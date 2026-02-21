import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const receipt = formData.get('receipt') as File;

    if (!userId || !amount || !receipt) {
      return NextResponse.json(
        { error: 'جميع البيانات مطلوبة' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save receipt image with proper extension
    const ext = receipt.name.split('.').pop() || 'jpg';
    const fileName = `${userId}_${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const bytes = await receipt.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Use API URL for serving the image
    const receiptUrl = `/api/serve-image?file=${fileName}`;

    // Create or update payment request
    const existingPayment = await db.paymentRequest.findUnique({
      where: { userId },
    });

    let payment;
    if (existingPayment) {
      payment = await db.paymentRequest.update({
        where: { userId },
        data: {
          amount,
          receiptImage: receiptUrl,
          status: 'pending',
          rejectionReason: null,
          pdfFile: null,
        },
      });
    } else {
      payment = await db.paymentRequest.create({
        data: {
          userId,
          amount,
          receiptImage: receiptUrl,
          status: 'pending',
        },
      });
    }

    return NextResponse.json({ paymentId: payment.id, payment });
  } catch (error) {
    console.error('Error creating payment request:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال الطلب' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const payment = await db.paymentRequest.findUnique({
      where: { userId },
    });

    if (!payment) {
      return NextResponse.json(null);
    }

    // Convert old image URLs to new API format
    let receiptImage = payment.receiptImage;
    if (receiptImage && receiptImage.startsWith('/uploads/receipts/')) {
      const fileName = receiptImage.split('/').pop();
      receiptImage = `/api/serve-image?file=${fileName}`;
    }

    // Convert old PDF URLs to new API format
    let pdfUrl = payment.pdfFile;
    if (pdfUrl && pdfUrl.startsWith('/uploads/programs/')) {
      const fileName = pdfUrl.split('/').pop();
      pdfUrl = `/api/serve-pdf?file=${fileName}`;
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      rejectionReason: payment.rejectionReason,
      pdfUrl: pdfUrl,
      receiptImage: receiptImage,
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب حالة الطلب' },
      { status: 500 }
    );
  }
}
