import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const motion = {
    // Utility for adding delay to staggered animations
    stagger: (index: number, baseDelay: number = 0.05) => ({
        animationDelay: `${index * baseDelay}s`,
    }),

    // Classes for common motion patterns
    hover: {
        lift: "hover-lift",
        glow: "hover-glow-card",
        slideRight: "group-hover-slide-right",
    },

    animate: {
        float: "animate-float",
        floatSlow: "animate-float-slow",
        pulse: "animate-pulse",
        pulseSlow: "animate-pulse-slow",
        rotateSlow: "animate-rotate-slow",
        fadeIn: "animate-in fade-in zoom-in-95 duration-500",
        slideUp: "animate-in fade-in slide-in-from-bottom-4 duration-500",
    }
}
