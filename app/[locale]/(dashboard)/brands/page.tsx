'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import { getBrands, removeBrand } from '@/features/brands/server/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Brand, BrandsResponse } from '@/lib/services/brands.service';

export default function BrandsPage() {
  const t = useTranslations('brands');
  const locale = useLocale();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const limit = 10;

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: BrandsResponse = await getBrands(
        page,
        limit,
        search || undefined
      );
      setBrands(response.data);
      setTotal(response.total);
      setPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
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
    fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await removeBrand(id);
      toast.success(t('messages.deleteSuccess'));
      await fetchBrands();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete brand:', error);
      toast.error(t('messages.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
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
        <Link href={`/${locale}/brands/new`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            {t('newBrand')}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 dark:bg-slate-900 dark:border-slate-800"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <Button
            onClick={() => fetchBrands()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            {t('messages.retry')}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('actions.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="border rounded-lg overflow-hidden dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-slate-900">
                  <TableHead>{t('table.brand')}</TableHead>
                  <TableHead>{t('table.status')}</TableHead>
                  <TableHead>{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-gray-500"
                    >
                      {t('noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow
                      key={brand.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {brand.logo && (
                            <div className="relative w-10 h-10">
                              <Image
                                src={brand.logo}
                                alt={brand.name_en}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{brand.name_en}</p>
                            <p className="text-sm text-gray-500">
                              {brand.name_km}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(brand.status)}>
                          {t(`status.${brand.status.toLowerCase()}`) ||
                            brand.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/${locale}/brands/${brand.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('actions.edit')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(brand.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('actions.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Delete Dialog */}
          <AlertDialog open={!!deleteId}>
            <AlertDialogContent>
              <AlertDialogTitle>{t('dialog.deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('dialog.deleteMessage')}
              </AlertDialogDescription>
              <div className="flex gap-4 justify-end">
                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                  {t('dialog.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteId && handleDelete(deleteId)}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? t('dialog.deleting') : t('dialog.confirm')}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Pagination */}
          {brands.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                {t('pagination.showing')} {(page - 1) * limit + 1}{' '}
                {t('pagination.to')} {Math.min(page * limit, total)}{' '}
                {t('pagination.of')} {total} {t('pagination.brands')}
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
        </>
      )}
    </div>
  );
}