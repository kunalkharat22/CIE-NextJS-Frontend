import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    variant?: "default" | "outline" | "risk-low" | "risk-med" | "risk-high" | "status-pending" | "status-resolved" | "neutral"
    dot?: boolean
    pulsing?: boolean
}

export function Badge({ className, children, variant = "default", dot = false, pulsing = false, ...props }: BadgeProps) {
    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            {
                "border-transparent bg-signature-gradient text-white shadow-sm": variant === "default",
                "border-border bg-white text-foreground shadow-sm": variant === "neutral",
                "border-accent text-accent bg-accent/5": variant === "outline",

                // Risky Levels
                "border-green-200 bg-green-50 text-green-700": variant === "risk-low",
                "border-yellow-200 bg-yellow-50 text-yellow-700": variant === "risk-med",
                "border-red-200 bg-red-50 text-red-700": variant === "risk-high",

                // Status
                "border-gray-200 bg-gray-50 text-gray-600": variant === "status-pending",
                "border-blue-200 bg-blue-50 text-blue-700": variant === "status-resolved",
            },
            className
        )} {...props}>
            {(dot || pulsing) && (
                <span className="mr-2 flex h-2 w-2 relative">
                    {pulsing && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
            )}
            {children}
        </div>
    )
}
