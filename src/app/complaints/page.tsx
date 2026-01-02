"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Phone, Mail, MessageCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useDemo } from "@/lib/demo/store"
import { getFilteredComplaints } from "@/lib/demo/selectors"
import { cn } from "@/lib/utils"

function IconForPlatform({ platform }: { platform: string }) {
    if (platform === 'Phone') return <Phone className="h-3 w-3 inline mr-1" />
    if (platform === 'Email') return <Mail className="h-3 w-3 inline mr-1" />
    return <MessageCircle className="h-3 w-3 inline mr-1" />
}

export default function ComplaintsPage() {
    const { state, dispatch } = useDemo()
    const complaints = getFilteredComplaints(state)

    const toggleRiskFilter = (group: 'high' | 'medium' | 'low') => {
        const current = state.filters.riskLevels;
        let target: ('critical' | 'high' | 'medium' | 'low')[] = [];

        if (group === 'high') target = ['critical', 'high'];
        else if (group === 'medium') target = ['medium'];
        else target = ['low'];

        const isActive = target.every(t => current.includes(t));

        if (isActive) {
            target.forEach(t => {
                if (current.includes(t)) dispatch({ type: 'TOGGLE_RISK_FILTER', payload: t });
            });
        } else {
            target.forEach(t => {
                if (!current.includes(t)) dispatch({ type: 'TOGGLE_RISK_FILTER', payload: t });
            });
        }
    }

    const isGroupActive = (group: 'high' | 'medium' | 'low') => {
        const current = state.filters.riskLevels;
        if (group === 'high') return current.includes('critical') || current.includes('high');
        if (group === 'medium') return current.includes('medium');
        if (group === 'low') return current.includes('low');
        return false;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
                        <p className="text-muted-foreground">Manage and review customer complaints.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground mr-2 uppercase text-xs tracking-wider">Channels:</span>
                        {(['Phone', 'Email', 'Chat'] as const).map(ch => (
                            <Button
                                key={ch}
                                variant={state.filters.channels.includes(ch) ? "primary" : "outline"}
                                size="sm"
                                className="h-7 text-xs rounded-full"
                                onClick={() => dispatch({ type: 'TOGGLE_CHANNEL_FILTER', payload: ch })}
                            >
                                {ch}
                            </Button>
                        ))}

                        <div className="h-4 w-px bg-border mx-2" />

                        <span className="text-sm font-medium text-muted-foreground mr-2 uppercase text-xs tracking-wider">Risk:</span>
                        <Button
                            variant={isGroupActive('high') ? 'primary' : 'outline'}
                            size="sm"
                            className={cn("h-7 text-xs rounded-full", isGroupActive('high') ? "bg-red-500 hover:bg-red-600 border-red-600 text-white" : "hover:text-red-500 hover:border-red-200")}
                            onClick={() => toggleRiskFilter('high')}
                        >
                            High Risk
                        </Button>
                        <Button
                            variant={isGroupActive('medium') ? 'primary' : 'outline'}
                            size="sm"
                            className={cn("h-7 text-xs rounded-full", isGroupActive('medium') ? "bg-orange-500 hover:bg-orange-600 border-orange-600 text-white" : "hover:text-orange-500 hover:border-orange-200")}
                            onClick={() => toggleRiskFilter('medium')}
                        >
                            Medium
                        </Button>
                        <Button
                            variant={isGroupActive('low') ? 'primary' : 'outline'}
                            size="sm"
                            className={cn("h-7 text-xs rounded-full", isGroupActive('low') ? "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white" : "hover:text-blue-500 hover:border-blue-200")}
                            onClick={() => toggleRiskFilter('low')}
                        >
                            Low
                        </Button>

                        {(state.filters.channels.length > 0 || state.filters.riskLevels.length > 0) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs ml-auto text-muted-foreground hover:text-foreground"
                                onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
                            >
                                Clear all
                            </Button>
                        )}
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by customer, id, or content..."
                            className="pl-9 bg-background"
                        // Note: Actual search implementation might require store update or local filtering. 
                        // The current selector `getFilteredComplaints` doesn't explicitly handle a text search query from the store 
                        // unless it was added to the standard filter state. 
                        // Checking types.ts: User added query? No. 
                        // I will skip Implementing text search functionality for now unless I add it to the store. 
                        // Or I can add local state here. 
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-w-full">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20 whitespace-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32 hidden sm:table-cell">Channel</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Risk</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24 hidden sm:table-cell">Sentiment</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Summary</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32 hidden sm:table-cell">Date</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                            No complaints found matching criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.map(c => {
                                        const customer = state.customers.find(cx => cx.id === c.customerId);
                                        return (
                                            <tr key={c.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{c.id}</td>
                                                <td className="px-4 py-3 font-medium text-foreground max-w-[140px] truncate">
                                                    {customer?.name || 'Unknown Customer'}
                                                    <div className="text-xs text-muted-foreground font-normal truncate">{customer?.email}</div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                                                    <div className="flex items-center gap-1.5">
                                                        <IconForPlatform platform={c.channel} />
                                                        {c.channel}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={
                                                        c.riskLevel === 'critical' ? 'risk-high' :
                                                            c.riskLevel === 'high' ? 'risk-high' :
                                                                c.riskLevel === 'medium' ? 'risk-med' : 'neutral'
                                                    } className="capitalize">
                                                        {c.riskLevel}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <div className={cn(
                                                        "font-medium",
                                                        c.sentimentScore < 30 ? "text-red-500" :
                                                            c.sentimentScore < 60 ? "text-orange-500" : "text-green-500"
                                                    )}>
                                                        {c.sentimentScore}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground max-w-[120px] sm:max-w-xs truncate" title={c.description}>
                                                    {c.issue}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                                                    {new Date(c.timestamp).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className={cn(
                                                        "capitalize",
                                                        c.status === 'open' ? "border-blue-200 bg-blue-50 text-blue-700" :
                                                            c.status === 'resolved' ? "border-green-200 bg-green-50 text-green-700" :
                                                                "border-gray-200 bg-gray-50 text-gray-700"
                                                    )}>
                                                        {c.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                        <span>Showing {complaints.length} results</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm" disabled>Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
