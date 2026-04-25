"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Loader2, PackageSearch } from "lucide-react";

export default function MyListingsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await api.get("/products/my-listings");
        setProducts(data.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">My Listings</h1>
        <p className="text-gray-400">Manage the items you've posted for sale.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : products.length > 0 ? (
        <FeaturedProducts manualProducts={products} />
      ) : (
        <div className="text-center py-20 glass-morphism rounded-[40px] max-w-2xl mx-auto">
          <PackageSearch className="mx-auto text-gray-700 mb-4" size={60} />
          <h3 className="text-xl font-bold mb-2">No listings found</h3>
          <p className="text-gray-500">You haven't listed anything for sale yet.</p>
        </div>
      )}
    </div>
  );
}
