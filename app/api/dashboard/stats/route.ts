import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total Revenue (Current Month)
        const currentMonthRevenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: currentMonthStart,
                    lte: now,
                },
                orderStatus: {
                    in: ['DELIVERED', 'SHIPPED'],
                },
            },
            _sum: {
                totalAmount: true,
            },
        });

        // Total Revenue (Last Month)
        const lastMonthRevenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: lastMonthStart,
                    lte: lastMonthEnd,
                },
                orderStatus: {
                    in: ['DELIVERED', 'SHIPPED'],
                },
            },
            _sum: {
                totalAmount: true,
            },
        });

        // Total Orders (Current Month)
        const currentMonthOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: currentMonthStart,
                    lte: now,
                },
            },
        });

        // Total Orders (Last Month)
        const lastMonthOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: lastMonthStart,
                    lte: lastMonthEnd,
                },
            },
        });

        // Total Customers (Current Month)
        const currentMonthCustomers = await prisma.customer.count({
            where: {
                createdAt: {
                    gte: currentMonthStart,
                    lte: now,
                },
            },
        });

        // Total Customers (Last Month)
        const lastMonthCustomers = await prisma.customer.count({
            where: {
                createdAt: {
                    gte: lastMonthStart,
                    lte: lastMonthEnd,
                },
            },
        });

        // Total Products (Current Month)
        const currentMonthProducts = await prisma.product.count({
            where: {
                createdAt: {
                    gte: currentMonthStart,
                    lte: now,
                },
            },
        });

        // Total Products (Last Month)
        const lastMonthProducts = await prisma.product.count({
            where: {
                createdAt: {
                    gte: lastMonthStart,
                    lte: lastMonthEnd,
                },
            },
        });

        // Calculate growth percentages
        const lastMonthTotal = lastMonthRevenue._sum.totalAmount?.toNumber() || 0;
        const currentMonthTotal = currentMonthRevenue._sum.totalAmount?.toNumber() || 0;

        const revenueGrowth =
            lastMonthTotal !== 0
                ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
                : 0;

        const ordersGrowth =
            lastMonthOrders !== 0
                ? (((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
                : 0;

        const customersGrowth =
            lastMonthCustomers !== 0
                ? (((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100).toFixed(1)
                : 0;

        const productsGrowth =
            lastMonthProducts !== 0
                ? (((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100).toFixed(1)
                : 0;

        return NextResponse.json({
            totalRevenue: parseFloat(currentMonthRevenue._sum.totalAmount?.toString() || '0'),
            totalOrders: currentMonthOrders,
            totalCustomers: currentMonthCustomers,
            totalProducts: currentMonthProducts,
            revenueGrowth: parseFloat(revenueGrowth as string),
            ordersGrowth: parseFloat(ordersGrowth as string),
            customersGrowth: parseFloat(customersGrowth as string),
            productsGrowth: parseFloat(productsGrowth as string),
        });
    } catch (error) {
        console.error('[DASHBOARD_STATS]', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}