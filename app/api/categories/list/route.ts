import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name_en: true,
        name_km: true,
      },
      orderBy: { name_en: 'asc' },
    });

    return NextResponse.json({
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}