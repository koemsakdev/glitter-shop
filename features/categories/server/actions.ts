'use server';

import {
  fetchAllCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryCreateInput,
  type CategoriesResponse,
  type Category,
} from '@/lib/services/categories.service';

export async function getCategories(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CategoriesResponse> {
  try {
    return await fetchAllCategories(page, limit, search);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

export async function getCategoryById(id: string): Promise<Category> {
  try {
    return await fetchCategoryById(id);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw error;
  }
}

export async function createNewCategory(
  data: CategoryCreateInput
): Promise<Category> {
  try {
    return await createCategory(data);
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

export async function updateCategoryData(
  id: string,
  data: Partial<CategoryCreateInput>
): Promise<Category> {
  try {
    return await updateCategory(id, data);
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

export async function removeCategory(id: string): Promise<void> {
  try {
    await deleteCategory(id);
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}