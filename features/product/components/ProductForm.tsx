'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductCreateInput } from '@/lib/services/products.service';

interface ProductFormProps {
  product?: Product;
  categories: Array<{ id: string; name_en: string; name_km: string }>;
  brands: Array<{ id: string; name_en: string; name_km: string }>;
  onSubmit: (data: ProductCreateInput) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  categories,
  brands,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const t = useTranslations('products.form');
  const locale = useLocale();
  const [formData, setFormData] = useState<ProductCreateInput>({
    name_en: product?.name_en || '',
    slug_en: product?.slug_en || '',
    description_en: product?.description_en || '',
    name_km: product?.name_km || '',
    slug_km: product?.slug_km || '',
    description_km: product?.description_km || '',
    categoryId: product?.categoryId || '',
    brandId: product?.brandId || '',
    branchId: product?.branchId || '',
    status: product?.status || 'DRAFT',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_en.trim()) newErrors.name_en = 'Required';
    if (!formData.slug_en.trim()) newErrors.slug_en = 'Required';
    if (!formData.name_km.trim()) newErrors.name_km = 'Required';
    if (!formData.slug_km.trim()) newErrors.slug_km = 'Required';
    if (!formData.categoryId) newErrors.categoryId = 'Required';
    if (!formData.brandId) newErrors.brandId = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('name_en')}
          </label>
          <Input
            value={formData.name_en}
            onChange={(e) =>
              setFormData({ ...formData, name_en: e.target.value })
            }
            placeholder="Product name in English"
            className={`dark:bg-slate-900 dark:border-slate-800 ${
              errors.name_en ? 'border-red-500' : ''
            }`}
          />
          {errors.name_en && (
            <p className="text-sm text-red-500">{errors.name_en}</p>
          )}
        </div>

        {/* Khmer Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('name_km')}
          </label>
          <Input
            value={formData.name_km}
            onChange={(e) =>
              setFormData({ ...formData, name_km: e.target.value })
            }
            placeholder="ឈ្មោះផលិតផលក្នុងភាសាខ្មែរ"
            className={`dark:bg-slate-900 dark:border-slate-800 ${
              errors.name_km ? 'border-red-500' : ''
            }`}
          />
          {errors.name_km && (
            <p className="text-sm text-red-500">{errors.name_km}</p>
          )}
        </div>

        {/* Slug English */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('slug_en')}
          </label>
          <Input
            value={formData.slug_en}
            onChange={(e) =>
              setFormData({ ...formData, slug_en: e.target.value })
            }
            placeholder="product-slug-en"
            className={`dark:bg-slate-900 dark:border-slate-800 ${
              errors.slug_en ? 'border-red-500' : ''
            }`}
          />
          {errors.slug_en && (
            <p className="text-sm text-red-500">{errors.slug_en}</p>
          )}
        </div>

        {/* Slug Khmer */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('slug_km')}
          </label>
          <Input
            value={formData.slug_km}
            onChange={(e) =>
              setFormData({ ...formData, slug_km: e.target.value })
            }
            placeholder="product-slug-km"
            className={`dark:bg-slate-900 dark:border-slate-800 ${
              errors.slug_km ? 'border-red-500' : ''
            }`}
          />
          {errors.slug_km && (
            <p className="text-sm text-red-500">{errors.slug_km}</p>
          )}
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('description_en')}
          </label>
          <Textarea
            value={formData.description_en || ''}
            onChange={(e) =>
              setFormData({ ...formData, description_en: e.target.value })
            }
            placeholder="Description in English"
            rows={5}
            className="dark:bg-slate-900 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('description_km')}
          </label>
          <Textarea
            value={formData.description_km || ''}
            onChange={(e) =>
              setFormData({ ...formData, description_km: e.target.value })
            }
            placeholder="ការពិពណ៌នាក្នុងភាសាខ្មែរ"
            rows={5}
            className="dark:bg-slate-900 dark:border-slate-800"
          />
        </div>
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('category')}
          </label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger className="dark:bg-slate-900 dark:border-slate-800">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {locale === 'km' ? cat.name_km : cat.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('brand')}
          </label>
          <Select
            value={formData.brandId}
            onValueChange={(value) =>
              setFormData({ ...formData, brandId: value })
            }
          >
            <SelectTrigger className="dark:bg-slate-900 dark:border-slate-800">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {locale === 'km' ? brand.name_km : brand.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.brandId && (
            <p className="text-sm text-red-500">{errors.brandId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('status')}
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="dark:bg-slate-900 dark:border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isLoading ? (
            product ? t('updating') : t('creating')
          ) : (
            t('save')
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="dark:bg-slate-900 dark:border-slate-800"
          onClick={() => window.history.back()}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}