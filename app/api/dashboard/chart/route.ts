import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '10', 10);

    const chartData = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get revenue for this day
      const revenue = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: date,
            lt: nextDay,
          },
          orderStatus: {
            in: ['DELIVERED', 'SHIPPED'],
          },
        },
        _sum: {
          totalAmount: true,
        },
      });

      // Get order count for this day
      const orders = await prisma.order.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDay,
          },
        },
      });

      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      chartData.push({
        date: formattedDate,
        revenue: parseFloat(revenue._sum.totalAmount?.toString() || '0'),
        orders: orders,
      });
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('[DASHBOARD_CHART]', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}