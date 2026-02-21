import { NextRequest, NextResponse } from 'next/server';
import { db, testDatabaseConnection } from '@/lib/db';

// This endpoint creates or updates the initial admin account

export async function POST(request: NextRequest) {
  try {
    // Test database connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return NextResponse.json({ 
        error: 'فشل الاتصال بقاعدة البيانات',
        details: connectionTest.error,
        hint: 'تأكد من إعداد DATABASE_URL في متغيرات البيئة'
      }, { status: 500 });
    }

    // Use upsert to create or update admin
    const admin = await db.admin.upsert({
      where: { username: 'admin' },
      update: {
        password: 'admin123',
        name: 'أحمد الكوتش',
      },
      create: {
        username: 'admin',
        password: 'admin123',
        name: 'أحمد الكوتش',
      },
    });

    return NextResponse.json({ 
      message: 'تم إنشاء/تحديث الأدمن بنجاح',
      username: admin.username,
      password: 'admin123',
      success: true,
      isNew: admin.createdAt === admin.updatedAt
    });
  } catch (error) {
    console.error('Error seeding admin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إنشاء الأدمن',
        details: errorMessage,
        hint: 'تأكد أن جداول قاعدة البيانات تم إنشاؤها (prisma db push)'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check database and admin status
export async function GET() {
  try {
    // Test database connection
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return NextResponse.json({ 
        connected: false,
        error: 'فشل الاتصال بقاعدة البيانات',
        details: connectionTest.error
      }, { status: 500 });
    }

    // Try to count admins
    try {
      const adminCount = await db.admin.count();
      const admin = await db.admin.findUnique({
        where: { username: 'admin' },
        select: { username: true, name: true, createdAt: true }
      });

      return NextResponse.json({ 
        connected: true,
        hasAdmin: adminCount > 0,
        adminCount,
        admin,
        message: adminCount > 0 
          ? 'الأدمن موجود بالفعل - يمكنك تسجيل الدخول' 
          : 'لا يوجد أدمن - استخدم POST لإنشاء واحد'
      });
    } catch (tableError) {
      return NextResponse.json({ 
        connected: true,
        tablesExist: false,
        error: 'جداول قاعدة البيانات غير موجودة',
        hint: 'يجب تشغيل prisma db push أولاً',
        details: tableError instanceof Error ? tableError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error checking admin:', error);
    return NextResponse.json(
      { 
        connected: false,
        error: 'حدث خطأ في التحقق من الأدمن',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
