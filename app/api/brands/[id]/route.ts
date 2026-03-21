import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const brand = await prisma.brand.findUnique({
      where: { id: BigInt(id) },
    });

    if (!brand) {
      return NextResponse.json(
        { message: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to fetch brand:', error);
    return NextResponse.json(
      { message: 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}