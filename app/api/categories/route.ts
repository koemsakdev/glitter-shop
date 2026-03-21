import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Fixed: Use Prisma.CategoryWhereInput type
    const whereClause: Prisma.CategoryWhereInput = search
      ? {
          OR: [
            { name_en: { contains: search, mode: 'insensitive' } },
            { name_km: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const total = await prisma.category.count({ where: whereClause });

    const categories = await prisma.category.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        parent: {
          select: {
            id: true,
            name_en: true,
            name_km: true,
          },
        },
      },
    });

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      data: categories,
      total,
      page,
      limit,
      pages,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}