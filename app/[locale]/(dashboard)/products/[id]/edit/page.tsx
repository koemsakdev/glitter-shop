'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { ProductForm } from '@/features/product/components/ProductForm';
import {
  getProductById,
  updateProductData,
} from '@/features/product/server/actions';
import {
  Product,
  ProductCreateInput,
} from '@/lib/services/products.service';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('products');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product, categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        // Fetch product
        const productData = await getProductById(params.id);
        setProduct(productData);

        // Fetch categories and brands
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
        console.error('Failed to fetch data:', err);
        setError(t('messages.loadError'));
        toast.error(t('messages.loadError'));
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [params.id, t]);

  const handleSubmit = async (data: ProductCreateInput) => {
    try {
      setIsLoading(true);
      await updateProductData(params.id, data);
      toast.success(t('messages.updateSuccess'));
      router.push(`/${locale}/products`);
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error(t('messages.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('actions.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-yellow-800 dark:text-yellow-200">
          <p className="font-medium">Product not found</p>
          <p className="text-sm mt-2">
            The product you are trying to edit does not exist.
          </p>
          <Link href={`/${locale}/products`}>
            <Button variant="outline" size="sm" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/${locale}/products`}>
              <Button
                variant="outline"
                size="sm"
                className="dark:bg-slate-900 dark:border-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {locale === 'km' ? 'កែប្រែផលិតផល' : 'Edit Product'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {product.name_en}
              </p>
            </div>
          </div>
        </div>
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

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
        <ProductForm
          product={product}
          categories={categories}
          brands={brands}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Product Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {locale === 'km' ? 'ស្ថានភាព' : 'Status'}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {product.status}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {locale === 'km' ? 'បង្កើត' : 'Created'}
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date(product.createdAt).toLocaleDateString(
              locale === 'km' ? 'km-KH' : 'en-US'
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {locale === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Updated'}
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date(product.updatedAt).toLocaleDateString(
              locale === 'km' ? 'km-KH' : 'en-US'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}