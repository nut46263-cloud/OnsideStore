'use server';

import { getUsers, saveUser } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addCreditsAction(userId: string, formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);

    if (isNaN(amount) || amount <= 0) {
        return { error: 'Invalid amount' };
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
        return { error: 'User not found' };
    }

    user.walletBalance += amount;
    await saveUser(user);

    revalidatePath('/admin/users');
    return { success: true };
}
