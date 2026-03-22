import { apiClient } from '@/lib/api-client';

export interface Brand {
  id: string;
  name_en: string;
  name_km: string;
  slug_en: string;
  slug_km: string;
  logo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandCreateInput {
  name_en: string;
  slug_en: string;
  name_km: string;
  slug_km: string;
  logo?: string;
  status?: string;
}

export interface BrandsResponse {
  data: Brand[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchAllBrands(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<BrandsResponse> {
  return apiClient.get<BrandsResponse>('/brands', {
    params: { page, limit, search },
  });
}

export async function fetchBrandById(id: string): Promise<Brand> {
  return apiClient.get<Brand>(`/brands/${id}`);
}

export async function createBrand(data: BrandCreateInput): Promise<Brand> {
  return apiClient.post<Brand>('/brands/create', data);
}

export async function updateBrand(
  id: string,
  data: Partial<BrandCreateInput>
): Promise<Brand> {
  return apiClient.put<Brand>(`/brands/${id}/update`, data);
}

export async function deleteBrand(id: string): Promise<{ success: boolean }> {
  return apiClient.delete<{ success: boolean }>(`/brands/${id}/delete`);
}

// Upload brand image
export async function uploadBrandImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/brand', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
}