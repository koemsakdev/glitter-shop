import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Check if brand has associated products
    const productsCount = await prisma.product.count({
      where: { brandId: BigInt(id) },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { message: "Cannot delete brand with existing products" },
        { status: 400 },
      );
    }

    // Delete brand
    await prisma.brand.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json(
      { message: "Brand deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete brand:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
