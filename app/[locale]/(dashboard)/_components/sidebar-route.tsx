"use client";

import { ChartBarStacked, Framer, LayoutDashboard, PackageOpen, ShoppingBasket, TicketSlash, UsersRound, WalletCards } from "lucide-react";
import { SidebarItem } from "@/app/[locale]/(dashboard)/_components/sidebar-item"
import { useTranslations } from "next-intl";

export const SidebarRoute = () => {

  const t = useTranslations("Sidebar");

  const menuRoutes = [
    {
      name: t("dashboard"),
      href: "/",
      icon: LayoutDashboard
    },
    {
      name: t("products"),
      href: "/products",
      icon: PackageOpen
    },
    {
      name: t("categories"),
      href: "/categories",
      icon: ChartBarStacked
    },
    {
      name: t("brands"),
      href: "/brands",
      icon: Framer
    },
    {
      name: t("orders"),
      href: "/orders",
      icon: ShoppingBasket
    },
    {
      name: t("customers"),
      href: "/customers",
      icon: UsersRound
    },
    {
      name: t("banners"),
      href: "/banners",
      icon: WalletCards
    }
  ];

  return (
    <div className={"flex flex-col w-full"}>
      {menuRoutes.map((route) => (
        <SidebarItem
          key={route.href}
          name={route.name}
          href={route.href}
          icon={route.icon}
        />
      ))}
    </div>
  )
}