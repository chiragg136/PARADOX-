import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Users, Search, Info, TrendingUp, Award, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://127.0.0.1:5050';
const socket = io(API_BASE);

const SwarmIntelligence = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('trending');
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    const fetchProducts = async (query = '') => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE}/swarm-intelligence?product=${query}`);
            setProducts(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Failed to load intelligence data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(searchQuery);

        // REAL-TIME INTEGRATION via WebSockets
        socket.on('swarm-update', (updatedProducts) => {
            console.log('Real-time swarm update received');
            setLastUpdate(Date.now());

            // If we have a search query, filter the pushed data locally
            if (searchQuery) {
                setProducts(updatedProducts.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                ));
            } else {
                setProducts(updatedProducts);
            }
        });

        return () => {
            socket.off('swarm-update');
        };
    }, [searchQuery]);

    const handleInteract = async (productId, type) => {
        try {
            await axios.post(`${API_BASE}/interact`, { productId, type });
            // No need to fetch, socket will push the update
        } catch (err) {
            console.error(err);
        }
    };

    const trending = [...products].sort((a, b) => b.vistoScore - a.vistoScore).slice(0, 3);
    const communityPicks = [...products].sort((a, b) => b.selectionCount - a.selectionCount);
    const betterAlternatives = products.filter(p => p.vistoScore > 8.0);

    const getActiveList = () => {
        if (activeTab === 'trending') return trending;
        if (activeTab === 'community') return communityPicks;
        return betterAlternatives;
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] text-gray-900 pb-20">
            <header className="bg-white border-b border-gray-100 pt-12 pb-20 px-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-vesto-green/5 blur-3xl rounded-full -mr-20 -mt-20 z-0" />
                <div className="max-w-6xl mx-auto z-10 relative">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-4">
                        <div className="bg-vesto-green/10 p-2 rounded-xl">
                            <Users className="text-vesto-green" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-vesto-green font-bold tracking-widest uppercase text-xs">Intelligence Core</span>
                            <span className="text-[10px] text-gray-400 font-mono animate-pulse">Live Socket Connected (Last sync: {new Date(lastUpdate).toLocaleTimeString()})</span>
                        </div>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black text-gray-900 mb-6 max-w-2xl leading-none">
                        Swarm Intelligence <span className="text-vesto-green">+</span> Visto Score
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-500 max-w-xl mb-10">
                        Real-time community synchronization enabled. Watch the scores evolve as thousands of shoppers make decisions.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <Zap size={18} />, label: "40% Price Efficiency", color: "bg-blue-500" },
                            { icon: <Award size={18} />, label: "30% Quality Signal", color: "bg-purple-500" },
                            { icon: <TrendingUp size={18} />, label: "30% Community Trend", color: "bg-vesto-green" },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + (i * 0.1) }} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                                <div className={`${item.color} text-white p-2 rounded-lg`}>{item.icon}</div>
                                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto -mt-10 px-6">
                <div className="glass-card rounded-[2.5rem] p-8 mb-12">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products (try 'litchi')..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-vesto-green/50 outline-none transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
                            {['trending', 'community', 'alternatives'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-vesto-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab === 'trending' ? '🔥 Trending' : tab === 'community' ? '👥 Community' : '✨ Best Spec'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100">
                            <Info size={20} />
                            <p className="font-medium text-sm">{error}</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {loading && !products.length ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => <div key={i} className="bg-gray-50 h-64 rounded-3xl animate-pulse" />)}
                            </motion.div>
                        ) : (
                            <motion.div key={activeTab + searchQuery} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {getActiveList().length > 0 ? (
                                    getActiveList().map((product) => (
                                        <ProductCard key={product._id} product={product} onInteract={handleInteract} />
                                    ))
                                ) : (
                                    <div className="col-span-3 py-20 text-center">
                                        <Info className="mx-auto text-gray-300 mb-4" size={48} />
                                        <p className="text-gray-500 font-medium">No results found for your smart search.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default SwarmIntelligence;
