"use client"
import * as React from "react"
import { X } from "lucide-react"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Megaphone,
  ShieldAlert,
  Shield,
  ShieldCheck
} from "lucide-react"
import { toast } from "sonner"

import { useRouter, useSearchParams } from "next/navigation"

import { useDemo } from "@/lib/demo/store"
import { getHighRiskAndMedRiskCustomers, getHighRiskComplaints, getDashboardStats, getFilteredComplaints } from "@/lib/demo/selectors"
import { cn } from "@/lib/utils"

const ChartPlaceholder = ({ type, color }: { type: 'bar' | 'line', color: string }) => {
  return (
    <div className="w-full h-full flex items-end gap-1 px-2 pb-2 opacity-80">
      {type === 'bar' ? (
        Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`flex-1 rounded-t-sm ${color}`} style={{ height: `${Math.random() * 80 + 20}%`, opacity: 0.6 + (i / 24) }}></div>
        ))
      ) : (
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d">
          <path d="M0 35 Q 10 30, 20 32 T 40 20 T 60 25 T 80 10 L 100 5 L 100 40 L 0 40 Z" fill={color} fillOpacity="0.1" />
          <path d="M0 35 Q 10 30, 20 32 T 40 20 T 60 25 T 80 10 L 100 5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { state, dispatch } = useDemo()
  const router = useRouter()
  const searchParams = useSearchParams()
  const stats = getDashboardStats(state)

  // Screenshot Mode Trigger
  React.useEffect(() => {
    if (searchParams.get('mode') === 'screenshot') {
      // Prevent infinite loop if we were to navigate, but we are just dispatching.
      // We only want to seed once per page load ideally, but doing it on every render of this component with this param is okay if cheap, 
      // but better in useEffect with dependency.
      dispatch({ type: 'SEED_SCREENSHOT_DATA' });
      toast.success("Screenshot Mode Active");
    }
  }, [searchParams, dispatch])

  // Modal States
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false)
  const [autoApproveConfirmOpen, setAutoApproveConfirmOpen] = React.useState(false)
  const [vizModalOpen, setVizModalOpen] = React.useState<'volume' | 'sentiment' | null>(null)

  const pendingActions = state.pendingActions || [];
  const refundCount = pendingActions.filter(a => a.type === 'Refund Approval').length;
  const totalCount = pendingActions.length;
  const progressPercent = totalCount > 0 ? (refundCount / totalCount) * 100 : 0;

  const handleAutoApprove = () => {
    const count = pendingActions.filter(a => a.risk === 'low').length;
    if (count > 0) {
      dispatch({ type: 'AUTO_APPROVE_LOW_RISK_ACTIONS' });
      toast.success(`Auto-approved ${count} low-risk items.`);
    } else {
      toast.info("No low-risk items to approve.");
    }
    setAutoApproveConfirmOpen(false);
  }

  const riskCounts = React.useMemo(() => {
    return state.complaints.reduce((acc, c) => {
      // Apply Filters (Project active channels/dates onto risk counts)
      if (state.filters.channels.length > 0 && !state.filters.channels.includes(c.channel)) return acc;
      // Date Check (Mock implementation or ignoring if not heavily used in demo)

      if (c.riskLevel === 'critical' || c.riskLevel === 'high') acc.high++;
      else if (c.riskLevel === 'medium') acc.medium++;
      else if (c.riskLevel === 'low') acc.low++;
      return acc;
    }, { high: 0, medium: 0, low: 0 })
  }, [state.complaints, state.filters.channels])

  const toggleRiskGroup = (group: 'high' | 'medium' | 'low') => {
    const current = state.filters.riskLevels;
    let target: string[] = [];
    if (group === 'high') target = ['critical', 'high'];
    else if (group === 'medium') target = ['medium'];
    else target = ['low'];

    // Check if group is fully active
    const isActive = target.every(t => current.includes(t as any));

    if (isActive) {
      // Deactivate all in group
      target.forEach(t => {
        if (current.includes(t as any)) dispatch({ type: 'TOGGLE_RISK_FILTER', payload: t });
      });
    } else {
      // Activate all in group (if not already)
      target.forEach(t => {
        if (!current.includes(t as any)) dispatch({ type: 'TOGGLE_RISK_FILTER', payload: t });
      });
    }
  }

  const isGroupActive = (group: 'high' | 'medium' | 'low') => {
    const current = state.filters.riskLevels;
    if (group === 'high') return current.includes('critical') || current.includes('high'); // Active if EITHER is active for visual feedback, or strictly BOTH? Requirement: "Clicking ... clears". Usually generous "Active" state.
    if (group === 'medium') return current.includes('medium');
    if (group === 'low') return current.includes('low');
    return false;
  }
  // ...

  return (
    <DashboardLayout>
      <div className="space-y-6 px-0 sm:px-2 lg:px-4">

        {/* Top Inverted Hero Band */}
        {/* Top Inverted Hero Band */}
        <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-4 sm:p-8 shadow-2xl hover-glow-card">

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Filters:</span>

            {/* Channel Filters */}
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

            {/* Date Badge Moved Here */}
            <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-md h-7">
              Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Badge>



            {/* Clear Filters */}
            {(state.filters.channels.length > 0 || state.filters.riskLevels.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
              >
                Clear all
              </Button>
            )}

            {/* Live Updates - Far Right */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse text-[10px] font-medium text-red-400 ml-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live
            </div>
          </div>

          {/* Hero Section */}
          <div className="rounded-3xl p-4 sm:p-8 md:p-10 relative overflow-hidden bg-foreground text-background shadow-2xl group">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 contrast-125 pointer-events-none"></div>
            <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] animate-pulse-slow"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 items-end">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="type-h1 tracking-tight text-white">CIE Dashboard</h1>


                </div>
                <p className="text-white/60 text-lg font-light max-w-md">
                  Real-time intelligence overview
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full xl:w-auto mt-4 md:mt-0">
                {/* Latest Campaign Mini-Card */}
                {state.campaigns.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group/card animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-white/70">Latest Campaign</span>
                        <Badge variant="outline" className="text-[10px] border-green-400 text-green-400 bg-green-400/10 px-1.5 py-0 rounded">Live</Badge>
                      </div>
                      <div>
                        <div className="text-white font-medium truncate w-full max-w-[150px] sm:max-w-full" title={state.campaigns[0].name}>{state.campaigns[0].name}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                          <Megaphone className="h-3 w-3" />
                          <span>{state.campaigns[0].platform.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group/card"
                  onClick={() => setVizModalOpen('volume')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-white/70">Filtered Volume</span>
                    <span className="text-xs text-green-400 font-mono bg-green-400/10 px-1.5 py-0.5 rounded">{stats.volumeTrend}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-display text-white">{stats.volume}</span>
                    <div className="h-8 w-16">
                      <ChartPlaceholder type="bar" color="bg-accent" />
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group/card"
                  onClick={() => setVizModalOpen('sentiment')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-white/70">Sentiment</span>
                    <span className="text-xs text-green-400 font-mono bg-green-400/10 px-1.5 py-0.5 rounded">{stats.sentimentTrend}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-display text-white">{stats.sentiment}</span>
                    <div className="h-8 w-24">
                      <ChartPlaceholder type="line" color="#4ade80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Overview Module */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* High Risk */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md border-border",
              isGroupActive('high') && "border-red-500/50 ring-1 ring-red-500/50 bg-red-50/10"
            )}
            onClick={() => toggleRiskGroup('high')}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">High Risk</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-semibold">{riskCounts.high}</span>
                  <span className="text-xs text-muted-foreground">items in filter</span>
                </div>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                isGroupActive('high') ? "bg-red-100 text-red-600" : "bg-red-50 text-red-500"
              )}>
                <ShieldAlert className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Medium Risk */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md border-border",
              isGroupActive('medium') && "border-yellow-500/50 ring-1 ring-yellow-500/50 bg-yellow-50/10"
            )}
            onClick={() => toggleRiskGroup('medium')}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Medium Risk</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-semibold">{riskCounts.medium}</span>
                  <span className="text-xs text-muted-foreground">items in filter</span>
                </div>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                isGroupActive('medium') ? "bg-yellow-100 text-yellow-600" : "bg-yellow-50 text-yellow-500"
              )}>
                <Shield className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Low Risk */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md border-border",
              isGroupActive('low') && "border-green-500/50 ring-1 ring-green-500/50 bg-green-50/10"
            )}
            onClick={() => toggleRiskGroup('low')}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Low Risk</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-semibold">{riskCounts.low}</span>
                  <span className="text-xs text-muted-foreground">items in filter</span>
                </div>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                isGroupActive('low') ? "bg-green-100 text-green-600" : "bg-green-50 text-green-500"
              )}>
                <ShieldCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* High Risk Alerts - Takes up 2/3 columns */}
          <Card className="lg:col-span-2 flex flex-col h-full hover-lift min-w-0 max-w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>High-Risk Alerts</CardTitle>
                <Button variant="ghost" size="sm" className="text-accent">View All</Button>
              </div>
              <CardDescription>Critical complaints requiring immediate attention.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {getHighRiskComplaints(state).slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/live?complaintId=${item.id}`)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${item.riskLevel === 'critical' || item.riskLevel === 'high' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-medium text-sm truncate text-foreground group-hover:text-accent transition-colors">{item.issue}</h4>
                        <Badge variant={item.riskLevel === 'critical' || item.riskLevel === 'high' ? 'risk-high' : 'risk-med'} className="h-5 text-[10px] px-1.5 py-0">
                          {item.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>Customer {item.customerId}</span> • <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> • <span className="flex items-center"><IconForPlatform platform={item.channel} /> {item.channel}</span>
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="outline" className="h-7 w-7" title="Mark Resolved" onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'RESOLVE_COMPLAINT', payload: { complaintId: item.id } });
                        toast.success("Complaint resolved");
                      }}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-7 w-7" title="Escalate" onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'ESCALATE_COMPLAINT', payload: { complaintId: item.id } });
                        toast.warning("Complaint escalated");
                      }}>
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-7 w-7" title="Follow Up" onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'CREATE_FOLLOWUP', payload: { complaintId: item.id } });
                        toast.info("Follow-up scheduled");
                      }}>
                        <Clock className="h-4 w-4 text-orange-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customers at Risk - Takes up 1/3 column */}
          <Card className="h-full hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">At-Risk Accounts</CardTitle>
              <CardDescription>Highest churn probability.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {getHighRiskAndMedRiskCustomers(state).slice(0, 5).map((customer, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/retention?customerId=${customer.id}`)}
                    className="flex items-center justify-between p-4 hover:bg-muted/10 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                        {customer.name[0]}
                      </div>
                      <span className="text-sm font-medium group-hover:text-accent transition-colors">{customer.name}</span>
                    </div>
                    <div className="text-xs font-mono text-red-500">-{customer.churnProbability > 50 ? '12%' : '4%'}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border mt-auto">
                <Button variant="outline" className="w-full text-xs h-8" onClick={() => router.push('/retention')}>View Retention Board</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Emerging Trends - Navigates to Studio */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Emerging Trends</CardTitle>
              <CardDescription>Detected patterns in last 24h.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { id: 0, name: "Hidden Fees Outrage", count: 24, type: 'risk-high' },
                  { id: 1, name: "Login Loop Bug", count: 12, type: 'status-pending' },
                  { id: 2, name: "Dark Mode Request", count: 8, type: 'neutral' }
                ].map((trend, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/studio?trendId=${trend.id}`)}
                    className="flex items-center justify-between p-4 hover:bg-muted/10 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("h-2 w-2 rounded-full", trend.type === 'risk-high' ? "bg-red-500" : trend.type === 'status-pending' ? "bg-yellow-500" : "bg-blue-500")} />
                      <span className="text-sm font-medium group-hover:text-accent transition-colors">{trend.name}</span>
                    </div>
                    <Badge variant="neutral" className="text-xs group-hover:bg-accent group-hover:text-white transition-colors">
                      +{trend.count}%
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border mt-auto">
                <Button variant="outline" className="w-full text-xs h-8" onClick={() => router.push('/studio')}>Open Trend Miner</Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Actions Pending - Featured KPI */}
          <Card className="lg:col-span-2 bg-signature-gradient text-white relative overflow-hidden hover-lift hover-glow-card">
            {/* Decorative background element to make it shine */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 p-6">
              <div className="flex flex-col justify-between">
                <div>
                  <CardTitle className="text-white/95 mb-1">AI Actions Pending</CardTitle>
                  <CardDescription className="text-white/70">Approvals needed for automated campaigns.</CardDescription>
                </div>
                <div className="mt-8">
                  <div className="text-5xl font-display font-medium">
                    {totalCount}
                  </div>
                  <div className="text-white/70 text-sm mt-1">Total pending items</div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Refund Approvals</span>
                    <Badge variant="outline" className="bg-white/20 text-white border-0">{refundCount}</Badge>
                  </div>
                  <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-white text-accent hover:bg-white/90 border-transparent shadow-lg text-xs md:text-sm"
                    onClick={() => setAutoApproveConfirmOpen(true)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Auto-Approve Low Risk
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/30 text-white hover:bg-white/10 text-xs md:text-sm"
                    onClick={() => setReviewModalOpen(true)}
                  >
                    Review All
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div >

      {/* Review Modal */}
      {
        reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-lg">AI Actions Pending</h3>
                <Button variant="ghost" size="icon" onClick={() => setReviewModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-0 max-h-[60vh] overflow-y-auto">
                <div className="divide-y divide-border">
                  {pendingActions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No pending actions.</div>
                  ) : (
                    pendingActions.map(action => (
                      <div key={action.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                        <div>
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{action.type} {action.amount ? ` • $${action.amount.toFixed(2)}` : ''}</div>
                        </div>
                        <Badge variant={action.risk === 'high' ? 'risk-high' : action.risk === 'medium' ? 'risk-med' : 'neutral'} className="capitalize">
                          {action.risk} Risk
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end">
                <Button onClick={() => setReviewModalOpen(false)}>Close</Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Auto-Approve Confirmation Modal */}
      {
        autoApproveConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Auto-Approve Low Risk?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will automatically approve and archive all pending actions marked as <strong>Low Risk</strong>. This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAutoApproveConfirmOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleAutoApprove}>Confirm Auto-Approve</Button>
                </div>
              </div>
            </div>
          </div>
        )
      }




      {/* Visualization Modal */}
      {
        vizModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{vizModalOpen === 'volume' ? 'Volume Trends' : 'Sentiment Analysis'}</h3>
                  <Badge variant="outline" className="text-xs">Last 30 Days</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setVizModalOpen(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <TrendChart
                  type={vizModalOpen}
                  data={getFilteredComplaints(state)}
                />
              </div>
              <div className="p-4 border-t border-border flex justify-end bg-muted/20">
                <Button onClick={() => setVizModalOpen(null)}>Close</Button>
              </div>
            </div>
          </div>
        )
      }

    </DashboardLayout >
  )
}

function TrendChart({ type, data }: { type: 'volume' | 'sentiment', data: any[] }) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const chartData = React.useMemo(() => {
    const days = 30;
    const now = new Date();
    const map = new Map<string, { count: number, sum: number }>();

    // Initialize last 30 days
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      map.set(key, { count: 0, sum: 0 });
    }

    // Fill data
    data.forEach(c => {
      const key = c.timestamp.split('T')[0];
      if (map.has(key)) {
        const entry = map.get(key)!;
        entry.count++;
        entry.sum += c.sentimentScore;
      }
    });

    return Array.from(map.entries()).map(([date, val]) => ({
      date,
      value: type === 'volume' ? val.count : (val.count > 0 ? val.sum / val.count : 0)
    }));
  }, [data, type]);

  const maxVal = Math.max(...chartData.map(d => d.value), type === 'sentiment' ? 100 : 5);
  const height = 240;
  const width = 600;
  const padding = { left: 40, right: 10, top: 20, bottom: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const barWidth = (chartWidth / chartData.length) * 0.6;
  const gap = (chartWidth / chartData.length) * 0.4;

  // Y Axis Ticks
  const yTicks = [0, maxVal / 4, maxVal / 2, 3 * maxVal / 4, maxVal].map(Math.round);
  const uniqueYTicks = [...new Set(yTicks)].sort((a, b) => a - b);

  return (
    <div className="w-full overflow-x-auto">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible font-mono text-xs">

        {/* Y-Axis Grid & Labels */}
        {uniqueYTicks.map((val) => {
          const y = padding.top + chartHeight - ((val / maxVal) * chartHeight);
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {type === 'volume' ? val : Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* X-Axis Main Line */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="currentColor"
          strokeOpacity="0.2"
        />

        {/* Charts */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {type === 'volume' ? (
            chartData.map((d, i) => {
              const h = (d.value / maxVal) * chartHeight || 2;
              const x = i * (chartWidth / chartData.length) + gap / 2;
              const isHovered = i === hoveredIndex;
              return (
                <g key={d.date}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <rect
                    x={x}
                    y={chartHeight - h}
                    width={barWidth}
                    height={h}
                    className={cn("transition-all duration-200 cursor-pointer", isHovered ? "fill-primary" : "fill-accent")}
                    rx={2}
                  />
                  {/* Value Label on Top if Hovered or High */}
                  {isHovered && (
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - h - 5}
                      textAnchor="middle"
                      className="fill-foreground font-bold text-[10px]"
                    >
                      {d.value}
                    </text>
                  )}
                </g>
              );
            })
          ) : (
            <>
              <path
                d={`M ${chartData.map((d, i) => {
                  const x = i * (chartWidth / chartData.length) + (chartWidth / chartData.length) / 2;
                  const y = chartHeight - ((d.value / maxVal) * chartHeight);
                  return `${x},${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {chartData.map((d, i) => {
                const x = i * (chartWidth / chartData.length) + (chartWidth / chartData.length) / 2;
                const y = chartHeight - ((d.value / maxVal) * chartHeight);
                const isHovered = i === hoveredIndex;
                return (
                  <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                    {/* Invisible hit target */}
                    <rect x={x - 10} y={0} width={20} height={chartHeight} fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      className={cn("fill-background stroke-green-400 stroke-2 transition-all cursor-pointer", isHovered && "stroke-4 fill-green-50")}
                    />
                  </g>
                )
              })}
            </>
          )}
        </g>

        {/* X-Axis Labels (Every 5th) */}
        {chartData.map((d, i) => i % 5 === 0 && (
          <text
            key={d.date}
            x={padding.left + i * (chartWidth / chartData.length) + (chartWidth / chartData.length) / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground"
          >
            {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </text>
        ))}

        {/* Tooltip Overlay */}
        {hoveredIndex !== null && (
          <g transform={`translate(${padding.left + hoveredIndex * (chartWidth / chartData.length) + (chartWidth / chartData.length) / 2}, ${height / 2})`}>
            {/* We use a fixed position or follow mouse, but fixed center overlay might be easier or top corner? 
                            Let's put a simple info box in the top right corner of the chart instead of floating tooltip to avoid clipping issues with limited SVG capability. */}
          </g>
        )}
      </svg>

      {/* HTML Tooltip (Absolute positioned relative to container) - Optional, or just use the in-graph highlighting we added above. 
                We added highlighting: Value on top of bar, enlarged circle.
                Let's also show a summary box if hovered.
            */}
      {hoveredIndex !== null && (
        <div className="absolute top-4 right-16 bg-popover text-popover-foreground border border-border shadow-md rounded-md px-3 py-1.5 text-xs animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="font-semibold">{new Date(chartData[hoveredIndex].date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          <div className="text-lg font-bold">
            {chartData[hoveredIndex].value} {type === 'volume' ? 'Complaints' : 'Sentiment'}
          </div>
        </div>
      )}
    </div>
  );
}


function IconForPlatform({ platform }: { platform: string }) {
  if (platform === 'Phone') return <Phone className="h-3 w-3 inline mr-1" />
  if (platform === 'Email') return <Mail className="h-3 w-3 inline mr-1" />
  return <MessageCircle className="h-3 w-3 inline mr-1" />
}
