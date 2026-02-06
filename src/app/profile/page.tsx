'use client';

import { getUserOrders } from '@/actions/order';
import { getUserTopUpsAction } from '@/actions/topup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/format';
import { Order, TopUpRequest } from '@/lib/types';
import { Coins, Package, ArrowUpCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [topups, setTopups] = useState<TopUpRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            try {
                const [ordersData, topupsData] = await Promise.all([
                    getUserOrders(),
                    getUserTopUpsAction()
                ]);
                setOrders(ordersData);
                setTopups(topupsData);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    if (!user) return null;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Account & Wallet */}
                <div className="md:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Username</div>
                                <div className="font-medium">@{user.username}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Full Name</div>
                                <div className="font-medium">{user.fullName || '-'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Wallet Balance</div>
                                <div className="text-2xl font-bold text-primary flex items-center gap-2">
                                    <Coins className="w-6 h-6" />
                                    {formatCurrency(user.walletBalance)}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Saved Address</div>
                                <div className="font-medium">{user.address || 'No address saved'}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: History */}
                <div className="md:col-span-2 space-y-8">

                    {/* Top-up History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowUpCircle className="w-5 h-5" /> Top-up History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : topups.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground text-sm">No top-up requests found.</div>
                            ) : (
                                <div className="space-y-3">
                                    {topups.map((req) => (
                                        <div key={req.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                            'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    <Coins className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm flex items-center gap-2">
                                                        {formatCurrency(req.amount)}
                                                        <span className="text-xs font-normal text-muted-foreground">via {req.method}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" /> Order History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    No orders yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Order ID</div>
                                                    <div className="font-mono text-xs">{order.id}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">Date</div>
                                                    <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <span className="font-bold">{formatCurrency(order.totalAmount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
