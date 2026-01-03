"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Sparkles,
    Eye,
    ExternalLink,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    Facebook,
    Chrome,
    Store,
    Check
} from "lucide-react"

import { useRouter } from "next/navigation"
import { useDemo } from "@/lib/demo/store"
import { Search, Megaphone } from "lucide-react"
import { toast } from "sonner"

export default function StudioPage() {
    const searchParams = useSearchParams()
    const { state, dispatch } = useDemo()
    // Default to first trend if none selected
    const [selectedTrendId, setSelectedTrendId] = React.useState<string | null>(null)
    const [searchQuery, setSearchQuery] = React.useState("")

    // Auto-select trend from URL
    const trendParam = searchParams.get('trendId')
    React.useEffect(() => {
        if (trendParam) {
            setSelectedTrendId(trendParam)
        } else if (state.trends.length > 0 && !selectedTrendId) {
            // Default to first
            setSelectedTrendId(state.trends[0].id)
        }
    }, [trendParam, state.trends])

    const activeTrend = state.trends.find(t => t.id === selectedTrendId) || state.trends[0]

    const [activeTab, setActiveTab] = React.useState("trust")
    const [approved, setApproved] = React.useState(false)
    const [platforms, setPlatforms] = React.useState({
        google: true,
        meta: false,
        shopify: true
    })

    // Content State per Tab
    const [campaignContent, setCampaignContent] = React.useState<Record<string, { headline: string, body: string, cta: string, ctaUrl: string }>>({
        trust: { headline: "", body: "", cta: "", ctaUrl: "" },
        speed: { headline: "", body: "", cta: "", ctaUrl: "" },
        service: { headline: "", body: "", cta: "", ctaUrl: "" }
    })

    // Current Content Accessor
    const currentContent = campaignContent[activeTab] || { headline: "", body: "", cta: "", ctaUrl: "" }
    const setContent = (field: string, value: string) => {
        setCampaignContent(prev => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], [field]: value }
        }))
    }

    // Auto-fill Editor Logic
    React.useEffect(() => {
        if (activeTrend) {
            if (activeTrend.name === "Delivery Delay Spike") {
                const common = {
                    headline: "Now Faster Delivery – Because We Listened",
                    body: "We apologize for the recent delays. We’ve upgraded our logistics partner to ensure this doesn’t happen again. All affected orders have been prioritized. Expect normal times by Monday.",
                    cta: "Learn More",
                    ctaUrl: "https://cie.ai/help"
                };
                setCampaignContent({
                    trust: common,
                    speed: common,
                    service: common
                })
            } else {
                setCampaignContent({
                    trust: {
                        headline: `We hear you: ${activeTrend.name}`,
                        body: `We apologize for the ${activeTrend.name}. Transparency is our priority. We have identified the issue and are working to rebuild your trust.`,
                        cta: "Read Our Full Statement",
                        ctaUrl: "https://cie.ai/blog/update"
                    },
                    speed: {
                        headline: `Fixed: ${activeTrend.name}`,
                        body: `The issue regarding ${activeTrend.name} has been resolved. Our team deployed a speed update to ensure this doesn't happen again.`,
                        cta: "View System Status",
                        ctaUrl: "https://status.cie.ai"
                    },
                    service: {
                        headline: `Our Promise: Better Service`,
                        body: `Regarding ${activeTrend.name}: We are committed to better service. If you were affected, please reach out for immediate assistance.`,
                        cta: "Contact Support",
                        ctaUrl: "https://cie.ai/support"
                    }
                })
            }
        }
    }, [activeTrend])

    const filteredTrends = state.trends.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const canPublish = approved && Object.values(platforms).some(v => v);
    const router = useRouter()
    const [showConfirmModal, setShowConfirmModal] = React.useState(false)

    const togglePlatform = (key: keyof typeof platforms) => {
        setPlatforms(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handlePublish = () => {
        setShowConfirmModal(true)
    }

    const confirmPublish = () => {
        if (!activeTrend) return;

        const activePlatforms = Object.entries(platforms)
            .filter(([_, enabled]) => enabled)
            .map(([key]) => key === 'google' ? 'Google Ads' : key === 'meta' ? 'Meta' : 'Shopify');

        dispatch({
            type: 'CREATE_CAMPAIGN',
            payload: {
                id: `cp-${Date.now()}`,
                name: `${activeTrend.name} Response`,
                status: 'active',
                targetSegment: 'Affected Users',
                platform: activePlatforms,
                headline: currentContent.headline,
                stats: { impressions: 0, clicks: 0, conversions: 0 }
            }
        });

        toast.success("Campaign published successfully");
        setShowConfirmModal(false);
        router.push('/');
    }


    return (
        <DashboardLayout>
            <div className="lg:h-[calc(100vh-8rem)] h-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 lg:pb-0">

                {/* LEFT PANEL: TREND MINER */}
                <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 lg:border-r border-border lg:pr-6 order-3 lg:order-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="type-label-mono text-muted-foreground">TREND MINER</span>
                        <Badge variant="outline" className="text-[10px]">Real-time</Badge>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search trends..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 lg:overflow-y-auto pr-2 no-scrollbar flex-1">
                        {filteredTrends.map((trend, i) => (
                            <Card
                                key={trend.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:-translate-y-1 hover-lift animate-in fade-in slide-in-from-left-4 duration-500",
                                    activeTrend?.id === trend.id ? "border-accent ring-1 ring-accent/20 bg-accent/5 shadow-md" : ""
                                )}
                                style={{ animationDelay: `${i * 100}ms` }}
                                onClick={() => setSelectedTrendId(trend.id)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={activeTrend?.id === trend.id ? "risk-high" : "neutral"} className="mb-2">
                                            Impact Score: {trend.impactScore}
                                        </Badge>
                                        <span className="text-xs font-mono text-green-600 font-bold">+{trend.growth}%</span>
                                    </div>
                                    <CardTitle className="text-base line-clamp-2">{trend.name}</CardTitle>
                                    <CardDescription>{trend.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="pt-0">
                                    <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                                        <span>{trend.volume} reports</span>
                                        <span className={cn(
                                            "font-medium",
                                            trend.sentiment < 20 ? "text-red-500" : "text-yellow-500"
                                        )}>
                                            Sentiment: {trend.sentiment}/100
                                        </span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}

                        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-center">
                            <span className="text-sm text-muted-foreground">Scanning for new clusters...</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: CAMPAIGN STUDIO */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="type-label-mono text-muted-foreground">CAMPAIGN STUDIO</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Auto-save on</span>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 lg:overflow-hidden h-auto">

                        {/* Editor Column */}
                        <div className="space-y-6 lg:overflow-y-auto pr-2 pl-2 no-scrollbar h-auto min-w-0">
                            {/* Variant Tabs */}
                            <div className="flex p-1 bg-muted rounded-lg overflow-x-auto whitespace-nowrap">
                                {["Trust Rebuild", "Speed Update", "Service Promise"].map((tab) => {
                                    const id = tab.toLowerCase().replace(' ', '-')
                                    const isActive = activeTab === id
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(id)}
                                            className={cn(
                                                "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
                                                isActive ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {tab}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="space-y-4">
                                {/* Context/Evidence Card */}
                                {activeTrend && (
                                    <Card className="bg-muted/10 border-muted">
                                        <CardHeader className="pb-2 pt-4">
                                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Eye className="h-3 w-3" />
                                                Cluster Evidence
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 pb-4">
                                            {activeTrend.examples.slice(0, 3).map((ex, i) => (
                                                <div key={i} className="text-xs bg-white border border-border p-2 rounded-md italic text-muted-foreground">
                                                    "{ex}"
                                                </div>
                                            ))}
                                            <div className="flex justify-end">
                                                <Badge variant="outline" className="text-[10px]">
                                                    Based on {activeTrend.volume} similar tickets
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Headline</label>
                                    <Input
                                        value={currentContent.headline}
                                        onChange={(e) => setContent("headline", e.target.value)}
                                        className="font-display"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Primary Text</label>
                                    <Textarea
                                        value={currentContent.body}
                                        onChange={(e) => setContent("body", e.target.value)}
                                        className="h-32 resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Call to Action</label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Input
                                            value={currentContent.cta}
                                            onChange={(e) => setContent("cta", e.target.value)}
                                        />
                                        <Input
                                            value={currentContent.ctaUrl}
                                            onChange={(e) => setContent("ctaUrl", e.target.value)}
                                            placeholder="https://"
                                            className="text-muted-foreground bg-muted/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Platforms</span>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-accent">Manage connections</Button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => togglePlatform('google')}
                                        className={cn(
                                            "flex-1 gap-2 h-auto py-2 flex-col items-center justify-center relative transition-all",
                                            platforms.google ? "border-accent/50 bg-accent/5 hover:bg-accent/10 hover:text-accent" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                        )}
                                    >
                                        {platforms.google && <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />}
                                        <GoogleIcon className="h-5 w-5" />
                                        <span className="text-xs">{platforms.google ? "Connected" : "Connect"}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => togglePlatform('meta')}
                                        className={cn(
                                            "flex-1 gap-2 h-auto py-2 flex-col items-center justify-center relative transition-all",
                                            platforms.meta ? "border-accent/50 bg-accent/5 hover:bg-accent/10 hover:text-accent" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                        )}
                                    >
                                        {platforms.meta && <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />}
                                        <FacebookIcon className="h-5 w-5" />
                                        <span className="text-xs">{platforms.meta ? "Connected" : "Connect"}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => togglePlatform('shopify')}
                                        className={cn(
                                            "flex-1 gap-2 h-auto py-2 flex-col items-center justify-center relative transition-all",
                                            platforms.shopify ? "border-accent/50 bg-accent/5 hover:bg-accent/10 hover:text-accent" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                        )}
                                    >
                                        {platforms.shopify && <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />}
                                        <ShoppingBagIcon className="h-5 w-5" />
                                        <span className="text-xs">{platforms.shopify ? "Connected" : "Connect"}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Column */}
                        <div className="flex flex-col gap-6">
                            <div className="flex-1 bg-muted/30 rounded-2xl border border-border p-6 flex flex-col items-center justify-start relative overflow-hidden">
                                {/* Mock Device Frame */}
                                <div className="w-full max-w-[300px] bg-white rounded-xl shadow-2xl border border-border overflow-hidden shrink-0">
                                    <div className="h-4 bg-muted border-b border-border flex items-center px-2 gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-32 bg-accent/10 rounded-lg flex items-center justify-center text-accent/20">
                                            <Sparkles className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-display font-medium text-lg leading-tight">{currentContent.headline || "Headline"}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {currentContent.body || "Body text will appear here..."}
                                            </p>
                                        </div>
                                        <Button className="w-full h-8 text-xs font-semibold shadow-none">{currentContent.cta || "Learn More"}</Button>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs font-mono text-muted-foreground">Ad Preview • Mobile 320px</p>
                            </div>

                            <Card>
                                <CardContent className="p-4 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                                AL
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-medium">Reviewer</p>
                                                <p className="text-xs text-muted-foreground">Alex L.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm font-medium cursor-pointer" htmlFor="approve-toggle">Approve to publish</label>
                                                <button
                                                    id="approve-toggle"
                                                    onClick={() => setApproved(!approved)}
                                                    className={cn(
                                                        "w-10 h-5 rounded-full transition-colors relative",
                                                        approved ? "bg-green-500" : "bg-muted"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                                                        approved ? "translate-x-5" : "translate-x-0"
                                                    )} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Launch Button */}
                                    {approved && (
                                        <Button
                                            className="w-full animate-in fade-in slide-in-from-top-2"
                                            disabled={!canPublish}
                                            variant={!canPublish ? "secondary" : undefined}
                                            onClick={handlePublish}
                                        >
                                            {canPublish ? "Launch Campaign" : "Connect Platform to Launch"}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>

            </div>
            {/* Publish Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-0 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Megaphone className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Confirm Campaign Launch</h3>
                                    <p className="text-sm text-muted-foreground">Action #2991-Alpha • 12,000 users targeted</p>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg space-y-3 border border-border/50">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Target Trend</span>
                                        <span className="font-medium">{activeTrend.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Platforms</span>
                                        <span className="font-medium">
                                            {Object.entries(platforms).filter(([_, v]) => v).map(([k]) => k).join(', ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-border/50">
                                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Copy Snippet</span>
                                    <p className="text-sm italic text-muted-foreground">"{currentContent.headline}"</p>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                By confirming, this campaign will go live immediately on selected channels.
                                Dashboard metrics will update in real-time.
                            </p>
                        </div>
                        <div className="p-4 bg-muted/50 border-t border-border flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                            <Button onClick={confirmPublish} className="bg-green-600 hover:bg-green-700 text-white">
                                <Megaphone className="h-4 w-4 mr-2" />
                                Confirm & Publish
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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
