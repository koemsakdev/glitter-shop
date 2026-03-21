import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface UpdateBrandBody {
  name_en?: string;
  slug_en?: string;
  name_km?: string;
  slug_km?: string;
  logo?: string;
  status?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateBrandBody = await request.json();

    const existingBrand = await prisma.brand.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { message: 'Brand not found' },
        { status: 404 }
      );
    }

    if (body.slug_en || body.slug_km) {
      const conflictingBrand = await prisma.brand.findFirst({
        where: {
          AND: [
            { id: { not: BigInt(id) } },
            {
              OR: [
                ...(body.slug_en ? [{ slug_en: body.slug_en }] : []),
                ...(body.slug_km ? [{ slug_km: body.slug_km }] : []),
              ],
            },
          ],
        },
      });

      if (conflictingBrand) {
        return NextResponse.json(
          { message: 'Brand slug already exists' },
          { status: 400 }
        );
      }
    }

    const brand = await prisma.brand.update({
      where: { id: BigInt(id) },
      data: {
        ...(body.name_en && { name_en: body.name_en }),
        ...(body.slug_en && { slug_en: body.slug_en }),
        ...(body.name_km && { name_km: body.name_km }),
        ...(body.slug_km && { slug_km: body.slug_km }),
        ...(body.logo !== undefined && { logo: body.logo || null }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to update brand:', error);
    return NextResponse.json(
      { message: 'Failed to update brand' },
      { status: 500 }
    );
  }
}