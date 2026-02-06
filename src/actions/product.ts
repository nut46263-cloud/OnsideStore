'use server';

import { deleteProduct, saveProduct } from '@/lib/db';
import { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addProductAction(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const requiresShipping = formData.get('requiresShipping') === 'on';
    const category = (formData.get('category') as string) || 'DIGITAL';
    const tagsRaw = formData.get('tags') as string || '';
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

    if (!name || isNaN(price)) {
        return { error: 'Invalid data' };
    }

    const newProduct: Product = {
        id: Math.random().toString(36).slice(2),
        name,
        description,
        price,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        requiresShipping,
        category: category as Product['category'],
        tags,
        createdAt: new Date().toISOString(),
    };

    await saveProduct(newProduct);
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
}

export async function deleteProductAction(id: string) {
    await deleteProduct(id);
    revalidatePath('/admin/products');
    revalidatePath('/');
}
