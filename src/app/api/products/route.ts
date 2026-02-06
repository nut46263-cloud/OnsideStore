import { getProducts } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}
