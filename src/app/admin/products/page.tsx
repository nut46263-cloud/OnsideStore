import { addProductAction, deleteProductAction } from '@/actions/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/lib/db';
import { formatCurrency } from '@/lib/format';
import { Plus, Trash2, Tag, Gamepad2, Monitor, Package } from 'lucide-react';
import Image from 'next/image';

const categoryOptions = [
    { value: 'GAME_TOPUP', label: '🎮 เติมเกม', icon: Gamepad2 },
    { value: 'DIGITAL', label: '💻 Digital', icon: Monitor },
    { value: 'PHYSICAL', label: '📦 Physical', icon: Package },
];

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={addProductAction} className="space-y-4">
                            <div className="space-y-2">
                                <Input name="name" placeholder="Product Name" required />
                            </div>
                            <div className="space-y-2">
                                <Input name="description" placeholder="Description" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input type="number" name="price" placeholder="Price (THB)" min="0" step="0.01" required />
                                <Input name="imageUrl" placeholder="Image URL (Optional)" />
                            </div>

                            {/* Category Select */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">หมวดหมู่</label>
                                <select
                                    name="category"
                                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    defaultValue="GAME_TOPUP"
                                >
                                    {categoryOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Tags (คั่นด้วย ,)
                                </label>
                                <Input name="tags" placeholder="เช่น Garena, Steam, ROV, FreeFire" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="requiresShipping" id="requiresShipping" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <label htmlFor="requiresShipping" className="text-sm font-medium leading-none">
                                    Requires Shipping (Physical Product)
                                </label>
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Add Product
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Product Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground">Total Products in Store</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <div className="p-4 grid grid-cols-1 gap-4">
                    {products.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No products found. Start adding some!</div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-medium text-primary">{formatCurrency(product.price)}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                                {product.category || 'DIGITAL'}
                                            </span>
                                            {product.tags?.map((tag) => (
                                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <form action={deleteProductAction.bind(null, product.id)}>
                                    <Button variant="destructive" size="sm" type="submit">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
