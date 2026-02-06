export type Role = 'USER' | 'ADMIN';

export interface User {
    id: string;
    username: string; // Used for login
    password?: string; // In real app, hash this. Here plain for demo/mock as requested? Secure usually.
    role: Role;
    fullName?: string;
    idCard?: string; // For admin verification
    address?: string;
    walletBalance: number;
}

export type ProductCategory = 'GAME_TOPUP' | 'DIGITAL' | 'PHYSICAL';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    requiresShipping: boolean;
    category: ProductCategory;
    tags: string[];
    createdAt: string;
}

export type TopUpStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TopUpMethod = 'BANK' | 'TRUEMONEY' | 'ANGPAO';

export interface TopUpRequest {
    id: string;
    userId: string;
    amount: number;
    method: TopUpMethod;
    proofUrl: string; // URL or Slip content
    status: TopUpStatus;
    createdAt: string;
    processedAt?: string;
}

export interface Order {
    id: string;
    userId: string;
    items: {
        productId: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    totalAmount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    shippingAddress: string;
    createdAt: string;
}
