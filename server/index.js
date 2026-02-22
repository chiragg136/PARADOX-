const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());

// Mock MongoDB connection if no URI provided
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vestocart';

// Connect to MongoDB (optional for demo)
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error (ignoring for now):', err.message));

// Schema for Price History (if needed)
const PriceHistorySchema = new mongoose.Schema({
    product: String,
    price: Number,
    timestamp: { type: Date, default: Date.now }
});
const PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);

app.get('/market-intelligence', async (req, res) => {
    const { product, days = 30 } = req.query;
    if (!product) {
        return res.status(400).json({ error: 'Product name is required' });
    }

    try {
        // Call AI Service
        const response = await axios.get(`${AI_SERVICE_URL}/market-intelligence`, {
            params: { product, days }
        });

        // Log to Price History if DB is available
        if (mongoose.connection.readyState === 1) {
            await PriceHistory.create({ product, price: response.data.current_price });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error calling AI service:', error.message);
        res.status(500).json({ error: 'Failed to fetch predictions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
