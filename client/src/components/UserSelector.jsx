import React from 'react';
import useStore from '../store/useStore';

const users = [
    { id: 'user1', name: 'Sanjay', avatar: 'S', color: '#10B981' },
    { id: 'user2', name: 'Priya', avatar: 'P', color: '#8B5CF6' },
    { id: 'user3', name: 'Rahul', avatar: 'R', color: '#F59E0B' },
    { id: 'user4', name: 'Anita', avatar: 'A', color: '#EF4444' },
];

export default function UserSelector() {
    const currentUser = useStore(s => s.currentUser);
    const setCurrentUser = useStore(s => s.setCurrentUser);

    if (currentUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 60%, #6ee7b7 100%)' }}>
            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl float" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary-400/15 rounded-full blur-3xl float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent-400/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative glass-strong rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl shadow-primary-500/10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/30 mb-4">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h1 className="text-3xl font-extrabold gradient-text mb-2">VESTOCART</h1>
                    <p className="text-text-secondary text-sm font-medium">Collaborative Smart Cart Platform</p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Choose your profile</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>

                {/* User Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {users.map((user, index) => (
                        <button
                            key={user.id}
                            onClick={() => setCurrentUser(user)}
                            className="group relative flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-transparent hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1 cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                            id={`user-selector-${user.id}`}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform duration-300 group-hover:scale-110"
                                style={{ background: `linear-gradient(135deg, ${user.color}, ${user.color}dd)` }}
                            >
                                {user.avatar}
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-text-primary text-sm">{user.name}</p>
                                <p className="text-xs text-text-muted">Click to enter</p>
                            </div>
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 transition-opacity live-pulse" />
                        </button>
                    ))}
                </div>

                <p className="text-center text-xs text-text-muted mt-6">
                    🔒 Demo mode — select any profile to start collaborating
                </p>
            </div>
        </div>
    );
}
