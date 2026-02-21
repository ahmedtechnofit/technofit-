import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'اسم الملف مطلوب' },
        { status: 400 }
      );
    }

    // Security: prevent directory traversal
    const fileName = path.basename(file);
    
    // Check both possible locations
    let filePath = path.join(process.cwd(), 'uploads', 'programs', fileName);
    
    // Fallback to public folder for old files
    if (!existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'uploads', 'programs', fileName);
    }

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'الملف غير موجود' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في قراءة الملف' },
      { status: 500 }
    );
  }
}
