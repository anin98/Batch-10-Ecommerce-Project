
import { API_BASE_URL,DEFAULT_HEADERS,getAuthHeaders, handleResponse } from "./config";
/**
 * Login
 * @param {Object} credentials - Query parameter for filtering
 * @returns {Promise<Object>}
 */ 

export const login = async (credentials) =>{
    try{
        const response = await fetch (`${API_BASE_URL}/auth/login/`,{
            method :'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(credentials)
        }
        )
        const data = await handleResponse(response);
        if(data.access){
            localStorage.setItem('auth_token', data.access)
        
        if(data.refresh){
            localStorage.setItem('refresh_token', data.refresh)
        }
        if (data.user){
            localStorage.setItem('user',JSON.stringify.apply(data.user))
        }}
        return data;
    }
    catch (error){
        console.log("Login failed:", error)
        throw error
    }
    
}

/**
 * Register
 * @param {Object}  - Query parameter for filtering
 * @returns {Promise<Object>}
 */ 
export const register = async(userData) =>{
try{
    const response = await fetch (`${API_BASE_URL}/auth/register/`,{
        method :'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(userData)

    })
    return handleResponse(response)
}
catch(error){
    console.log("Registration failed:", error)
    throw error;
}
}
/**
 * Register

 * @returns {Promise<void>}
 */ 

export const logout = async () =>{
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')

}

export const getCurrentUser = async () => {
    try {
      // First check if we have the user in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // For development, we'll return the stored user data
        // In production, you might want to verify with the server regardless
        return JSON.parse(storedUser);
      }
      
      // If not, fetch from API
      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const userData = await handleResponse(response);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Clear stored user data if API call fails
      localStorage.removeItem('user');
      throw error;
    }
  };