import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface CreateCategoryBody {
  name_en: string;
  slug_en: string;
  name_km: string;
  slug_km: string;
  image?: string;
  parentId?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryBody = await request.json();

    if (!body.name_en || !body.slug_en || !body.name_km || !body.slug_km) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { slug_en: body.slug_en },
          { slug_km: body.slug_km },
        ],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name_en: body.name_en,
        slug_en: body.slug_en,
        name_km: body.name_km,
        slug_km: body.slug_km,
        image: body.image || null,
        parentId: body.parentId ? BigInt(body.parentId) : null,
        status: body.status || 'ACTIVE',
      },
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

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    );
  }
}