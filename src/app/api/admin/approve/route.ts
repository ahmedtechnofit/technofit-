import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateToken(token: string) {
  const session = await prisma.adminSession.findUnique({
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

    // Read file content
    const bytes = await pdf.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate PDF magic number (first 4 bytes should be %PDF)
    const header = buffer.slice(0, 4).toString('ascii');
    
    if (header !== '%PDF') {
      return NextResponse.json(
        { error: 'الملف المرفوع ليس ملف PDF صالح. يرجى رفع ملف PDF حقيقي.' },
        { status: 400 }
      );
    }

    // Convert to base64 for storage (Vercel serverless compatible)
    const base64Pdf = `data:application/pdf;base64,${buffer.toString('base64')}`;

    // Update payment request
    const payment = await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: {
        status: 'approved',
        pdfFile: base64Pdf,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, paymentId: payment.id });
  } catch (error) {
    console.error('Error approving payment:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'حدث خطأ في قبول الطلب', details: msg },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
