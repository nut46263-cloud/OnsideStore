import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/db';
import { formatCurrency } from '@/lib/format';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton'; // We need a client component for the button

export default async function ProductPage({ params }: { params: { id: string } }) {
    const products = await getProducts();
    const product = products.find(p => p.id === params.id);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary border">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
                        <div className="mt-4 text-2xl font-bold text-primary">{formatCurrency(product.price)}</div>
                    </div>

                    <div className="prose prose-sm text-muted-foreground">
                        <p>{product.description}</p>
                    </div>

                    <div className="pt-6 border-t">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
