import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, location, height, weight, age, gender, activityLevel, goal, proteinBudget } = body;

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

    return NextResponse.json({ userId: user.id, user });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ البيانات' },
      { status: 500 }
    );
  }
}
