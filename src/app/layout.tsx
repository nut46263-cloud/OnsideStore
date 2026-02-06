import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Oneside E-commerce',
  description: 'Cool & Trustworthy Shopping',
};


import { CartProvider } from '@/context/CartContext';

// ... (imports remain same, just showing relevant part for clarity in thought, but I must replace correctly)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <PageWrapper className="flex-1 container mx-auto px-4 py-8">
              {children}
            </PageWrapper>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
