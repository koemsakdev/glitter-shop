import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);

    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: String(order.id),
      orderNumber: order.orderNumber,
      customer: order.customer
        ? `${order.customer.firstName} ${order.customer.lastName || ''}`
        : 'Unknown Customer',
      amount: parseFloat(order.totalAmount.toString()),
      status: order.orderStatus,
      date: order.createdAt,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('[DASHBOARD_ORDERS]', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}