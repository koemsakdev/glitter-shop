import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id: BigInt(id) },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({
      where: { categoryId: BigInt(id) },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with existing products' },
        { status: 400 }
      );
    }

    const childCount = await prisma.category.count({
      where: { parentId: BigInt(id) },
    });

    if (childCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}