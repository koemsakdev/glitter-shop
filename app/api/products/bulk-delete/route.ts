import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface BulkDeleteBody {
  ids: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkDeleteBody = await request.json();

    if (!body.ids || body.ids.length === 0) {
      return NextResponse.json(
        { message: 'No IDs provided' },
        { status: 400 }
      );
    }

    // Convert string IDs to BigInt
    const bigIntIds = body.ids.map(id => BigInt(id));

    // Check if any products have orders (OrderItem has Restrict relation)
    const productsWithOrders = await prisma.orderItem.findMany({
      where: {
        productId: {
          in: bigIntIds,
        },
      },
      select: {
        productId: true,
      },
    });

    if (productsWithOrders.length > 0) {
      return NextResponse.json(
        { 
          message: 'Some products have existing orders and cannot be deleted. Consider archiving them instead.',
          affectedCount: productsWithOrders.length,
        },
        { status: 400 }
      );
    }

    // Delete inventory for product variants
    const variants = await prisma.productVariant.findMany({
      where: {
        productId: {
          in: bigIntIds,
        },
      },
    });

    for (const variant of variants) {
      await prisma.inventory.deleteMany({
        where: { variantId: variant.id },
      });
    }

    // Delete product images
    await prisma.productImage.deleteMany({
      where: {
        productId: {
          in: bigIntIds,
        },
      },
    });

    // Delete product variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: {
          in: bigIntIds,
        },
      },
    });

    // Delete products
    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: bigIntIds,
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} products deleted successfully`,
    });
  } catch (error) {
    console.error('Failed to bulk delete products:', error);
    return NextResponse.json(
      { message: 'Failed to bulk delete products' },
      { status: 500 }
    );
  }
}