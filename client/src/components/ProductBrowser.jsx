import React from 'react';
import useStore from '../store/useStore';

export default function ProductBrowser() {
    const products = useStore(s => s.products);
    const addItem = useStore(s => s.addItem);
    const currentCart = useStore(s => s.currentCart);

    if (!currentCart) return null;

    // Group products by category
    const grouped = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {});

    return (
        <div className="glass-strong rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50">
                <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
                    <span>📦</span>
                    Browse Products
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Click any product to add to cart</p>
            </div>

            <div className="max-h-[450px] overflow-y-auto p-3 space-y-4">
                {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{category}</span>
                            <div className="flex-1 h-px bg-border-light" />
                            <span className="text-[10px] text-text-muted">{items.length}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            {items.map(product => {
                                // Check if already in cart
                                const inCart = currentCart.items?.some(i => i.productId === product.id);

                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => addItem(product.id)}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer text-left ${inCart ? 'bg-primary-50 border border-primary-200' : 'bg-white border border-border-light hover:border-primary-300 hover:bg-primary-50/30'}`}
                                        id={`browse-product-${product.id}`}
                                    >
                                        <span className="text-lg w-7 text-center">{product.image}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-text-primary truncate">{product.name}</p>
                                            <p className="text-[10px] text-text-muted">₹{product.price}/{product.unit}</p>
                                        </div>
                                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${product.vestoScore >= 8 ? 'bg-green-100 text-green-700' : product.vestoScore >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.vestoScore}
                                        </div>
                                        {inCart ? (
                                            <span className="text-[9px] font-bold text-primary-600">✓</span>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
