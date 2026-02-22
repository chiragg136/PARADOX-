import React from 'react';
import { ShoppingCart, TrendingUp, Zap, Star } from 'lucide-react';
import VistoBadge from './VistoBadge';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onInteract }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 flex flex-col gap-4 relative overflow-hidden group"
        >
            {/* Visual background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-vesto-green/5 rounded-full group-hover:scale-150 transition-transform duration-500" />

            <div className="flex justify-between items-start z-10">
                <div className="flex gap-4">
                    {product.image && (
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    )}
                    <div>
                        <span className="text-[10px] font-bold text-vesto-green uppercase tracking-[0.2em] bg-vesto-green/5 px-2 py-0.5 rounded-full">{product.category}</span>
                        <h3 className="text-lg font-black text-gray-800 leading-tight mt-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{product.brand}</p>
                            <span className="text-gray-300">•</span>
                            <span className="text-[10px] text-gray-500 font-medium italic">{product.origin}</span>
                        </div>
                    </div>
                </div>
                <VistoBadge score={product.vistoScore} size="md" />
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm z-10">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-700">{product.rating || 0}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    <TrendingUp size={14} className="text-vesto-green" />
                    <span className="font-bold text-gray-700">{(product.selectionCount || 0).toLocaleString()} picks</span>
                </div>
            </div>

            <div className="flex justify-between items-end mt-auto z-10 pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900">₹{product.price || 0}</span>
                    {product.priceHistory && product.priceHistory.length > 1 && (
                        <span className="text-[10px] text-gray-400 line-through tracking-wider">₹{product.priceHistory[0]}</span>
                    )}
                </div>

                <button
                    onClick={() => onInteract(product._id, 'cart')}
                    className="bg-vesto-green hover:bg-vesto-green-dark text-white p-3 rounded-2xl transition-all shadow-lg shadow-vesto-green/20 group-hover:scale-110 active:scale-95"
                >
                    <ShoppingCart size={20} />
                </button>
            </div>

            {/* Trust Indicator */}
            {product.vistoScore >= 8.5 && (
                <div className="absolute top-0 left-0 w-1 h-full bg-vesto-green" />
            )}
        </motion.div>
    );
};

export default ProductCard;
