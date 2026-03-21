import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
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
        images: {
          select: {
            id: true,
            url: true,
            altText_en: true,
            altText_km: true,
          },
        },
        variants: {
          include: {
            color: true,
            size: true,
            inventory: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}