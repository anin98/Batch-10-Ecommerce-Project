// lib/api/config.js
// Configuration for API requests

// Base API URL from environment variable or default to localhost
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Default headers for all requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Get authentication headers if user is logged in
 * @returns {Object} Headers with authorization token if available
 */
export const getAuthHeaders = () => {
  const headers = { ...DEFAULT_HEADERS };
  
  // Only run on client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Handle API response and extract data or error
 * @param {Response} response - Fetch API response
 * @returns {Promise<any>} Parsed response data
 * @throws {Error} If response is not ok
 */
export const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Parse response based on content type
  const data = isJson ? await response.json() : await response.text();
  
  // If response is not ok, throw an error with the response data
  if (!response.ok) {
    // Extract error message from response if available
    const message = isJson && data.detail 
      ? data.detail 
      : `API Error: ${response.status} ${response.statusText}`;
    
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};