import React from "react";
import {Sidebar} from "@/app/[locale]/(dashboard)/_components/sidebar";
import {Navbar} from "@/app/[locale]/(dashboard)/_components/navbar";

const DashboardLayout = ({children}: {children: React.ReactNode }) => {
    return (
        <div className={"min-h-screen"}>
            <div className={"h-16 lg:pl-64 fixed insert-y-0 z-50 w-full"}>
                <Navbar />
            </div>
            <div className={"hidden lg:flex h-full w-64 flex-col fixed insert-y-0 z-50"}>
                <Sidebar />
            </div>
            <main className={"lg:pl-64 pt-16 h-full"}>
                <div className={"p-4 sm:p-6 lg:p-4"}>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout;