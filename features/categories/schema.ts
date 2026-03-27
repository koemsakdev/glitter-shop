import { z } from "zod";

export const createCategorySchema = z.object({
  name_en: z
    .string()
    .min(2, 'Category name (English) must be at least 2 characters')
    .max(100, 'Category name (English) must be at most 100 characters'),
  slug_en: z
    .string()
    .min(2, 'Slug (English) is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  name_km: z
    .string()
    .min(2, 'Category name (Khmer) must be at least 2 characters')
    .max(100, 'Category name (Khmer) must be at most 100 characters'),
  slug_km: z
    .string()
    .min(2, 'Slug (Khmer) is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  image: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});