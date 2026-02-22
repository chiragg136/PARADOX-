import React, { useState } from 'react';
import useStore from '../store/useStore';

export default function Header() {
    const currentUser = useStore(s => s.currentUser);
    const currentCart = useStore(s => s.currentCart);
    const setCurrentUser = useStore(s => s.setCurrentUser);
    const setShowCreateModal = useStore(s => s.setShowCreateModal);
    const setShowJoinModal = useStore(s => s.setShowJoinModal);
    const setShowInviteModal = useStore(s => s.setShowInviteModal);

    return (
        <header className="glass-strong sticky top-0 z-40 border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                            <span className="text-xl">🛒</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold gradient-text leading-none">VESTOCART</h1>
                            <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest">Collab Platform</p>
                        </div>
                    </div>

                    {/* Center - Cart Info */}
                    {currentCart && (
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200">
                                <div className="w-2 h-2 rounded-full bg-primary-500 live-pulse" />
                                <span className="text-sm font-semibold text-primary-700">{currentCart.name}</span>
                                <span className="text-xs text-primary-500 font-mono">#{currentCart.id?.slice(0, 6)}</span>
                            </div>
                            {currentCart.memberDetails && (
                                <div className="flex -space-x-2">
                                    {currentCart.memberDetails.map((member) => (
                                        <div
                                            key={member.id}
                                            className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                            style={{ backgroundColor: member.color }}
                                            title={member.name}
                                        >
                                            {member.avatar}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {currentCart && (
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20 cursor-pointer"
                                id="invite-btn"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Invite
                            </button>
                        )}
                        {!currentCart && (
                            <>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20 cursor-pointer"
                                    id="create-cart-btn"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    New Cart
                                </button>
                                <button
                                    onClick={() => setShowJoinModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-primary-600 text-xs font-semibold border border-primary-200 hover:bg-primary-50 transition-colors cursor-pointer"
                                    id="join-cart-btn"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" /></svg>
                                    Join
                                </button>
                            </>
                        )}
                        {/* User avatar */}
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: currentUser?.color || '#10B981' }}
                                onClick={() => { setCurrentUser(null); }}
                                title="Switch user"
                                id="user-avatar"
                            >
                                {currentUser?.avatar || '?'}
                            </div>
                            <span className="text-sm font-medium text-text-primary hidden sm:block">{currentUser?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
