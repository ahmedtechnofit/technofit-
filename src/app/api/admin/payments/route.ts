import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function validateToken(token: string) {
  const session = await db.adminSession.findUnique({
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

    const payments = await db.paymentRequest.findMany({
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

    // Convert old URLs to new API format
    const processedPayments = payments.map(payment => {
      let receiptImage = payment.receiptImage;
      if (receiptImage && receiptImage.startsWith('/uploads/receipts/')) {
        const fileName = receiptImage.split('/').pop();
        receiptImage = `/api/serve-image?file=${fileName}`;
      }

      let pdfFile = payment.pdfFile;
      if (pdfFile && pdfFile.startsWith('/uploads/programs/')) {
        const fileName = pdfFile.split('/').pop();
        pdfFile = `/api/serve-pdf?file=${fileName}`;
      }

      return {
        ...payment,
        receiptImage,
        pdfFile,
      };
    });

    return NextResponse.json(processedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    );
  }
}
