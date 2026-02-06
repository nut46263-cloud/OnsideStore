'use server';

import { findUserByUsername, getUsers, saveUser } from '@/lib/db';
import { User } from '@/lib/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const idCard = formData.get('idCard') as string | null;

    const user = await findUserByUsername(username);

    if (!user) {
        return { error: 'Invalid credentials' };
    }

    // Simple password check (In real app, use bcrypt)
    if (user.password !== password) {
        return { error: 'Invalid credentials' };
    }

    // Admin check
    if (user.role === 'ADMIN') {
        const inputId = idCard?.trim();
        const storedId = user.idCard?.trim();

        console.log(`Admin Login Attempt: Input "${inputId}" vs Stored "${storedId}"`);

        if (!inputId || inputId !== storedId) {
            return { error: 'Invalid ID Card for Admin' };
        }
    }

    // Set session cookie
    (await cookies()).set('session_user', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    return { success: true, user };
}

export async function logoutAction() {
    (await cookies()).delete('session_user');
    redirect('/login');
}

export async function registerAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    if (!username || !password) {
        return { error: 'Missing fields' };
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        return { error: 'Username already taken' };
    }

    const newUser: User = {
        id: Math.random().toString(36).slice(2),
        username,
        password,
        role: 'USER',
        fullName,
        walletBalance: 0,
    };

    await saveUser(newUser);

    // Auto login
    (await cookies()).set('session_user', JSON.stringify(newUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    return { success: true, user: newUser };
}

export async function getSession() {
    const sessionCookie = (await cookies()).get('session_user');
    if (!sessionCookie?.value) return null;
    try {
        return JSON.parse(sessionCookie.value) as User;
    } catch {
        return null;
    }
}
