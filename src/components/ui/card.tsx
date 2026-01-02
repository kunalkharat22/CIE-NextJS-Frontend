import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "elevated" | "featured" }>(
    ({ className, variant = "default", ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-2xl border text-card-foreground transition-all duration-300",
                {
                    "bg-card border-border shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,82,255,0.15)]": variant === "default",
                    "bg-white border-transparent shadow-xl hover:shadow-2xl": variant === "elevated",
                    "bg-white border-gradient border-2 shadow-accent-lg hover:shadow-accent-xl": variant === "featured",
                },
                className
            )}
            {...props}
        />
    )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 p-6", className)}
            {...props}
        />
    )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn("text-xl font-display font-semibold leading-none tracking-tight text-foreground", className)}
            {...props}
        />
    )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
