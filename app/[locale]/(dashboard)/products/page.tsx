'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import { getProducts, removeProduct } from '@/features/product/server/actions';
import { ProductsTable } from '@/features/product/components/products-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Product, ProductsResponse } from '@/lib/services/products.service';

export default function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: ProductsResponse = await getProducts(page, limit, search || undefined);
      setProducts(response.data);
      setTotal(response.total);
      setPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(t('messages.loadError'));
      toast.error(t('messages.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, limit, t]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await removeProduct(id);
      toast.success(t('messages.deleteSuccess'));
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(t('messages.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/${locale}/products/${product.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link href={`/${locale}/products/new`}>
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            {t('newProduct')}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p>{error}</p>
          <Button
            onClick={() => fetchProducts()}
            variant="outline"
            size="sm"
            className="mt-2 dark:bg-red-950 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900"
          >
            {t('messages.retry')}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('actions.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />

          {/* Pagination Info */}
          {products.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('pagination.showing')} {(page - 1) * limit + 1} {t('pagination.to')}{' '}
                {Math.min(page * limit, total)} {t('pagination.of')} {total} {t('pagination.products')}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="dark:bg-slate-900 dark:border-slate-800"
                >
                  {t('pagination.previous')}
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('pagination.page')} {page} {t('pagination.of')} {pages}
                  </span>
                </div>
                <Button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  variant="outline"
                  className="dark:bg-slate-900 dark:border-slate-800"
                >
                  {t('pagination.next')}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}