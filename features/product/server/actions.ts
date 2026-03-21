'use server';

import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  bulkDeleteProducts,
  type ProductCreateInput,
  type ProductsResponse,
  type Product,
} from '@/lib/services/products.service';

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProductsResponse> {
  try {
    return await fetchAllProducts(page, limit, search);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    return await fetchProductById(id);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
}

export async function createNewProduct(
  data: ProductCreateInput
): Promise<Product> {
  try {
    return await createProduct(data);
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProductData(
  id: string,
  data: Partial<ProductCreateInput>
): Promise<Product> {
  try {
    return await updateProduct(id, data);
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function removeProduct(id: string): Promise<void> {
  try {
    await deleteProduct(id);
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

export async function searchProductsByQuery(query: string): Promise<Product[]> {
  try {
    return await searchProducts(query);
  } catch (error) {
    console.error('Failed to search products:', error);
    throw error;
  }
}

export async function deleteManyProducts(ids: string[]): Promise<number> {
  try {
    const result = await bulkDeleteProducts(ids);
    return result.count;
  } catch (error) {
    console.error('Failed to bulk delete products:', error);
    throw error;
  }
}