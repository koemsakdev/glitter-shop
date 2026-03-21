import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name_en: { contains: q, mode: 'insensitive' } },
              { name_km: { contains: q, mode: 'insensitive' } },
              { description_en: { contains: q, mode: 'insensitive' } },
              { description_km: { contains: q, mode: 'insensitive' } },
            ],
          },
          { status: { not: 'ARCHIVED' } },
        ],
      },
      select: {
        id: true,
        name_en: true,
        name_km: true,
      },
      take: 10,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to search products:', error);
    return NextResponse.json(
      { message: 'Failed to search products' },
      { status: 500 }
    );
  }
}