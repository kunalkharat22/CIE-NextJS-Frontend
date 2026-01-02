"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowDownRight,
    ArrowUpRight,
    Ban,
    CheckCircle,
    MoreHorizontal,
    Filter,
    Search,
    Calendar,
    User,
    AlertTriangle,
    History,
    Phone,
    Mail,
    X,
    CreditCard,
    Send,
    FileText,
    Plus,
    Tag,
    PhoneCall,
    Gift,
    ShieldCheck,
    Briefcase,
    Download
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useRouter, useSearchParams } from "next/navigation"
import { useDemo } from "@/lib/demo/store"
import { ArrowLeft } from "lucide-react"

// ... imports

// Restore Sparkline
const Sparkline = ({ value }: { value: number }) => {
    const points = Array.from({ length: 10 }).map((_, i) => {
        const seed = (Math.sin(i) * 10) + (value / 2);
        return `${i * 5},${30 - (seed / 100 * 30)}`
    }).join(' L ');
    return (
        <svg width="50" height="20" className="overflow-visible">
            <path d={`M 0,10 L ${points}`} fill="none" stroke={value > 70 ? "#ef4444" : value > 50 ? "#eab308" : "#22c55e"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

// Remove Mock Data CUSTOMERS

export default function RetentionPage() {
    const { state, dispatch } = useDemo()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Map store customers to view model with Fallbacks for missing fields
    const customers = React.useMemo(() => {
        return state.customers.map(c => ({
            id: c.id,
            name: c.name,
            contact: c.name, // Mock
            role: "Contact", // Mock
            email: c.email,
            // @ts-ignore - tags property might be missing in type definition but used in demo data instantiation
            issues: c.tags || ['General'],
            churnProb: c.churnProbability,
            status: c.churnProbability > 70 ? "Critical" : c.churnProbability > 50 ? "At Risk" : "Watch",
            action: c.churnProbability > 70 ? "Intervention" : "Nurture",
            // @ts-ignore
            lastTouch: c.lastContact ? new Date(c.lastContact).toLocaleDateString() : 'Twice a week',
            // @ts-ignore
            value: c.ltv ? `$${(c.ltv / 1000).toFixed(1)}k` : '$120k',
            history: state.interactions
                .filter(i => i.customerId === c.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(i => ({ type: i.type, date: new Date(i.date).toLocaleDateString(), note: i.content })),
            assignedAgentId: c.assignedAgentId
        })).sort((a, b) => b.churnProb - a.churnProb)
    }, [state.customers, state.interactions])

    const [selectedCustomerIdDirect, setSelectedCustomerIdDirect] = React.useState<string | null>(null)

    // Sync URL param
    const paramId = searchParams.get('customerId')
    // Effect to set selection from URL
    React.useEffect(() => {
        if (paramId) setSelectedCustomerIdDirect(paramId)
    }, [paramId])

    const selectedCustomerId = selectedCustomerIdDirect
    const selectedCustomer = React.useMemo(() =>
        customers.find(c => c.id === selectedCustomerId),
        [customers, selectedCustomerId]
    )

    const [searchQuery, setSearchQuery] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [filters, setFilters] = React.useState<{ risk: string | null, issue: string | null }>({
        risk: null,
        issue: null
    })
    const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' }>({
        key: 'churnProb',
        direction: 'desc'
    })

    // Handler to update URL shallowly or just state
    const handleSelect = (id: string | null) => {
        setSelectedCustomerIdDirect(id)
        if (id) {
            const url = new URL(window.location.href)
            url.searchParams.set('customerId', id)
            window.history.pushState({}, '', url)
        } else {
            const url = new URL(window.location.href)
            url.searchParams.delete('customerId')
            window.history.pushState({}, '', url)
        }
    }

    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleSelect(null)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    // Action Logic
    const [outcomeSubject, setOutcomeSubject] = React.useState("")
    const [outcomeNote, setOutcomeNote] = React.useState("")

    const performAction = (action: string, type: 'Email' | 'Call' | 'Action', churnImpact: number) => {
        if (!selectedCustomerId) return;

        // Add Interaction
        dispatch({
            type: 'ADD_INTERACTION',
            payload: {
                id: `act-${Date.now()}`,
                customerId: selectedCustomerId,
                type: type as any,
                content: action,
                date: new Date().toISOString(),
                agentId: state.currentUser.id
            }
        })

        // Reduce Churn
        const currentProb = selectedCustomer?.churnProb || 0;
        const newProb = Math.max(0, currentProb - churnImpact);
        const newStatus = newProb > 70 ? 'Critical' : newProb > 50 ? 'At Risk' : 'Watch';

        dispatch({
            type: 'UPDATE_CUSTOMER_STATUS',
            payload: { customerId: selectedCustomerId, status: newStatus, churnProb: newProb }
        })

        toast.success(`Action Performed: ${action}`);
    }

    const logOutcome = (status: 'resolved' | 'at_risk') => {
        if (!selectedCustomerId || !outcomeSubject) return;

        dispatch({
            type: 'ADD_INTERACTION',
            payload: {
                id: `log-${Date.now()}`,
                customerId: selectedCustomerId,
                type: 'Note',
                content: `${outcomeSubject}: ${outcomeNote}`,
                date: new Date().toISOString(),
                agentId: state.currentUser.id
            }
        })

        if (status === 'resolved') {
            dispatch({
                type: 'UPDATE_CUSTOMER_STATUS',
                payload: { customerId: selectedCustomerId, status: 'Stable', churnProb: 5 }
            })
            toast.success("Outcome logged: Customer marked as Stable");
            handleSelect(null); // Close drawer on success
        } else {
            toast.success("Outcome logged");
        }

        setOutcomeSubject("");
        setOutcomeNote("");
    }

    const assignAgent = (agentId: string) => {
        if (!selectedCustomerId) return;
        dispatch({
            type: 'UPDATE_CUSTOMER_AGENT',
            payload: { customerId: selectedCustomerId, agentId }
        })
        toast.success("Agent assigned successfully");
    }

    const downloadCSV = () => {
        if (filteredCustomers.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["ID", "Name", "Email", "Churn Prob", "Status", "Last Touch", "Issues"];
        const rows = filteredCustomers.map(c => [
            c.id,
            c.name,
            c.email,
            `${c.churnProb}%`,
            c.status,
            c.lastTouch,
            c.issues.join("; ")
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "retention_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Report downloaded successfully");
    }

    const downloadHistoryJSON = () => {
        if (!selectedCustomer) return;

        const data = {
            customer: selectedCustomer.name,
            email: selectedCustomer.email,
            history: selectedCustomer.history
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${selectedCustomer.id}_history.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("History downloaded");
    }

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }))
    }

    // Filter Logic
    const filteredCustomers = React.useMemo(() => {
        let result = [...customers];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            );
        }

        // Filters
        if (filters.risk) {
            result = result.filter(c => c.status === filters.risk);
        }
        if (filters.issue) {
            result = result.filter(c => c.issues.includes(filters.issue));
        }

        // Sorting
        result.sort((a, b) => {
            const aVal = a[sortConfig.key as keyof typeof a];
            const bVal = b[sortConfig.key as keyof typeof b];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [customers, searchQuery, filters, sortConfig])

    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / 10)
    const paginatedCustomers = filteredCustomers.slice((page - 1) * 10, page * 10)

    // Reset page on filter change
    React.useEffect(() => {
        setPage(1)
    }, [searchQuery, filters])

    return (
        <DashboardLayout>
            <div className="relative h-[calc(100vh-8rem)] flex flex-col">

                {/* HEADER & FILTERS */}
                <div className="mb-6 space-y-4 flex-none">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="type-h2">Retention Dashboard</h1>
                            <p className="text-muted-foreground">Identify and recover at-risk accounts.</p>
                        </div>
                        {/* ... */}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={downloadCSV}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 p-1">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                className="pl-9 h-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="h-9 w-px bg-border mx-2" />

                        <FilterDropdown
                            icon={AlertTriangle}
                            label="Risk Level"
                            options={['Critical', 'At Risk', 'Watch']}
                            value={filters.risk}
                            onChange={(val) => setFilters(prev => ({ ...prev, risk: val }))}
                        />
                        <FilterDropdown
                            icon={History}
                            label="Last Issue"
                            options={['Login', 'Billing', 'Feature', 'General']}
                            value={filters.issue}
                            onChange={(val) => setFilters(prev => ({ ...prev, issue: val }))}
                        />

                        {/* Reset Filters */}
                        {(filters.risk || filters.issue || searchQuery) && (
                            <Button variant="ghost" size="sm" onClick={() => {
                                setFilters({ risk: null, issue: null })
                                setSearchQuery("")
                            }} className="h-9 text-xs">
                                Reset
                            </Button>
                        )}

                        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground bg-white border border-border rounded-lg px-3 py-1.5 h-9">
                            <Calendar className="h-4 w-4" />
                            <span>Last 30 Days</span>
                        </div>
                    </div>
                </div>

                {/* MAIN TABLE */}
                <div className="flex-1 overflow-hidden rounded-xl border border-border bg-white shadow-sm relative flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 sticky top-0 z-10 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-2">
                                            Customer
                                            {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 font-medium">Previous Issues</th>
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('churnProb')}>
                                        <div className="flex items-center gap-2">
                                            Predicted Churn
                                            {sortConfig.key === 'churnProb' && (sortConfig.direction === 'asc' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Assigned Action</th>
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('lastTouch')}>
                                        <div className="flex items-center gap-2">
                                            Last Touch
                                            {sortConfig.key === 'lastTouch' && (sortConfig.direction === 'asc' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {paginatedCustomers.map((customer, i) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => handleSelect(customer.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleSelect(customer.id);
                                            }
                                        }}
                                        tabIndex={0}
                                        className={cn(
                                            "group hover:bg-muted/30 transition-colors cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500 focus:outline-none focus:bg-muted/30",
                                            selectedCustomerId === customer.id ? "bg-accent/5 ring-1 ring-inset ring-accent/20" : ""
                                        )}
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-foreground">{customer.name}</p>
                                                <p className="text-xs text-muted-foreground">{customer.value}/yr</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {customer.issues.map((issue: string) => (
                                                    <Badge key={issue} variant="outline" className="text-[10px] h-5 px-1.5 font-normal bg-white">
                                                        {issue}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Badge variant={customer.churnProb > 70 ? "risk-high" : customer.churnProb > 50 ? "risk-med" : "neutral"} className="w-12 justify-center">
                                                    {customer.churnProb}%
                                                </Badge>
                                                <Sparkline value={customer.churnProb} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={customer.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-muted-foreground text-xs font-medium border-b border-dashed border-border pb-0.5">
                                                {customer.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs">
                                            {customer.lastTouch}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                            No customers found matching these filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="border-t border-border p-4 bg-muted/10 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, filteredCustomers.length)}</span> of <span className="font-medium">{filteredCustomers.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-8 w-8 p-0"
                            >
                                ←
                            </Button>
                            <span className="text-xs font-medium min-w-[3rem] text-center">
                                Page {page} of {Math.max(1, totalPages)}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                →
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ACTION DRAWER */}
                <div
                    className={cn(
                        "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out sm:duration-500",
                        selectedCustomerId ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {selectedCustomer && (
                        <div className="h-full flex flex-col">
                            <div className="p-6 border-b border-border flex items-start justify-between bg-muted/10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-display font-bold">{selectedCustomer.name}</h2>
                                        <StatusBadge status={selectedCustomer.status} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.contact} • {selectedCustomer.role}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleSelect(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                                {/* Key Stats & Assignment */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-lg">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Assigned to:</span>
                                        </div>
                                        <select
                                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-accent transition-colors"
                                            value={selectedCustomer.assignedAgentId || ""}
                                            onChange={(e) => assignAgent(e.target.value)}
                                        >
                                            <option value="" disabled>Unassigned</option>
                                            {state.agents.map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                                            <div className="text-xs text-muted-foreground mb-1">Predicted Churn</div>
                                            <div className="text-2xl font-bold font-display flex items-center gap-2">
                                                {selectedCustomer.churnProb}%
                                                <span className="text-[10px] font-sans text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">+4%</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                                            <div className="text-xs text-muted-foreground mb-1">Annual Value</div>
                                            <div className="text-2xl font-bold font-display">{selectedCustomer.value}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommended Actions */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Recommended Actions</h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 items-center justify-center border-dashed hover:border-accent hover:text-accent hover:bg-accent/5" onClick={() => performAction('Sent $50 Retention Voucher', 'Email', 10)}>
                                            <Gift className="h-5 w-5" />
                                            <span className="text-xs font-medium">Send Voucher</span>
                                        </Button>
                                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 items-center justify-center border-dashed hover:border-accent hover:text-accent hover:bg-accent/5" onClick={() => performAction('Scheduled Strategy Call', 'Call', 5)}>
                                            <PhoneCall className="h-5 w-5" />
                                            <span className="text-xs font-medium">Schedule Call</span>
                                        </Button>
                                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 items-center justify-center border-dashed hover:border-accent hover:text-accent hover:bg-accent/5" onClick={() => performAction('Upgraded to Priority Support', 'Action', 15)}>
                                            <ShieldCheck className="h-5 w-5" />
                                            <span className="text-xs font-medium">Priority Support</span>
                                        </Button>
                                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 items-center justify-center border-dashed hover:border-accent hover:text-accent hover:bg-accent/5" onClick={() => performAction('Added to Loyalty Program', 'Action', 8)}>
                                            <Tag className="h-5 w-5" />
                                            <span className="text-xs font-medium">Add to Loyalty</span>
                                        </Button>
                                    </div>

                                    <div className="p-4 rounded-xl border-l-4 border-l-accent bg-accent/5 border border-border/50 mt-2">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-accent">
                                                <Send className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-sm mb-1">AI Recommendation</h5>
                                                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                                                    {selectedCustomer.action === 'Intervention'
                                                        ? 'High churn risk detected. Recommend immediate voucher offering and priority support upgrade.'
                                                        : 'Customer is showing signs of dissatisfaction. A check-in call is recommended.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Interactions */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Interaction History</h4>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={downloadHistoryJSON} title="Export History">
                                            <Download className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <div className="relative border-l border-border ml-3 space-y-6 max-h-60 overflow-y-auto pr-2">
                                        {selectedCustomer.history.map((item, i) => (
                                            <div key={i} className="pl-6 relative">
                                                <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-border border-2 border-background" />
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-semibold">{item.type}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{item.note}</p>
                                            </div>
                                        ))}
                                        {selectedCustomer.history.length === 0 && (
                                            <div className="pl-6 text-xs text-muted-foreground italic">No recent history recorded.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Log Outcome */}
                                <div className="space-y-3 pb-8">
                                    <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Log Activity</h4>
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Subject"
                                            className="text-sm"
                                            value={outcomeSubject}
                                            onChange={(e) => setOutcomeSubject(e.target.value)}
                                        />
                                        <Textarea
                                            className="min-h-[80px] text-sm"
                                            placeholder="Enter interaction notes..."
                                            value={outcomeNote}
                                            onChange={(e) => setOutcomeNote(e.target.value)}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => logOutcome('at_risk')}>Update Status</Button>
                                            <Button size="sm" onClick={() => logOutcome('resolved')} className="bg-green-600 hover:bg-green-700">Mark Recovered</Button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                {/* Overlay backdrop for drawer */}
                {selectedCustomerId && (
                    <div
                        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => handleSelect(null)}
                    />
                )}

            </div>
        </DashboardLayout>
    )
}

function FilterDropdown({ icon: Icon, label, options, value, onChange }: { icon: any, label: string, options: string[], value: string | null, onChange: (val: string | null) => void }) {
    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <Button
                variant={value ? "secondary" : "outline"}
                size="sm"
                className={cn("h-9 border-dashed font-normal group", value ? "border-solid text-accent bg-accent/5 border-accent/20" : "text-muted-foreground")}
                onClick={() => setOpen(!open)}
            >
                <Icon className={cn("h-3.5 w-3.5 mr-2", value ? "text-accent" : "text-muted-foreground")} />
                {value || label}
                {value && <div className="ml-2 h-1.5 w-1.5 rounded-full bg-accent" />}
            </Button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100 p-1">
                    <div
                        className={cn("px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted transition-colors mb-1", !value && "bg-muted font-medium")}
                        onClick={() => { onChange(null); setOpen(false); }}
                    >
                        All
                    </div>
                    {options.map(opt => (
                        <div
                            key={opt}
                            className={cn("px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted transition-colors", value === opt && "bg-accent/10 text-accent font-medium")}
                            onClick={() => { onChange(opt); setOpen(false); }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const variant = status === "Critical" ? "destructive" : status === "At Risk" ? "secondary" : "outline";
    const dot = status === "Critical";
    return (
        // @ts-ignore
        <Badge variant={variant} dot={dot} className="h-5 px-2 text-[10px]">
            {status}
        </Badge>
    )
}
