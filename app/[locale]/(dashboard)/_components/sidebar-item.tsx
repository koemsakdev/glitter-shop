"use client";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { useLocale } from "next-intl";

interface SidebarItemProps {
    name: string;
    href: string;
    icon: LucideIcon
}

export const SidebarItem = (
    { name, href, icon: Icon }: SidebarItemProps,
) => {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const segments = pathname.split("/").filter(Boolean);

    // remove locale
    const pathWithoutLocale = "/" + segments.slice(1).join("/");

    const isActive =
        pathWithoutLocale === href ||
        pathWithoutLocale.startsWith(`${href}/`);

    const handleClick = () => {
        startTransition(() => {
            router.push(`/${locale}${href}`);
        });
    }

    return (
        <>
            <button
                disabled={isPending}
                className={cn(
                    "flex items-center text-slate-500 dark:text-slate-200 text-sm pl-6 transition-all hover:text-slate-600 ",
                    isActive && "text-pink-500 dark:text-pink-500 hover:text-pink-700 bg-pink-200/20 hover:bg-purple-200/30 font-bold"
                )}
                onClick={handleClick}
            >
                <div className={"flex items-center gap-x-2 py-3"}>
                    <Icon size={17} className={cn(
                        "transition-all text-slate-500 dark:text-slate-200 hover:text-text-600",
                        isActive && "text-pink-500 dark:text-pink-500 hover:text-pink-600"
                    )} />
                    <span>{name}</span>
                </div>
                {isActive && (
                    <div className={"border-2 ml-auto border-pink-500 h-full transition-all"} />
                )}
            </button>
        </>
    )
}