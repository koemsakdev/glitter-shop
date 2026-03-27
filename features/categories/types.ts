export interface Category {
  id: string;
  name_en: string;
  name_km: string;
  slug_en: string;
  slug_km: string;
  image?: string | null;
  parentId?: string | null;
  status: string;
  parent?: { id: string; name_en: string; name_km: string };
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  data: Category[];
  total: number;
  pages: number;
  page: number;
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