'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart, getCartTotal } from '@/app/CallApi/cart';



const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Fetch cart items - memoized with useCallback
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const items = await getCartItems();
      setCartItems(items);
      
      // Calculate total and count
      const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      setTotal(totalPrice);
      setItemCount(totalCount);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Only clear cart if it's a 401 error (unauthorized)
      if (error.status === 401) {
        setCartItems([]);
        setTotal(0);
        setItemCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any state

  // Add item to cart
  const addItemToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await addToCart({ product_id: productId, quantity });
      await fetchCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      await updateCartItemQuantity(cartItemId, quantity);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId) => {
    try {
      setLoading(true);
      await removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCartItems = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCartItems([]);
      setTotal(0);
      setItemCount(0);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem('auth_token');
  };

  // Load cart on mount and when auth changes
  useEffect(() => {
    if (isLoggedIn()) {
      fetchCart();
    } else {
      setCartItems([]);
      setTotal(0);
      setItemCount(0);
    }
  }, [fetchCart]);

  const value = {
    cartItems,
    loading,
    total,
    itemCount,
    addItemToCart,
    updateItemQuantity,
    removeItem,
    clearCartItems,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}