import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('✅ Admin already exists:', existingAdmin.username);
    return;
  }

  // Create initial admin
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin123', // In production, use bcrypt to hash this
      name: 'أحمد الكوتش',
    },
  });

  console.log('✅ Admin created successfully!');
  console.log('   Username:', admin.username);
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
