'use client';

import { ProductCard } from '@/components/ProductCard';
import { PromoBanner } from '@/components/PromoBanner';
import { ProductFilters } from '@/components/ProductFilters';
import { Product, ProductCategory } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query (name, tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="space-y-8">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Filters */}
      <ProductFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
      />

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedCategory === 'ALL' ? 'สินค้าทั้งหมด' :
              selectedCategory === 'GAME_TOPUP' ? '🎮 เติมเกม' :
                selectedCategory === 'DIGITAL' ? '💻 Digital' : '📦 Physical'}
          </h2>
          <span className="text-muted-foreground text-sm">{filteredProducts.length} รายการ</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl">
            <p className="text-muted-foreground">ไม่พบสินค้าที่ค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
