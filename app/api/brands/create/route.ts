import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface CreateBrandBody {
  name_en: string;
  slug_en: string;
  name_km: string;
  slug_km: string;
  logo?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBrandBody = await request.json();

    if (!body.name_en || !body.slug_en || !body.name_km || !body.slug_km) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingBrand = await prisma.brand.findFirst({
      where: {
        OR: [
          { slug_en: body.slug_en },
          { slug_km: body.slug_km },
        ],
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        { message: 'Brand slug already exists' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name_en: body.name_en,
        slug_en: body.slug_en,
        name_km: body.name_km,
        slug_km: body.slug_km,
        logo: body.logo || null,
        status: body.status || 'ACTIVE',
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Failed to create brand:', error);
    return NextResponse.json(
      { message: 'Failed to create brand' },
      { status: 500 }
    );
  }
}