import { AppState, Customer, Complaint, Trend, Campaign, Agent, Interaction, PendingAction } from "./types";

const MOCK_AGENTS: Agent[] = [
    { id: "a1", name: "John Doe", email: "john@cie.ai", role: "Manager" },
    { id: "a2", name: "Sarah Connor", email: "sarah@cie.ai", role: "Agent" },
    { id: "a3", name: "Kyle Reese", email: "kyle@cie.ai", role: "Agent" },
];

const MOCK_CUSTOMERS: Customer[] = [
    { id: "c1", name: "Acme Corp", contact: "Dave Smith", role: "CTO", email: "dave@acme.com", value: 142000, churnProbability: 82, riskLevel: "critical", status: "Critical", lastTouch: "2024-10-22T10:00:00Z" },
    { id: "c2", name: "TechStart Inc", contact: "Melissa Ray", role: "VP Eng", email: "melissa@techstart.io", value: 42000, churnProbability: 65, riskLevel: "high", status: "At Risk", lastTouch: "2024-10-20T14:30:00Z" },
    { id: "c3", name: "Globex", contact: "Hank Scorpio", role: "CEO", email: "hank@globex.com", value: 210000, churnProbability: 45, riskLevel: "medium", status: "Watch", lastTouch: "2024-10-15T09:15:00Z" },
    { id: "c4", name: "Soylent Corp", contact: "Green P.", role: "Procurement", email: "admin@soylent.com", value: 85000, churnProbability: 92, riskLevel: "critical", status: "Critical", lastTouch: "2024-10-24T11:00:00Z" },
];

const MOCK_COMPLAINTS: Complaint[] = [
    { id: "cmp1", customerId: "c4", issue: "Account Termination Threat", description: "Customer threatened to leave due to price hike.", channel: "Phone", timestamp: "2024-10-24T10:30:00Z", status: "open", riskLevel: "critical", sentimentScore: 12 },
    { id: "cmp2", customerId: "c2", issue: "API Service Outage", description: "Critical production outage affecting their users.", channel: "Email", timestamp: "2024-10-24T10:15:00Z", status: "open", riskLevel: "high", sentimentScore: 25 },
    { id: "cmp3", customerId: "c1", issue: "Billing Double Charge", description: "Charged twice for the Oct invoice.", channel: "Chat", timestamp: "2024-10-24T09:45:00Z", status: "pending", riskLevel: "medium", sentimentScore: 40 },
    { id: "cmp4", customerId: "c3", issue: "Feature Gap", description: "Needs SSO support implemented.", channel: "Phone", timestamp: "2024-10-23T16:20:00Z", status: "resolved", riskLevel: "low", sentimentScore: 65 },
];

const MOCK_TRENDS: Trend[] = [
    { id: "t1", name: "Hidden Fees Outrage", volume: 124, impactScore: 92, sentiment: 15, growth: 24, description: "High volume of complaints regarding 'surprise service charges'.", examples: ["Did not expect extra $5...", "Why is there a service fee?"] },
    { id: "t2", name: "Login Loop Bug", volume: 85, impactScore: 85, sentiment: 10, growth: 12, description: "Users reporting inability to access dashboard after update.", examples: ["Can't login...", "Stuck on loading screen"] },
    { id: "t3", name: "Feature Request: Dark Mode", volume: 42, impactScore: 65, sentiment: 60, growth: 8, description: "Growing demand for dark mode support in mobile app.", examples: ["My eyes hurt...", "Need dark mode"] },
];

const MOCK_CAMPAIGNS: Campaign[] = [
    { id: "cp1", name: "Fee Transparency Update", status: "active", targetSegment: "At Risk Users", platform: ["Email", "Google Ads"], headline: "We heard you. Transparent pricing is here.", stats: { impressions: 12500, clicks: 450, conversions: 22 } },
];

const MOCK_INTERACTIONS: Interaction[] = [
    { id: "int1", customerId: "c1", type: "Note", content: "Reported api latency > 500ms via Ticket #9921", date: "2024-10-22", agentId: "a1" },
    { id: "int2", customerId: "c1", type: "Call", content: "Mentioned competitor pricing", date: "2024-10-15", agentId: "a1" },
];

const MOCK_PENDING_ACTIONS: PendingAction[] = [
    { id: "pa1", title: "Refund Request #9921", type: "Refund Approval", risk: "low", amount: 45.00 },
    { id: "pa2", title: "Refund Request #9922", type: "Refund Approval", risk: "low", amount: 120.00 },
    { id: "pa3", title: "Refund Request #9923", type: "Refund Approval", risk: "high", amount: 890.00 },
    { id: "pa4", title: "Campaign Launch: 'Winback Q4'", type: "Campaign Approval", risk: "medium" },
    { id: "pa5", title: "Follow-up: VIP Escalation", type: "Follow-up Approval", risk: "high" },
    { id: "pa6", title: "Refund Request #9924", type: "Refund Approval", risk: "low", amount: 15.50 },
    { id: "pa7", title: "Refund Request #9925", type: "Refund Approval", risk: "medium", amount: 250.00 },
    { id: "pa8", title: "Campaign Adjustment: Budget", type: "Campaign Approval", risk: "low" },
    { id: "pa9", title: "Follow-up: Policy Exception", type: "Follow-up Approval", risk: "medium" },
    { id: "pa10", title: "Refund Request #9926", type: "Refund Approval", risk: "low", amount: 30.00 },
    { id: "pa11", title: "Refund Request #9927", type: "Refund Approval", risk: "low", amount: 9.99 },
    { id: "pa12", title: "Refund Request #9928", type: "Refund Approval", risk: "high", amount: 1200.00 },
];

export const INITIAL_STATE: AppState = {
    customers: MOCK_CUSTOMERS,
    complaints: MOCK_COMPLAINTS,
    tickets: [], // Can generate from complaints if needed
    trends: MOCK_TRENDS,
    campaigns: MOCK_CAMPAIGNS,
    interactions: MOCK_INTERACTIONS,
    agents: MOCK_AGENTS,
    currentUser: MOCK_AGENTS[0],
    auth: {
        isAuthenticated: false,
        user: null
    },
    filters: {
        dateRange: { from: null, to: null },
        channels: [],
        statuses: [],
        riskLevels: []
    },
    pendingActions: MOCK_PENDING_ACTIONS
};
