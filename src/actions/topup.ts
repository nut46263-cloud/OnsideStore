'use server';

import { getSession } from '@/actions/auth';
import { findTopUpRequestById, getTopUpRequests, getUsers, saveTopUpRequest, saveUser } from '@/lib/db';
import { TopUpMethod, TopUpRequest } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// User: Submit a TopUp Request
export async function submitTopUpAction(amount: number, method: TopUpMethod, proofUrl: string) {
    const sessionUser = await getSession();
    if (!sessionUser) return { error: 'Not authenticated' };

    const request: TopUpRequest = {
        id: Math.random().toString(36).slice(2),
        userId: sessionUser.id,
        amount,
        method,
        proofUrl,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    };

    await saveTopUpRequest(request);
    revalidatePath('/profile');
    revalidatePath('/admin/topups');
    return { success: true };
}

// Admin: Get all requests
export async function getAllTopUps() {
    const requests = await getTopUpRequests();
    const users = await getUsers();

    // Join with user info
    return requests.map(req => ({
        ...req,
        user: users.find(u => u.id === req.userId)
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// User: Get own top-up requests
export async function getUserTopUpsAction() {
    const sessionUser = await getSession();
    if (!sessionUser) return [];

    const requests = await getTopUpRequests();
    return requests
        .filter(req => req.userId === sessionUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Admin: Approve Request
export async function approveTopUpAction(requestId: string) {
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role !== 'ADMIN') return { error: 'Unauthorized' };

    const request = await findTopUpRequestById(requestId);
    if (!request) return { error: 'Request not found' };
    if (request.status !== 'PENDING') return { error: 'Request already processed' };

    // Update Request Status
    request.status = 'APPROVED';
    request.processedAt = new Date().toISOString();
    await saveTopUpRequest(request);

    // Add Balance to User
    const users = await getUsers();
    const targetUser = users.find(u => u.id === request.userId);
    if (targetUser) {
        targetUser.walletBalance += request.amount;
        await saveUser(targetUser);
    }

    revalidatePath('/admin/topups');
    return { success: true };
}

// Admin: Reject Request
export async function rejectTopUpAction(requestId: string) {
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role !== 'ADMIN') return { error: 'Unauthorized' };

    const request = await findTopUpRequestById(requestId);
    if (!request) return { error: 'Request not found' };
    if (request.status !== 'PENDING') return { error: 'Request already processed' };

    request.status = 'REJECTED';
    request.processedAt = new Date().toISOString();
    await saveTopUpRequest(request);

    revalidatePath('/admin/topups');
    return { success: true };
}
