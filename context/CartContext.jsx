'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) { try { setCart(JSON.parse(saved)); } catch (e) {} }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      // Create a unique ID based on product ID + selected variants
      const cartItemId = `${product.id}-${product.size || 'default'}-${product.color || 'default'}`;
      
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, cartItemId, qty: 1 }];
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