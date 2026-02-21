import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Simple admin creation - no complex validation
// Just creates admin/admin123 if it doesn't exist

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Try to create admin directly
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {
        password: 'admin123',
        name: 'Admin',
      },
      create: {
        username: 'admin',
        password: 'admin123',
        name: 'Admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created/updated successfully!',
      credentials: {
        username: 'admin',
        password: 'admin123',
      },
      data: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    // Get detailed error
    let errorMessage = 'Unknown error';
    let errorHint = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        errorHint = 'Database tables not created. Prisma db push needed.';
      } else if (errorMessage.includes('connect')) {
        errorHint = 'Cannot connect to database. Check DATABASE_URL.';
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      hint: errorHint,
      envCheck: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  return GET();
}
