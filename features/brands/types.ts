export interface Brand {
  id: string;
  name_en: string;
  name_km: string;
  slug_en: string;
  slug_km: string;
  logo?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsResponse {
  data: Brand[];
  total: number;
  pages: number;
  page: number;
}

export interface BrandCreateInput {
  name_en: string;
  slug_en: string;
  name_km: string;
  slug_km: string;
  logo?: string;
  status?: string;
}