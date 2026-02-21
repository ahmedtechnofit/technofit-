import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, location, height, weight, age, gender, activityLevel, goal, proteinBudget } = body;

    // Validate required fields
    if (!name || !email || !height || !weight || !age) {
      return NextResponse.json(
        { error: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Upsert user
    const user = await db.user.upsert({
      where: { email },
      update: {
        name,
        phone,
        location,
        fitnessProfile: {
          upsert: {
            create: {
              height: parseFloat(height),
              weight: parseFloat(weight),
              age: parseInt(age),
              gender: gender || 'male',
              activityLevel: activityLevel || 'moderate',
              goal: goal || 'maintenance',
              proteinBudget: proteinBudget || 'medium',
            },
            update: {
              height: parseFloat(height),
              weight: parseFloat(weight),
              age: parseInt(age),
              gender: gender || 'male',
              activityLevel: activityLevel || 'moderate',
              goal: goal || 'maintenance',
              proteinBudget: proteinBudget || 'medium',
            },
          },
        },
      },
      create: {
        name,
        email,
        phone,
        location,
        fitnessProfile: {
          create: {
            height: parseFloat(height),
            weight: parseFloat(weight),
            age: parseInt(age),
            gender: gender || 'male',
            activityLevel: activityLevel || 'moderate',
            goal: goal || 'maintenance',
            proteinBudget: proteinBudget || 'medium',
          },
        },
      },
      include: { fitnessProfile: true },
    });

    return NextResponse.json({ userId: user.id, user, success: true });
  } catch (error) {
    console.error('Error in user API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { 
        error: 'حدث خطأ في حفظ البيانات',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await db.user.count();
    return NextResponse.json({ success: true, userCount: count });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
