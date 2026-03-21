import localFont from "next/font/local";
import type { Metadata } from "next";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

const googleSans = localFont({
  src: [
    { path: "../fonts/GoogleSans-Regular.ttf", weight: "400" },
    { path: "../fonts/GoogleSans-Medium.ttf", weight: "500" },
    { path: "../fonts/GoogleSans-Bold.ttf", weight: "700" },
  ],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "Glitter Shop | Your Sparkle, Our Priority",
  description:
    "Discover the latest trends in fashion and accessories at Glitter Shop.",
};

const locales = ["en", "km"] as const;

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          googleSans.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="relative flex flex-col min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}