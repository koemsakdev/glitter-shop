'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { createNewCategory } from '@/features/categories/server/actions';
import { CategoryCreateInput } from '@/lib/services/categories.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ParentCategory {
  id: string;
  name_en: string;
  name_km: string;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('categories');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);

  const [formData, setFormData] = useState<CategoryCreateInput>({
    name_en: '',
    slug_en: '',
    name_km: '',
    slug_km: '',
    image: undefined,
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch parent categories for dropdown
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await fetch('/api/categories/list');
        const data = await res.json();
        setParentCategories(data.data || []);
      } catch (error) {
        console.error('Failed to fetch parent categories:', error);
      }
    };
    fetchParentCategories();
  }, []);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setIsUploadingImage(true);
      const response = await fetch('/api/upload/category', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        })(),
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData({ ...formData, image: data.url });
      toast.success(t('messages.uploadSuccess'));
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error(t('messages.uploadError'));
      setPreviewUrl(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData({ ...formData, image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      await createNewCategory(formData);
      toast.success(t('messages.createSuccess'));
      router.push(`/${locale}/categories`);
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(t('messages.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('form.save')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('subtitle')}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-800"
      >
        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.icon')}
          </label>

          {previewUrl ? (
            <div className="relative w-40 h-40">
              <Image
                src={previewUrl}
                alt="Category icon preview"
                fill
                className="object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition"
            >
              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('form.uploadPlaceholder')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t('form.fileInfo')}
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={isUploadingImage}
            className="hidden"
          />

          {isUploadingImage && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {t('form.uploadingImage')}
            </p>
          )}
        </div>

        {/* Category Name Fields */}
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
              placeholder="e.g., Shoes"
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
              placeholder="ឧ. ស្បែក"
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
              placeholder="e.g., shoes"
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
              placeholder="e.g., shoes-km"
              className={`dark:bg-slate-800 dark:border-slate-700 ${
                errors.slug_km ? 'border-red-500' : ''
              }`}
            />
            {errors.slug_km && (
              <p className="text-sm text-red-500">{errors.slug_km}</p>
            )}
          </div>
        </div>

        {/* Parent Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.parentCategory')}
          </label>
          <Select
            value={formData.parentId || 'none'}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                parentId: value === 'none' ? undefined : value,
              })
            }
          >
            <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
              <SelectValue placeholder={t('form.selectParent')} />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              <SelectItem value="none">{t('form.none')}</SelectItem>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {locale === 'km' ? cat.name_km : cat.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Select */}
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

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700"
          >
            {isLoading ? t('form.creating') : t('form.save')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="dark:bg-slate-800 dark:border-slate-700"
          >
            {t('form.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}