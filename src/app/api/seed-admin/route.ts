import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Ultra simple admin creation - no complex validation
// Just creates admin/admin123

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    // Direct create - will fail if exists, that's ok
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: 'admin123',
        name: 'Admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created! Username: admin, Password: admin123',
    });
  } catch (error: unknown) {
    // If admin exists, that's fine
    const msg = error instanceof Error ? error.message : '';
    
    if (msg.includes('Unique constraint') || msg.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: 'Admin already exists! Username: admin, Password: admin123',
      });
    }
    
    // Other error - show details
    return NextResponse.json({
      success: false,
      error: msg || 'Unknown error',
      hint: 'Make sure DATABASE_URL is set correctly in Vercel',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  return GET();
}
