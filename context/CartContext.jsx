'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) { 
      try { setCart(JSON.parse(saved)); } catch (e) {} 
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      // Create a unique ID based on product ID + selected variants
      const cartItemId = `${product.id}-${product.size || 'default'}-${product.color || 'default'}`;
      
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        // If item exists, increase qty by the requested amount (default to 1 if not set)
        return prev.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, qty: item.qty + (product.qty || 1) } 
            : item
        );
      }
      
      // If new item, add it with the requested qty (default to 1)
      return [...prev, { 
        ...product, 
        cartItemId, 
        qty: product.qty || 1 
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (cartItemId, qty) => {
    if (qty <= 0) return removeFromCart(cartItemId);
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, qty } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);