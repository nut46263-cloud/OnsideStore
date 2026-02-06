import { addCreditsAction } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getUsers } from '@/lib/db';
import { formatCurrency } from '@/lib/format';
import { Coins, User as UserIcon } from 'lucide-react';

export default async function AdminUsersPage() {
    const users = (await getUsers()).filter(u => u.role !== 'ADMIN');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            <div className="grid gap-6">
                {users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No users registered yet.</div>
                ) : (
                    users.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-secondary rounded-full">
                                        <UserIcon className="w-6 h-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{user.fullName}</h3>
                                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                                        <div className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-1">
                                            <Coins className="w-3 h-3" />
                                            {formatCurrency(user.walletBalance)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <form action={addCreditsAction.bind(null, user.id)} className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            name="amount"
                                            placeholder="Amount"
                                            className="w-32 h-9"
                                            min="1"
                                            required
                                        />
                                        <Button size="sm" type="submit">
                                            Top-up
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
