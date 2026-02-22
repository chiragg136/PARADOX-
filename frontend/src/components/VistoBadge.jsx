import React from 'react';
import { Sparkles } from 'lucide-react';

const VistoBadge = ({ score, size = 'md' }) => {
    const getBadgeColor = (s) => {
        if (s >= 8.5) return 'bg-vesto-green';
        if (s >= 7) return 'bg-emerald-500';
        if (s >= 5) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const sizes = {
        sm: 'p-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-lg',
    };

    return (
        <div className={`${getBadgeColor(score)} ${sizes[size]} visto-badge flex gap-1.5 items-center`}>
            <Sparkles size={size === 'lg' ? 20 : 14} className="animate-pulse" />
            <span>{score}</span>
            <span className="font-normal opacity-90">Visto</span>
        </div>
    );
};

export default VistoBadge;
