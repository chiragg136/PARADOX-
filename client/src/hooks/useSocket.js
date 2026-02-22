import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

const SOCKET_URL = 'http://localhost:3001';

export function useSocket(cartId) {
    const socketRef = useRef(null);
    const updateCartFromSocket = useStore(s => s.updateCartFromSocket);
    const setShowSuggestion = useStore(s => s.setShowSuggestion);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling']
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🟢 Connected to server');
            if (cartId) {
                socket.emit('join_cart', cartId);
            }
        });

        socket.on('cart_updated', (cart) => {
            updateCartFromSocket(cart);
        });

        socket.on('suggestion', (suggestion) => {
            setShowSuggestion(suggestion);
        });

        socket.on('member_joined', (data) => {
            console.log('👤 New member joined:', data);
        });

        socket.on('disconnect', () => {
            console.log('🔴 Disconnected from server');
        });

        return () => {
            if (cartId) {
                socket.emit('leave_cart', cartId);
            }
            socket.disconnect();
        };
    }, [cartId]);

    return socketRef;
}
