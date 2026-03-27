'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label: string;
  description?: string;
  uploadEndpoint: string;
  onImageUpload: (url: string) => void;
  previewUrl?: string | null;
  className?: string;
}

export function ImageUpload({
  label,
  description,
  uploadEndpoint,
  onImageUpload,
  previewUrl,
  className,
}: ImageUploadProps) {
  const t = useTranslations('imageUpload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(
    previewUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compress image before upload
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Max dimensions
          const maxWidth = 1024;
          const maxHeight = 1024;

          // Resize if larger than max
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob!], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.8
          );
        };
      };
    });
  };

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validImageTypes.includes(file.type)) {
      const errorMsg = t('messages.invalidFile');
      toast.error(errorMsg);
      setError(errorMsg);
      return { valid: false, error: errorMsg };
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = t('messages.fileTooLarge');
      toast.error(errorMsg);
      setError(errorMsg);
      return { valid: false, error: errorMsg };
    }

    setError(null);
    return { valid: true };
  };

  const handleImageSelect = async (file: File) => {
    if (!file) return;

    // Validate file
    const { valid } = validateFile(file);
    if (!valid) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 5));
      }, 150);

      // Compress image
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.url);
      toast.success(t('messages.uploadSuccess'));
    } catch (error) {
      console.error('Failed to upload image:', error);
      const errorMsg = t('messages.uploadError');
      toast.error(errorMsg);
      setError(errorMsg);
      setLocalPreview(null);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 600);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const removeImage = () => {
    setLocalPreview(null);
    onImageUpload('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success(t('messages.removeSuccess'));
  };

  return (
    <div className={cn('group w-full space-y-3', className)}>
      {(label || description) && (
        <div className="flex flex-col space-y-1 text-left">
          {label && (
            <Label className="text-sm font-semibold tracking-tight">
              {label}
            </Label>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div
        onClick={() => !isUploading && !localPreview && !error && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out overflow-hidden bg-slate-50 dark:bg-neutral-950 w-100',
          !localPreview
            ? 'aspect-video cursor-pointer'
            : 'aspect-video border-transparent',
          error
            ? 'border-red-500 dark:border-red-500 bg-red-50/30 dark:bg-red-950/20'
            : isDragging
            ? 'border-pink-500 dark:border-pink-700/50 bg-pink-50/50 dark:bg-pink-950/20'
            : 'border-slate-200 dark:border-pink-800/50 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/10 hover:shadow-inner',
          isUploading && 'pointer-events-none brightness-95'
        )}
      >
        {error && !localPreview ? (
          // Error state
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-red-500 opacity-20 blur"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 shadow-sm">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setError(null);
                  fileInputRef.current?.click();
                }}
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : localPreview ? (
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-white dark:bg-black">
            <Image
              src={localPreview}
              alt="Upload preview"
              fill
              className={cn(
                'object-contain transition-transform duration-700',
                isUploading && 'blur-md scale-110 grayscale'
              )}
              priority
            />

            {!isUploading && (
              <>
                {/* Remove button - Always visible at top right */}
                <div className="absolute top-3 right-3 z-20">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="h-9 w-9 rounded-full shadow-xl hover:scale-110 transition-transform"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="relative">
              <div className={cn(
                'absolute -inset-1 rounded-full opacity-20 blur transition duration-500',
                isDragging
                  ? 'bg-pink-500 opacity-40'
                  : 'bg-linear-to-r from-pink-500 to-violet-500 group-hover:opacity-40'
              )}></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Upload className={cn(
                  'h-6 w-6 transition-colors',
                  isDragging
                    ? 'text-pink-500'
                    : 'text-slate-400 group-hover:text-pink-500'
                )} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {isDragging ? '✨ Drop your image here' : t('placeholder')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {t('fileInfo')}
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-all">
            <div className="w-full max-w-[70%] space-y-4 px-4 text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-pink-600 dark:text-pink-400 tracking-widest uppercase">
                  <span>{t('uploading')}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}