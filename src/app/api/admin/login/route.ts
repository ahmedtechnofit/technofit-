import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Check database for admin
    const admin = await db.admin.findUnique({
      where: { username: username || 'admin' },
    });

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Save session
    await db.adminSession.create({
      data: {
        token,
        adminId: admin.id,
        expiresAt,
      },
    });

    return NextResponse.json({ 
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  }
}
