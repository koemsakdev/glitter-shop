import { apiClient } from '@/lib/api-client';

export interface Category {
  id: string;
  name_en: string;
  name_km: string;
  slug_en: string;
  slug_km: string;
  image?: string;
  parentId?: string;
  status: string;
  parent?: {
    id: string;
    name_en: string;
    name_km: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateInput {
  name_en: string;
  slug_en: string;
  name_km: string;
  slug_km: string;
  image?: string;
  parentId?: string;
  status?: string;
}

export interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchAllCategories(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CategoriesResponse> {
  return apiClient.get<CategoriesResponse>('/categories', {
    params: { page, limit, search },
  });
}

export async function fetchCategoryById(id: string): Promise<Category> {
  return apiClient.get<Category>(`/categories/${id}`);
}

export async function createCategory(
  data: CategoryCreateInput
): Promise<Category> {
  return apiClient.post<Category>('/categories/create', data);
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryCreateInput>
): Promise<Category> {
  return apiClient.put<Category>(`/categories/${id}/update`, data);
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  return apiClient.delete<{ success: boolean }>(`/categories/${id}/delete`);
}

// Upload category image
export async function uploadCategoryImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/category', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
}