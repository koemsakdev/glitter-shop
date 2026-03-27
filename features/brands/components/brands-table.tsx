'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import { removeBrand } from '../server/actions';
import { Brand } from '../types';
import { Button } from '@/components/ui/button';
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
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandsTableProps {
  brands: Brand[];
  isLoading: boolean;
  onDeleteSuccess: () => void;
}

export function BrandsTable({
  brands,
  isLoading,
  onDeleteSuccess,
}: BrandsTableProps) {
  const t = useTranslations('brands');
  const locale = useLocale();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await removeBrand(id);
      toast.success(t('messages.deleteSuccess'));
      onDeleteSuccess();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('actions.loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
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
    </>
  );
}