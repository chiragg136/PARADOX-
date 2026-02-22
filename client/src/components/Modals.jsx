import React, { useState } from 'react';
import useStore from '../store/useStore';

export function CreateCartModal() {
    const [cartName, setCartName] = useState('');
    const showCreateModal = useStore(s => s.showCreateModal);
    const setShowCreateModal = useStore(s => s.setShowCreateModal);
    const createCart = useStore(s => s.createCart);
    const isLoading = useStore(s => s.isLoading);

    if (!showCreateModal) return null;

    const handleCreate = async () => {
        if (!cartName.trim()) return;
        await createCart(cartName);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
            <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-xl">🛒</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Create Shared Cart</h3>
                        <p className="text-xs text-text-muted">Start collaborating with family or friends</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-xs font-semibold text-text-secondary mb-1.5 block">Cart Name</label>
                    <input
                        type="text"
                        value={cartName}
                        onChange={e => setCartName(e.target.value)}
                        placeholder="e.g., Weekend Groceries, Party Supplies"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none text-sm"
                        id="create-cart-name"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCreate}
                        disabled={isLoading || !cartName.trim()}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        id="confirm-create-cart"
                    >
                        {isLoading ? 'Creating...' : 'Create Cart ✨'}
                    </button>
                    <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-3 rounded-xl bg-surface-alt text-text-secondary text-sm font-semibold hover:bg-border transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export function JoinCartModal() {
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const showJoinModal = useStore(s => s.showJoinModal);
    const setShowJoinModal = useStore(s => s.setShowJoinModal);
    const joinCart = useStore(s => s.joinCart);
    const isLoading = useStore(s => s.isLoading);

    if (!showJoinModal) return null;

    const handleJoin = async () => {
        if (!inviteCode.trim()) return;
        setError('');
        try {
            await joinCart(inviteCode.trim().toUpperCase());
        } catch (err) {
            setError('Invalid invite code. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowJoinModal(false)}>
            <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Join a Cart</h3>
                        <p className="text-xs text-text-muted">Enter the invite code shared with you</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-xs font-semibold text-text-secondary mb-1.5 block">Invite Code</label>
                    <input
                        type="text"
                        value={inviteCode}
                        onChange={e => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="e.g., A1B2C3"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-border focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none text-sm font-mono text-center text-lg tracking-widest uppercase"
                        id="join-cart-code"
                        autoFocus
                        maxLength={6}
                        onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    />
                    {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleJoin}
                        disabled={isLoading || !inviteCode.trim()}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-white font-semibold text-sm shadow-md shadow-accent-500/20 hover:from-accent-500 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        id="confirm-join-cart"
                    >
                        {isLoading ? 'Joining...' : 'Join Cart →'}
                    </button>
                    <button
                        onClick={() => setShowJoinModal(false)}
                        className="px-4 py-3 rounded-xl bg-surface-alt text-text-secondary text-sm font-semibold hover:bg-border transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export function InviteModal() {
    const [copied, setCopied] = useState(false);
    const showInviteModal = useStore(s => s.showInviteModal);
    const setShowInviteModal = useStore(s => s.setShowInviteModal);
    const currentCart = useStore(s => s.currentCart);

    if (!showInviteModal || !currentCart) return null;

    const inviteCode = currentCart.inviteCode;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
            <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl pop-in" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 items-center justify-center mb-3 shadow-lg shadow-primary-500/20">
                        <span className="text-3xl">🔗</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">Invite to "{currentCart.name}"</h3>
                    <p className="text-xs text-text-muted mt-1">Share this code with family or friends</p>
                </div>

                {/* Invite code display */}
                <div className="bg-primary-50 rounded-xl p-4 text-center mb-4 border border-primary-200">
                    <p className="text-3xl font-extrabold text-primary-700 tracking-[0.3em] font-mono">{inviteCode}</p>
                </div>

                <button
                    onClick={handleCopy}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${copied ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700'}`}
                    id="copy-invite-code"
                >
                    {copied ? '✅ Copied to Clipboard!' : '📋 Copy Invite Code'}
                </button>

                {/* Members list */}
                {currentCart.memberDetails && currentCart.memberDetails.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs font-semibold text-text-muted mb-2">Current Members ({currentCart.memberDetails.length})</p>
                        <div className="flex flex-wrap gap-2">
                            {currentCart.memberDetails.map(member => (
                                <div key={member.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt">
                                    <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                                        style={{ backgroundColor: member.color }}
                                    >
                                        {member.avatar}
                                    </div>
                                    <span className="text-xs font-medium text-text-primary">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setShowInviteModal(false)}
                    className="w-full mt-3 py-2 text-center text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
