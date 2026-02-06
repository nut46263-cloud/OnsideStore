'use client';

import { submitTopUpAction } from '@/actions/topup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/format';
import { TopUpMethod } from '@/lib/types';
import { Loader2, Coins, Wallet, CreditCard, Gift, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BANK_INFO = {
    BANK: { title: 'Bank Transfer', account: '123-4-56789-0', name: 'Oneside Official', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' },
    TRUEMONEY: { title: 'TrueMoney Wallet', account: '081-234-5678', name: 'Oneside Wallet', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-100' },
    ANGPAO: { title: 'TrueMoney Gift Link', account: 'Paste Link Below', name: '-', icon: Gift, color: 'text-pink-600', bg: 'bg-pink-100' },
};

export default function TopUpPage() {
    const { user } = useAuth();
    const [method, setMethod] = useState<TopUpMethod>('BANK');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const amount = parseFloat(formData.get('amount') as string);
        const proofUrl = formData.get('proofUrl') as string;

        const res = await submitTopUpAction(amount, method, proofUrl);

        if (res?.success) {
            router.push('/profile');
        } else {
            alert('Failed to submit request');
            setIsLoading(false);
        }
    }

    if (!user) return <div className="p-8 text-center text-muted-foreground">Please login to top-up.</div>;

    const SelectedIcon = BANK_INFO[method].icon;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Top-up Wallet</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Select Method</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {(Object.keys(BANK_INFO) as TopUpMethod[]).map((m) => {
                                const info = BANK_INFO[m];
                                const isSelected = method === m;
                                return (
                                    <div
                                        key={m}
                                        onClick={() => setMethod(m)}
                                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 transition-all ${isSelected ? 'border-primary bg-secondary/50' : 'border-transparent hover:bg-secondary'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-full ${info.bg} ${info.color}`}>
                                            <info.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{info.title}</div>
                                            <div className="text-sm text-muted-foreground">{info.account}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                        <CardContent className="p-6 space-y-4">
                            <div className="text-slate-300">Selected Method Details</div>
                            <div className="text-2xl font-bold">{BANK_INFO[method].title}</div>
                            <div className="space-y-1">
                                <div className="text-sm text-slate-400">Account No. / Phone</div>
                                <div className="text-3xl font-mono tracking-wider flex items-center gap-2">
                                    {BANK_INFO[method].account}
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-auto p-1" onClick={() => navigator.clipboard.writeText(BANK_INFO[method].account)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Account Name</div>
                                <div className="text-lg">{BANK_INFO[method].name}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount (THB)</label>
                                    <div className="relative">
                                        <Coins className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input type="number" name="amount" placeholder="0.00" className="pl-10 text-lg" required min="1" step="0.01" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {method === 'ANGPAO' ? 'Gift Link URL' : 'Proof Image URL (Slip)'}
                                    </label>
                                    <Input name="proofUrl" placeholder="https://..." required />
                                    <p className="text-xs text-muted-foreground">
                                        *For demo, you can paste any image URL or mock text.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Top-up Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="text-center text-sm text-muted-foreground">
                        Your request will be processed by Admin shortly.
                    </div>
                </div>
            </div>
        </div>
    );
}
