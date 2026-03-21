/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';

export interface Product {
  id: string;
  name_en: string;
  name_km: string;
  slug_en: string;
  slug_km: string;
  description_en?: string;
  description_km?: string;
  status: string;
  categoryId: string;
  brandId: string;
  branchId?: string;
  category?: {
    id: string;
    name_en: string;
    name_km: string;
  };
  brand?: {
    id: string;
    name_en: string;
    name_km: string;
  };
  images?: Array<{
    id: string;
    url: string;
    altText_en?: string;
    altText_km?: string;
  }>;
  variants?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  name_en: string;
  slug_en: string;
  description_en?: string;
  name_km: string;
  slug_km: string;
  description_km?: string;
  categoryId: string;
  brandId: string;
  branchId?: string;
  status?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchAllProducts(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProductsResponse> {
  return apiClient.get<ProductsResponse>('/products', {
    params: { page, limit, search },
  });
}

export async function fetchProductById(id: string): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`);
}

export async function createProduct(data: ProductCreateInput): Promise<Product> {
  return apiClient.post<Product>('/products/create', data);
}

export async function updateProduct(
  id: string,
  data: Partial<ProductCreateInput>
): Promise<Product> {
  return apiClient.put<Product>(`/products/${id}/update`, data);
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  return apiClient.delete<{ success: boolean }>(`/products/${id}/delete`);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return apiClient.get<Product[]>('/products/search', {
    params: { q: query },
  });
}

export async function bulkDeleteProducts(ids: string[]): Promise<{ success: boolean; count: number }> {
  return apiClient.post<{ success: boolean; count: number }>('/products/bulk-delete', { ids });
}