'use client';

import { placeOrderAction } from '@/actions/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/format';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user, refreshSession } = useAuth();
    const [address, setAddress] = useState(user?.address || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    if (items.length === 0) {
        router.push('/');
        return null;
    }

    async function handleCheckout(formData: FormData) {
        setIsLoading(true);
        setError('');

        const addressInput = formData.get('address') as string;

        // Convert cart items to format expected by action
        const orderItems = items.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const res = await placeOrderAction(orderItems, addressInput);

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        } else if (res?.success) {
            clearCart();
            await refreshSession();
            router.push('/profile'); // Redirect to profile to see order
        }
    }

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Checkout</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={handleCheckout} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    name="address"
                                    placeholder="Full Address"
                                    defaultValue={address}
                                    required
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold">Payment Method</h3>
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                                    <div>
                                        <span className="font-medium">Wallet Balance</span>
                                        {user && (
                                            <div className={user.walletBalance < total ? "text-destructive text-sm" : "text-emerald-600 text-sm"}>
                                                Available: {formatCurrency(user.walletBalance)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading || (user ? user.walletBalance < total : true)}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Pay ${formatCurrency(total)}`}
                            </Button>
                            {user && user.walletBalance < total && (
                                <p className="text-xs text-destructive text-center">Insufficient balance. Please contact admin to top-up.</p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
