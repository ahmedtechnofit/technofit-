import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateToken(token: string) {
  const session = await prisma.adminSession.findUnique({
    where: { token },
  });
  return !!session && session.expiresAt > new Date();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, paymentId, reason } = body;

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    if (!paymentId || !reason) {
      return NextResponse.json({ error: 'جميع البيانات مطلوبة' }, { status: 400 });
    }

    await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
