import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name_en: "asc" },
    });

    // ✅ Convert BigInt to string
    const brandsResponse = brands.map((brand) => ({
      id: brand.id.toString(),
      name_en: brand.name_en,
      slug_en: brand.slug_en,
      name_km: brand.name_km,
      slug_km: brand.slug_km,
      logo: brand.logo,
      status: brand.status,
      createdAt: brand.createdAt.toISOString()
    }));

    return NextResponse.json({
      data: brandsResponse,
    });
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
