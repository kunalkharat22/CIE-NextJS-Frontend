"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TokensPage() {
    return (
        <div className="p-12 space-y-12 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="space-y-4">
                <h1 className="text-4xl font-display font-medium">Design System Tokens</h1>
                <p className="text-muted-foreground">Reference for colors, shadows, and tokens.</p>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-medium border-b pb-2">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ColorToken name="Background" variable="--background" className="bg-background border" />
                    <ColorToken name="Foreground" variable="--foreground" className="bg-foreground text-background" />
                    <ColorToken name="Muted" variable="--muted" className="bg-muted" />
                    <ColorToken name="Muted Foreground" variable="--muted-foreground" className="bg-muted-foreground text-white" />
                    <ColorToken name="Border" variable="--border" className="bg-border" />
                    <ColorToken name="Card" variable="--card" className="bg-card border" />
                    <ColorToken name="Accent" variable="--accent" className="bg-accent text-white" />
                    <ColorToken name="Accent Secondary" variable="--accent-secondary" className="bg-accent-secondary text-white" />
                    <ColorToken name="Accent Foreground" variable="--accent-foreground" className="bg-accent-foreground border" />
                    <ColorToken name="Ring" variable="--ring" className="bg-ring text-white" />
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-medium border-b pb-2">Gradients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-32 w-full rounded-xl bg-accent-gradient shadow-md" />
                        <p className="font-mono text-xs">.bg-accent-gradient</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-32 w-full rounded-xl bg-white border border-border flex items-center justify-center">
                            <span className="text-4xl font-display font-bold text-accent-gradient">Gradient Text</span>
                        </div>
                        <p className="font-mono text-xs">.text-accent-gradient</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-medium border-b pb-2">Shadows</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-white rounded-lg shadow-accent-sm flex items-center justify-center text-xs">accent-sm</div>
                        <p className="font-mono text-xs text-muted-foreground">.shadow-accent-sm</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-white rounded-lg shadow-accent-md flex items-center justify-center text-xs">accent-md</div>
                        <p className="font-mono text-xs text-muted-foreground">.shadow-accent-md</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-white rounded-lg shadow-accent-lg flex items-center justify-center text-xs">accent-lg</div>
                        <p className="font-mono text-xs text-muted-foreground">.shadow-accent-lg</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-white rounded-lg shadow-accent-xl flex items-center justify-center text-xs">accent-xl</div>
                        <p className="font-mono text-xs text-muted-foreground">.shadow-accent-xl</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 w-full bg-white rounded-lg shadow-accent-glow flex items-center justify-center text-xs border border-accent">accent-glow</div>
                        <p className="font-mono text-xs text-muted-foreground">.shadow-accent-glow</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-medium border-b pb-2">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Default Card</CardTitle></CardHeader>
                        <CardContent>Standard card with layer shadow.</CardContent>
                    </Card>
                    <div className="border-gradient rounded-2xl p-0.5">
                        <div className="bg-card rounded-2xl p-6 h-full">
                            <h3 className="text-xl font-medium mb-2">Border Gradient Wrapper</h3>
                            <p className="text-muted-foreground">Using .border-gradient utility</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function ColorToken({ name, variable, className }: { name: string, variable: string, className: string }) {
    return (
        <div className="space-y-3 group">
            <div className={`h-20 w-full rounded-xl shadow-sm ${className}`} />
            <div>
                <h3 className="font-medium text-sm">{name}</h3>
                <p className="text-xs font-mono text-muted-foreground">{variable}</p>
            </div>
        </div>
    )
}
