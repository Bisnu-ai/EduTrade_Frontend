"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Loader2, HeartOff } from "lucide-react";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get("/products/wishlist");
        setProducts(data.data.wishlist);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Your Wishlist</h1>
        <p className="text-gray-400">Items you've saved for later.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : products.length > 0 ? (
        <FeaturedProducts manualProducts={products} />
      ) : (
        <div className="text-center py-20 glass-morphism rounded-[40px] max-w-2xl mx-auto">
          <HeartOff className="mx-auto text-gray-700 mb-4" size={60} />
          <h3 className="text-xl font-bold mb-2">Wishlist is empty</h3>
          <p className="text-gray-500">Explore the marketplace and heart items you like!</p>
        </div>
      )}
    </div>
  );
}
