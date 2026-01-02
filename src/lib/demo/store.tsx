"use client"

import * as React from "react";
import { AppState, Customer, Interaction, Campaign, Agent, Complaint } from "./types";
import { INITIAL_STATE } from "./data";

// Action Types
type DemoAction =
    | { type: 'RESET_DEMO' }
    | { type: 'SEED_DATA' }
    | { type: 'UPDATE_CUSTOMER_STATUS', payload: { customerId: string, status: string, churnProb?: number } }
    | { type: 'UPDATE_CUSTOMER_AGENT', payload: { customerId: string, agentId: string } }
    | { type: 'ADD_INTERACTION', payload: Interaction }
    | { type: 'CREATE_CAMPAIGN', payload: Campaign }
    | { type: 'RESOLVE_COMPLAINT', payload: { complaintId: string } }
    | { type: 'ESCALATE_COMPLAINT', payload: { complaintId: string } }
    | { type: 'CREATE_FOLLOWUP', payload: { complaintId: string } }
    | { type: 'APPLY_SUGGESTION', payload: { complaintId: string, suggestion: string, customerId: string } }
    | { type: 'LOGIN', payload: { user: Agent } }
    | { type: 'LOGOUT' }
    | { type: 'SET_DATE_RANGE', payload: { from: string | null, to: string | null } }
    | { type: 'TOGGLE_CHANNEL_FILTER', payload: string }
    | { type: 'TOGGLE_STATUS_FILTER', payload: string }
    | { type: 'TOGGLE_RISK_FILTER', payload: string }
    | { type: 'TOGGLE_RISK_FILTER', payload: string }
    | { type: 'CLEAR_FILTERS' }
    | { type: 'ADD_COMPLAINT', payload: Complaint }
    | { type: 'SEED_SCREENSHOT_DATA' }
    | { type: 'AUTO_APPROVE_LOW_RISK_ACTIONS' };

// Context
const DemoContext = React.createContext<{
    state: AppState;
    dispatch: React.Dispatch<DemoAction>;
    resetDemo: () => void;
    login: (email: string) => boolean;
    logout: () => void;
} | undefined>(undefined);

