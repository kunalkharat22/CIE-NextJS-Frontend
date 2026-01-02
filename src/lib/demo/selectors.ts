import { AppState, Customer, Complaint } from "./types";

// Helper to filter items by date range if applicable
const isWithinDateRange = (dateStr: string, range: { from: string | null; to: string | null }) => {
    if (!range.from && !range.to) return true;
    const date = new Date(dateStr).getTime();
    const from = range.from ? new Date(range.from).getTime() : 0;
    const to = range.to ? new Date(range.to).getTime() : Infinity;
    return date >= from && date <= to;
};

// --- Filtered Complaints ---
export const getFilteredComplaints = (state: AppState) => {
    const { filters, complaints } = state;
    return complaints.filter(c => {
        // Date Check
        if (!isWithinDateRange(c.timestamp, filters.dateRange)) return false;

        // Channel Check
        if (filters.channels.length > 0 && !filters.channels.includes(c.channel)) return false;

        // Status Check
        if (filters.statuses.length > 0 && !filters.statuses.includes(c.status)) return false;

        // Risk Check
        if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(c.riskLevel)) return false;

        return true;
    });
};

// --- Filtered Customers (based on interactions or direct filtering) ---
// For now, let's just filter customers by general risk level if selected, 
// OR if they have complaints that match the filters. 
// A simpler approach for the dashboard "At-Risk Accounts" is to show customers who have qualifying complaints.
export const getFilteredCustomers = (state: AppState) => {
    // If no filters, return all (sorted by risk)
    if (!state.filters.channels.length && !state.filters.statuses.length && !state.filters.riskLevels.length && !state.filters.dateRange.from) {
        return state.customers;
    }

    // Filter based on having relevant complaints
    const filteredComplaints = getFilteredComplaints(state);
    const customerIds = new Set(filteredComplaints.map(c => c.customerId));
    return state.customers.filter(c => customerIds.has(c.id));
};


export const getHighRiskAndMedRiskCustomers = (state: AppState) => {
    // We'll reuse the filtered set but ensure we only pick high/med risk ones
    const baseList = getFilteredCustomers(state);
    return baseList.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high' || c.riskLevel === 'medium')
        .sort((a, b) => b.churnProbability - a.churnProbability);
};

export const getHighRiskComplaints = (state: AppState) => {
    const baseList = getFilteredComplaints(state);
    return baseList.filter(c => (c.riskLevel === 'critical' || c.riskLevel === 'high') && c.status !== 'resolved')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getCustomerById = (state: AppState, id: string | null) => {
    if (!id) return undefined;
    return state.customers.find(c => c.id === id);
};

export const getCustomerHistory = (state: AppState, customerId: string) => {
    return state.interactions.filter(i => i.customerId === customerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Dashboard Stats
export const getDashboardStats = (state: AppState) => {
    const filtered = getFilteredComplaints(state);
    const vol = filtered.length;

    // Calculate volume change (mock logic: if filters applied, just randomize or show 0, else show stored trend)
    // Real logic would compare vs previous period
    const trend = "+4.2%";

    // Sentiment
    const avgSentiment = vol > 0 ? filtered.reduce((acc, c) => acc + c.sentimentScore, 0) / vol : 0;

    return {
        volume: vol,
        volumeTrend: trend,
        sentiment: avgSentiment.toFixed(1),
        sentimentTrend: "+2.1%"
    }
};

export const getCampaignStats = (state: AppState) => {
    const active = state.campaigns.filter(c => c.status === 'active').length;
    const pending = state.campaigns.filter(c => c.status === 'draft').length;
    return { active, pending, total: state.campaigns.length };
};
