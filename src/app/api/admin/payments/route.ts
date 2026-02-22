import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateToken(token: string) {
  const session = await prisma.adminSession.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt < new Date()) {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const payments = await prisma.paymentRequest.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            location: true,
            fitnessProfile: {
              select: {
                height: true,
                weight: true,
                age: true,
                gender: true,
                activityLevel: true,
                goal: true,
                proteinBudget: true,
                bmr: true,
                tdee: true,
                targetCalories: true,
                protein: true,
                carbs: true,
                fat: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الطلبات', details: msg },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
