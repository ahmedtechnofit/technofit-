import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      password: 'admin123',
      name: 'Admin',
    },
    create: {
      username: 'admin',
      password: 'admin123',
      name: 'Admin',
    },
  });

  console.log('✅ Admin created/updated:', admin.username);
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
