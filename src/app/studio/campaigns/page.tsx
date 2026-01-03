"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDemo } from "@/lib/demo/store"
import {
    Megaphone,
    ExternalLink,
    X,
    Calendar,
    Sparkles,
    Target,
    Layers
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function CampaignsListPage() {
    const { state } = useDemo()
    const router = useRouter()

    const [viewingCampaign, setViewingCampaign] = React.useState<any | null>(null) // Using any to bypass strict type check for now or cast later

    const campaigns = state.campaigns || []

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setViewingCampaign(null)
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    const handleOpenEditor = () => {
        // Ideally we pass the ID to load it. For now, we mock the navigation.
        router.push('/studio/create')
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6 relative">
                {/* Modal */}
                {viewingCampaign && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setViewingCampaign(null)}
                        />
                        <div className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold tracking-tight">{viewingCampaign.name}</h2>
                                        <Badge variant="outline" className={
                                            viewingCampaign.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                viewingCampaign.status === 'draft' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }>
                                            {viewingCampaign.status === 'active' ? 'Published' : viewingCampaign.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Created {viewingCampaign.startDate || new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setViewingCampaign(null)} className="h-8 w-8 rounded-full">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-muted/5">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                    {/* Left Column: Details */}
                                    <div className="md:col-span-5 space-y-6">
                                        {/* Platforms */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Platforms</h4>
                                            <div className="flex gap-2">
                                                {viewingCampaign.platform.map((p: string) => (
                                                    <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-sm font-medium">
                                                        {p.includes('Google') ? <GoogleIcon className="h-4 w-4" /> :
                                                            p.includes('Meta') ? <FacebookIcon className="h-4 w-4" /> :
                                                                <ShoppingBagIcon className="h-4 w-4" />}
                                                        <span>{p.replace('Ads', '').trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Target */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Strategy</h4>
                                            <div className="rounded-lg border border-border bg-background p-4 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                        <Target className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground block mb-0.5">Target Segment</span>
                                                        <span className="text-sm font-medium">{viewingCampaign.targetSegment}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                        <Layers className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground block mb-0.5">Linked Trend</span>
                                                        <span className="text-sm font-medium">"Refund Policy Confusion"</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Info */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Content Assets</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-xs text-muted-foreground block mb-1">Headline</span>
                                                    <p className="text-sm font-medium leading-normal">{viewingCampaign.headline}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground block mb-1">Primary Text</span>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{viewingCampaign.body || "No additional body text provided."}</p>
                                                </div>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <span className="text-xs text-muted-foreground">CTA:</span>
                                                    <Badge variant="neutral" className="font-mono text-xs">{viewingCampaign.cta || "Learn More"}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Preview */}
                                    <div className="md:col-span-7">
                                        <div className="h-full bg-muted/30 rounded-2xl border border-border p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
                                            <div className="absolute top-4 left-4">
                                                <Badge variant="outline" className="bg-background/50 backdrop-blur">Ad Preview</Badge>
                                            </div>
                                            {/* Mock Device Frame */}
                                            <div className="w-full max-w-[320px] bg-white rounded-xl shadow-2xl border border-border overflow-hidden shrink-0 transform transition-transform hover:scale-[1.02]">
                                                <div className="h-6 bg-slate-50 border-b border-border flex items-center px-3 gap-1.5">
                                                    <div className="h-2 w-2 rounded-full bg-red-400/80" />
                                                    <div className="h-2 w-2 rounded-full bg-yellow-400/80" />
                                                    <div className="h-2 w-2 rounded-full bg-green-400/80" />
                                                </div>
                                                <div className="p-5 space-y-4">
                                                    <div className="h-40 bg-gradient-to-br from-accent/5 to-purple-500/5 rounded-lg flex items-center justify-center text-accent/20 border border-dashed border-accent/20">
                                                        <Sparkles className="h-10 w-10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-display font-medium text-lg leading-tight text-slate-900">{viewingCampaign.headline}</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {viewingCampaign.body || "Experience premium quality and dedicated support with every order."}
                                                        </p>
                                                    </div>
                                                    <Button className="w-full h-10 text-sm font-semibold shadow-none bg-blue-600 hover:bg-blue-700 text-white">
                                                        {viewingCampaign.cta || "Learn More"}
                                                    </Button>
                                                </div>
                                                <div className="px-5 pb-4 pt-0">
                                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-3">
                                                        <span>Sponsored</span>
                                                        <div className="flex gap-1">
                                                            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                                            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                                            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border bg-card flex justify-end gap-3 z-10">
                                <Button variant="outline" onClick={() => setViewingCampaign(null)}>Close</Button>
                                <Button className="gap-2" onClick={handleOpenEditor}>
                                    <ExternalLink className="h-4 w-4" />
                                    Open in Editor
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
                        <p className="text-muted-foreground text-sm">Drafts and published campaigns.</p>
                    </div>
                    <Button onClick={() => router.push('/studio/create')} className="gap-2">
                        <Megaphone className="h-4 w-4" />
                        New Campaign
                    </Button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Campaign Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Platforms</th>
                                    <th className="px-6 py-4">Linked Trend</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {campaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No campaigns found. Create your first campaign to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex flex-col">
                                                    <span>{campaign.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-normal truncate max-w-[200px]">{campaign.headline}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={
                                                    campaign.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        campaign.status === 'draft' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }>
                                                    {campaign.status === 'active' ? 'Published' : campaign.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {campaign.platform.map(p => (
                                                        <div key={p} className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border" title={p}>
                                                            {p.includes('Google') ? <GoogleIcon className="h-3 w-3" /> :
                                                                p.includes('Meta') ? <FacebookIcon className="h-3 w-3" /> :
                                                                    <ShoppingBagIcon className="h-3 w-3" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                                {campaign.targetSegment || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" variant="ghost" className="h-8" onClick={() => setViewingCampaign(campaign)}>
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile List View */}
                <div className="sm:hidden space-y-4">
                    {campaigns.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground italic border border-dashed rounded-xl">
                            No campaigns found.
                        </div>
                    ) : (
                        campaigns.map((campaign) => (
                            <Card key={campaign.id} className="overflow-hidden" onClick={() => setViewingCampaign(campaign)}>
                                <CardContent className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-3">
                                        <span className="font-medium truncate flex-1 min-w-0 text-sm">{campaign.name}</span>
                                        <Badge variant="outline" className={
                                            campaign.status === 'active' ? 'bg-green-50 text-green-700 border-green-200 shrink-0' :
                                                campaign.status === 'draft' ? 'bg-gray-50 text-green-500 border-gray-200 shrink-0' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0'
                                        }>
                                            {campaign.status === 'active' ? 'Published' : campaign.status}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {campaign.headline || "No headline available."}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
                                        <div className="flex gap-2">
                                            {campaign.platform.map(p => (
                                                <div key={p} className="h-6 w-6 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground border border-border" title={p}>
                                                    {p.includes('Google') ? <GoogleIcon className="h-3 w-3" /> :
                                                        p.includes('Meta') ? <FacebookIcon className="h-3 w-3" /> :
                                                            <ShoppingBagIcon className="h-3 w-3" />}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                            {campaign.targetSegment || 'N/A'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.027-1.133 8.027-3.227 2.053-2.08 2.64-5.227 2.64-7.853 0-.787-.067-1.56-.16-2.293H12.48z" /></svg>
    )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    )
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}
