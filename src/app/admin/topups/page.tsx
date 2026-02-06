import { approveTopUpAction, getAllTopUps, rejectTopUpAction } from '@/actions/topup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { Check, X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function AdminTopUpsPage() {
    const requests = await getAllTopUps();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Top-up Requests</h1>

            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg">
                        No pending requests.
                    </div>
                ) : (
                    requests.map((req) => (
                        <Card key={req.id} className={req.status !== 'PENDING' ? 'opacity-60' : ''}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-6">
                                    <div className="space-y-1">
                                        <div className="font-semibold">{req.user?.fullName || req.userId}</div>
                                        <div className="text-sm text-muted-foreground">@{req.user?.username}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleString()}</div>
                                    </div>

                                    <div className="text-right min-w-[120px]">
                                        <div className="font-bold text-lg text-primary">{formatCurrency(req.amount)}</div>
                                        <div className="text-xs font-mono uppercase bg-secondary px-2 py-1 rounded inline-block">
                                            {req.method}
                                        </div>
                                    </div>

                                    {/* Proof Display */}
                                    <div className="relative group">
                                        <Link href={req.proofUrl} target="_blank" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                            <ExternalLink className="w-4 h-4" /> View Proof
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {req.status === 'PENDING' ? (
                                        <>
                                            <form action={approveTopUpAction.bind(null, req.id)}>
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                                    <Check className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                            </form>
                                            <form action={rejectTopUpAction.bind(null, req.id)}>
                                                <Button size="sm" variant="destructive">
                                                    <X className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            </form>
                                        </>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {req.status}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
