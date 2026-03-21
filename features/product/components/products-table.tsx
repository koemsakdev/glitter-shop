'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Product } from '@/lib/services/products.service';
import toast from 'react-hot-toast';

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  isDeleting,
}: ProductsTableProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === products.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(products.map((p) => p.id)));
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !onDelete) return;
    try {
      await onDelete(deleteId);
      toast.success(t('messages.deleteSuccess'));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(t('messages.deleteError'));
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">{t('stock.outOfStock')}</Badge>;
    } else if (stock < 10) {
      return <Badge variant="outline">{t('stock.lowStock')}</Badge>;
    } else {
      return <Badge variant="default">{t('stock.inStock')}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase() as keyof typeof statusColors;
    const colors = statusColors[statusKey] || statusColors.active;
    return (
      <Badge variant="outline" className={colors}>
        {t(`status.${statusKey}`)}
      </Badge>
    );
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const getProductName = (product: Product) => {
    return locale === 'km' ? product.name_km : product.name_en;
  };

  const getCategoryName = (product: Product) => {
    if (!product.category) return '-';
    return locale === 'km' ? product.category.name_km : product.category.name_en;
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-slate-900">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === products.length && products.length > 0}
                  onCheckedChange={() => toggleAllRows()}
                />
              </TableHead>
              <TableHead>{t('table.product')}</TableHead>
              <TableHead>{t('table.category')}</TableHead>
              <TableHead>{t('table.stock')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead className="w-12">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className={`hover:bg-gray-50 dark:hover:bg-slate-800 ${
                    selectedRows.has(product.id)
                      ? 'bg-blue-50 dark:bg-blue-950'
                      : ''
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(product.id)}
                      onCheckedChange={() => toggleRow(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getProductName(product)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {locale === 'km' ? product.name_en : product.name_km}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getCategoryName(product)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-300">
                      {product.variants?.[0]?.inventory?.[0]?.qtyOnHand || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status)}
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
                          <Link href={`/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('actions.view')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('actions.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(product.id)}
                          className="text-red-600 dark:text-red-400"
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>{t('dialog.deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('dialog.deleteMessage')}
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {isDeleting ? t('dialog.deleting') : t('dialog.confirm')}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}