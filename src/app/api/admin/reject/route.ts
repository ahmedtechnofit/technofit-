import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    const body = await request.json();
    const { token, paymentId, reason } = body;

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    if (!paymentId || !reason) {
      return NextResponse.json(
        { error: 'جميع البيانات مطلوبة' },
        { status: 400 }
      );
    }

    // Update payment request
    const payment = await db.paymentRequest.update({
      where: { id: paymentId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في رفض الطلب' },
      { status: 500 }
    );
  }
}
