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
    const { token, userId } = body;

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // Delete user and all related records
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المستخدم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Delete all users and related data
    await db.paymentRequest.deleteMany();
    await db.fitnessProfile.deleteMany();
    await db.user.deleteMany();

    return NextResponse.json({ success: true, message: 'تم حذف جميع المشتركين' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المشتركين' },
      { status: 500 }
    );
  }
}
