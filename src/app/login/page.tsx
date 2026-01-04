"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Lock, Mail, ShieldCheck, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
// Import Demo Hooks
import { useDemo } from "@/lib/demo/store"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const { login } = useDemo()
    const router = useRouter()

    const [isLoading, setIsLoading] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [showForgotPassword, setShowForgotPassword] = React.useState(false)

    // Remember Me mock state
    const [rememberMe, setRememberMe] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (!email) {
            setError("Email is required")
            return
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address")
            return
        }
        if (!password) {
            setError("Password is required")
            return
        }

        setIsLoading(true)

        // Artificial delay
        setTimeout(() => {
            const success = login(email, password);
            if (success) {
                // If remember me is checked, we could theoretically verify this specific persistence preference,
                // but demo store persists everything to localStorage by default anyway.
                // We'll proceed to dashboard.
                router.push("/");
            } else {
                setError("Invalid credentials. Please check your email and password.");
                setIsLoading(false);
            }
        }, 800)
    }

    // Mock Forgot Password Handler
    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            alert(`Reset link sent to ${email || 'your email'}`)
            setIsLoading(false)
            setShowForgotPassword(false)
        }, 800)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/20 relative overflow-hidden">

            {/* Background Texture & Glow */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            {/* Subtle center blue glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />

            {/* Floating Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent-secondary/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

            <div className="w-full max-w-[480px] p-4 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <div className="inline-flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 hover-lift">
                                <Image src="/logo.png" alt="CIE Logo" fill className="object-contain" priority />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">CIE</span>
                        </div>
                        <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-medium">Complaint Intelligence Engine</p>
                    </div>

                    <h1 className="type-h2 text-foreground mb-3">
                        Welcome back
                    </h1>
                    <p className="type-body text-muted-foreground max-w-sm mx-auto">
                        Sign in to access your dashboard.
                    </p>
                </div>

                <Card className="border-white/50 bg-white/60 backdrop-blur-xl shadow-2xl hover-glow-card relative overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="space-y-1 pb-2">
                            {/* Header content moved to top level for design match, kept structural if needed */}
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1 border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-focus-within:text-accent transition-colors" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                    <Input
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                        className="pl-10 bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-focus-within:text-accent transition-colors" htmlFor="password">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs text-accent hover:text-accent-secondary font-medium hover:underline transition-all"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="rounded border-gray-300 text-accent focus:ring-accent"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Remember me</label>
                            </div>

                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 pt-2 pb-8">
                            <Button
                                className={cn(
                                    "w-full h-11 text-base shadow-accent-md hover:shadow-accent-lg transition-all",
                                    isLoading ? "opacity-80 cursor-not-allowed" : "hover-lift"
                                )}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    Secure sign-in
                                </span>
                                <span>•</span>
                                <span>GDPR-ready</span>
                            </div>
                        </CardFooter>
                    </form>

                    {/* Forgot Password Modal Overlay */}
                    {showForgotPassword && (
                        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="w-full max-w-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">Reset Password</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setShowForgotPassword(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
                                <Input
                                    placeholder="name@company.com"
                                    className="h-11"
                                    defaultValue={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button className="w-full" onClick={handleForgotPassword} disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="#" className="font-semibold text-foreground hover:text-accent transition-colors">
                            Contact Sales
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
