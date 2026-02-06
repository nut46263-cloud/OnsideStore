'use client';

import { ProductCategory } from '@/lib/types';
import { motion } from 'framer-motion';
import { Search, Gamepad2, Monitor, Package, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
    onSearchChange: (query: string) => void;
    onCategoryChange: (category: ProductCategory | 'ALL') => void;
    selectedCategory: ProductCategory | 'ALL';
}

const categories: { value: ProductCategory | 'ALL'; label: string; icon: React.ElementType }[] = [
    { value: 'ALL', label: 'ทั้งหมด', icon: LayoutGrid },
    { value: 'GAME_TOPUP', label: 'เติมเกม', icon: Gamepad2 },
    { value: 'DIGITAL', label: 'Digital', icon: Monitor },
    { value: 'PHYSICAL', label: 'Physical', icon: Package },
];

export function ProductFilters({ onSearchChange, onCategoryChange, selectedCategory }: ProductFiltersProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        onSearchChange(value);
    };

    return (
        <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="ค้นหาสินค้า... (เช่น Garena, Steam, ROV)"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat.value;
                    const Icon = cat.icon;
                    return (
                        <motion.button
                            key={cat.value}
                            onClick={() => onCategoryChange(cat.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
