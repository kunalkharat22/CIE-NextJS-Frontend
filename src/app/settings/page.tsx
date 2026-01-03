"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useDemo } from "@/lib/demo/store"
import { Download, RefreshCw, Database } from "lucide-react"

export default function SettingsPage() {
    const { state, resetDemo } = useDemo();

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "cie_demo_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="type-h2">Settings</h1>
                    <p className="text-muted-foreground">Manage your preferences and preview data.</p>
                </div>

                <div className="space-y-6">
                    {process.env.NEXT_PUBLIC_DEBUG === 'true' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Demo Tools</CardTitle>
                                <CardDescription>Manage the prototype data state.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button variant="outline" onClick={resetDemo}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reset Demo State
                                    </Button>
                                    <Button variant="outline" onClick={handleExport}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Data JSON
                                    </Button>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg border border-border mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Database className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Current State Overview</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                                        <div>Customers: <span className="text-foreground font-mono">{state.customers.length}</span></div>
                                        <div>Complaints: <span className="text-foreground font-mono">{state.complaints.length}</span></div>
                                        <div>Trends: <span className="text-foreground font-mono">{state.trends.length}</span></div>
                                        <div>Campaigns: <span className="text-foreground font-mono">{state.campaigns.length}</span></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="opacity-50 pointer-events-none">
                        <CardHeader>
                            <CardTitle>Application Settings</CardTitle>
                            <CardDescription>General configuration (Disabled in Prototype)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2">
                                    <span>Email Notifications</span>
                                    <div className="h-5 w-9 bg-accent rounded-full relative"><div className="absolute right-0.5 top-0.5 h-4 w-4 bg-white rounded-full" /></div>
                                </div>
                                <div className="flex items-center justify-between p-2">
                                    <span>Dark Mode</span>
                                    <div className="h-5 w-9 bg-muted rounded-full relative"><div className="absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-sm" /></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
