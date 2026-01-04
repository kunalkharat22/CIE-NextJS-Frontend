"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TypographyPage() {
    return (
        <div className="min-h-screen bg-background p-12 space-y-16 max-w-7xl mx-auto">
            <div className="space-y-4">
                <h1 className="type-h2">Typography System</h1>
                <p className="type-body text-muted-foreground w-full max-w-2xl">
                    Typography hierarchy using <strong>Calistoga</strong> for headlines, <strong>Inter</strong> for UI content,
                    and <strong>JetBrains Mono</strong> for technical data and labels.
                </p>
            </div>

            <section className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-border pb-4">
                        <span className="text-xs text-muted-foreground font-mono">.type-h1 / Display</span>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <h1 className="type-h1">The Creative <span className="text-signature-gradient">Intelligence</span> Engine</h1>
                        <p className="text-sm text-muted-foreground font-mono">Calistoga • 60px/48px</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-border pb-4">
                        <span className="text-xs text-muted-foreground font-mono">.type-h2 / Heading</span>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <h2 className="type-h2">Retention & Growth</h2>
                        <p className="text-sm text-muted-foreground font-mono">Calistoga • 48px/36px</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-border pb-4">
                        <span className="text-xs text-muted-foreground font-mono">.type-h3 / Title</span>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <h3 className="type-h3">Campaign Performance Metrics</h3>
                        <p className="text-sm text-muted-foreground font-mono">Inter • Semibold • 20px</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-border pb-4">
                        <span className="text-xs text-muted-foreground font-mono">.type-body / Body</span>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <p className="type-body max-w-2xl">
                            The quick brown fox jumps over the lazy dog. Customer intelligence requires a proactive approach
                            to solving complaints before they become churn risks. Our AI detects subtle sentiment shifts
                            in near-real-time pilot dashboard voice data.
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">Inter • Regular • 16px</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 border-border pb-4">
                        <span className="text-xs text-muted-foreground font-mono">.type-label-mono / Section Label</span>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <div className="flex flex-col gap-4 items-start">
                            <span className="type-label-mono text-muted-foreground">System Status</span>
                            <Badge variant="outline" className="type-label-mono text-accent border-accent/30 bg-accent/5 py-1">
                                Live Connected
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mt-2">JetBrains Mono • Uppercase • Tracking 0.15em</p>
                    </div>
                </div>
            </section>

            {/* Contextual Usage */}
            <section className="pt-12 border-t border-border">
                <h3 className="type-h3 mb-8">Context Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-0 overflow-hidden">
                        <CardContent className="p-8 space-y-4">
                            <div className="type-label-mono text-accent">Active Case</div>
                            <h2 className="type-h2">Billing Dispute</h2>
                            <p className="type-body text-muted-foreground">
                                Customer is disputing the overage charges from last month's invoice.
                                Intervention recommended.
                            </p>
                            <div className="pt-4">
                                <span className="type-h3 text-foreground">Action Required</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
