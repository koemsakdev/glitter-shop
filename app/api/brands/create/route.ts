import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name_en || !body.slug_en || !body.name_km || !body.slug_km) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existingBrand = await prisma.brand.findFirst({
      where: {
        OR: [{ slug_en: body.slug_en }, { slug_km: body.slug_km }],
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        { message: "Brand with this slug already exists" },
        { status: 409 },
      );
    }

    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name_en: body.name_en,
        slug_en: body.slug_en,
        name_km: body.name_km,
        slug_km: body.slug_km,
        logo: body.logo || null,
        status: body.status || "ACTIVE",
      },
    });

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

    return NextResponse.json(brandResponse, { status: 201 });
  } catch (error) {
    console.error("Failed to create brand:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
