import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

export default function ProductSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const products = useStore(s => s.products);
    const addItem = useStore(s => s.addItem);
    const currentUser = useStore(s => s.currentUser);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (value) => {
        setQuery(value);
        if (!value.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.category.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
        setIsOpen(true);
    };

    const handleAdd = (product) => {
        addItem(product.id);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    // Group results by category
    const groupedResults = results.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {});

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Search Input */}
            <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder="Search products... (milk, tomato, rice)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none text-sm text-text-primary placeholder:text-text-muted transition-all"
                    id="product-search"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-alt flex items-center justify-center hover:bg-border transition-colors cursor-pointer"
                    >
                        <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-xl shadow-black/10 border border-border/50 max-h-80 overflow-y-auto z-30 pop-in">
                    {Object.entries(groupedResults).map(([category, items]) => (
                        <div key={category}>
                            <div className="px-3 py-1.5 bg-surface-alt/50">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{category}</span>
                            </div>
                            {items.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => handleAdd(product)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-50/50 transition-colors cursor-pointer border-b border-border-light last:border-0"
                                    id={`product-${product.id}`}
                                >
                                    <span className="text-xl w-8 text-center">{product.image}</span>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-text-primary">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-semibold text-primary-600">₹{product.price}</span>
                                            <span className="text-xs text-text-muted">/{product.unit}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${product.vestoScore >= 8 ? 'bg-green-100 text-green-700' : product.vestoScore >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            VESTOSCORE {product.vestoScore}
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span className="text-[10px] text-text-muted">{product.rating}</span>
                                        </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-xl p-6 text-center z-30 pop-in">
                    <span className="text-2xl mb-2 block">🔍</span>
                    <p className="text-sm text-text-secondary">No products found for "{query}"</p>
                </div>
            )}
        </div>
    );
}
