import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface UpdateProductBody {
  name_en?: string;
  slug_en?: string;
  description_en?: string;
  name_km?: string;
  slug_km?: string;
  description_km?: string;
  categoryId?: string;
  brandId?: string;
  branchId?: string;
  status?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateProductBody = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if new slugs are unique (if provided)
    if (body.slug_en || body.slug_km) {
      const conflictingProduct = await prisma.product.findFirst({
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

      if (conflictingProduct) {
        return NextResponse.json(
          { message: 'Product slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        ...(body.name_en && { name_en: body.name_en }),
        ...(body.slug_en && { slug_en: body.slug_en }),
        ...(body.description_en !== undefined && { description_en: body.description_en || null }),
        ...(body.name_km && { name_km: body.name_km }),
        ...(body.slug_km && { slug_km: body.slug_km }),
        ...(body.description_km !== undefined && { description_km: body.description_km || null }),
        ...(body.categoryId && { categoryId: BigInt(body.categoryId) }),
        ...(body.brandId && { brandId: BigInt(body.brandId) }),
        ...(body.branchId && { branchId: BigInt(body.branchId) }),
        ...(body.status && { status: body.status }),
      },
      include: {
        category: {
          select: {
            id: true,
            name_en: true,
            name_km: true,
          },
        },
        brand: {
          select: {
            id: true,
            name_en: true,
            name_km: true,
          },
        },
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}