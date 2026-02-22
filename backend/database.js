const products = [
    // Grains & Pulses
    { _id: "g1", name: "Premium Aged Basmati Rice", brand: "India Gate", origin: "India", category: "Grains", price: 185.00, rating: 4.8, nutritionScore: 9, selectionCount: 850, priceHistory: [195, 185], image: "https://www.indiagatebasmatirice.com/images/products/classic.png" },
    { _id: "g2", name: "Organic White Quinoa", brand: "Bob's Red Mill", origin: "USA", category: "Grains", price: 450.00, rating: 4.9, nutritionScore: 10, selectionCount: 1200, priceHistory: [470, 450], image: "https://m.media-amazon.com/images/I/81+XN5Z8X8L._SL1500_.jpg" },
    { _id: "g3", name: "Steel Cut Oats", brand: "Quaker", origin: "UK", category: "Grains", price: 299.00, rating: 4.7, nutritionScore: 9, selectionCount: 650, priceHistory: [310, 299], image: "https://m.media-amazon.com/images/I/81xU4+wQvML._SL1500_.jpg" },
    { _id: "g4", name: "Peshawari Chole (Chickpeas)", brand: "Tata Sampann", origin: "India", category: "Pulses", price: 95.00, rating: 4.6, nutritionScore: 8, selectionCount: 1400, priceHistory: [105, 95], image: "https://m.media-amazon.com/images/I/71Yy3I0A7eL._SL1500_.jpg" },

    // Beverages
    { _id: "b1", name: "Attikan Estate Coffee", brand: "Blue Tokai", origin: "India", category: "Beverages", price: 540.00, rating: 4.9, nutritionScore: 8, selectionCount: 2200, priceHistory: [540, 540], image: "https://m.media-amazon.com/images/I/61K-kX+yW6L._SL1200_.jpg" },
    { _id: "b2", name: "Classic Energy Drink", brand: "Red Bull", origin: "Austria", category: "Beverages", price: 125.00, rating: 4.4, nutritionScore: 4, selectionCount: 5000, priceHistory: [125, 125], image: "https://m.media-amazon.com/images/I/61T7Y4T-YFL._SL1500_.jpg" },
    { _id: "b3", name: "Earl Grey Tea", brand: "Twinings", origin: "UK", category: "Beverages", price: 350.00, rating: 4.8, nutritionScore: 9, selectionCount: 1800, priceHistory: [360, 350], image: "https://m.media-amazon.com/images/I/71EIsy2O-jL._SL1500_.jpg" },
    { _id: "b4", name: "Sparkling Water", brand: "Perrier", origin: "France", category: "Beverages", price: 110.00, rating: 4.5, nutritionScore: 10, selectionCount: 950, priceHistory: [120, 110], image: "https://m.media-amazon.com/images/I/51rEx6X7P1L._SL1200_.jpg" },

    // Snacks & Chocolates
    { _id: "s1", name: "Sea Salt Kettle Chips", brand: "Lay's Gourmet", origin: "USA", category: "Snacks", price: 60.00, rating: 4.6, nutritionScore: 3, selectionCount: 3500, priceHistory: [60, 60], image: "https://m.media-amazon.com/images/I/71b2eJ6SGoL._SL1500_.jpg" },
    { _id: "s2", name: "Excellence 85% Dark", brand: "Lindt", origin: "Switzerland", category: "Confectionery", price: 250.00, rating: 4.9, nutritionScore: 7, selectionCount: 2800, priceHistory: [275, 250], image: "https://m.media-amazon.com/images/I/71-YqI8K9DL._SL1500_.jpg" },
    { _id: "s3", name: "Rocher Premium Box", brand: "Ferrero", origin: "Italy", category: "Confectionery", price: 899.00, rating: 5.0, nutritionScore: 2, selectionCount: 4200, priceHistory: [950, 899], image: "https://m.media-amazon.com/images/I/71Xm3pE+Y8L._SL1500_.jpg" },
    { _id: "s4", name: "Digestive Biscuits", brand: "McVitie's", origin: "UK", category: "Snacks", price: 85.00, rating: 4.5, nutritionScore: 6, selectionCount: 1200, priceHistory: [85, 85], image: "https://m.media-amazon.com/images/I/81xU4+wQvML._SL1500_.jpg" },

    // Dairy & Healthy
    { _id: "d1", name: "Greek Yogurt Plain", brand: "Epigamia", origin: "India", category: "Dairy", price: 70.00, rating: 4.8, nutritionScore: 10, selectionCount: 1600, priceHistory: [70, 70], image: "https://m.media-amazon.com/images/I/61C2rP6lVFL._SL1100_.jpg" },
    { _id: "d2", name: "Cream Cheese Spread", brand: "Philadelphia", origin: "USA", category: "Dairy", price: 399.00, rating: 4.7, nutritionScore: 5, selectionCount: 1100, priceHistory: [420, 399], image: "https://m.media-amazon.com/images/I/51rEx6X7P1L._SL1200_.jpg" },
    { _id: "d3", name: "Unsweetened Almond Milk", brand: "Alpro", origin: "Belgium", category: "Dairy Alternatives", price: 299.00, rating: 4.7, nutritionScore: 9, selectionCount: 850, priceHistory: [310, 299], image: "https://m.media-amazon.com/images/I/61K-kX+yW6L._SL1200_.jpg" },
    { _id: "d4", name: "Chia Seeds Organic", brand: "True Elements", origin: "India", category: "Healthy", price: 240.00, rating: 4.9, nutritionScore: 10, selectionCount: 1900, priceHistory: [260, 240], image: "https://m.media-amazon.com/images/I/71Yy3I0A7eL._SL1500_.jpg" }
];

module.exports = products;
