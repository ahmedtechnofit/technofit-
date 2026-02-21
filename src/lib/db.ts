import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// للتعامل مع serverless environments مثل Vercel
// يتم إغلاق الاتصال عند انتهاء الطلب
if (process.env.NODE_ENV === 'production') {
  // في production، Prisma تتولى إدارة الاتصالات تلقائياً
}
