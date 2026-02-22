import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateToken(token: string) {
  const session = await prisma.adminSession.findUnique({
    where: { token },
  });
  return !!session && session.expiresAt > new Date();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const [users, pending, approved] = await Promise.all([
      prisma.user.count(),
      prisma.paymentRequest.count({ where: { status: 'pending' } }),
      prisma.paymentRequest.count({ where: { status: 'approved' } }),
    ]);

    return NextResponse.json({ users, pending, approved });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
