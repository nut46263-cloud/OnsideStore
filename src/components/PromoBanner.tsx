'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Zap, Gift, Flame } from 'lucide-react';

const promos = [
    {
        title: 'เติมเกมสุดคุ้ม! 🔥',
        subtitle: 'รับโบนัสพิเศษทุกการเติม Garena Shell',
        gradient: 'from-purple-600 via-pink-500 to-orange-400',
        icon: Flame,
    },
    {
        title: 'Steam Wallet ลดราคา!',
        subtitle: 'ซื้อวันนี้รับส่วนลด 5% ทันที',
        gradient: 'from-blue-600 via-cyan-500 to-teal-400',
        icon: Zap,
    },
    {
        title: 'โปรสุดพิเศษ! 🎁',
        subtitle: 'เติมครบ ฿500 รับฟรีคูปองส่วนลด',
        gradient: 'from-emerald-500 via-green-400 to-lime-300',
        icon: Gift,
    },
];

export function PromoBanner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % promos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const promo = promos[current];
    const Icon = promo.icon;

    return (
        <div className="relative overflow-hidden rounded-2xl mb-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className={`bg-gradient-to-r ${promo.gradient} p-8 md:p-12 text-white relative`}
                >
                    {/* Animated sparkles background */}
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }}
                    />

                    <div className="relative z-10 flex items-center gap-6">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm"
                        >
                            <Icon className="w-10 h-10" />
                        </motion.div>
                        <div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-4xl font-extrabold tracking-tight"
                            >
                                {promo.title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg md:text-xl opacity-90 mt-2"
                            >
                                {promo.subtitle}
                            </motion.p>
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {promos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
