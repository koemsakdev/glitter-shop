import { prisma } from '@/lib/db';
import { getLocale } from 'next-intl/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const locale = await getLocale();
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);

    // Build field name based on locale
    const nameField = locale === 'km' ? 'name_km' : 'name_en';

    // Get top selling products by quantity
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Fetch product details
    const products = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name_en: true,
            name_km: true,
          },
        });

        return {
          id: String(item.productId),
          name: product?.[nameField] || 'Unknown Product',
          sales: item._sum.quantity || 0,
          revenue: parseFloat(item._sum.price?.toString() || '0'),
        };
      })
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('[DASHBOARD_PRODUCTS]', error);
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    );
  }
}