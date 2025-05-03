'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../CallApi/products';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare query parameters
        const params = {};
        if (categoryFilter) {
          params.category = categoryFilter;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        // Fetch products from API
        const data = await getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [categoryFilter, searchQuery]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {categoryFilter 
            ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` 
            : 'All Products'}
          {searchQuery && ` matching "${searchQuery}"`}
        </h1>
        
        {/* We'll implement filters in Class 2 */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Filter by:</span>
          <select 
            className="border rounded-md p-2"
            disabled
          >
            <option>Category</option>
          </select>
          
          <select 
            className="border rounded-md p-2"
            disabled
          >
            <option>Price</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl text-gray-600">No products found</h2>
              <p className="mt-2">Try changing your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}