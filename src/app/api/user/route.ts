import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, location, height, weight, age, gender, activityLevel, goal, proteinBudget } = body;

    if (!name || !email || !height || !weight || !age) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
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

    return NextResponse.json({ userId: user.id, success: true });
  } catch (error) {
    console.error('Error in user API:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'حدث خطأ', details: msg }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
