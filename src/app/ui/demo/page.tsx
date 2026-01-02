"use client"

import { useDemo } from "@/lib/demo/store"
// import { JsonView } from "@/components/ui/json-view-placeholder" // We'll just dump text for now

export default function DemoDebugPage() {
    const { state } = useDemo()

    return (
        <div className="p-8 font-mono text-xs">
            <h1 className="text-xl font-bold mb-4">Demo State Debugger</h1>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-xl overflow-auto max-h-[80vh]">
                {JSON.stringify(state, null, 2)}
            </pre>
        </div>
    )
}
