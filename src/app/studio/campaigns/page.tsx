"use client"

import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDemo } from "@/lib/demo/store"
import { Megaphone, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CampaignsListPage() {
    const { state } = useDemo()
    const router = useRouter()

    const campaigns = state.campaigns || []

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
                        <p className="text-muted-foreground text-sm">Drafts and published campaigns.</p>
                    </div>
                    <Button onClick={() => router.push('/studio/create')} className="gap-2">
                        <Megaphone className="h-4 w-4" />
                        New Campaign
                    </Button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Campaign Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Platforms</th>
                                    <th className="px-6 py-4">Linked Trend</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {campaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No campaigns found. Create your first campaign to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex flex-col">
                                                    <span>{campaign.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-normal truncate max-w-[200px]">{campaign.headline}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={
                                                    campaign.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        campaign.status === 'draft' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }>
                                                    {campaign.status === 'active' ? 'Published' : campaign.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {campaign.platform.map(p => (
                                                        <div key={p} className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border" title={p}>
                                                            {p.includes('Google') ? <GoogleIcon className="h-3 w-3" /> :
                                                                p.includes('Meta') ? <FacebookIcon className="h-3 w-3" /> :
                                                                    <ShoppingBagIcon className="h-3 w-3" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                                {campaign.targetSegment || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" variant="ghost" className="h-8">
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile List View */}
                <div className="sm:hidden space-y-4">
                    {campaigns.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground italic border border-dashed rounded-xl">
                            No campaigns found.
                        </div>
                    ) : (
                        campaigns.map((campaign) => (
                            <Card key={campaign.id} className="overflow-hidden">
                                <CardContent className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-3">
                                        <span className="font-medium truncate flex-1 min-w-0 text-sm">{campaign.name}</span>
                                        <Badge variant="outline" className={
                                            campaign.status === 'active' ? 'bg-green-50 text-green-700 border-green-200 shrink-0' :
                                                campaign.status === 'draft' ? 'bg-gray-50 text-green-500 border-gray-200 shrink-0' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0'
                                        }>
                                            {campaign.status === 'active' ? 'Published' : campaign.status}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {campaign.headline || "No headline available."}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
                                        <div className="flex gap-2">
                                            {campaign.platform.map(p => (
                                                <div key={p} className="h-6 w-6 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground border border-border" title={p}>
                                                    {p.includes('Google') ? <GoogleIcon className="h-3 w-3" /> :
                                                        p.includes('Meta') ? <FacebookIcon className="h-3 w-3" /> :
                                                            <ShoppingBagIcon className="h-3 w-3" />}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                            {campaign.targetSegment || 'N/A'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.027-1.133 8.027-3.227 2.053-2.08 2.64-5.227 2.64-7.853 0-.787-.067-1.56-.16-2.293H12.48z" /></svg>
    )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    )
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}
