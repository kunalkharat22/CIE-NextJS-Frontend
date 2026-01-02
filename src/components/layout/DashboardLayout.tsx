"use client"
import * as React from "react"
import { Sidebar, Header } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils"

// This component wraps pages that need the dashboard layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false)
    const [collapsed, setCollapsed] = React.useState(false)

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                collapsed ? "lg:pl-[90px]" : "lg:pl-64"
            )}>
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 w-full max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
