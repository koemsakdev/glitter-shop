'use client';

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface TopProductsProps {
  products: Product[];
}

import { useTranslations } from 'next-intl';

export function TopProducts({ products }: TopProductsProps) {
  const t = useTranslations();
  const maxRevenue = Math.max(...products.map(p => p.revenue), 1);

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('dashboard.topProducts')}
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          {t('dashboard.noProduct')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {t('dashboard.topProducts')}
      </h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-pink-500 dark:bg-pink-700 text-white text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.sales} sales
                  </p>
                </div>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${product.revenue.toFixed(2)}
              </p>
            </div>
            <div className="h-2 bg-pink-100 dark:bg-pink-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 transition-all"
                style={{
                  width: `${(product.revenue / maxRevenue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}