'use client';

import { useTranslations } from 'next-intl';
import { BrandForm } from '@/features/brands/components';

export default function NewBrandPage() {
  const t = useTranslations('brands');

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

      <BrandForm />
    </div>
  );
}