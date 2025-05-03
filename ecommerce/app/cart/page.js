'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { 
    cartItems, 
    loading, 
    total, 
    updateItemQuantity, 
    removeItem, 
    clearCartItems 
  } = useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      router.push('/login');
    }
  }, [router]);

  // Format price helper
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return '$0.00';
    return `$${numericPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
        <Link 
          href="/products"
          className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b py-4 last:border-b-0">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image 
                    src={item.product.image || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                
                <div className="ml-6 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link href={`/products/${item.product.slug}`} className="hover:text-indigo-600">
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mt-1">{formatPrice(item.product.price)}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm text-gray-700">
                        Quantity:
                      </label>
                      <select
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                        className="border rounded-md px-2 py-1 text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.total_price)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearCartItems}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            
            <Link 
              href="/products"
              className="block text-center mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}