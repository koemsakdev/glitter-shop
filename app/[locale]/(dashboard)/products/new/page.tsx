'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { ProductForm } from '@/features/product/components/ProductForm';
import { createNewProduct } from '@/features/product/server/actions';
import { ProductCreateInput } from '@/lib/services/products.service';

interface Category {
  id: string;
  name_en: string;
  name_km: string;
}

interface Brand {
  id: string;
  name_en: string;
  name_km: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('products');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);

        if (!categoriesRes.ok || !brandsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();

        setCategories(categoriesData.data || []);
        setBrands(brandsData.data || []);
      } catch (err) {
        console.error('Failed to fetch categories/brands:', err);
        setError('Failed to load form data');
        toast.error(t('messages.loadError'));
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [t]);

  const handleSubmit = async (data: ProductCreateInput) => {
    try {
      setIsLoading(true);
      await createNewProduct(data);
      toast.success(t('messages.createSuccess'));
      router.push(`/${locale}/products`);
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error(t('messages.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {locale === 'km' ? 'បង្កើតផលិតផលថ្មី' : 'Create New Product'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {locale === 'km'
            ? 'បង្កើតផលិតផលថ្មីក្នុងដ៍ផលិតផល'
            : 'Add a new product to your catalog'}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            {t('messages.retry')}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoadingData ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('actions.loading')}
            </p>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
          <ProductForm
            categories={categories}
            brands={brands}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}