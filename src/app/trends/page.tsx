"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDemo } from "@/lib/demo/store"
import { ArrowUpRight, Megaphone, MessageSquare, TrendingUp, AlertTriangle, Users, Activity, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function TrendsPage() {
    const { state } = useDemo()
    const router = useRouter()
    const [timeRange, setTimeRange] = React.useState<'24h' | '7d'>('24h')
    const [selectedTrendId, setSelectedTrendId] = React.useState<string | null>(null)

    // Ensure we start with a selection if available
    React.useEffect(() => {
        if (state.trends.length > 0 && !selectedTrendId) {
            setSelectedTrendId(state.trends[0].id)
        }
    }, [state.trends, selectedTrendId])

    const activeTrend = state.trends.find(t => t.id === selectedTrendId) || state.trends[0]
    const totalVolume = state.trends.reduce((sum, t) => sum + t.volume, 0) || 1

    // Computed KPIs
    const kpiActiveTrends = state.trends.length
    const kpiHighRiskCount = state.trends.filter(t => t.impactScore > 75).length
    const kpiAvgGrowth = Math.round(state.trends.reduce((sum, t) => sum + t.growth, 0) / (state.trends.length || 1))

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">

                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Trends Analysis</h1>
                        <p className="text-muted-foreground text-sm">Complaint clustering and pattern detection.</p>
                    </div>
                    <div className="flex bg-muted p-1 rounded-lg self-start sm:self-auto">
                        {(['24h', '7d'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                                    timeRange === r ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Last {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clusters</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpiActiveTrends}</div>
                            <p className="text-xs text-muted-foreground mt-1">Detected across 4 channels</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">High-Risk Share</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {Math.round((kpiHighRiskCount / (kpiActiveTrends || 1)) * 100)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{kpiHighRiskCount} clusters require attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">24h Vol Change</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">+{kpiAvgGrowth}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">

                    {/* Left Panel: Trend List */}
                    <Card className="flex-1 flex flex-col min-w-0 lg:w-2/5 overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/10">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                Detected Clusters
                            </h3>
                        </div>
                        <div className="overflow-y-auto p-2 space-y-2 flex-1 no-scrollbar">
                            {state.trends.map((trend) => {
                                const isSelected = selectedTrendId === trend.id;
                                const share = Math.round((trend.volume / totalVolume) * 100);
                                return (
                                    <div
                                        key={trend.id}
                                        onClick={() => setSelectedTrendId(trend.id)}
                                        className={cn(
                                            "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
                                            isSelected ? "bg-accent/5 border-accent shadow-sm ring-1 ring-accent/20" : "bg-card border-transparent hover:border-border"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="font-medium text-sm truncate pr-2">{trend.name}</span>
                                                <Badge variant="outline" className={cn(
                                                    "w-fit text-[10px] px-1.5 h-5",
                                                    trend.impactScore > 80 ? "text-red-600 bg-red-50 border-red-200" :
                                                        trend.impactScore > 50 ? "text-yellow-600 bg-yellow-50 border-yellow-200" : "text-blue-600 bg-blue-50 border-blue-200"
                                                )}>
                                                    Impact: {trend.impactScore}
                                                </Badge>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className={cn(
                                                    "text-xs font-mono font-bold block",
                                                    trend.growth > 0 ? "text-green-600" : "text-muted-foreground"
                                                )}>
                                                    {trend.growth > 0 ? "+" : ""}{trend.growth}%
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">24h change</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                                            <span>{share}% of volume</span>
                                            <span>{trend.volume} reports</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>

                    {/* Right Panel: Details */}
                    {activeTrend ? (
                        <Card className="flex-1 flex flex-col min-w-0 lg:w-3/5 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            <CardHeader className="bg-muted/10 border-b border-border pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Cluster Analysis</span>
                                            <Badge className="h-5 text-[10px]" variant={activeTrend.growth > 20 ? "risk-high" : "outline"}>
                                                {activeTrend.growth > 20 ? "Rising Fast" : "Stable"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl">{activeTrend.name}</CardTitle>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{activeTrend.sentiment}/100</div>
                                        <div className="text-xs text-muted-foreground">Sentiment Score</div>
                                    </div>
                                </div>
                                <CardDescription className="mt-2 line-clamp-2">
                                    {activeTrend.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-6 space-y-6 overflow-y-auto flex-1">
                                {/* Evidence Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-accent" />
                                            Customer Evidence
                                        </h4>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            Based on {activeTrend.volume} tickets
                                        </span>
                                    </div>
                                    <div className="grid gap-3">
                                        {activeTrend.examples?.map((ex, i) => (
                                            <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-sm italic text-slate-600 relative">
                                                <span className="absolute top-2 left-2 text-slate-300 text-xl leading-none">"</span>
                                                <span className="pl-4">{ex}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Section */}
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Recommended Action
                                    </h4>
                                    <p className="text-sm text-blue-800/80 leading-relaxed">
                                        This cluster shows high negative sentiment. We recommend launching a
                                        targeted proactive campaign to address the specific pain point immediately.
                                    </p>
                                </div>

                            </CardContent>

                            <div className="p-4 border-t border-border bg-white flex flex-col sm:flex-row gap-3">
                                <Button
                                    className="flex-1 bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20"
                                    onClick={() => router.push(`/studio/create?trendId=${activeTrend.id}`)}
                                >
                                    <Megaphone className="h-4 w-4 mr-2" />
                                    Open in Campaign Studio
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push(`/complaints?search=${encodeURIComponent(activeTrend.name)}`)}
                                >
                                    <ArrowUpRight className="h-4 w-4 mr-2" />
                                    View Related Complaints
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground border border-dashed rounded-xl">
                            Select a trend to view details
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
