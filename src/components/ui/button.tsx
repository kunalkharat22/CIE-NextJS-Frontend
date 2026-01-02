import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                    "active:scale-95 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:transform-none", // Lift effect with a11y support
                    {
                        "bg-signature-gradient text-white shadow-lg hover:shadow-accent-lg border border-transparent": variant === "primary",
                        "bg-white border border-border text-foreground hover:bg-muted hover:border-accent/40 shadow-sm hover:shadow-md": variant === "secondary",
                        "bg-transparent border border-accent text-accent hover:bg-accent/5": variant === "outline", // Distinct from secondary which is standard outline
                        "bg-transparent hover:bg-accent/10 hover:text-accent": variant === "ghost",

                        "h-10 px-4 py-2 text-sm": size === "default",
                        "h-9 rounded-md px-3 text-xs": size === "sm",
                        "h-12 rounded-lg px-8 text-base": size === "lg",
                        "h-10 w-10 p-0 flex items-center justify-center": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
