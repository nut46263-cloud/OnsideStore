'use client';

import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ShoppingCart, Gamepad2, Monitor, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
}

const categoryIcons: Record<string, React.ElementType> = {
    GAME_TOPUP: Gamepad2,
    DIGITAL: Monitor,
    PHYSICAL: Package,
};

const categoryColors: Record<string, string> = {
    GAME_TOPUP: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    DIGITAL: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    PHYSICAL: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
};

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const CategoryIcon = categoryIcons[product.category] || Monitor;
    const categoryStyle = categoryColors[product.category] || categoryColors.DIGITAL;

    return (
        <motion.div
            whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.3)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full"
        >
            {/* Category Badge */}
            <div className={`absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${categoryStyle}`}>
                <CategoryIcon className="w-3 h-3" />
                {product.category === 'GAME_TOPUP' ? 'เติมเกม' : product.category}
            </div>

            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-muted">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {product.description}
                </p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <div className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        {formatCurrency(product.price)}
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            size="sm"
                            className="rounded-full shadow-lg shadow-primary/30 z-20 relative bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-400"
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                        >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </motion.div>
                </div>
            </div>
            <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />
        </motion.div>
    );
}
