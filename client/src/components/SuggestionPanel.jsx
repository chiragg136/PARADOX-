import React from 'react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuggestionPanel() {
    const currentCart = useStore(s => s.currentCart);
    const applyMerge = useStore(s => s.applyMerge);
    const setShowSuggestion = useStore(s => s.setShowSuggestion);

    if (!currentCart) return null;

    const suggestions = currentCart.suggestions || [];

    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {suggestions.map((suggestion, index) => {
                    if (suggestion.type === 'merge_suggestion' || suggestion.type === 'duplicate_detected') {
                        return (
                            <motion.div
                                key={suggestion.id || index}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-strong rounded-2xl border-2 border-primary-200 overflow-hidden shadow-xl shadow-primary-500/10"
                            >
                                {/* Premium AI Header */}
                                <div className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
                                        🤖
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-tighter">Smart Merge Detected</p>
                                        <p className="text-[10px] text-primary-100 font-medium italic">VESTOCART AI Optimization</p>
                                    </div>
                                    <button
                                        onClick={() => {/* dismiss */ }}
                                        className="ml-auto text-white/60 hover:text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Content Body */}
                                <div className="p-4 bg-white/50">
                                    <p className="text-sm font-bold text-text-primary mb-4 leading-tight">
                                        {suggestion.suggestion?.message || `We found multiple ${suggestion.category} items. Should we merge them into the best value option?`}
                                    </p>

                                    {/* Optimization Showcase */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white rounded-xl p-3 border border-border/50 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-1">
                                                <span className="text-[8px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">CURRENT</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-text-muted mb-1">Total Cost</p>
                                            <p className="text-lg font-black text-text-primary">₹{suggestion.totalCurrentCost || suggestion.newItem?.price * 2}</p>
                                        </div>
                                        <div className="bg-primary-50 rounded-xl p-3 border border-primary-200 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-1">
                                                <span className="text-[8px] font-black text-primary-600 bg-white px-1.5 py-0.5 rounded-full">AI PICK</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-primary-600 mb-1">Optimized Cost</p>
                                            <p className="text-lg font-black text-primary-700">₹{suggestion.suggestedProduct?.price || suggestion.suggestion?.bestValue?.price}</p>
                                        </div>
                                    </div>

                                    {/* Product Comparison Detail */}
                                    {(suggestion.suggestedProduct || suggestion.suggestion?.bestValue) && (
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-primary-50/50 to-white rounded-xl border border-primary-100 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm italic">
                                                {suggestion.suggestedProduct?.image || '✨'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black text-text-primary">{suggestion.suggestedProduct?.name || suggestion.suggestion?.bestValue?.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">Save ₹{suggestion.potentialSavings || suggestion.suggestion?.bestValue?.savings}</span>
                                                    <span className="text-[10px] font-black text-primary-600 underline decoration-dotted">VESTOSCORE {suggestion.suggestedProduct?.vestoScore || suggestion.suggestion?.bestValue?.vestoScore}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const productId = suggestion.suggestedProduct?.id || suggestion.suggestion?.bestValue?.productId;
                                                if (productId) applyMerge(suggestion.id, productId);
                                            }}
                                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-black shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            🚀 Smart Merge Now
                                        </button>
                                        <button
                                            className="py-3 px-4 rounded-xl bg-surface-alt text-text-muted text-xs font-bold hover:bg-border transition-colors cursor-pointer"
                                        >
                                            Ignore
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    if (suggestion.type === 'health_upgrade') {
                        return (
                            <motion.div
                                key={suggestion.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-strong rounded-2xl border-l-4 border-blue-500 p-4 shadow-lg"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">💊</div>
                                    <p className="text-xs font-black text-blue-700 uppercase tracking-wider">Health Upgrade</p>
                                </div>
                                <p className="text-sm font-bold text-text-primary mb-3">{suggestion.message}</p>
                                <button
                                    onClick={() => {
                                        if (suggestion.betterOption) applyMerge(suggestion.id, suggestion.betterOption.id);
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-xs font-black hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                                >
                                    Swap for Healthier Option →
                                </button>
                            </motion.div>
                        );
                    }

                    return null;
                })}
            </AnimatePresence>
        </div>
    );
}
