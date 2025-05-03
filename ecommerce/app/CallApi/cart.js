// lib/api/cart.js
// API functions for cart-related endpoints

import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Get all cart items
 * @returns {Promise<Array>} List of cart items
 */
export const getCartItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    throw error;
  }
};

/**
 * Add item to cart
 * @param {Object} cartItem - Cart item data (product_id, quantity)
 * @returns {Promise<Object>} Created cart item
 */
export const addToCart = async (cartItem) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cartItem),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param {number} cartItemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart item
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}/update_quantity/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to update cart item quantity:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 * @param {number} cartItemId - Cart item ID
 * @returns {Promise<void>}
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw error;
  }
};

/**
 * Clear all cart items
 * @returns {Promise<void>}
 */
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
};

/**
 * Get cart total and count
 * @returns {Promise<Object>} Cart total and count
 */
export const getCartTotal = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/total/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to get cart total:', error);
    throw error;
  }
};