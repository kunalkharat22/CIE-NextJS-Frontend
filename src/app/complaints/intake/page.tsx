"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Phone,
    Mail,
    MessageSquare,
    User,
    RefreshCcw,
    CheckCircle2,
    AlertTriangle,
    Zap,
    FileText,
    Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { scoreComplaint, ScoringResult } from "@/lib/demo/scoring"
import { useDemo } from "@/lib/demo/store"
import { useRouter } from "next/navigation"
import {
    Activity,
    Flag,
    ShieldAlert,
    ChevronDown,
    Save,
    ArrowLeft,
    SlidersHorizontal,
    Info
} from "lucide-react"

export default function IntakePage() {
    const { dispatch } = useDemo()
    const router = useRouter()

    // Form and Scoring State
    const [scoringResult, setScoringResult] = React.useState<ScoringResult | null>(null)
    const [isScoring, setIsScoring] = React.useState(false)
    const [formData, setFormData] = React.useState({
        customerName: "",
        contact: "",
        channel: "Email",
        category: "Service",
        complaintText: "",
        orderValue: "",
        customerTier: "Standard",
        isRepeat: false
    })

    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const loadSample = (type: 'delivery' | 'billing' | 'defect') => {
        const samples = {
            delivery: {
                customerName: "Alice Chen",
                contact: "alice.c@example.com",
                channel: "Email",
                category: "Delivery",
                complaintText: "Order #9921 implies delivered yesterday but I haven't received anything. Camera doorbell has no record of delivery attempt. This contains frozen goods.",
                orderValue: "185.50",
                customerTier: "Premium",
                isRepeat: false
            },
            billing: {
                customerName: "Marcus Johnson",
                contact: "marcus.j@example.com",
                channel: "Voice",
                category: "Billing",
                complaintText: "I was double charged for my subscription renewal. I see two pending transactions on my AMEX for $49.99 each. Please refund one immediately.",
                orderValue: "49.99",
                customerTier: "Standard",
                isRepeat: true
            },
            defect: {
                customerName: "Sarah Williams",
                contact: "sarah.w@example.com",
                channel: "Chat",
                category: "Defect",
                complaintText: "The ceramic vase arrived shattered. The box looked crushed on one side. I have photos of the damage.",
                orderValue: "120.00",
                customerTier: "VIP",
                isRepeat: false
            }
        }
        setFormData(samples[type])
        setErrors({})
        toast.info("Sample complaint loaded")
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.customerName) newErrors.customerName = "Name is required"
        if (!formData.contact) newErrors.contact = "Contact is required"
        else if (formData.contact.includes("@") && !/^\S+@\S+\.\S+$/.test(formData.contact)) newErrors.contact = "Invalid email"
        if (!formData.complaintText) newErrors.complaintText = "Description is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleScore = async () => {
        if (!validate()) {
            toast.error("Please fill in required fields")
            return
        }

        setIsScoring(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const result = scoreComplaint({
            text: formData.complaintText,
            category: formData.category,
            channel: formData.channel,
            customerTier: formData.customerTier,
            orderValue: parseFloat(formData.orderValue || "0"),
            isRepeat: formData.isRepeat
        })

        setScoringResult(result)
        setIsScoring(false)
        toast.success("Scoring complete")
    }

    const handleSave = () => {
        if (!scoringResult) return

        // Dispatch to store
        dispatch({
            type: 'ADD_COMPLAINT',
            payload: {
                id: `TKT-${Math.floor(Math.random() * 10000)}`,
                customerId: `CUST-${Math.floor(Math.random() * 1000)}`, // Mock customer
                issue: formData.category,
                description: formData.complaintText,
                channel: formData.channel as any, // "Voice" | "Chat" | "Email" | "Social" matches Channel type mostly
                timestamp: new Date().toISOString(),
                status: 'open',
                riskLevel: scoringResult.risk.toLowerCase() as any, // "High" -> "high"
                sentimentScore: 40 // Default
            }
        })

        toast.success("Complaint saved successfully")
        router.push('/') // Back to dashboard
    }

    // Override Handlers
    const updateResult = (field: keyof ScoringResult, value: any) => {
        if (!scoringResult) return
        setScoringResult({ ...scoringResult, [field]: value, isOverridden: true } as any)
    }

    const handleReset = () => {
        setFormData({
            customerName: "",
            contact: "",
            channel: "Email",
            category: "Service",
            complaintText: "",
            orderValue: "",
            customerTier: "Standard",
            isRepeat: false
        })
        setErrors({})
    }

    if (scoringResult) {
        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" className="gap-2" onClick={() => setScoringResult(null)}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Intake
                        </Button>
                        <h1 className="type-h2">Scoring Results</h1>
                        {(scoringResult as any).isOverridden && (
                            <Badge variant="outline" className="border-accent text-accent bg-accent/5">
                                <SlidersHorizontal className="h-3 w-3 mr-1" />
                                Manual Override Applied
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Risk Card */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Risk Level</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className={cn("h-8 w-8",
                                            scoringResult.risk === 'High' ? "text-red-500" :
                                                scoringResult.risk === 'Medium' ? "text-yellow-500" : "text-green-500"
                                        )} />
                                        <span className={cn("text-3xl font-bold font-display",
                                            scoringResult.risk === 'High' ? "text-red-600" :
                                                scoringResult.risk === 'Medium' ? "text-yellow-600" : "text-green-600"
                                        )}>{scoringResult.risk}</span>
                                    </div>
                                    <select
                                        className="text-xs bg-muted/50 border-none rounded p-1 cursor-pointer focus:ring-0"
                                        value={scoringResult.risk}
                                        onChange={(e) => updateResult('risk', e.target.value)}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Severity Card */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Severity Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-8 w-8 text-accent" />
                                        <span className="text-3xl font-bold font-display">{scoringResult.severity}<span className="text-muted-foreground text-lg">/5</span></span>
                                    </div>
                                    <select
                                        className="text-xs bg-muted/50 border-none rounded p-1 cursor-pointer focus:ring-0"
                                        value={scoringResult.severity}
                                        onChange={(e) => updateResult('severity', parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-1 h-2 w-full">
                                    {[1, 2, 3, 4, 5].map(step => (
                                        <div key={step} className={cn("flex-1 rounded-full bg-muted transition-colors", step <= scoringResult.severity && "bg-accent")} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Priority Card */}
                        <Card className="border-border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Priority Queue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Badge variant={
                                        scoringResult.priority === 'P1' ? "risk-high" :
                                            scoringResult.priority === 'P2' ? "risk-med" : "neutral"
                                    } className="text-xl px-4 py-1.5 h-auto rounded-md">
                                        <Flag className="h-5 w-5 mr-2" />
                                        {scoringResult.priority}
                                    </Badge>
                                    <select
                                        className="text-xs bg-muted/50 border-none rounded p-1 cursor-pointer focus:ring-0"
                                        value={scoringResult.priority}
                                        onChange={(e) => updateResult('priority', e.target.value)}
                                    >
                                        <option value="P1">P1 - Critical</option>
                                        <option value="P2">P2 - High</option>
                                        <option value="P3">P3 - Normal</option>
                                        <option value="P4">P4 - Low</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Explainability Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="lg:col-span-2 border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-muted-foreground" />
                                    AI Explainability Analysis
                                </CardTitle>
                                <CardDescription>Key factors contributing to this score</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-3">Detected Signals</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {scoringResult.reasons.map((reason, i) => (
                                                <Badge key={i} variant="outline" className="bg-muted/30 font-normal py-1">
                                                    {reason}
                                                </Badge>
                                            ))}
                                            {scoringResult.reasons.length === 0 && (
                                                <span className="text-sm text-muted-foreground italic">No specific risk signals detected.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border mt-4">
                                        <h4 className="text-sm font-medium mb-3">Score Breakdown</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-3 bg-muted/20 rounded-lg">
                                                <div className="text-xs text-muted-foreground">Keywords</div>
                                                <div className="font-mono font-bold">{scoringResult.breakdown.keywordScore} pts</div>
                                            </div>
                                            <div className="p-3 bg-muted/20 rounded-lg">
                                                <div className="text-xs text-muted-foreground">Category</div>
                                                <div className="font-mono font-bold">{scoringResult.breakdown.categoryScore} pts</div>
                                            </div>
                                            <div className="p-3 bg-muted/20 rounded-lg">
                                                <div className="text-xs text-muted-foreground">Customer Value</div>
                                                <div className="font-mono font-bold">+{scoringResult.breakdown.valueScore + scoringResult.breakdown.tierScore} pts</div>
                                            </div>
                                            <div className="p-3 bg-muted/20 rounded-lg">
                                                <div className="text-xs text-muted-foreground">Context</div>
                                                <div className="font-mono font-bold">+{scoringResult.breakdown.repeatScore + scoringResult.breakdown.channelScore} pts</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Card className="border-border shadow-sm h-full bg-slate-900 text-white border-none">
                                <CardHeader>
                                    <CardTitle>Next Steps</CardTitle>
                                    <CardDescription className="text-slate-400">Recommended actions based on score.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 rounded-lg bg-white/10 text-sm">
                                        {scoringResult.priority === 'P1' ? (
                                            "🚨 Immediate escalation to Trust & Safety team required."
                                        ) : scoringResult.priority === 'P2' ? (
                                            "⚠️ Assign to Senior Support Agent within 4 hours."
                                        ) : (
                                            "✓ Standard routing to General Support queue."
                                        )}
                                    </div>
                                    <Button className="w-full bg-white text-black hover:bg-white/90" size="lg" onClick={handleSave}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save & Route Ticket
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto h-full flex flex-col pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 flex-none">
                    <div>
                        <h1 className="type-h2">Complaint Intake</h1>
                        <p className="text-muted-foreground">Log and score new customer issues.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => loadSample('delivery')} className="hidden md:flex">Load Delivery Sample</Button>
                        <Button variant="outline" onClick={() => loadSample('billing')} className="hidden md:flex">Load Billing Sample</Button>
                        <Button variant="outline" onClick={() => loadSample('defect')} className="hidden md:flex">Load Defect Sample</Button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 h-auto lg:h-full overflow-y-visible lg:overflow-y-auto lg:pr-2 no-scrollbar">
                        <Card className="h-full border-border shadow-sm flex flex-col">
                            <CardHeader className="border-b border-border bg-muted/20 pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-accent" />
                                    Complaint Details
                                </CardTitle>
                                <CardDescription>Enter ticket information manually.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-6 space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className={cn("pl-9", errors.customerName && "border-red-500 focus-visible:ring-red-500")}
                                                placeholder="e.g. John Doe"
                                                value={formData.customerName}
                                                onChange={(e) => handleChange('customerName', e.target.value)}
                                            />
                                        </div>
                                        {errors.customerName && <p className="text-xs text-red-500">{errors.customerName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email or Phone <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className={cn("pl-9", errors.contact && "border-red-500 focus-visible:ring-red-500")}
                                                placeholder="e.g. john@example.com"
                                                value={formData.contact}
                                                onChange={(e) => handleChange('contact', e.target.value)}
                                            />
                                        </div>
                                        {errors.contact && <p className="text-xs text-red-500">{errors.contact}</p>}
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Channel</label>
                                        <select
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={formData.channel}
                                            onChange={(e) => handleChange('channel', e.target.value)}
                                        >
                                            <option value="Email">Email</option>
                                            <option value="Chat">Chat</option>
                                            <option value="Voice">Voice</option>
                                            <option value="Social">Social</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <select
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={formData.category}
                                            onChange={(e) => handleChange('category', e.target.value)}
                                        >
                                            <option value="Service">Service</option>
                                            <option value="Delivery">Delivery</option>
                                            <option value="Billing">Billing</option>
                                            <option value="Defect">Product Defect</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tier</label>
                                        <select
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={formData.customerTier}
                                            onChange={(e) => handleChange('customerTier', e.target.value)}
                                        >
                                            <option value="Standard">Standard</option>
                                            <option value="Premium">Premium</option>
                                            <option value="VIP">VIP</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Complaint */}
                                <div className="space-y-2 min-w-0">
                                    <label className="text-sm font-medium">Complaint Description <span className="text-red-500">*</span></label>
                                    <Textarea
                                        className={cn("min-h-[150px] resize-none w-full", errors.complaintText && "border-red-500 focus-visible:ring-red-500")}
                                        placeholder="Paste verbatim customer complaint text here..."
                                        value={formData.complaintText}
                                        onChange={(e) => handleChange('complaintText', e.target.value)}
                                    />
                                    {errors.complaintText && <p className="text-xs text-red-500">{errors.complaintText}</p>}
                                </div>

                                {/* Additional Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end p-4 bg-muted/20 rounded-xl border border-border/50">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Order Value ($)</label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.orderValue}
                                            onChange={(e) => handleChange('orderValue', e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between pb-2">
                                        <label className="text-sm font-medium">Repeat Issue?</label>
                                        <div className="flex items-center bg-white border border-input rounded-lg p-1 h-10 w-32">
                                            <button
                                                className={cn("flex-1 text-xs font-medium rounded-md h-full transition-all", !formData.isRepeat ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50")}
                                                onClick={() => handleChange('isRepeat', false)}
                                            >
                                                No
                                            </button>
                                            <button
                                                className={cn("flex-1 text-xs font-medium rounded-md h-full transition-all", formData.isRepeat ? "bg-red-100 text-red-700 shadow-sm" : "text-muted-foreground hover:bg-muted/50")}
                                                onClick={() => handleChange('isRepeat', true)}
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="p-6 border-t border-border bg-muted/10 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0 rounded-b-xl">
                                <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    Reset Form
                                </Button>
                                <Button onClick={handleScore} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white min-w-[140px] shadow-lg shadow-accent/20">
                                    <Zap className="h-4 w-4 mr-2" />
                                    {isScoring ? "Analyzing..." : "Score Complaint"}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="lg:col-span-5 hidden lg:block h-full">
                        <div className="h-full space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Preview</h3>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Ready to process
                                </Badge>
                            </div>

                            {/* Detailed Card Preview */}
                            <div className="bg-white rounded-2xl border border-border shadow-xl shadow-slate-200/50 p-6 space-y-6 relative overflow-hidden transition-all duration-300">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-8 -mt-8" />

                                <div className="relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {formData.customerName ? formData.customerName.charAt(0) : "?"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg leading-tight">{formData.customerName || "Customer Name"}</h4>
                                                <p className="text-sm text-muted-foreground">{formData.contact || "Contact Info"}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn(
                                            "border-accent/20 text-accent font-medium",
                                            formData.customerTier === 'VIP' && "bg-purple-50 text-purple-700 border-purple-200",
                                            formData.customerTier === 'Premium' && "bg-blue-50 text-blue-700 border-blue-200"
                                        )}>
                                            {formData.customerTier}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 bg-muted/20 rounded-lg">
                                            <p className="text-xs text-muted-foreground uppercase mb-1">Channel</p>
                                            <div className="flex items-center gap-2 font-medium text-sm">
                                                {formData.channel === 'Email' && <Mail className="h-3.5 w-3.5" />}
                                                {formData.channel === 'Voice' && <Phone className="h-3.5 w-3.5" />}
                                                {formData.channel === 'Chat' && <MessageSquare className="h-3.5 w-3.5" />}
                                                {formData.channel}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-muted/20 rounded-lg">
                                            <p className="text-xs text-muted-foreground uppercase mb-1">Risk Factors</p>
                                            <div className="flex items-center gap-2 font-medium text-sm">
                                                {formData.isRepeat && (
                                                    <Badge variant="risk-high" className="h-5 px-1.5 text-[10px]">Repeat</Badge>
                                                )}
                                                {parseFloat(formData.orderValue) > 100 && (
                                                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200">High Value</Badge>
                                                )}
                                                {!formData.isRepeat && parseFloat(formData.orderValue || "0") <= 100 && (
                                                    <span className="text-muted-foreground text-xs italic">None detected</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground uppercase">Complaint Summary</p>
                                            <Badge variant="neutral" className="text-[10px] h-5">{formData.category}</Badge>
                                        </div>
                                        <div className="p-4 bg-muted/10 rounded-xl border border-border text-sm italic text-muted-foreground min-h-[100px] relative">
                                            <span className="absolute top-2 left-2 text-3xl text-muted-foreground/20 font-serif leading-none">“</span>
                                            <p className="relative z-10 pl-4">{formData.complaintText || "Complaint text will appear here..."}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Intake ID: #PENDING</span>
                                        <span>{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Processing Card (Decorative) */}
                            <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20" />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">AI Scoring Engine</p>
                                            <p className="text-xs text-white/50">Ready to analyze sentiment & risk</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </DashboardLayout >
    )
}
