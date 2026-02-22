import React from 'react';
import useStore from '../store/useStore';

function timeAgo(dateString) {
    const now = new Date();
    const then = new Date(dateString);
    const seconds = Math.floor((now - then) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const activityIcons = {
    cart_created: '🎉',
    member_joined: '👤',
    item_added: '➕',
    item_removed: '🗑️',
    items_merged: '🔄',
};

const activityColors = {
    cart_created: 'bg-primary-100 text-primary-700',
    member_joined: 'bg-blue-100 text-blue-700',
    item_added: 'bg-green-100 text-green-700',
    item_removed: 'bg-red-100 text-red-700',
    items_merged: 'bg-purple-100 text-purple-700',
};

export default function ActivityFeed() {
    const currentCart = useStore(s => s.currentCart);

    if (!currentCart) return null;

    const activities = currentCart.activity || [];

    return (
        <div className="glass-strong rounded-2xl border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 live-pulse" />
                    <h3 className="font-bold text-text-primary text-sm">Live Activity</h3>
                    <span className="text-xs text-text-muted ml-auto">{activities.length} events</span>
                </div>
            </div>

            {/* Activities */}
            <div className="max-h-[350px] overflow-y-auto">
                {activities.length === 0 ? (
                    <div className="p-6 text-center">
                        <span className="text-2xl mb-2 block">📡</span>
                        <p className="text-xs text-text-muted">Activity will appear here in real-time</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border-light">
                        {activities.slice(0, 20).map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 hover:bg-surface-hover transition-colors"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${activityColors[activity.type] || 'bg-gray-100 text-gray-700'}`}>
                                    {activity.productEmoji || activityIcons[activity.type] || '📌'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-text-primary leading-relaxed">{activity.message}</p>
                                    <p className="text-[10px] text-text-muted mt-0.5">{timeAgo(activity.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
