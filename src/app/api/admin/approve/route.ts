import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

async function validateToken(token: string) {
  const session = await db.adminSession.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt < new Date()) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const paymentId = formData.get('paymentId') as string;
    const pdf = formData.get('pdf') as File;

    console.log('Approve request:', { 
      token: token ? 'exists' : 'missing', 
      paymentId, 
      pdf: pdf ? { name: pdf.name, type: pdf.type, size: pdf.size } : 'missing' 
    });

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    if (!paymentId) {
      return NextResponse.json(
        { error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    if (!pdf) {
      return NextResponse.json(
        { error: 'يرجى رفع ملف PDF' },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'programs');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Read file content
    const bytes = await pdf.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate PDF magic number (first 4 bytes should be %PDF)
    const header = buffer.slice(0, 4).toString('ascii');
    console.log('File header:', header);
    
    if (header !== '%PDF') {
      return NextResponse.json(
        { error: `الملف المرفوع ليس ملف PDF صالح. الملف يجب أن يبدأ بـ %PDF ولكن يبدأ بـ "${header}". يرجى رفع ملف PDF حقيقي وليس صورة.` },
        { status: 400 }
      );
    }

    // Save PDF file with proper extension
    const fileName = `${paymentId}_${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Store the URL that serves the file properly
    const pdfUrl = `/api/serve-pdf?file=${fileName}`;

    // Update payment request
    const payment = await db.paymentRequest.update({
      where: { id: paymentId },
      data: {
        status: 'approved',
        pdfFile: pdfUrl,
        reviewedAt: new Date(),
      },
    });

    console.log('Payment approved successfully:', payment.id);

    return NextResponse.json({ success: true, payment, pdfUrl });
  } catch (error) {
    console.error('Error approving payment:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في قبول الطلب: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}
