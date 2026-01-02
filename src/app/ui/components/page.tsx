"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bell, Search, Mic, Plus } from "lucide-react"

export default function ComponentsShowcase() {
    return (
        <div className="min-h-screen bg-background p-12 space-y-16 max-w-7xl mx-auto">
            <div className="space-y-4">
                <h1 className="type-h2">Component Library</h1>
                <p className="type-body text-muted-foreground">Core components for the CIE application.</p>
            </div>

            {/* Buttons */}
            <section className="space-y-8">
                <h3 className="type-h3 border-b pb-2">Buttons</h3>
                <div className="flex flex-wrap gap-8 items-center">
                    <div className="space-y-2 text-center">
                        <Button>Primary Action</Button>
                        <p className="type-label-mono text-xs text-muted-foreground">Default (Primary)</p>
                    </div>
                    <div className="space-y-2 text-center">
                        <Button variant="secondary">Secondary Action</Button>
                        <p className="type-label-mono text-xs text-muted-foreground">Secondary</p>
                    </div>
                    <div className="space-y-2 text-center">
                        <Button variant="outline">Outline Action</Button>
                        <p className="type-label-mono text-xs text-muted-foreground">Outline</p>
                    </div>
                    <div className="space-y-2 text-center">
                        <Button variant="ghost">Ghost Action</Button>
                        <p className="type-label-mono text-xs text-muted-foreground">Ghost</p>
                    </div>
                    <div className="space-y-2 text-center">
                        <Button size="icon" variant="primary"><Plus className="h-5 w-5" /></Button>
                        <p className="type-label-mono text-xs text-muted-foreground">Icon Primary</p>
                    </div>
                    <div className="space-y-2 text-center">
                        <Button size="icon" variant="ghost"><Bell className="h-5 w-5" /></Button>
                        <p className="type-label-mono text-xs text-muted-foreground">Icon Ghost</p>
                    </div>
                </div>
            </section>

            {/* Badges */}
            <section className="space-y-8">
                <h3 className="type-h3 border-b pb-2">Badges & Labels</h3>
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <Badge variant="default">Default Badge</Badge>
                        <Badge variant="neutral">Neutral Badge</Badge>
                        <Badge variant="outline">Outline Accent</Badge>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Badge variant="risk-low" dot={true}>Low Risk</Badge>
                        <Badge variant="risk-med" dot={true}>Med Risk</Badge>
                        <Badge variant="risk-high" dot={true}>High Risk</Badge>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Badge variant="status-pending">Pending</Badge>
                        <Badge variant="status-resolved">Resolved</Badge>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Badge variant="risk-high" pulsing={true}>Live Issue</Badge>
                        <Badge variant="status-pending" pulsing={true} className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>
                    </div>
                </div>
            </section>

            {/* Cards */}
            <section className="space-y-8">
                <h3 className="type-h3 border-b pb-2">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card variant="default">
                        <CardHeader>
                            <CardTitle>Standard Card</CardTitle>
                            <CardDescription>Default border and shadow.</CardDescription>
                        </CardHeader>
                        <CardContent>Content area.</CardContent>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Elevated Card</CardTitle>
                            <CardDescription>Higher shadow, no border.</CardDescription>
                        </CardHeader>
                        <CardContent>Content area.</CardContent>
                    </Card>

                    <Card variant="featured">
                        <CardHeader>
                            <CardTitle>Featured Card</CardTitle>
                            <CardDescription>Gradient border, accent shadow.</CardDescription>
                        </CardHeader>
                        <CardContent>Content area.</CardContent>
                    </Card>
                </div>
            </section>

            {/* Inputs */}
            <section className="space-y-8">
                <h3 className="type-h3 border-b pb-2">Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Standard Input</label>
                        <Input placeholder="Enter text..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">With Icon</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-10" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
