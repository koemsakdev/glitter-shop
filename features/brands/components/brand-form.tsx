'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { createNewBrand } from '../server/actions';
import { BrandCreateInput } from '../types';
import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BrandForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('brands');

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BrandCreateInput>({
    name_en: '',
    slug_en: '',
    name_km: '',
    slug_km: '',
    logo: undefined,
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name_en.trim()) newErrors.name_en = 'Required';
    if (!formData.slug_en.trim()) newErrors.slug_en = 'Required';
    if (!formData.name_km.trim()) newErrors.name_km = 'Required';
    if (!formData.slug_km.trim()) newErrors.slug_km = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await createNewBrand(formData);
      toast.success(t('messages.createSuccess'));
      router.push(`/${locale}/brands`);
    } catch (error) {
      console.error('Failed to create brand:', error);
      toast.error(t('messages.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-800"
    >
      <ImageUpload
        label={t('form.logo')}
        uploadEndpoint="/api/upload/brand"
        onImageUpload={(url) => setFormData({ ...formData, logo: url })}
        previewUrl={formData.logo}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.name_en')}
          </label>
          <Input
            value={formData.name_en}
            onChange={(e) =>
              setFormData({ ...formData, name_en: e.target.value })
            }
            placeholder="e.g., Apple"
            className={`dark:bg-slate-800 dark:border-slate-700 ${
              errors.name_en ? 'border-red-500' : ''
            }`}
          />
          {errors.name_en && (
            <p className="text-sm text-red-500">{errors.name_en}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.name_km')}
          </label>
          <Input
            value={formData.name_km}
            onChange={(e) =>
              setFormData({ ...formData, name_km: e.target.value })
            }
            placeholder="ឧ. អាប៊ល"
            className={`dark:bg-slate-800 dark:border-slate-700 ${
              errors.name_km ? 'border-red-500' : ''
            }`}
          />
          {errors.name_km && (
            <p className="text-sm text-red-500">{errors.name_km}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.slug_en')}
          </label>
          <Input
            value={formData.slug_en}
            onChange={(e) =>
              setFormData({ ...formData, slug_en: e.target.value })
            }
            placeholder="e.g., apple"
            className={`dark:bg-slate-800 dark:border-slate-700 ${
              errors.slug_en ? 'border-red-500' : ''
            }`}
          />
          {errors.slug_en && (
            <p className="text-sm text-red-500">{errors.slug_en}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.slug_km')}
          </label>
          <Input
            value={formData.slug_km}
            onChange={(e) =>
              setFormData({ ...formData, slug_km: e.target.value })
            }
            placeholder="e.g., apple-km"
            className={`dark:bg-slate-800 dark:border-slate-700 ${
              errors.slug_km ? 'border-red-500' : ''
            }`}
          />
          {errors.slug_km && (
            <p className="text-sm text-red-500">{errors.slug_km}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.status')}
        </label>
        <Select
          value={formData.status || 'ACTIVE'}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-800">
            <SelectItem value="ACTIVE">{t('status.active')}</SelectItem>
            <SelectItem value="INACTIVE">{t('status.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700"
        >
          {isLoading ? t('form.creating') : t('form.save')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => history.back()}
          className="dark:bg-slate-800 dark:border-slate-700"
        >
          {t('form.cancel')}
        </Button>
      </div>
    </form>
  );
}