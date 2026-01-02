"use client"

import { useDemo } from "@/lib/demo/store"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { state, dispatch } = useDemo()
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        const isScreenshot = searchParams.get('mode') === 'screenshot'

        if (isScreenshot) {
            if (!state.auth.isAuthenticated) {
                // Auto-login for screenshot mode
                dispatch({
                    type: 'LOGIN',
                    payload: { user: state.agents[0] }
                })
            }
            setIsChecked(true)
            return
        }

        if (!state.auth.isAuthenticated && pathname !== "/login") {
            router.push("/login")
        } else if (state.auth.isAuthenticated && pathname === "/login") {
            router.push("/")
        }
        setIsChecked(true)
    }, [state.auth.isAuthenticated, pathname, router, searchParams, dispatch, state.agents])

    // Prevent hydration mismatch or flash of content by waiting for check
    // However, since state is sync from localStorage in our provider, we might be okay.
    // But router.push is async. 

    // If we are unauthenticated and on a protected page, don't show children.
    if (!state.auth.isAuthenticated && pathname !== "/login") {
        return null;
    }

    return <>{children}</>
}