// Reducer
function demoReducer(state: AppState, action: DemoAction): AppState {
    switch (action.type) {
        case 'RESET_DEMO':
            return INITIAL_STATE;
        case 'SEED_DATA':
            return INITIAL_STATE;
        case 'SEED_SCREENSHOT_DATA': {
            // Deterministic data for screenshot
            const now = new Date();
            const screenshotComplaints: Complaint[] = [
                // 3 High/Critical
                { id: 'SC-001', customerId: 'C101', issue: 'Legal Threat: Data Privacy', description: 'Customer threatening legal action over GDPR.', channel: 'Email', timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), status: 'escalated', riskLevel: 'critical', sentimentScore: 10 },
                { id: 'SC-002', customerId: 'C102', issue: 'Repeated Overcharge', description: 'Third time being charged for cancelled sub.', channel: 'Phone', timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(), status: 'open', riskLevel: 'critical', sentimentScore: 15 },
                { id: 'SC-003', customerId: 'C103', issue: 'Product Safety', description: 'Battery pack got extremely hot while charging.', channel: 'Chat', timestamp: new Date(now.getTime() - 1000 * 60 * 240).toISOString(), status: 'open', riskLevel: 'high', sentimentScore: 20 },

                // 5 Medium
                { id: 'SC-004', customerId: 'C201', issue: 'Delivery Delay', description: 'Package is 3 days late.', channel: 'Email', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), status: 'open', riskLevel: 'medium', sentimentScore: 40 },
                { id: 'SC-005', customerId: 'C202', issue: 'Wrong Item', description: 'Received blue instead of red.', channel: 'Chat', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(), status: 'open', riskLevel: 'medium', sentimentScore: 45 },
                { id: 'SC-006', customerId: 'C203', issue: 'Login Issue', description: 'Password reset link not working.', channel: 'Phone', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 7).toISOString(), status: 'open', riskLevel: 'medium', sentimentScore: 50 },
                { id: 'SC-007', customerId: 'C204', issue: 'Feature Request', description: 'Wants dark mode on mobile.', channel: 'Email', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 20).toISOString(), status: 'pending', riskLevel: 'medium', sentimentScore: 60 },
                { id: 'SC-008', customerId: 'C205', issue: 'Billing Inquiry', description: 'Clarification on invoice #992.', channel: 'Chat', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 22).toISOString(), status: 'resolved', riskLevel: 'medium', sentimentScore: 55 },

                // 8 Low
                { id: 'SC-009', customerId: 'C301', issue: 'Positive Feedback', description: 'Great service today.', channel: 'Social', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 25).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 90 },
                { id: 'SC-010', customerId: 'C302', issue: 'Question', description: 'Hours of operation?', channel: 'Chat', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 80 },
                { id: 'SC-011', customerId: 'C303', issue: 'Thanks', description: 'Thank you.', channel: 'Email', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 27).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 85 },
                { id: 'SC-012', customerId: 'C304', issue: 'Typo on site', description: 'Small typo on homepage.', channel: 'Email', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 28).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 70 },
                { id: 'SC-013', customerId: 'C305', issue: 'Feedback', description: 'Nice colors.', channel: 'Social', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 29).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 75 },
                { id: 'SC-014', customerId: 'C306', issue: 'Inquiry', description: 'Do you ship to mars?', channel: 'Chat', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 30).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 70 },
                { id: 'SC-015', customerId: 'C307', issue: 'Test', description: 'Just testing.', channel: 'Email', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 31).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 60 },
                { id: 'SC-016', customerId: 'C308', issue: 'Update', description: 'Address change.', channel: 'Phone', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 32).toISOString(), status: 'resolved', riskLevel: 'low', sentimentScore: 65 }
            ];

            return {
                ...INITIAL_STATE,
                auth: { isAuthenticated: true, user: state.agents?.[0] || INITIAL_STATE.agents[0] }, // Ensure authenticated
                currentUser: state.agents?.[0] || INITIAL_STATE.agents[0],
                complaints: screenshotComplaints,
                // Ensure date range fits? We don't strictly enforce date range in reducers unless filters are applied.
                // But let's clear filters to be safe so all 16 show up.
                filters: {
                    dateRange: { from: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(), to: now.toISOString() }, // Last 30 days
                    channels: [],
                    statuses: [],
                    riskLevels: []
                }
            };
        }
        case 'LOGIN':
            return {
                ...state,
                auth: { isAuthenticated: true, user: action.payload.user },
                currentUser: action.payload.user
            };
        case 'LOGOUT':
            return {
                ...state,
                auth: { isAuthenticated: false, user: null }
            };
        case 'SET_DATE_RANGE':
            return {
                ...state,
                filters: { ...state.filters, dateRange: action.payload }
            };
        case 'TOGGLE_CHANNEL_FILTER': {
            const current = state.filters?.channels || [];
            const exists = current.includes(action.payload as any);
            return {
                ...state,
                filters: {
                    ...state.filters,
                    channels: exists
                        ? current.filter(c => c !== action.payload)
                        : [...current, action.payload as any]
                }
            };
        }
        case 'TOGGLE_STATUS_FILTER': {
            const current = state.filters?.statuses || [];
            const exists = current.includes(action.payload as any);
            return {
                ...state,
                filters: {
                    ...state.filters,
                    statuses: exists
                        ? current.filter(s => s !== action.payload)
                        : [...current, action.payload as any]
                }
            };
        }
        case 'TOGGLE_RISK_FILTER': {
            const current = state.filters?.riskLevels || [];
            const exists = current.includes(action.payload as any);
            return {
                ...state,
                filters: {
                    ...state.filters,
                    riskLevels: exists
                        ? current.filter(r => r !== action.payload)
                        : [...current, action.payload as any]
                }
            };
        }
        case 'CLEAR_FILTERS':
            return {
                ...state,
                filters: {
                    dateRange: { from: null, to: null },
                    channels: [],
                    statuses: [],
                    riskLevels: []
                }
            };
        case 'UPDATE_CUSTOMER_STATUS':
            return {
                ...state,
                customers: state.customers.map(c =>
                    c.id === action.payload.customerId
                        ? { ...c, status: action.payload.status as any, churnProbability: action.payload.churnProb ?? c.churnProbability }
                        : c
                )
            };
        case 'UPDATE_CUSTOMER_AGENT':
            return {
                ...state,
                customers: state.customers.map(c =>
                    c.id === action.payload.customerId
                        ? { ...c, assignedAgentId: action.payload.agentId }
                        : c
                )
            };
        case 'ADD_INTERACTION':
            return {
                ...state,
                interactions: [action.payload, ...state.interactions]
            };
        case 'CREATE_CAMPAIGN':
            return {
                ...state,
                campaigns: [action.payload, ...state.campaigns]
            };
        case 'RESOLVE_COMPLAINT':
            return {
                ...state,
                complaints: state.complaints.map(c =>
                    c.id === action.payload.complaintId
                        ? { ...c, status: 'resolved' }
                        : c
                )
            };
        case 'ESCALATE_COMPLAINT':
            return {
                ...state,
                complaints: state.complaints.map(c =>
                    c.id === action.payload.complaintId
                        ? { ...c, status: 'escalated', riskLevel: 'critical', assignedAgentId: 'manager-1' }
                        : c
                )
            };
        case 'CREATE_FOLLOWUP':
            return {
                ...state,
                complaints: state.complaints.map(c =>
                    c.id === action.payload.complaintId
                        ? { ...c, status: 'followup_scheduled' }
                        : c
                ),
                // Optionally add a task here if we had a tasks array
            };
        case 'ADD_COMPLAINT':
            return {
                ...state,
                complaints: [action.payload, ...state.complaints]
            };
        case 'APPLY_SUGGESTION': {
            const target = state.complaints.find(c => c.id === action.payload.complaintId);
            let nextRisk = target?.riskLevel || 'low';
            if (target?.riskLevel === 'critical') nextRisk = 'high';
            else if (target?.riskLevel === 'high') nextRisk = 'medium';
            else if (target?.riskLevel === 'medium') nextRisk = 'low';

            return {
                ...state,
                complaints: state.complaints.map(c =>
                    c.id === action.payload.complaintId
                        ? { ...c, status: 'followup_scheduled', riskLevel: nextRisk }
                        : c
                ),
                interactions: [
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        customerId: action.payload.customerId,
                        type: 'Note',
                        content: `Action Applied: ${action.payload.suggestion}`,
                        date: new Date().toISOString(),
                        agentId: state.currentUser.id
                    },
                    ...state.interactions
                ]
            };
        }
        case 'AUTO_APPROVE_LOW_RISK_ACTIONS':
            return {
                ...state,
                pendingActions: state.pendingActions.filter(a => a.risk !== 'low')
            };
        default:
            return state;
    }
}

