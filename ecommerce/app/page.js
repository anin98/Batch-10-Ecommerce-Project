'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from './CallApi/products';
import ProductCard from './components/ProductCard';
import { Truck, RefreshCcw, Shield, MessageCircle } from 'lucide-react';
import Footer from './components/Footer';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        // Fetch featured products from the API
        const products = await getProducts();
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Failed to load featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadFeaturedProducts();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to ShopNext
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Discover amazing products at unbeatable prices. Shop the latest trends in electronics, clothing, and more.
          </p>
          <div className="mt-10">
            <Link 
              href="/products"
              className="inline-block bg-white text-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      {/* Featured Products */}

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
          <p className="mt-4 text-lg text-gray-500">Check out our most popular items</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No featured products available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/products"
            className="inline-block bg-indigo-600 text-white rounded-md py-3 px-8 text-base font-medium hover:bg-indigo-700"
          >
            View All Products
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Why Shop With Us</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Free Shipping */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Truck className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Free Shipping</h3>
            <p className="mt-2 text-sm text-gray-500">On orders over $50</p>
          </div>
          
          {/* Easy Returns */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <RefreshCcw className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Easy Returns</h3>
            <p className="mt-2 text-sm text-gray-500">30-day return policy</p>
          </div>
          
          {/* Secure Payments */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Secure Payments</h3>
            <p className="mt-2 text-sm text-gray-500">100% secure checkout</p>
          </div>
          
          {/* 24/7 Support */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
            <p className="mt-2 text-sm text-gray-500">Always here to help</p>
          </div>
        </div>
      </section>
      
      
     
   
     
    </div>
  );
}