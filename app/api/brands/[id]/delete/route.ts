import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const brand = await prisma.brand.findUnique({
      where: { id: BigInt(id) },
    });

    if (!brand) {
      return NextResponse.json(
        { message: 'Brand not found' },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({
      where: { brandId: BigInt(id) },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete brand with existing products' },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete brand:', error);
    return NextResponse.json(
      { message: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}