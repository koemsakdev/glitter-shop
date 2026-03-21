"use client"
import { Logo } from "@/app/[locale]/(dashboard)/_components/logo";
import { SidebarRoute } from "@/app/[locale]/(dashboard)/_components/sidebar-route";
import { useTranslations } from "next-intl";

export const Sidebar = () => {
    const t = useTranslations("Sidebar");
    return (
        <div className={"h-full border-r flex flex-col bg-white dark:bg-slate-900 overflow-y-auto"}>
            <div className={"p-6 w-full flex items-center gap-3"}>
                <Logo />
                <h2 className="text-2xl text-[#ff7acc] font-bold "> {t("title")} </h2>
            </div>
            <div className={"flex flex-col w-full"}>
                <SidebarRoute />
            </div>
        </div>
    )
}