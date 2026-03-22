import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const brand = await prisma.brand.findUnique({
      where: { id: BigInt(id) },
    });

    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // ✅ Convert BigInt to string
    const brandResponse = {
      id: brand.id.toString(),
      name_en: brand.name_en,
      slug_en: brand.slug_en,
      name_km: brand.name_km,
      slug_km: brand.slug_km,
      logo: brand.logo,
      status: brand.status,
      createdAt: brand.createdAt.toISOString()
    };

    return NextResponse.json(brandResponse);
  } catch (error) {
    console.error("Failed to fetch brand:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
