import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface CreateProductBody {
  name_en: string;
  slug_en: string;
  description_en?: string;
  name_km: string;
  slug_km: string;
  description_km?: string;
  categoryId: string; // Will be converted to BigInt
  brandId: string;   // Will be converted to BigInt
  branchId?: string; // Optional
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductBody = await request.json();

    // Validate required fields
    if (
      !body.name_en ||
      !body.slug_en ||
      !body.name_km ||
      !body.slug_km ||
      !body.categoryId ||
      !body.brandId
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists (both EN and KM)
    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { slug_en: body.slug_en },
          { slug_km: body.slug_km },
        ],
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: 'Product slug already exists' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name_en: body.name_en,
        slug_en: body.slug_en,
        description_en: body.description_en || null,
        name_km: body.name_km,
        slug_km: body.slug_km,
        description_km: body.description_km || null,
        categoryId: BigInt(body.categoryId),
        brandId: BigInt(body.brandId),
        branchId: body.branchId ? BigInt(body.branchId) : null,
        status: body.status || 'DRAFT',
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}