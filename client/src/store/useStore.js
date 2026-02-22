import { create } from 'zustand';

const API_BASE = 'http://localhost:3001/api';

const useStore = create((set, get) => ({
    // User state
    currentUser: null,
    users: [],

    // Cart state
    currentCart: null,
    userCarts: [],

    // Product state
    products: [],
    searchQuery: '',
    searchResults: [],

    // UI state
    isLoading: false,
    showSuggestion: null,
    activePanel: 'cart', // 'cart' | 'products' | 'activity'
    showInviteModal: false,
    showJoinModal: false,
    showCreateModal: false,

    // Actions
    setCurrentUser: (user) => set({ currentUser: user }),
    setActivePanel: (panel) => set({ activePanel: panel }),
    setShowInviteModal: (show) => set({ showInviteModal: show }),
    setShowJoinModal: (show) => set({ showJoinModal: show }),
    setShowCreateModal: (show) => set({ showCreateModal: show }),
    setShowSuggestion: (suggestion) => set({ showSuggestion: suggestion }),

    // Fetch all users
    fetchUsers: async () => {
        try {
            const res = await fetch(`${API_BASE}/users`);
            const users = await res.json();
            set({ users });
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    },

    // Fetch products
    fetchProducts: async () => {
        try {
            const res = await fetch(`${API_BASE}/products`);
            const products = await res.json();
            set({ products });
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    },

    // Search products
    searchProducts: async (query) => {
        set({ searchQuery: query });
        if (!query.trim()) {
            set({ searchResults: [] });
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
            const results = await res.json();
            set({ searchResults: results });
        } catch (err) {
            console.error('Search failed:', err);
        }
    },

    // Create shared cart
    createCart: async (cartName) => {
        const { currentUser } = get();
        if (!currentUser) return;
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_BASE}/carts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ownerId: currentUser.id, cartName })
            });
            const cart = await res.json();
            set({ currentCart: cart, isLoading: false, showCreateModal: false });
            // Refresh user carts
            get().fetchUserCarts();
            return cart;
        } catch (err) {
            console.error('Failed to create cart:', err);
            set({ isLoading: false });
        }
    },

    // Fetch cart by ID
    fetchCart: async (cartId) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_BASE}/carts/${cartId}`);
            const cart = await res.json();
            set({ currentCart: cart, isLoading: false });
            return cart;
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            set({ isLoading: false });
        }
    },

    // Join cart via invite code
    joinCart: async (inviteCode) => {
        const { currentUser } = get();
        if (!currentUser) return;
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_BASE}/carts/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteCode, userId: currentUser.id })
            });
            if (!res.ok) throw new Error('Invalid invite code');
            const cart = await res.json();
            set({ isLoading: false, showJoinModal: false });
            get().fetchCart(cart.id);
            get().fetchUserCarts();
            return cart;
        } catch (err) {
            console.error('Failed to join cart:', err);
            set({ isLoading: false });
            throw err;
        }
    },

    // Add item to cart
    addItem: async (productId, quantity = 1) => {
        const { currentCart, currentUser } = get();
        if (!currentCart || !currentUser) return;
        try {
            const res = await fetch(`${API_BASE}/carts/${currentCart.id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity, userId: currentUser.id })
            });
            const updatedCart = await res.json();
            set({ currentCart: updatedCart });
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    },

    // Remove item from cart
    removeItem: async (itemId) => {
        const { currentCart, currentUser } = get();
        if (!currentCart) return;
        try {
            const res = await fetch(`${API_BASE}/carts/${currentCart.id}/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser?.id })
            });
            const updatedCart = await res.json();
            set({ currentCart: updatedCart });
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    },

    // Apply merge suggestion
    applyMerge: async (suggestionId, acceptedProductId) => {
        const { currentCart, currentUser } = get();
        if (!currentCart) return;
        try {
            const res = await fetch(`${API_BASE}/carts/${currentCart.id}/merge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suggestionId, acceptedProductId, userId: currentUser?.id })
            });
            const updatedCart = await res.json();
            set({ currentCart: updatedCart, showSuggestion: null });
        } catch (err) {
            console.error('Merge failed:', err);
        }
    },

    // Fetch user's carts
    fetchUserCarts: async () => {
        const { currentUser } = get();
        if (!currentUser) return;
        try {
            const res = await fetch(`${API_BASE}/users/${currentUser.id}/carts`);
            const carts = await res.json();
            set({ userCarts: carts });
        } catch (err) {
            console.error('Failed to fetch user carts:', err);
        }
    },

    // Update cart from socket
    updateCartFromSocket: (cart) => {
        const { currentCart } = get();
        if (currentCart && currentCart.id === cart.id) {
            set({ currentCart: cart });
        }
    }
}));

export default useStore;
