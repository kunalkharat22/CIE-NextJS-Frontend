"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    PieChart,
    Megaphone,
    LogOut,
    Bell,
    Search,
    TrendingUp,
    Blocks, // Integrations
    Calendar,
    Menu,
    MoreVertical,
    X,
    PlusCircle,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useDemo } from "@/lib/demo/store"
import { useRouter } from "next/navigation"

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    {
        name: 'Complaints',
        href: '/complaints',
        icon: FileText,
        children: [
            { name: 'Intake', href: '/complaints/intake', icon: PlusCircle }
        ]
    },
    { name: 'Live Coaching', href: '/live', icon: MessageSquare },
    { name: 'Trends', href: '/trends', icon: TrendingUp },
    {
        name: 'Campaign Studio',
        href: '/studio',
        icon: Megaphone,
        children: [
            { name: 'Create', href: '/studio/create', icon: PlusCircle },
            { name: 'Campaigns', href: '/studio/campaigns', icon: Megaphone }
        ]
    },
    { name: 'Retention', href: '/retention', icon: PieChart },
    { name: 'Integrations', href: '/integrations', icon: Blocks },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ className, isOpen, onClose, collapsed, setCollapsed }: { className?: string, isOpen?: boolean, onClose?: () => void, collapsed?: boolean, setCollapsed?: (v: boolean) => void }) {
    const pathname = usePathname()
    // Local state for mobile simple usage if collapsed prop not provided
    const [localCollapsed, setLocalCollapsed] = React.useState(false)
    const isCollapsed = collapsed ?? localCollapsed
    const toggleCollapsed = () => setCollapsed ? setCollapsed(!isCollapsed) : setLocalCollapsed(!localCollapsed)

    // Lucide imports for toggle
    const { ChevronRight, ChevronLeft } = require("lucide-react")
    const [showUserMenu, setShowUserMenu] = React.useState(false)
    const { logout, state } = useDemo() // state might be needed or just logout
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <div className={cn(
                "fixed top-0 left-0 z-50 h-screen border-r border-border bg-card flex flex-col transition-all duration-300 lg:fixed lg:bottom-0 lg:z-30",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                isCollapsed ? "w-[90px]" : "w-64",
                className
            )}>
                {/* Header / Logo */}
                <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    <div className="flex items-center gap-2">
                        <div className="relative h-9 w-9 shrink-0">
                            <Image src="/logo.png" alt="CIE Logo" fill className="object-contain" priority />
                        </div>

                        <div className={cn("overflow-hidden transition-all duration-300 flex items-center", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                            <span className="font-display text-xl font-bold tracking-tight whitespace-nowrap">CIE</span>
                            <Badge variant="outline" className="text-[10px] py-0 h-5 border-accent/20 text-accent bg-accent/5 ml-2">
                                PRO
                            </Badge>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Nav Items */}
                <div className={cn("flex-1 overflow-y-auto py-2 px-3 space-y-2", isCollapsed ? "px-2" : "px-4")}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href))

                        return (
                            <div key={item.name} className="relative group/item">
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex transition-all duration-200 group relative items-center",
                                        isCollapsed
                                            ? "flex-col justify-center gap-1 py-3 px-1 rounded-xl"
                                            : "flex-row gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                                        isActive && !item.children
                                            ? "bg-accent/5 text-accent font-semibold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                        isActive && item.children ? "text-foreground" : ""
                                    )}
                                >
                                    <item.icon className={cn(
                                        "transition-colors",
                                        isCollapsed ? "h-5 w-5" : "h-4 w-4",
                                        isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                                    )} />

                                    <span className={cn(
                                        "transition-all duration-200",
                                        isCollapsed ? "text-[10px] text-center leading-none font-medium truncate w-full" : "text-sm"
                                    )}>
                                        {item.name}
                                    </span>

                                    {/* Active Indicator Bar */}
                                    {!isCollapsed && isActive && !item.children && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-accent rounded-r-full" />
                                    )}
                                </Link>

                                {/* Sub-menu only visible when expanded AND active */}
                                {!isCollapsed && isActive && item.children && (
                                    <div className="ml-9 border-l border-border pl-2 my-1 space-y-1 animate-in slide-in-from-left-2 duration-200">
                                        {item.children.map(child => {
                                            const isChildActive = pathname === child.href
                                            return (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    onClick={onClose}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 block",
                                                        isChildActive
                                                            ? "text-accent font-semibold bg-accent/5"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    {child.name}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Footer / User / Toggle */}
                <div className="p-4 border-t border-border mt-auto relative">
                    {/* Toggle Button */}
                    <div className="hidden lg:flex absolute -right-3 top-[-16px] z-50">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full shadow-md bg-background border-border text-muted-foreground hover:text-foreground"
                            onClick={toggleCollapsed}
                        >
                            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                        </Button>
                    </div>

                    {/* User Menu Popup */}
                    {!isCollapsed && showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <div className="absolute bottom-full right-4 mb-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-xl z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                                <div className="px-2 py-1.5 border-b border-border/50 mb-1">
                                    <p className="text-xs font-semibold">My Account</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 h-9 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </Button>
                            </div>
                        </>
                    )}

                    <div className={cn(
                        "flex items-center rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group select-none",
                        isCollapsed ? "justify-center p-2 flex-col gap-1 aspect-square" : "gap-3 p-3"
                    )}
                        onClick={() => !isCollapsed && setShowUserMenu(!showUserMenu)}
                    >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-medium text-xs shadow-sm shrink-0">
                            JD
                        </div>
                        <div className={cn("min-w-0 transition-all duration-300", isCollapsed ? "h-0 w-0 opacity-0 overflow-hidden" : "flex-1")}>
                            <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">John Doe</p>
                            <p className="text-xs text-muted-foreground truncate">john@cie.ai</p>
                        </div>
                        {!isCollapsed && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => {
                                e.stopPropagation();
                                setShowUserMenu(!showUserMenu);
                            }}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 lg:hidden">
                <Button variant="ghost" size="icon" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    {/* Mobile Input */}
                    <Input
                        placeholder="Search"
                        className="md:hidden pl-10 h-10 bg-muted/30 border-transparent focus:bg-white focus:border-accent/30 transition-all rounded-xl"
                    />
                    {/* Desktop Input */}
                    <Input
                        placeholder="Search complaints, campaigns..."
                        className="hidden md:block pl-10 h-10 bg-muted/30 border-transparent focus:bg-white focus:border-accent/30 transition-all rounded-xl"
                    />
                    <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white text-sm font-medium text-muted-foreground hover:border-accent/30 transition-colors cursor-pointer">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Oct 24 - Nov 24</span>
                </div>

                <Badge variant="risk-low" dot={false} pulsing={true} className="hidden md:flex bg-red-50 text-red-600 border-red-200 px-3 py-1.5 h-auto">
                    Live
                </Badge>

                <div className="h-6 w-px bg-border hidden md:block" />

                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
                </Button>
            </div>
        </header>
    )
}
