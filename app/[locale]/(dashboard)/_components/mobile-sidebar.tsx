/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent, 
    SheetHeader, 
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Logo } from "@/app/[locale]/(dashboard)/_components/logo";
import { SidebarRoute } from "@/app/[locale]/(dashboard)/_components/sidebar-route";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MobileSidebarProps {
    isAuthLayout?: boolean
}

export const MobileSidebar = ({ isAuthLayout = false }: MobileSidebarProps) => {
    const t = useTranslations("Sidebar");
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger className={cn(
                "lg:hidden pr-4 opacity-75 hover:opacity-55 transition-opacity duration-300",
                isAuthLayout && "hidden"
            )}>
                <Menu />
            </SheetTrigger>
            <SheetContent side={"left"} className={"p-0 bg-white dark:bg-slate-800 overflow-y-auto"}>
                <SheetHeader className="border-b dark:border-slate-700">
                    <SheetTitle>
                        <div className={"p-4 w-full flex items-center gap-3"}>
                            <Logo />
                            <h2 className="text-2xl text-pink-500 font-bold">{t("title")}</h2>
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className={"flex flex-col w-full"}>
                    <SidebarRoute />
                </div>
            </SheetContent>
        </Sheet>
    )
}