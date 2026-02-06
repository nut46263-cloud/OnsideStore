'use server';

import { getSession } from '@/actions/auth';
import { getProducts, getUsers, saveUser } from '@/lib/db';
import { Order, User } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function getOrders(): Promise<Order[]> {
    try {
        const data = await fs.readFile(ORDERS_FILE, 'utf-8');
        return JSON.parse(data) as Order[];
    } catch {
        return [];
    }
}

async function saveOrder(order: Order): Promise<void> {
    const orders = await getOrders();
    orders.push(order);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function placeOrderAction(items: { productId: string; quantity: number }[], address: string) {
    const sessionUser = await getSession();
    if (!sessionUser) {
        return { error: 'Not authenticated' };
    }

    const users = await getUsers();
    const user = users.find(u => u.id === sessionUser.id);

    if (!user) {
        return { error: 'User not found' };
    }

    const products = await getProducts();
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue;
        totalAmount += product.price * item.quantity;
        orderItems.push({
            productId: product.id,
            quantity: item.quantity,
            priceAtPurchase: product.price
        });
    }

    if (user.walletBalance < totalAmount) {
        return { error: 'Insufficient balance' };
    }

    // Deduct balance
    user.walletBalance -= totalAmount;
    // Update address if provided (optional save)
    user.address = address;

    await saveUser(user);

    const order: Order = {
        id: Math.random().toString(36).slice(2),
        userId: user.id,
        items: orderItems,
        totalAmount,
        status: 'COMPLETED',
        shippingAddress: address,
        createdAt: new Date().toISOString()
    };

    await saveOrder(order);

    revalidatePath('/profile');

    return { success: true };
}

export async function getUserOrders() {
    const sessionUser = await getSession();
    if (!sessionUser) return [];
    const orders = await getOrders();
    // Reverse to show newest first
    return orders.filter(o => o.userId === sessionUser.id).reverse();
}