// Provider
export function DemoProvider({ children }: { children: React.ReactNode }) {
    // Initialize lazily from localStorage
    const [state, dispatch] = React.useReducer(demoReducer, INITIAL_STATE, (initial) => {
        if (typeof window !== 'undefined') {
            const persisted = localStorage.getItem('cie_demo_state');
            if (persisted) {
                try {
                    const parsed = JSON.parse(persisted);
                    // Merge with initial to ensure new keys (likh auth) exist if missing in stale storage
                    return { ...initial, ...parsed, auth: parsed.auth || initial.auth };
                } catch (e) {
                    console.error("Failed to parse demo state", e);
                }
            }
        }
        return initial;
    });

    // Persistence effect
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cie_demo_state', JSON.stringify(state));
        }
    }, [state]);

    const resetDemo = () => dispatch({ type: 'RESET_DEMO' });

    const login = (email: string) => {
        // Simple mock login logic: find agent by email or default to first one
        const agent = state.agents.find(a => a.email === email) || state.agents[0];
        dispatch({ type: 'LOGIN', payload: { user: agent } });
        return true;
    };

    const logout = () => dispatch({ type: 'LOGOUT' });

    return (
        <DemoContext.Provider value={{ state, dispatch, resetDemo, login, logout }}>
            {children}
        </DemoContext.Provider>
    );
}

// Helper Hook
export function useDemo() {
    const context = React.useContext(DemoContext);
    if (!context) {
        throw new Error("useDemo must be used within a DemoProvider");
    }
    return context;
}
