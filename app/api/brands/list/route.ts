import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const brands = await prisma.brand.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name_en: true,
        name_km: true,
      },
      orderBy: { name_en: 'asc' },
    });

    return NextResponse.json({
      data: brands,
      total: brands.length,
    });
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json(
      { message: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}