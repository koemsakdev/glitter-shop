'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import { getCategories } from '@/features/categories/server/actions';
import { CategoriesTable } from '@/features/categories/components';
import { Category, CategoriesResponse } from '@/features/categories/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const t = useTranslations('categories');
  const locale = useLocale();

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: CategoriesResponse = await getCategories(
        page,
        limit,
        search || undefined
      );
      setCategories(response.data);
      setTotal(response.total);
      setPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link href={`/${locale}/categories/new`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            {t('newCategory')}
          </Button>
        </Link>
      </div>

      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 dark:bg-slate-900 dark:border-slate-800"
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <Button
            onClick={() => fetchCategories()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            {t('messages.retry')}
          </Button>
        </div>
      )}

      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        onDeleteSuccess={fetchCategories}
      />

      {categories.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            {t('pagination.showing')} {(page - 1) * limit + 1}{' '}
            {t('pagination.to')} {Math.min(page * limit, total)}{' '}
            {t('pagination.of')} {total}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
            >
              {t('pagination.previous')}
            </Button>
            <span className="flex items-center px-4 text-sm">
              {t('pagination.page')} {page} of {pages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              variant="outline"
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}