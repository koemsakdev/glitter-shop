import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface UpdateCategoryBody {
  name_en?: string;
  slug_en?: string;
  name_km?: string;
  slug_km?: string;
  image?: string;
  parentId?: string;
  status?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateCategoryBody = await request.json();

    const existingCategory = await prisma.category.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    if (body.slug_en || body.slug_km) {
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: BigInt(id) } },
            {
              OR: [
                ...(body.slug_en ? [{ slug_en: body.slug_en }] : []),
                ...(body.slug_km ? [{ slug_km: body.slug_km }] : []),
              ],
            },
          ],
        },
      });

      if (conflictingCategory) {
        return NextResponse.json(
          { message: 'Category slug already exists' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: BigInt(id) },
      data: {
        ...(body.name_en && { name_en: body.name_en }),
        ...(body.slug_en && { slug_en: body.slug_en }),
        ...(body.name_km && { name_km: body.name_km }),
        ...(body.slug_km && { slug_km: body.slug_km }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.parentId !== undefined && { parentId: body.parentId ? BigInt(body.parentId) : null }),
        ...(body.status && { status: body.status }),
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

    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    );
  }
}