import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
    }

    // Convert string IDs to BigInt
    const bigIntIds = ids.map((id: string) => BigInt(id));

    // Check if any brand has associated products
    const productsCount = await prisma.product.count({
      where: { brandId: { in: bigIntIds } },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { message: "Cannot delete brands with existing products" },
        { status: 400 },
      );
    }

    // Delete brands
    const result = await prisma.brand.deleteMany({
      where: { id: { in: bigIntIds } },
    });

    return NextResponse.json({
      message: `${result.count} brands deleted successfully`,
      count: result.count,
    });
  } catch (error) {
    console.error("Failed to bulk delete brands:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
