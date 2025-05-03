'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard ({product}){
    const [imageError,setImageError]= useState(false)



   const getImageSrc = () => {
    if (imageError || !product.image){
         return '/placeholder-product.jpg'   
    }
    return product.image 
   }
     
        

    const formatPrice = (price) => {
        // Convert price to a number if it's not already
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        // Check if it's a valid number after conversion
        if (isNaN(numericPrice)) {
          return '$0.00';
        }
        
        // Format the price with 2 decimal places
        return `$${numericPrice.toFixed(2)}`;
      };
      
      return (
        <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative w-full h-56">
            <Image
              src={getImageSrc()}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              onError={() => setImageError(true)}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-indigo-600">
                {formatPrice(product.price)}
              </span>
              <div className="flex space-x-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
                >
                  View
                </Link>
                <button
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // We'll implement this in the next class
                    console.log('Add to cart:', product.id);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }