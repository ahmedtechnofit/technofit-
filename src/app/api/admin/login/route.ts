import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Find admin in database
    const admin = await prisma.admin.findUnique({
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
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Save session
    await prisma.adminSession.create({
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
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'حدث خطأ', details: msg }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
