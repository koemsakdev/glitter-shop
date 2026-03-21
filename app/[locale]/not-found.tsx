"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("Common");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-linear-to-b from-gray-100 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-5xl w-full p-10 grid md:grid-cols-2 gap-10 bg-white/70 dark:bg-slate-800/40">
        
        <section>
          <p className="text-sm uppercase text-gray-500">
            404 — {t("notFound")}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            {t("notFoundTitle")}
          </h1>

          <p className="mt-4 text-gray-600 dark:text-slate-300">
            {t("notFoundDesc")}
          </p>

          <div className="mt-6">
            <Button onClick={() => router.back()}>
              {t("back")}
            </Button>
          </div>
        </section>

        <aside className="flex items-center justify-center">
          <div className="w-52 h-52 flex items-center justify-center">
            <span className="text-6xl font-bold">404</span>
          </div>
        </aside>

      </div>
    </main>
  );
}