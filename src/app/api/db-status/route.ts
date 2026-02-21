import { NextResponse } from 'next/server';
import { db, testDatabaseConnection } from '@/lib/db';

// This endpoint checks database connection and table status

export async function GET() {
  const status: {
    timestamp: string;
    database: {
      url?: string;
      connected: boolean;
      error?: string;
    };
    tables: {
      users: boolean;
      fitness_profiles: boolean;
      payment_requests: boolean;
      admins: boolean;
      admin_sessions: boolean;
    };
    counts?: {
      users: number;
      admins: number;
    };
  } = {
    timestamp: new Date().toISOString(),
    database: {
      url: process.env.DATABASE_URL ? '***set***' : 'NOT SET',
      connected: false,
    },
    tables: {
      users: false,
      fitness_profiles: false,
      payment_requests: false,
      admins: false,
      admin_sessions: false,
    },
  };

  // Test connection
  const connectionTest = await testDatabaseConnection();
  status.database.connected = connectionTest.success;
  if (!connectionTest.success) {
    status.database.error = connectionTest.error;
    return NextResponse.json(status, { status: 500 });
  }

  // Check each table
  try {
    await db.user.count();
    status.tables.users = true;
  } catch { /* table doesn't exist */ }

  try {
    await db.fitnessProfile.count();
    status.tables.fitness_profiles = true;
  } catch { /* table doesn't exist */ }

  try {
    await db.paymentRequest.count();
    status.tables.payment_requests = true;
  } catch { /* table doesn't exist */ }

  try {
    await db.admin.count();
    status.tables.admins = true;
  } catch { /* table doesn't exist */ }

  try {
    await db.adminSession.count();
    status.tables.admin_sessions = true;
  } catch { /* table doesn't exist */ }

  // Get counts if all tables exist
  if (Object.values(status.tables).every(Boolean)) {
    status.counts = {
      users: await db.user.count(),
      admins: await db.admin.count(),
    };
  }

  return NextResponse.json(status);
}
