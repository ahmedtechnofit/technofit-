import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Create/Update payment request with receipt
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

    // Convert receipt to base64 for storage (Vercel serverless compatible)
    const bytes = await receipt.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${receipt.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;

    // Create or update payment request
    const existingPayment = await prisma.paymentRequest.findUnique({
      where: { userId },
    });

    let payment;
    if (existingPayment) {
      payment = await prisma.paymentRequest.update({
        where: { userId },
        data: {
          amount,
          receiptImage: base64Image,
          status: 'pending',
          rejectionReason: null,
          pdfFile: null,
        },
      });
    } else {
      payment = await prisma.paymentRequest.create({
        data: {
          userId,
          amount,
          receiptImage: base64Image,
          status: 'pending',
        },
      });
    }

    return NextResponse.json({ 
      success: true,
      paymentId: payment.id 
    });
  } catch (error) {
    console.error('Error creating payment request:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال الطلب', details: msg },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Fetch payment status for user
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

    const payment = await prisma.paymentRequest.findUnique({
      where: { userId },
    });

    if (!payment) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      rejectionReason: payment.rejectionReason,
      pdfUrl: payment.pdfFile,
      receiptImage: payment.receiptImage,
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب حالة الطلب' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
