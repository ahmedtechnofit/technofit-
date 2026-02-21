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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const [users, pendingPayments, approvedPayments] = await Promise.all([
      db.user.count(),
      db.paymentRequest.count({
        where: { status: 'pending' },
      }),
      db.paymentRequest.count({
        where: { status: 'approved' },
      }),
    ]);

    return NextResponse.json({
      users,
      pending: pendingPayments,
      approved: approvedPayments,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
