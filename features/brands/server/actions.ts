"use server";

import {
  fetchAllBrands,
  fetchBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  type BrandCreateInput,
  type BrandsResponse,
  type Brand,
} from "@/lib/services/brands.service";

export async function getBrands(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<BrandsResponse> {
  try {
    return await fetchAllBrands(page, limit, search);
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw error;
  }
}

export async function getBrandById(id: string): Promise<Brand> {
  try {
    return await fetchBrandById(id);
  } catch (error) {
    console.error("Failed to fetch brand:", error);
    throw error;
  }
}

export async function createNewBrand(data: BrandCreateInput): Promise<Brand> {
  try {
    return await createBrand(data);
  } catch (error) {
    console.error("Failed to create brand:", error);
    throw error;
  }
}

export async function updateBrandData(
  id: string,
  data: Partial<BrandCreateInput>,
): Promise<Brand> {
  try {
    return await updateBrand(id, data);
  } catch (error) {
    console.error("Failed to update brand:", error);
    throw error;
  }
}

export async function removeBrand(id: string): Promise<void> {
  try {
    await deleteBrand(id);
  } catch (error) {
    console.error("Failed to delete brand:", error);
    throw error;
  }
}
