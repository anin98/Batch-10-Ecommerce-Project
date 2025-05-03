import { API_BASE_URL,DEFAULT_HEADERS, handleResponse } from "./config";


/**
 * Get authentication headers if user is logged in
 * @param {Object} params - Query parameter for filtering
 * @returns {Promise<Array>}
 */ 

export const getProducts = async (params = {}) => {
    try {
      // Convert params object to URL search params
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/products/${queryString ? `?${queryString}`: ''}`;

    const response = await fetch (url,{
        method: 'GET',
        headers : DEFAULT_HEADERS
    })
    return handleResponse(response)
}
catch (error){
    console.log("Failed to fetch products")
    throw error;
}
}



