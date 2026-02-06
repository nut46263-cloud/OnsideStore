'use client';

import { registerAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { refreshSession } = useAuth();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError('');

        const res = await registerAction(formData);

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        } else if (res?.success) {
            await refreshSession();
            router.push('/');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <p className="text-sm text-muted-foreground">Join us for a premium shopping experience</p>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input name="username" placeholder="Username" required />
                        </div>
                        <div className="space-y-2">
                            <Input name="fullName" placeholder="Full Name" required />
                        </div>
                        <div className="space-y-2">
                            <Input type="password" name="password" placeholder="Password" required />
                        </div>

                        {error && <p className="text-sm text-destructive text-center">{error}</p>}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
