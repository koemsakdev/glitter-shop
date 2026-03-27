'use client';

import { useTranslations } from 'next-intl';
import { CategoryForm } from '@/features/categories/components';

export default function NewCategoryPage() {
  const t = useTranslations('categories');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('form.create')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('subtitle')}
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}