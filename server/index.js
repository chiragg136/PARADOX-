const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors());
app.use(express.json());

// ─── Database Helpers ───
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── AI Logic: VESTOSCORE Calculation ───
function calculateVestoScore(product) {
  // VESTOSCORE = weighted combination of naturalness, health impact, price value
  const base = product.vestoScore || 5;
  return Math.round(base * 10) / 10;
}

// ─── AI Logic: Duplicate Detection ───
function detectDuplicates(items, newItem, products) {
  const db = readDB();
  const newProduct = db.products.find(p => p.id === newItem.productId);
  if (!newProduct) return null;

  // Filter items in the same category but different brand/product
  const duplicates = items.filter(item => {
    const existingProduct = db.products.find(p => p.id === item.productId);
    if (!existingProduct) return false;
    // Same category, different product ID = potential duplicate
    return existingProduct.category === newProduct.category && item.productId !== newItem.productId;
  });

  if (duplicates.length === 0) return null;

  // Find the best value option in the same category (price + quality score)
  const categoryProducts = db.products.filter(p => p.category === newProduct.category);
  const bestValue = categoryProducts.reduce((best, p) => {
    // Score based on 40% VESTOSCORE, 30% Rating, 30% Price Value
    const score = (p.vestoScore * 4) + (p.rating * 3) + ((100 - p.price) / 10);
    const bestScore = (best.vestoScore * 4) + (best.rating * 3) + ((100 - best.price) / 10);
    return score > bestScore ? p : best;
  }, categoryProducts[0]);

  return {
    type: 'duplicate_detected',
    category: newProduct.category,
    existingItems: duplicates.map(d => {
      const prod = db.products.find(p => p.id === d.productId);
      return { ...d, productName: prod?.name, price: prod?.price };
    }),
    newItem: { ...newItem, productName: newProduct.name, price: newProduct.price },
    suggestion: {
      message: `Multiple ${newProduct.category} items detected! Merge into best value option?`,
      bestValue: {
        productId: bestValue.id,
        name: bestValue.name,
        price: bestValue.price,
        vestoScore: bestValue.vestoScore,
        rating: bestValue.rating,
        savings: Math.max(0, newProduct.price - bestValue.price)
      }
    }
  };
}

// ─── AI Logic: Smart Cart Optimization ───
function optimizeCart(cart) {
  const db = readDB();
  const suggestions = [];
  const categoryGroups = {};

  // Group items by category
  cart.items.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) return;
    if (!categoryGroups[product.category]) {
      categoryGroups[product.category] = [];
    }
    categoryGroups[product.category].push({ ...item, product });
  });

  // Check for optimization opportunities
  Object.entries(categoryGroups).forEach(([category, items]) => {
    if (items.length > 1) {
      const totalCost = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const avgVestoScore = items.reduce((sum, i) => sum + i.product.vestoScore, 0) / items.length;

      // Find if there's a better single option
      const categoryProducts = db.products.filter(p => p.category === category);
      const bestOption = categoryProducts.reduce((best, p) => {
        const score = p.vestoScore * 0.5 + p.rating * 0.3 + (1 / p.price) * 100 * 0.2;
        const bestScore = best.vestoScore * 0.5 + best.rating * 0.3 + (1 / best.price) * 100 * 0.2;
        return score > bestScore ? p : best;
      }, categoryProducts[0]);

      if (bestOption) {
        suggestions.push({
          type: 'merge_suggestion',
          category,
          currentItems: items.map(i => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
          totalCurrentCost: totalCost,
          suggestedProduct: bestOption,
          potentialSavings: Math.max(0, totalCost - bestOption.price * items.reduce((s, i) => s + i.quantity, 0)),
          vestoImprovement: Math.round((bestOption.vestoScore - avgVestoScore) * 10) / 10
        });
      }
    }

    // Health score warnings
    items.forEach(i => {
      if (i.product.vestoScore < 5) {
        const betterOptions = db.products.filter(p => p.category === category && p.vestoScore > 7);
        if (betterOptions.length > 0) {
          suggestions.push({
            type: 'health_upgrade',
            currentItem: { name: i.product.name, vestoScore: i.product.vestoScore },
            betterOption: betterOptions[0],
            message: `Swap ${i.product.name} (Vesto: ${i.product.vestoScore}) for ${betterOptions[0].name} (Vesto: ${betterOptions[0].vestoScore})?`
          });
        }
      }
    });
  });

  // Swarm Intelligence: trending items
  const trendingCategories = ['Dairy', 'Vegetables', 'Fruits'];
  const missingEssentials = trendingCategories.filter(cat => !categoryGroups[cat]);
  if (missingEssentials.length > 0) {
    suggestions.push({
      type: 'swarm_suggestion',
      message: `Trending categories missing from your cart: ${missingEssentials.join(', ')}`,
      categories: missingEssentials
    });
  }

  return suggestions;
}

