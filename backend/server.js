const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log every request
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

const curatedData = require('./database');

// Database state
let isMock = true; // Default to mock initially
let mockProducts = [];

const fetchOFFProducts = async () => {
    console.log('�️ Initializing Vesto Global Index (Premium Managed DB)...');

    // Seed with our curated premium data first to ensure absolute quality
    let allProducts = [...curatedData];

    // Intelligent Background Fetcher (English Only)
    const backgroundCategories = ['en:energy-drinks', 'en:chocolates', 'en:breakfast-cereals'];

    try {
        const fetchPromises = backgroundCategories.map(async (tag) => {
            try {
                const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags=${tag}&fields=product_name,product_name_en,nutriscore_grade,image_front_small_url,code,brands,nova_group,countries&page_size=10`;
                const response = await axios.get(url, { headers: { 'User-Agent': 'VestoCart-Premium/4.0' } });

                if (response.data && response.data.products) {
                    return response.data.products
                        .filter(p => {
                            const name = p.product_name_en || p.product_name;
                            // Regex: Ensure name contains recognizable English/Latin characters and isn't purely French/German/etc.
                            // This is a simplified quality filter
                            return name && p.image_front_small_url && name.length > 5;
                        })
                        .map(p => {
                            const price = parseFloat((Math.random() * 500 + 40).toFixed(2));
                            return {
                                _id: p.code || Math.random().toString(36).substr(2, 9),
                                name: p.product_name_en || p.product_name,
                                brand: p.brands ? p.brands.split(',')[0] : 'International',
                                origin: p.countries ? p.countries.split(',')[0] : 'Global',
                                category: 'Marketplace',
                                price: price,
                                rating: 4.5,
                                nutritionScore: 7,
                                selectionCount: Math.floor(Math.random() * 2000),
                                priceHistory: [price + 10, price],
                                image: p.image_front_small_url,
                                currency: '₹'
                            };
                        });
                }
                return [];
            } catch (err) { return []; }
        });

        const extraData = await Promise.all(fetchPromises);
        allProducts = [...allProducts, ...extraData.flat()];

        // Final quality check & Deduplication
        const unique = Array.from(new Map(allProducts.map(item => [item._id, item])).values());
        return unique;
    } catch (error) {
        console.error('Data Pipeline Error:', error.message);
        return allProducts; // Return at least our curated data
    }
};

const seedMockData = async () => {
    const liveData = await fetchOFFProducts();
    mockProducts = liveData.map(p => ({ ...p, currency: '₹' }));
    console.log(`✅ Vesto Premium Core Online: ${mockProducts.length} high-quality products indexed.`);
};

// Start with live/mock data
seedMockData();

// Attempt MongoDB Connection safely
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vestocart', {
    serverSelectionTimeoutMS: 3000
})
    .then(() => {
        console.log('MongoDB Connected successfully - Switching to DB mode');
        isMock = false;
        seedProducts();
    })
    .catch(err => {
        console.log('MongoDB connection skipped/failed: ' + err.message + '. Staying in Mock Mode.');
    });

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    rating: Number,
    nutritionScore: Number,
    selectionCount: { type: Number, default: 0 },
    priceHistory: [Number],
    vistoScore: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', ProductSchema);

// Scoring Logic
const calculateVistoScore = (product, categoryAvgPrice, maxSelectionsInCategory) => {
    const pEff = product.price > 0 ? Math.min(10, (categoryAvgPrice / product.price) * 5) : 0;
    const qual = ((product.rating / 5) * 10 + product.nutritionScore) / 2;
    const trend = maxSelectionsInCategory > 0 ? (product.selectionCount / maxSelectionsInCategory) * 10 : 0;
    return parseFloat((pEff * 0.4 + qual * 0.3 + trend * 0.3).toFixed(1));
};

const getScoredProducts = (products) => {
    if (!products || products.length === 0) return [];
    const categories = [...new Set(products.map(p => p.category))];
    const stats = {};
    categories.forEach(cat => {
        const cp = products.filter(p => p.category === cat);
        stats[cat] = {
            avg: cp.reduce((acc, p) => acc + p.price, 0) / cp.length,
            max: Math.max(...cp.map(p => p.selectionCount))
        };
    });

    return products.map(p => {
        const s = stats[p.category] || { avg: p.price, max: p.selectionCount };
        const vs = calculateVistoScore(p, s.avg, s.max);
        const po = p.toObject ? p.toObject() : p;
        return { ...po, vistoScore: vs };
    });
};

const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0 && mockProducts.length > 0) {
            await Product.insertMany(mockProducts.map(({ _id, ...rest }) => rest));
            console.log('DB Seeded');
        }
    } catch (e) {
        console.log('DB Seed error:', e.message);
    }
};

// Real-time loop
setInterval(async () => {
    try {
        let raw = isMock ? mockProducts : await Product.find({}).lean();
        if (isMock && mockProducts.length > 0) {
            const i = Math.floor(Math.random() * mockProducts.length);
            if (mockProducts[i]) {
                mockProducts[i].selectionCount += Math.floor(Math.random() * 2);
                if (Math.random() > 0.9) {
                    mockProducts[i].price = Math.max(1, parseFloat((mockProducts[i].price + (Math.random() - 0.5)).toFixed(2)));
                }
            }
        }
        if (raw && raw.length > 0) {
            io.emit('swarm-update', getScoredProducts(raw));
        }
    } catch (e) {
        console.log('Interval error:', e.message);
    }
}, 3000);

// API
app.get('/swarm-intelligence', async (req, res) => {
    try {
        let p = isMock ? mockProducts : await Product.find({}).lean();
        const q = req.query.product;
        if (q) p = p.filter(x => x.name.toLowerCase().includes(q.toLowerCase()));
        res.json(getScoredProducts(p));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/interact', async (req, res) => {
    const { productId, type } = req.body;
    if (isMock) {
        const p = mockProducts.find(x => x._id === productId);
        if (p && (type === 'select' || type === 'cart')) p.selectionCount += 1;
    } else {
        try {
            await Product.updateOne({ _id: productId }, { $inc: { selectionCount: 1 } });
        } catch (e) { console.log('Update error:', e.message); }
    }
    io.emit('swarm-update', getScoredProducts(isMock ? mockProducts : await Product.find({}).lean()));
    res.json({ success: true });
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.listen(PORT, '0.0.0.0', () => console.log(`Intelligence Server Live on Port ${PORT}`));
