// lib/api/orders.js
// API functions for order-related endpoints

import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

/**
 * Create a new order
 * @param {Object} orderData - Order data (shipping information)
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

/**
 * Get all orders for the current user
 * @returns {Promise<Array>} List of orders
 */
export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
};