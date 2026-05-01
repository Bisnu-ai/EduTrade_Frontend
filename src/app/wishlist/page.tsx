"use client";

import useSWR from "swr";
import api from "@/lib/api";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Loader2, HeartOff } from "lucide-react";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function WishlistPage() {
  const { data, isLoading, error } = useSWR("/products/wishlist", fetcher, {
    revalidateOnFocus: true, // Wishlist might change often
  });

  const products = data?.wishlist || [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Your Wishlist</h1>
        <p className="text-gray-400">Items you've saved for later.</p>
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length > 0 ? (
        <FeaturedProducts manualProducts={products} title="" subtitle="" />
      ) : (
        <div className="text-center py-20 glass-morphism rounded-[40px] max-w-2xl mx-auto">
          <HeartOff className="mx-auto text-gray-700 mb-4" size={60} />
          <h3 className="text-xl font-bold mb-2">Wishlist is empty</h3>
          <p className="text-gray-500">Explore the marketplace and heart items you like!</p>
        </div>
      )}
      
      {error && (
        <p className="text-center text-red-500 py-10">Failed to load wishlist. Please try again.</p>
      )}
    </div>
  );
}
