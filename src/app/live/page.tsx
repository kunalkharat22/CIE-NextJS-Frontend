"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Mic, Phone, Send, Sparkles, User, AlertTriangle, CheckCircle, ArrowUpRight, Clock, History, Mail, Copy, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Channel = 'Phone' | 'Chat' | 'Email';
type Sentiment = 'Negative' | 'Neutral' | 'Positive';

interface TranscriptItem {
    role: 'agent' | 'customer' | 'ai-insight';
    text: string;
    time: string;
    sentiment?: 'negative' | 'neutral' | 'positive';
    type?: 'insight';
}

interface EmailItem {
    from: string;
    to: string;
    date: string;
    subject: string;
    body: string;
}

interface LiveInteraction {
    id: string;
    name: string;
    email: string; // for avatar generation etc
    channel: Channel;
    status: 'live' | 'ended';
    duration?: string; // For calls/chats
    sentiment: Sentiment;
    issue: string;
    transcript?: TranscriptItem[];
    emailThread?: EmailItem[];
    risk?: 'High' | 'Medium' | 'Low';
    suggestions?: string[];
}

interface SessionLog {
    message: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning';
}

interface SessionData {
    isEscalated: boolean;
    isApplied: boolean;
    logs: SessionLog[];
}

const MOCK_DATA: LiveInteraction[] = [
    // Live Calls
    {
        id: "lc1", name: "Sarah Connor", email: "sarah@example.com", channel: "Phone", status: "live", duration: "04:12", sentiment: "Negative", issue: "Account Termination", risk: "High",
        transcript: [
            { role: "agent", text: "Thank you for calling CIE Support, this is Alex. How can I help?", time: "2 mins ago" },
            { role: "customer", text: "I'm extremely frustrated! My account was suspended without warning.", time: "2 mins ago", sentiment: "negative" },
            { role: "ai-insight", text: "Customer is exhibiting high churn risk. Empathy required.", type: "insight", time: "now" }
        ],
        suggestions: [
            "I apologize for the confusion. I can restore your account immediately while we review the flag.",
            "I understand your frustration. Let me check the suspension reason and see if we can override it.",
            "I can see this was an automated flag. I'm escalating this to the safety team for priority review."
        ]
    },
    {
        id: "lc2", name: "James Holden", email: "james@example.com", channel: "Phone", status: "live", duration: "01:45", sentiment: "Neutral", issue: "Billing Inquiry", risk: "Low",
        transcript: [
            { role: "agent", text: "Hi James, I see you have a question about your invoice?", time: "1 min ago" },
            { role: "customer", text: "Yeah, line 4 seems wrong. Can you explain the service fee?", time: "1 min ago" }
        ],
        suggestions: [
            "That service fee covers the new platform maintenance costs introduced last month.",
            "I can waive that fee this one time as a courtesy since you weren't notified.",
            "Let me break down the invoice for you line by line."
        ]
    },
    // Live Chats
    {
        id: "lch1", name: "Naomi Nagata", email: "naomi@example.com", channel: "Chat", status: "live", duration: "08:20", sentiment: "Negative", issue: "API Latency", risk: "Medium",
        transcript: [
            { role: "customer", text: "Your API is throwing 500 errors. This is breaking our prod.", time: "8 mins ago", sentiment: "negative" },
            { role: "agent", text: "I'm checking the status page now, Naomi.", time: "7 mins ago" },
            { role: "customer", text: "Hurry up please.", time: "5 mins ago", sentiment: "negative" }
        ],
        suggestions: [
            "I apologize for the delay. We have a known incident and engineering is rolling out a fix now.",
            "I can see the 500 errors on our dashboard. I've flagged this to the on-call team.",
            "We are experiencing a temporary degradation. Can I email you once it's resolved?"
        ]
    },
    {
        id: "lch2", name: "Amos Burton", email: "amos@example.com", channel: "Chat", status: "live", duration: "03:10", sentiment: "Positive", issue: "Feature Request", risk: "Low",
        transcript: [
            { role: "customer", text: "Just wanted to say the new dark mode is awesome.", time: "3 mins ago", sentiment: "positive" },
            { role: "agent", text: "Glad you like it Amos! Anything else?", time: "2 mins ago" }
        ]
    },
    // Ended (History)
    {
        id: "ec1", name: "Chrisjen Avasarala", email: "chrisjen@example.com", channel: "Phone", status: "ended", duration: "12:30", sentiment: "Negative", issue: "Policy Complaint", risk: "High",
        transcript: [
            { role: "agent", text: "Policy states we cannot refund after 30 days.", time: "10:00 AM" },
            { role: "customer", text: "That is ridiculous. I want to speak to your manager.", time: "10:02 AM", sentiment: "negative" }
        ]
    },
    {
        id: "ech1", name: "Bobbie Draper", email: "bobbie@example.com", channel: "Chat", status: "ended", duration: "05:15", sentiment: "Neutral", issue: "Login Issues", risk: "Low",
        transcript: [
            { role: "customer", text: "I can't log in.", time: "09:30 AM" },
            { role: "agent", text: "Password reset link sent.", time: "09:32 AM" },
            { role: "customer", text: "Thanks, it worked.", time: "09:35 AM", sentiment: "positive" }
        ]
    },
    {
        id: "ec2", name: "Alex Kamal", email: "alex@example.com", channel: "Phone", status: "ended", duration: "02:45", sentiment: "Positive", issue: "Upgrade", risk: "Low",
        transcript: []
    },
    // Emails (History)
    {
        id: "em1", name: "Fred Johnson", email: "fred@example.com", channel: "Email", status: "ended", sentiment: "Negative", issue: "Contract Breach", risk: "High",
        emailThread: [
            { from: "Fred Johnson", to: "Support", date: "Oct 24, 09:00 AM", subject: "Urgent: Breach of SLA", body: "We noticed downtime exceeded 4 hours this month. This violates our SLA. We expect a credit immediately." },
            { from: "Support Agent", to: "Fred Johnson", date: "Oct 24, 10:30 AM", subject: "Re: Urgent: Breach of SLA", body: "Hello Fred,\n\nWe are investigating the outage records. We will get back to you shortly." },
            { from: "Fred Johnson", to: "Support", date: "Oct 24, 11:00 AM", subject: "Re: Re: Urgent: Breach of SLA", body: "Don't take too long. We are blocking payment." }
        ]
    },
    {
        id: "em2", name: "Camina Drummer", email: "camina@example.com", channel: "Email", status: "ended", sentiment: "Neutral", issue: "Invoice #9921", risk: "Low",
        emailThread: [
            { from: "Camina Drummer", to: "Billing", date: "Oct 23, 02:00 PM", subject: "Invoice Copy", body: "Please send a copy of the last invoice." }
        ]
    },
    {
        id: "em3", name: "Marco Inaros", email: "marco@example.com", channel: "Email", status: "ended", sentiment: "Negative", issue: "Account Access", risk: "Medium",
        emailThread: [
            { from: "Marco Inaros", to: "Support", date: "Oct 22, 08:00 AM", subject: "Access Denied", body: "Why can't I access the Free Navy portal?" }
        ]
    }
];

