'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                    Oneside<span className="text-foreground">Store</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/products" className="text-foreground/60 hover:text-foreground transition-colors">
                        Products
                    </Link>
                    {user && (
                        <Link href="/topup" className="text-foreground/60 hover:text-foreground transition-colors">Top-up</Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                            {user.role === 'ADMIN' && (
                                <Link href="/admin/products" className="text-sm font-medium text-destructive hover:underline">
                                    Admin Panel
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{user.username}</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    ฿{user.walletBalance.toLocaleString()}
                                </span>
                            </div>
                            <Link href="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors">
                                <ShoppingCart className="w-5 h-5" />
                                {/* Badge would go here */}
                            </Link>
                            <Link href="/profile" className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <UserIcon className="w-5 h-5" />
                            </Link>
                            <button onClick={logout} className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 ml-4">
                            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-card animate-in slide-in-from-top-2">
                    <Link href="/" className="block py-2">Home</Link>
                    <Link href="/products" className="block py-2">Products</Link>
                    {user ? (
                        <>
                            <div className="py-2 border-y my-2">
                                <div className="font-medium">{user.fullName || user.username}</div>
                                <div className="text-sm text-primary">Balance: ฿{user.walletBalance.toLocaleString()}</div>
                            </div>
                            {user.role === 'ADMIN' && (
                                <Link href="/admin/products" className="block py-2 text-destructive">Admin Panel</Link>
                            )}
                            <Link href="/cart" className="block py-2">Cart</Link>
                            <Link href="/profile" className="block py-2">Profile</Link>
                            <button onClick={logout} className="block w-full text-left py-2 text-destructive">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block py-2">Login</Link>
                            <Link href="/register" className="block py-2 text-primary font-medium">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
