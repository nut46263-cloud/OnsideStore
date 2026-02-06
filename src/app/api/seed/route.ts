import { saveProduct, saveUser, getUsers } from '@/lib/db';
import { Product, User } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function GET() {
    const users = await getUsers();
    let admin = users.find(u => u.role === 'ADMIN');

    if (!admin) {
        admin = {
            id: 'admin-seed',
            username: 'admin',
            password: 'password', // Simple password for demo
            role: 'ADMIN',
            fullName: 'System Administrator',
            idCard: '1234567890123',
            walletBalance: 1000000,
        };
        await saveUser(admin);
    }

    // Seed some products if empty
    const products: Product[] = [
        {
            id: 'p1',
            name: 'Wireless Noise-Cancelling Headphones',
            description: 'Premium sound quality with active noise cancellation and 30-hour battery life.',
            price: 5990,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            createdAt: new Date().toISOString()
        },
        {
            id: 'p2',
            name: 'Smart Watch Series X',
            description: 'Track your fitness, health, and notifications with this sleek smartwatch.',
            price: 8900,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            createdAt: new Date().toISOString()
        },
        {
            id: 'p3',
            name: 'Mechanical Gaming Keyboard',
            description: 'RGB backlight, blue switches, and durable aluminum frame for the best typing experience.',
            price: 3290,
            imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91a05c?w=800&q=80',
            createdAt: new Date().toISOString()
        },
        {
            id: 'p4',
            name: 'Ergonomic Office Chair',
            description: 'Comfortable mesh chair with adjustable lumbar support and headrest.',
            price: 4500,
            imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
            createdAt: new Date().toISOString()
        }
    ];

    for (const p of products) {
        await saveProduct(p);
    }

    return NextResponse.json({
        message: 'Seeded successfully',
        adminCredentials: { username: 'admin', password: 'password', idCard: '1234567890123' },
        note: 'Visit this route only once to setup initial data.'
    });
}
