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

import { Complaint } from "@/lib/demo/types"
import { X, ShieldAlert, Activity } from "lucide-react"

export default function ComplaintsPage() {
    const { state, dispatch } = useDemo()
    const complaints = getFilteredComplaints(state)
    const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null)

    // Handle ESC key to close modal
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedComplaint(null)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

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

    const handleEscalate = () => {
        if (selectedComplaint) {
            dispatch({ type: 'ESCALATE_COMPLAINT', payload: { complaintId: selectedComplaint.id } })
            setSelectedComplaint(prev => prev ? { ...prev, status: 'escalated', riskLevel: 'critical' } : null)
        }
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
                                            <tr
                                                key={c.id}
                                                className="hover:bg-muted/30 transition-colors group cursor-pointer"
                                                onClick={() => setSelectedComplaint(c)}
                                            >
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
                </div>
            </div>

            {/* Complaint Details Modal (Frontend Only) */}
            {selectedComplaint && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm"
                    onClick={() => setSelectedComplaint(null)}
                >
                    <div
                        className="bg-background rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                            <div>
                                <h2 className="text-lg font-semibold">Complaint Details</h2>
                                <p className="text-xs text-muted-foreground font-mono">ID: {selectedComplaint.id}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedComplaint(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Key Signals */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Risk Level</span>
                                    <div>
                                        <Badge variant={
                                            selectedComplaint.riskLevel === 'critical' ? 'risk-high' :
                                                selectedComplaint.riskLevel === 'high' ? 'risk-high' :
                                                    selectedComplaint.riskLevel === 'medium' ? 'risk-med' : 'neutral'
                                        } className="capitalize">{selectedComplaint.riskLevel}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sentiment</span>
                                    <div className="flex items-center gap-2">
                                        <Activity className={cn("h-4 w-4", selectedComplaint.sentimentScore < 40 ? "text-red-500" : "text-green-500")} />
                                        <span className="font-bold">{selectedComplaint.sentimentScore}</span>
                                        <span className="text-xs text-muted-foreground">/100</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Channel</span>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <IconForPlatform platform={selectedComplaint.channel} />
                                        {selectedComplaint.channel}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</span>
                                    <div className="text-sm font-medium capitalize">{selectedComplaint.status}</div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold border-b border-border pb-2">Description</h3>
                                <div className="space-y-2">
                                    <div className="font-medium text-sm">{selectedComplaint.issue}</div>
                                    <div className="text-sm text-muted-foreground leading-relaxed p-3 bg-muted/20 rounded-lg border border-border/50">
                                        "{selectedComplaint.description}"
                                    </div>
                                </div>
                            </div>

                            {/* AI Analysis Mockup */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold border-b border-border pb-2 flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-accent" />
                                    Detected Signals
                                </h3>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                                        <span className="text-slate-700">Churn Risk Detected</span>
                                        <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">High Confidence</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                                        <span className="text-slate-700">Negative Sentiment Spike</span>
                                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">Medium Confidence</Badge>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3 rounded-b-xl">
                            <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Close</Button>
                            <div className="flex-1 sm:flex-none"></div>
                            <Button variant="secondary" className="gap-2">View Scoring</Button>
                            {selectedComplaint.status !== 'escalated' && selectedComplaint.status !== 'resolved' && (
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                                    onClick={handleEscalate}
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    Escalate
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