// ─── REST API Routes ───

// Get all products
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// Search products
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  const db = readDB();
  const results = db.products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results);
});

// Get all users
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(Object.values(db.users));
});

// Create a shared cart
app.post('/api/carts', (req, res) => {
  const { ownerId, cartName } = req.body;
  const db = readDB();
  const cartId = uuidv4().slice(0, 8);
  const inviteCode = uuidv4().slice(0, 6).toUpperCase();

  const cart = {
    id: cartId,
    name: cartName || 'Shared Cart',
    ownerId,
    members: [ownerId],
    items: [],
    inviteCode,
    createdAt: new Date().toISOString(),
    activity: [{
      type: 'cart_created',
      userId: ownerId,
      message: `${db.users[ownerId]?.name || 'Someone'} created the cart`,
      timestamp: new Date().toISOString()
    }],
    suggestions: [],
    optimizationScore: 100
  };

  db.carts[cartId] = cart;
  writeDB(db);

  io.emit('cart_created', cart);
  res.json(cart);
});

// Get cart by ID
app.get('/api/carts/:cartId', (req, res) => {
  const db = readDB();
  const cart = db.carts[req.params.cartId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  // Enrich items with product data
  const enrichedCart = {
    ...cart,
    items: cart.items.map(item => {
      const product = db.products.find(p => p.id === item.productId);
      return { ...item, product };
    }),
    memberDetails: cart.members.map(mId => db.users[mId]).filter(Boolean)
  };

  res.json(enrichedCart);
});

// Join cart via invite code
app.post('/api/carts/join', (req, res) => {
  const { inviteCode, userId } = req.body;
  const db = readDB();

  const cart = Object.values(db.carts).find(c => c.inviteCode === inviteCode);
  if (!cart) return res.status(404).json({ error: 'Invalid invite code' });

  if (!cart.members.includes(userId)) {
    cart.members.push(userId);
    cart.activity.unshift({
      type: 'member_joined',
      userId,
      message: `${db.users[userId]?.name || 'Someone'} joined the cart`,
      timestamp: new Date().toISOString()
    });
    writeDB(db);
  }

  io.to(cart.id).emit('cart_updated', cart);
  io.emit('member_joined', { cartId: cart.id, userId, user: db.users[userId] });
  res.json(cart);
});

// Add item to cart
app.post('/api/carts/:cartId/items', (req, res) => {
  const { productId, quantity, userId } = req.body;
  const db = readDB();
  const cart = db.carts[req.params.cartId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Check for exact duplicates
  const existingItem = cart.items.find(i => i.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    const newItem = {
      id: uuidv4().slice(0, 8),
      productId,
      quantity: quantity || 1,
      addedBy: userId,
      addedAt: new Date().toISOString()
    };

    // AI: Detect category duplicates
    const duplicateInfo = detectDuplicates(cart.items, newItem, db.products);

    cart.items.push(newItem);

    if (duplicateInfo) {
      cart.suggestions.push({
        id: uuidv4().slice(0, 8),
        ...duplicateInfo,
        createdAt: new Date().toISOString()
      });
      io.to(cart.id).emit('suggestion', duplicateInfo);
    }
  }

  // Activity log
  cart.activity.unshift({
    type: 'item_added',
    userId,
    message: `${db.users[userId]?.name || 'Someone'} added ${product.name}`,
    productName: product.name,
    productEmoji: product.image,
    timestamp: new Date().toISOString()
  });

  // Recalculate optimization
  cart.suggestions = [];
  const newSuggestions = optimizeCart(cart);
  cart.suggestions = newSuggestions.map(s => ({
    id: uuidv4().slice(0, 8),
    ...s,
    createdAt: new Date().toISOString()
  }));

  // Calculate optimization score
  const totalItems = cart.items.length;
  const healthyItems = cart.items.filter(i => {
    const p = db.products.find(pr => pr.id === i.productId);
    return p && p.vestoScore >= 7;
  }).length;
  cart.optimizationScore = totalItems > 0 ? Math.round((healthyItems / totalItems) * 100) : 100;

  writeDB(db);

  // Emit real-time update
  const enrichedCart = {
    ...cart,
    items: cart.items.map(item => ({
      ...item,
      product: db.products.find(p => p.id === item.productId)
    })),
    memberDetails: cart.members.map(mId => db.users[mId]).filter(Boolean)
  };

  io.to(cart.id).emit('cart_updated', enrichedCart);
  io.emit('cart_updated', enrichedCart);

  res.json(enrichedCart);
});

// Remove item from cart
app.delete('/api/carts/:cartId/items/:itemId', (req, res) => {
  const db = readDB();
  const cart = db.carts[req.params.cartId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  const itemIndex = cart.items.findIndex(i => i.id === req.params.itemId);
  if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

  const removedItem = cart.items[itemIndex];
  const product = db.products.find(p => p.id === removedItem.productId);

  cart.items.splice(itemIndex, 1);

  cart.activity.unshift({
    type: 'item_removed',
    userId: req.body.userId || removedItem.addedBy,
    message: `${product?.name || 'An item'} was removed`,
    timestamp: new Date().toISOString()
  });

  // Recalculate suggestions
  cart.suggestions = optimizeCart(cart).map(s => ({
    id: uuidv4().slice(0, 8),
    ...s,
    createdAt: new Date().toISOString()
  }));

  writeDB(db);

  const enrichedCart = {
    ...cart,
    items: cart.items.map(item => ({
      ...item,
      product: db.products.find(p => p.id === item.productId)
    })),
    memberDetails: cart.members.map(mId => db.users[mId]).filter(Boolean)
  };

  io.to(cart.id).emit('cart_updated', enrichedCart);
  io.emit('cart_updated', enrichedCart);

  res.json(enrichedCart);
});

// Apply merge suggestion
app.post('/api/carts/:cartId/merge', (req, res) => {
  const { suggestionId, acceptedProductId, userId } = req.body;
  const db = readDB();
  const cart = db.carts[req.params.cartId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  const product = db.products.find(p => p.id === acceptedProductId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Remove all items in the same category
  const itemsToRemove = cart.items.filter(item => {
    const p = db.products.find(pr => pr.id === item.productId);
    return p && p.category === product.category;
  });

  const totalQty = itemsToRemove.reduce((s, i) => s + i.quantity, 0);

  cart.items = cart.items.filter(item => {
    const p = db.products.find(pr => pr.id === item.productId);
    return !p || p.category !== product.category;
  });

  // Add the merged best option
  cart.items.push({
    id: uuidv4().slice(0, 8),
    productId: acceptedProductId,
    quantity: Math.max(1, totalQty),
    addedBy: userId,
    addedAt: new Date().toISOString(),
    merged: true
  });

  // Remove the applied suggestion
  cart.suggestions = cart.suggestions.filter(s => s.id !== suggestionId);

  cart.activity.unshift({
    type: 'items_merged',
    userId,
    message: `${db.users[userId]?.name || 'Someone'} merged ${product.category} items into ${product.name}`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);

  const enrichedCart = {
    ...cart,
    items: cart.items.map(item => ({
      ...item,
      product: db.products.find(p => p.id === item.productId)
    })),
    memberDetails: cart.members.map(mId => db.users[mId]).filter(Boolean)
  };

  io.to(cart.id).emit('cart_updated', enrichedCart);
  io.emit('cart_updated', enrichedCart);

  res.json(enrichedCart);
});

// Get optimization suggestions for a cart
app.get('/api/carts/:cartId/optimize', (req, res) => {
  const db = readDB();
  const cart = db.carts[req.params.cartId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  const suggestions = optimizeCart(cart);
  res.json(suggestions);
});

// Get all carts for a user
app.get('/api/users/:userId/carts', (req, res) => {
  const db = readDB();
  const userCarts = Object.values(db.carts).filter(c =>
    c.members.includes(req.params.userId)
  );
  res.json(userCarts);
});

// ─── Socket.io Real-Time ───
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on('join_cart', (cartId) => {
    socket.join(cartId);
    console.log(`📦 Socket ${socket.id} joined cart ${cartId}`);
  });

  socket.on('leave_cart', (cartId) => {
    socket.leave(cartId);
    console.log(`📤 Socket ${socket.id} left cart ${cartId}`);
  });

  socket.on('typing', (data) => {
    socket.to(data.cartId).emit('user_typing', data);
  });

  socket.on('cursor_move', (data) => {
    socket.to(data.cartId).emit('cursor_update', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// ─── Start Server ───
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 VESTOCART Collaborative Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections`);
  console.log(`📦 Database loaded from ${DB_PATH}\n`);
});
