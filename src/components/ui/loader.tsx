import { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function Loader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)} {...props}>
            <div className="relative h-12 w-12">
                {/* Spinner Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-muted/50"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

                {/* Inner Dot Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground animate-pulse">Loading...</p>
        </div>
    )
}
