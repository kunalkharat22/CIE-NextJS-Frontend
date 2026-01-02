"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function IntegrationsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="type-h2">Integrations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>Salesforce</CardTitle>
                                <Badge variant="status-resolved">Connected</Badge>
                            </div>
                            <CardDescription>CRM Data Sync</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">Configure</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>ZenDesk</CardTitle>
                                <Badge variant="status-pending">Syncing</Badge>
                            </div>
                            <CardDescription>Ticket Ingestion</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">Manage</Button>
                        </CardContent>
                    </Card>

                    <Card className="opacity-75">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>Slack</CardTitle>
                                <Badge variant="neutral">Disconnected</Badge>
                            </div>
                            <CardDescription>Alert Notifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Connect</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
