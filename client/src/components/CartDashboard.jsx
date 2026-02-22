import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export default function CartDashboard() {
    const currentCart = useStore(s => s.currentCart);
    const userCarts = useStore(s => s.userCarts);
    const fetchUserCarts = useStore(s => s.fetchUserCarts);
    const fetchCart = useStore(s => s.fetchCart);
    const setShowCreateModal = useStore(s => s.setShowCreateModal);
    const setShowJoinModal = useStore(s => s.setShowJoinModal);
    const currentUser = useStore(s => s.currentUser);

    useEffect(() => {
        fetchUserCarts();
    }, [currentUser]);

    if (currentCart) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary-500 live-pulse" />
                    <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Real-time Collaboration</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4">
                    Build Your Smart Cart <span className="gradient-text">Together</span>
                </h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                    Family, roommates, or friends — everyone adds items to one shared cart.
                    AI merges duplicates, optimizes choices, and keeps everyone in sync.
                </p>
            </div>

            {/* Action Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="group card-hover glass-strong rounded-2xl p-8 text-left cursor-pointer border border-transparent hover:border-primary-300"
                    id="dashboard-create-cart"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Create New Cart</h3>
                    <p className="text-sm text-text-secondary">Start a new shared cart and invite family or friends to collaborate in real-time.</p>
                </button>

                <button
                    onClick={() => setShowJoinModal(true)}
                    className="group card-hover glass-strong rounded-2xl p-8 text-left cursor-pointer border border-transparent hover:border-accent-400"
                    id="dashboard-join-cart"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mb-4 shadow-lg shadow-accent-500/20 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Join a Cart</h3>
                    <p className="text-sm text-text-secondary">Enter an invite code to join someone else's shared cart instantly.</p>
                </button>
            </div>

            {/* Existing Carts */}
            {userCarts.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Your Carts
                    </h3>
                    <div className="space-y-3">
                        {userCarts.map(cart => (
                            <button
                                key={cart.id}
                                onClick={() => fetchCart(cart.id)}
                                className="w-full card-hover glass-strong rounded-xl p-4 flex items-center justify-between cursor-pointer border border-transparent hover:border-primary-200"
                                id={`cart-${cart.id}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                                        <span className="text-lg">🛒</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-text-primary text-sm">{cart.name}</p>
                                        <p className="text-xs text-text-muted">{cart.members?.length || 0} members · {cart.items?.length || 0} items</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-text-muted font-mono">#{cart.id?.slice(0, 6)}</span>
                                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: '🤖', label: 'AI Merge', desc: 'Auto-detect duplicates' },
                    { icon: '⚡', label: 'Real-Time', desc: 'Live collaboration' },
                    { icon: '📊', label: 'VESTOSCORE', desc: 'Health optimization' },
                    { icon: '💰', label: 'Best Value', desc: 'Smart price compare' },
                ].map((feature, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/60 border border-border-light">
                        <div className="text-2xl mb-2">{feature.icon}</div>
                        <p className="text-sm font-semibold text-text-primary">{feature.label}</p>
                        <p className="text-xs text-text-muted">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
