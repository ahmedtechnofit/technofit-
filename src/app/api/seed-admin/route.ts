import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// This endpoint creates the initial admin account
// Can be called once to seed the database

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        exists: true 
      });
    }

    // Create initial admin
    // Password: admin123 (in production, you should hash this with bcrypt)
    const admin = await db.admin.create({
      data: {
        username: 'admin',
        password: 'admin123', // Plain text for now - in production use bcrypt
        name: 'أحمد الكوتش',
      },
    });

    return NextResponse.json({ 
      message: 'Admin created successfully',
      username: admin.username,
      password: 'admin123',
      success: true 
    });
  } catch (error) {
    console.error('Error seeding admin:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الأدمن' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    const adminCount = await db.admin.count();
    return NextResponse.json({ 
      hasAdmin: adminCount > 0,
      count: adminCount 
    });
  } catch (error) {
    console.error('Error checking admin:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في التحقق من الأدمن' },
      { status: 500 }
    );
  }
}
