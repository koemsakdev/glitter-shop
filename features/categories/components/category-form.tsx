'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { createNewCategory } from '../server/actions';
import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createCategorySchema } from '../schema';



type CategoryFormSchema = z.infer<typeof createCategorySchema>;

interface ParentCategory {
  id: string;
  name_en: string;
  name_km: string;
}

export function CategoryForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('categories');
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>(
    []
  );

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await fetch('/api/categories/list');
        const data = await res.json();
        setParentCategories(data.data || []);
      } catch (error) {
        console.error('Failed to fetch parent categories:', error);
      }
    };
    fetchParentCategories();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name_en: '',
      slug_en: '',
      name_km: '',
      slug_km: '',
      image: undefined,
      parentId: undefined,
      status: 'ACTIVE',
    },
  });

  const imageValue = watch('image');
  const parentIdValue = watch('parentId');

  const onSubmit = async (data: CategoryFormSchema) => {
    try {
      await createNewCategory(data);
      toast.success(t('messages.createSuccess'));
      router.push(`/${locale}/categories`);
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(t('messages.createError'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('form.title')}</CardTitle>
        <CardDescription>{t('form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-category-create" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="mb-2">
              <ImageUpload
                label={t('form.icon')}
                uploadEndpoint="/api/upload/category"
                onImageUpload={(url) => setValue('image', url)}
                previewUrl={imageValue}
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="name_en"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-category-name-en">
                      {t('form.name_en')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-category-name-en"
                      placeholder="e.g., Shoes"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="name_km"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-category-name-km">
                      {t('form.name_km')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-category-name-km"
                      placeholder="ឧ. ស្បែក"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="slug_en"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-category-slug-en">
                      {t('form.slug_en')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-category-slug-en"
                      placeholder="e.g., shoes"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="slug_km"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-category-slug-km">
                      {t('form.slug_km')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-category-slug-km"
                      placeholder="e.g., shoes-km"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="parentId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-category-parent">
                    {t('form.parentCategory')}
                  </FieldLabel>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(value) =>
                      field.onChange(value === 'none' ? undefined : value)
                    }
                  >
                    <SelectTrigger id="form-category-parent">
                      <SelectValue placeholder={t('form.selectParent')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('form.none')}</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {locale === 'km' ? cat.name_km : cat.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-category-status">
                    {t('form.status')}
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-category-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        {t('status.active')}
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        {t('status.inactive')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {t('form.cancel')}
        </Button>
        <Button
          type="submit"
          form="form-category-create"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('form.creating') : t('form.save')}
        </Button>
      </CardFooter>
    </Card>
  );
}