export default function LiveCoachingPage() {
    const router = useRouter()
    const [mode, setMode] = React.useState<'live' | 'history'>('live')
    const [channelFilter, setChannelFilter] = React.useState<'All' | 'Calls' | 'Chats' | 'Threads'>('All') // Affects list only
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [showRefundModal, setShowRefundModal] = React.useState(false)
    const [isQueueOpen, setQueueOpen] = React.useState(false)

    // Filter Data
    const filteredList = React.useMemo(() => {
        let list = MOCK_DATA.filter(item => {
            if (mode === 'live') return item.status === 'live';
            if (mode === 'history') return item.status === 'ended' || item.channel === 'Email'; // Emails are history
            return false;
        });

        if (channelFilter === 'Calls') list = list.filter(i => i.channel === 'Phone');
        if (channelFilter === 'Chats') list = list.filter(i => i.channel === 'Chat');
        if (channelFilter === 'Threads') list = list.filter(i => i.channel === 'Email');

        // If All, live mode only Calls/Chats (Email isn't "Live" usually, but if data had it, it would show. Our mock data Emails are status='ended').
        if (channelFilter === 'All' && mode === 'live') {
            // Just ensuring no emails leak into live if status was wrong defined, but our mock is strict.
        }

        return list;
    }, [mode, channelFilter]);

    // Local State for Persistence
    const [sessionData, setSessionData] = React.useState<Record<string, SessionData>>({})
    const [responseInput, setResponseInput] = React.useState("")
    const isLoaded = React.useRef(false)

    // Load from LocalStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('cie_live_sessions')
        if (saved) {
            try {
                setSessionData(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse session data", e)
            }
        }
        isLoaded.current = true
    }, [])

    // Save to LocalStorage
    React.useEffect(() => {
        if (isLoaded.current) {
            localStorage.setItem('cie_live_sessions', JSON.stringify(sessionData))
        }
    }, [sessionData])

    // Helper to get current session data safely
    const getSession = (id: string) => sessionData[id] || { isEscalated: false, isApplied: false, logs: [] }

    // Helper to format timestamp
    const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Auto-select first item if exists and none selected
    React.useEffect(() => {
        if (filteredList.length > 0 && !selectedId) {
            setSelectedId(filteredList[0].id);
        } else if (filteredList.length === 0) {
            setSelectedId(null);
        }
    }, [filteredList, selectedId, mode]); // Add mode dependency to re-select on switch

    // Reset input when selection changes
    React.useEffect(() => {
        setResponseInput("")
        setSelectedSuggestionIndex(0)
    }, [selectedId])

    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(0)
    const activeItem = MOCK_DATA.find(i => i.id === selectedId) || null;
    const currentSession = activeItem ? getSession(activeItem.id) : null;

    const currentSuggestions = React.useMemo(() => {
        if (!activeItem) return [];
        if (activeItem.suggestions && activeItem.suggestions.length > 0) return activeItem.suggestions;

        // Fallbacks
        if (activeItem.channel === 'Email') {
            return [
                "I apologize for the delay. I have escalated this breach of SLA to our management team and we will issue a credit.",
                "We are currently reviewing the SLA terms and will get back to you within 24 hours.",
                "Thank you for bringing this to our attention."
            ]
        }
        return [
            "I hear your frustration. Let's look at that together right now.",
            "I can certainly help you with that issue.",
            "Let me check the details on your account."
        ]
    }, [activeItem]);

    const selectedText = currentSuggestions[selectedSuggestionIndex] || "";

    const handleApplySuggestion = (text: string) => {
        if (!activeItem) return;

        const newLog: SessionLog = {
            message: "AI response applied",
            timestamp: getTime(),
            type: 'success'
        };

        setSessionData(prev => ({
            ...prev,
            [activeItem.id]: {
                ...getSession(activeItem.id),
                isApplied: true,
                logs: [newLog, ...getSession(activeItem.id).logs] // Prepend new logs
            }
        }));

        setResponseInput(text);
        toast.success("Action logged successfully", { description: "Outcome updated." });
    }

    const handleEscalate = () => {
        if (!activeItem) return;

        const newLog: SessionLog = {
            message: "Escalated to manager",
            timestamp: getTime(),
            type: 'warning'
        };

        setSessionData(prev => ({
            ...prev,
            [activeItem.id]: {
                ...getSession(activeItem.id),
                isEscalated: true,
                logs: [newLog, ...getSession(activeItem.id).logs]
            }
        }));

        toast.warning("Escalated to Manager");
    }

    const handleRefund = () => {
        setShowRefundModal(false);
        toast.success("Refund processed");
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
                {/* Header Nav & Toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight">Live Coaching</h1>
                        <div className="flex p-1 bg-muted rounded-lg border border-border">
                            <button
                                onClick={() => setMode('live')}
                                className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", mode === 'live' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                Live
                            </button>
                            <button
                                onClick={() => setMode('history')}
                                className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", mode === 'history' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                History
                            </button>
                        </div>
                    </div>

                    {activeItem && (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-xs uppercase tracking-wider", activeItem.status === 'live' ? "border-green-200 text-green-700 bg-green-50 animate-pulse" : "border-gray-200 text-gray-600")}>
                                {activeItem.status === 'live' ? 'Live Session' : 'Ended Session'}
                            </Badge>
                            {currentSession?.isEscalated && (
                                <Badge variant="risk-high" className="text-xs uppercase tracking-wider animate-in fade-in zoom-in">
                                    Escalated
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 overflow-y-auto lg:overflow-hidden">
                    {/* Left: Queue */}
                    <div className="w-full lg:w-80 flex flex-col gap-4 order-3 lg:order-1 lg:flex shrink-0">
                        <div className="flex items-center justify-between cursor-pointer lg:cursor-default bg-card lg:bg-transparent p-4 lg:p-0 rounded-lg border lg:border-none shadow-sm lg:shadow-none" onClick={() => setQueueOpen(!isQueueOpen)}>
                            <h2 className="font-display font-medium text-lg">Queue</h2>
                            <div className="hidden lg:flex gap-1">
                                {(['All', 'Calls', 'Chats', 'Threads'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setChannelFilter(f)}
                                        className={cn(
                                            "px-2 py-0.5 text-[10px] rounded-full border transition-colors",
                                            channelFilter === f
                                                ? "bg-accent/10 border-accent text-accent font-medium"
                                                : "border-transparent text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="lg:hidden">
                            {isQueueOpen ? "Hide" : "Show"}
                        </Button>

                        <div className={cn("hidden lg:block lg:flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar", isQueueOpen && "block h-64")}>
                            <div className="flex lg:hidden gap-1 mb-3 overflow-x-auto pb-2">
                                {(['All', 'Calls', 'Chats', 'Threads'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setChannelFilter(f)}
                                        className={cn(
                                            "px-2 py-0.5 text-[10px] rounded-full border transition-colors whitespace-nowrap",
                                            channelFilter === f
                                                ? "bg-accent/10 border-accent text-accent font-medium"
                                                : "border-transparent text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            {filteredList.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground text-sm italic">
                                    No items in queue.
                                </div>
                            ) : (
                                filteredList.map((item) => (
                                    <Card
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={cn(
                                            "cursor-pointer hover:border-accent/50 transition-all",
                                            selectedId === item.id ? "border-accent ring-1 ring-accent/20 bg-accent/5" : ""
                                        )}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("h-2 w-2 rounded-full", item.status === 'live' ? "bg-red-500 animate-pulse" : "bg-gray-400")} />
                                                    <span className="font-medium text-sm truncate max-w-[100px]">{item.name}</span>
                                                    {getSession(item.id).isEscalated && (
                                                        <Badge variant="risk-high" className="h-4 px-1 text-[8px]">Escalated</Badge>
                                                    )}
                                                </div>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {item.channel === 'Email' ? 'Thread' : item.duration}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 flex gap-1">
                                                    {item.channel === 'Phone' ? <Phone className="h-3 w-3" /> : item.channel === 'Chat' ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                                                    {item.issue}
                                                </Badge>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase",
                                                    item.sentiment === 'Negative' ? "text-red-500" : item.sentiment === 'Positive' ? "text-green-500" : "text-yellow-500"
                                                )}>
                                                    {item.sentiment}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Center: Transcript/Email */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0 order-1 lg:order-2 h-[600px] lg:h-auto shrink-0">
                        {activeItem ? (
                            <Card className="flex-1 flex flex-col overflow-hidden shadow-md">
                                <CardHeader className="border-b border-border py-4 bg-muted/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                {activeItem.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{activeItem.name}</CardTitle>
                                                <CardDescription className="text-xs">{activeItem.id} • {activeItem.risk} Risk</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" title="Copy AI Summary">
                                                <Copy className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                                    {activeItem.channel === 'Email' ? (
                                        // Email Thread View
                                        <div className="space-y-6 max-w-3xl mx-auto">
                                            {activeItem.emailThread?.map((mail, i) => (
                                                <div key={i} className="bg-white rounded-lg border border-border shadow-sm p-4 animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="flex justify-between items-start border-b border-border/50 pb-2 mb-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{mail.from}</div>
                                                            <div className="text-xs text-muted-foreground">To: {mail.to}</div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{mail.date}</div>
                                                    </div>
                                                    <div className="text-sm font-medium mb-2">{mail.subject}</div>
                                                    <div className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                                                        {mail.body}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-center">
                                                <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full border border-border">End of thread</div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Chat/Call Transcript View
                                        activeItem.transcript?.map((msg, i) => (
                                            msg.type === "insight" ? (
                                                <div key={i} className="flex justify-center">
                                                    <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border border-yellow-200 shadow-sm animate-pulse">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div key={i} className={cn("flex gap-4 max-w-[85%]", msg.role === "agent" ? "ml-auto flex-row-reverse" : "")}>
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white shadow-sm",
                                                        msg.role === "agent" ? "bg-accent" : "bg-slate-500"
                                                    )}>
                                                        {msg.role === "agent" ? "ME" : activeItem.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className={cn(
                                                        "p-3.5 rounded-2xl shadow-sm text-sm break-words min-w-0",
                                                        msg.role === "agent"
                                                            ? "bg-accent text-white rounded-tr-none"
                                                            : "bg-white border border-border rounded-tl-none"
                                                    )}>
                                                        <p>{msg.text}</p>
                                                        {msg.sentiment === "negative" && (
                                                            <div className="mt-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-md inline-block font-mono">
                                                                Negative Sentiment
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground self-end mb-1 opacity-50">
                                                        {msg.time}
                                                    </div>
                                                </div>
                                            )
                                        ))
                                    )}
                                </CardContent>

                                <CardFooter className="p-4 bg-white border-t border-border">
                                    <div className="relative w-full">
                                        <Input
                                            placeholder={activeItem.channel === 'Email' ? "Draft a reply..." : "Type a response or use AI suggestion..."}
                                            className="pr-12"
                                            value={responseInput}
                                            onChange={(e) => setResponseInput(e.target.value)}
                                        />
                                        <Button size="icon" className="absolute right-1 top-1 h-10 w-10 bg-transparent text-accent hover:bg-accent/10 shadow-none border-0">
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card className="flex-1 flex items-center justify-center bg-muted/10 border-dashed text-muted-foreground">
                                Select an item from the queue to view details.
                            </Card>
                        )}
                    </div>

                    {/* Right: AI Coach */}
                    <div className="w-full lg:w-80 flex flex-col gap-4 order-2 lg:order-3 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-accent" />
                                <h2 className="font-display font-medium text-lg text-signature-gradient">AI Coach</h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
                            {activeItem ? (
                                <>
                                    <Card className="border-gradient shadow-lg animate-in slide-in-from-right-4 fade-in duration-300">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Action Plan</CardTitle>
                                                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">High Confidence</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium mb-3">Suggested Responses:</p>
                                                <div className="space-y-2">
                                                    {currentSuggestions.map((suggestion, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => setSelectedSuggestionIndex(idx)}
                                                            className={cn(
                                                                "p-3 rounded-lg text-xs cursor-pointer border transition-all relative",
                                                                selectedSuggestionIndex === idx
                                                                    ? "bg-accent/10 border-accent shadow-sm"
                                                                    : "bg-muted/20 border-border/50 hover:border-accent/30"
                                                            )}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn(
                                                                    "mt-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                                                    selectedSuggestionIndex === idx ? "border-accent bg-accent" : "border-muted-foreground/40"
                                                                )}>
                                                                    {selectedSuggestionIndex === idx && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={cn("leading-relaxed", selectedSuggestionIndex === idx ? "text-foreground font-medium" : "text-muted-foreground")}>
                                                                    "{suggestion}"
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <Button
                                                    size="sm"
                                                    className={cn("h-8 text-xs", currentSession?.isApplied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-accent text-white hover:bg-accent/90")}
                                                    onClick={() => handleApplySuggestion(selectedText)}
                                                    disabled={currentSession?.isApplied}
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-2" />
                                                    {currentSession?.isApplied ? "Applied ✓" : "Apply Selection"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs"
                                                    onClick={handleEscalate}
                                                >
                                                    <ArrowUpRight className="h-3 w-3 mr-2" />
                                                    Escalate
                                                </Button>
                                            </div>
                                            <div className="pt-2 border-t border-border">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setShowRefundModal(true)}
                                                >
                                                    <AlertTriangle className="h-3 w-3 mr-2 text-red-500" />
                                                    Issue Refund / Credit
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <History className="h-4 w-4 text-muted-foreground" />
                                                Outcome Log
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 max-h-60 overflow-y-auto text-xs">
                                            <div className="space-y-4 relative border-l border-border ml-2 pl-4">
                                                {/* Dynamic Logs */}
                                                {currentSession?.logs.map((log, idx) => (
                                                    <div key={idx} className="relative animate-in slide-in-from-left-2 fade-in duration-300">
                                                        <div className={cn("absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                                                            log.type === 'success' ? "bg-green-500" : log.type === 'warning' ? "bg-red-500" : "bg-accent"
                                                        )} />
                                                        <div className="flex justify-between items-start mb-0.5">
                                                            <span className="font-semibold">{log.message}</span>
                                                            <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Initial Log */}
                                                <div className="relative">
                                                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" />
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <span className="font-semibold">Context Loaded</span>
                                                        <span className="text-[10px] text-muted-foreground">Now</span>
                                                    </div>
                                                    <p className="text-muted-foreground leading-snug">Risk analysis completed for {activeItem.name}.</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <div className="text-center text-sm text-muted-foreground italic p-4">
                                    Select an interaction to see real-time coaching.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Refund Modal Overlay */}
                {showRefundModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Confirm High Impact Action
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Are you sure you want to issue a full refund? This action requires manager approval if over $500.
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => setShowRefundModal(false)}>Cancel</Button>
                                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleRefund}>Confirm Refund</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout >
    )
}
