import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause: Prisma.BrandWhereInput = search
      ? {
          OR: [
            { name_en: { contains: search, mode: "insensitive" } },
            { name_km: { contains: search, mode: "insensitive" } },
            { slug_en: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Get total count
    const total = await prisma.brand.count({ where: whereClause });
    const pages = Math.ceil(total / limit);

    // Get paginated brands
    const brands = await prisma.brand.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // ✅ Convert BigInt to string for all brands
    const brandsResponse = brands.map((brand) => ({
      id: brand.id.toString(),
      name_en: brand.name_en,
      slug_en: brand.slug_en,
      name_km: brand.name_km,
      slug_km: brand.slug_km,
      logo: brand.logo,
      status: brand.status,
      createdAt: brand.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data: brandsResponse,
      total,
      pages,
      page,
    });
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
