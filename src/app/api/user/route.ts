import { NextRequest, NextResponse } from 'next/server';
import { db, testDatabaseConnection } from '@/lib/db';

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

    const body = await request.json();
    const { name, email, phone, location, height, weight, age, gender, activityLevel, goal, proteinBudget } = body;

    // Validate required fields
    if (!name || !email || !height || !weight || !age || !gender || !activityLevel || !goal) {
      return NextResponse.json(
        { error: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    let user;
    if (existingUser) {
      // Update user and profile
      user = await db.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          phone,
          location,
          fitnessProfile: {
            upsert: {
              create: {
                height,
                weight,
                age,
                gender,
                activityLevel,
                goal,
                proteinBudget,
              },
              update: {
                height,
                weight,
                age,
                gender,
                activityLevel,
                goal,
                proteinBudget,
              },
            },
          },
        },
        include: { fitnessProfile: true },
      });
    } else {
      // Create new user with profile
      user = await db.user.create({
        data: {
          name,
          email,
          phone,
          location,
          fitnessProfile: {
            create: {
              height,
              weight,
              age,
              gender,
              activityLevel,
              goal,
              proteinBudget,
            },
          },
        },
        include: { fitnessProfile: true },
      });
    }

    return NextResponse.json({ userId: user.id, user, success: true });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a database table error
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      return NextResponse.json(
        { 
          error: 'جداول قاعدة البيانات غير موجودة',
          hint: 'يجب تشغيل prisma db push أولاً',
          details: errorMessage
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ البيانات', details: errorMessage },
      { status: 500 }
    );
  }
}

// GET endpoint to check database status
export async function GET() {
  try {
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return NextResponse.json({ 
        connected: false,
        error: connectionTest.error 
      }, { status: 500 });
    }

    const userCount = await db.user.count();
    return NextResponse.json({ 
      connected: true,
      userCount 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
