import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete related data first (due to relations)
    // Delete inventory for variants
    const variants = await prisma.productVariant.findMany({
      where: { productId: BigInt(id) },
    });

    for (const variant of variants) {
      await prisma.inventory.deleteMany({
        where: { variantId: variant.id },
      });
    }

    // Delete product images
    await prisma.productImage.deleteMany({
      where: { productId: BigInt(id) },
    });

    // Delete order items (with Restrict relation, we need to check)
    // In your schema, OrderItem has onDelete: Restrict for product
    // So we need to handle this carefully
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: BigInt(id) },
    });

    if (orderItems.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete product with existing orders. Please archive it instead.' },
        { status: 400 }
      );
    }

    // Delete product variants
    await prisma.productVariant.deleteMany({
      where: { productId: BigInt(id) },
    });

    // Delete product
    await prisma.product.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}