import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export default function SharedCartPanel() {
    const currentCart = useStore(s => s.currentCart);
    const removeItem = useStore(s => s.removeItem);
    const currentUser = useStore(s => s.currentUser);
    const [typingUser, setTypingUser] = useState(null);

    // Mock real-time typing effect (in a real app, this comes from Socket.io)
    useEffect(() => {
        const handleTyping = (data) => {
            if (data.userId !== currentUser?.id) {
                setTypingUser(data.userName);
                setTimeout(() => setTypingUser(null), 3000);
            }
        };
        // This is a placeholder for where the socket listener would trigger local state
        // In this demo, we'll simulate occasional activity
    }, [currentUser]);

    if (!currentCart) return null;

    const items = currentCart.items || [];
    const totalPrice = items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * (item.quantity || 1);
    }, 0);

    const avgVestoScore = items.length > 0
        ? Math.round(items.reduce((sum, item) => sum + (item.product?.vestoScore || 0), 0) / items.length * 10) / 10
        : 0;

    return (
        <div className="glass-strong rounded-2xl border border-border/50 overflow-hidden flex flex-col h-full max-h-[600px]">
            {/* Cart Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary-50/50 to-transparent shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🛒</span>
                        <h3 className="font-bold text-text-primary">Shared Cart</h3>
                        <span className="text-xs font-mono text-text-muted bg-surface-alt px-2 py-0.5 rounded-full">{items.length} items</span>
                    </div>
                    {/* Optimization Score */}
                    <div className="flex items-center gap-1.5">
                        <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                <path
                                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={currentCart.optimizationScore >= 70 ? '#10b981' : currentCart.optimizationScore >= 40 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="3"
                                    strokeDasharray={`${currentCart.optimizationScore || 0}, 100`}
                                    className="score-ring"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-text-primary">
                                {currentCart.optimizationScore || 0}
                            </span>
                        </div>
                        <div className="hidden xs:block">
                            <p className="text-[10px] font-semibold text-text-primary leading-none">Market</p>
                            <p className="text-[10px] text-text-muted leading-none">Health</p>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 text-center border border-primary-100 shadow-sm">
                        <p className="text-lg font-bold text-primary-600">₹{totalPrice}</p>
                        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Total</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 text-center border border-accent-100 shadow-sm">
                        <p className="text-lg font-bold text-accent-500">{avgVestoScore}</p>
                        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">VESTOSCORE</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 text-center border border-blue-100 shadow-sm">
                        <p className="text-lg font-bold text-blue-600">{currentCart.memberDetails?.length || 0}</p>
                        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Users</p>
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white/30">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
                        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <p className="text-sm font-bold text-text-primary mb-1">Collaborative Cart is Empty</p>
                        <p className="text-xs text-text-muted max-w-[200px]">Items added by anyone will appear here instantly for everyone.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {items.map((item, index) => {
                            const product = item.product;
                            if (!product) return null;

                            const addedByUser = currentCart.memberDetails?.find(m => m.id === item.addedBy);

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-4 hover:bg-white/60 transition-all group relative overflow-hidden"
                                >
                                    {/* Product emoji */}
                                    <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center text-2xl shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                        {product.image}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-bold text-text-primary truncate">{product.name}</p>
                                            {item.merged && (
                                                <span className="shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-primary-500 text-white shadow-sm">AI MERGED</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-black text-primary-600">₹{product.price * item.quantity}</span>
                                            <div className="h-1 w-1 rounded-full bg-border" />
                                            <span className="text-[11px] font-medium text-text-muted">₹{product.price} × {item.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Added by + VESTOSCORE */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm ${product.vestoScore >= 8 ? 'bg-green-500 text-white' : product.vestoScore >= 5 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                                            V: {product.vestoScore}
                                        </div>
                                        {addedByUser && (
                                            <div
                                                className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-md ring-2 ring-white"
                                                style={{ backgroundColor: addedByUser.color }}
                                                title={`Added by ${addedByUser.name}`}
                                            >
                                                {addedByUser.avatar}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove button (Floating on hover) */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute right-0 top-0 bottom-0 px-4 bg-red-50 to-white text-red-500 opacity-0 group-hover:opacity-100 transition-all translate-x-full group-hover:translate-x-0 cursor-pointer flex items-center justify-center"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t border-border/50 bg-white/80 backdrop-blur-sm shrink-0">
                {/* Typing/Activity Indicator */}
                <div className="h-4 mb-2 flex items-center gap-1.5">
                    {typingUser && (
                        <p className="text-[10px] font-medium text-primary-500 flex items-center gap-1.5 animate-pulse">
                            <span className="flex gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                            {typingUser} is adding items...
                        </p>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Shared Total</span>
                            <span className="text-2xl font-black gradient-text">₹{totalPrice}</span>
                        </div>
                        <button
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                            id="checkout-btn"
                        >
                            <span className="text-lg">💰</span>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
