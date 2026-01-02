export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'pending' | 'resolved' | 'escalated' | 'followup_scheduled';
export type Channel = 'Phone' | 'Email' | 'Chat' | 'Social';

export interface PendingAction {
    id: string;
    title: string;
    type: 'Refund Approval' | 'Campaign Approval' | 'Follow-up Approval';
    risk: 'low' | 'medium' | 'high';
    amount?: number; // optional context
}

export interface Customer {
    id: string;
    name: string;
    contact: string;
    role: string;
    email: string;
    value: number; // Annual value
    churnProbability: number;
    riskLevel: RiskLevel;
    status: 'Critical' | 'At Risk' | 'Watch' | 'Stable';
    lastTouch: string;
    assignedAgentId?: string;
}

export interface Complaint {
    id: string;
    customerId: string;
    issue: string;
    description: string;
    channel: Channel;
    timestamp: string;
    status: Status;
    riskLevel: RiskLevel;
    sentimentScore: number; // 0-100
    assignedAgentId?: string;
}

export interface Ticket {
    id: string;
    complaintId: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    status: Status;
    createdAt: string;
}

export interface Trend {
    id: string;
    name: string;
    volume: number;
    impactScore: number;
    sentiment: number;
    growth: number; // Percentage
    description: string;
    examples: string[];
}

export interface Campaign {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    targetSegment: string;
    platform: ('Google Ads' | 'Meta' | 'Email' | 'Shopify')[];
    headline: string;
    stats?: {
        impressions: number;
        clicks: number;
        conversions: number;
    };
}

export interface Interaction {
    id: string;
    customerId: string;
    type: 'Call' | 'Email' | 'Chat' | 'Note' | 'Action';
    content: string;
    date: string;
    agentId: string;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    role: 'Agent' | 'Manager' | 'Admin';
}

export interface DashboardFilters {
    dateRange: { from: string | null; to: string | null };
    channels: Channel[];
    statuses: Status[];
    riskLevels: RiskLevel[];
}

export interface AppState {
    customers: Customer[];
    complaints: Complaint[];
    tickets: Ticket[];
    trends: Trend[];
    campaigns: Campaign[];
    interactions: Interaction[];
    agents: Agent[];
    currentUser: Agent;
    auth: {
        isAuthenticated: boolean;
        user: Agent | null;
    };
    filters: DashboardFilters;
    pendingActions: PendingAction[];
}
