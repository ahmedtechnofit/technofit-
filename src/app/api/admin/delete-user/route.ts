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
    const { token, userId } = body;

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await prisma.paymentRequest.deleteMany();
    await prisma.fitnessProfile.deleteMany();
    await prisma.user.deleteMany();

    return NextResponse.json({ success: true, message: 'تم حذف جميع المشتركين' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
