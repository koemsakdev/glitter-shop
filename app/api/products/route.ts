import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Build where clause for search
        const whereClause: Prisma.ProductWhereInput = search
            ? {
                OR: [
                    {
                        name_en: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        name_km: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        description_en: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        description_km: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            }
            : {};

        // Get total count for pagination
        const total = await prisma.product.count({
            where: whereClause,
        });

        // Get products with relations
        const products = await prisma.product.findMany({
            where: whereClause,
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
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const pages = Math.ceil(total / limit);

        return NextResponse.json({
            data: products,
            total,
            page,
            limit,
            pages,
        });
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            { message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}