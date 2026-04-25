"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Grid, List as ListIcon, Loader2 } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?search=${search}&category=${category}`);
      setProducts(data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">Discover everything you need for college life.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <button className="p-3 glass-morphism rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
        {/* Filters Sidebar */}
        <aside className="space-y-8">
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Categories</h3>
            <div className="space-y-2">
              {["All", "Textbooks", "Electronics", "Dorm Essentials", "Fashion", "Bicycles", "Others"].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, "-"))}
                  className={`block w-full text-left px-4 py-2 rounded-xl transition-all ${
                    (category === cat.toLowerCase().replace(/\s+/g, "-") || (category === "" && cat === "All"))
                      ? "bg-primary text-white font-bold" 
                      : "hover:bg-primary/10 text-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-primary" size={40} />
               <p className="text-gray-500 animate-pulse font-medium">Fetching the best deals...</p>
             </div>
           ) : products.length > 0 ? (
             <FeaturedProducts manualProducts={products} />
           ) : (
             <div className="text-center py-20 glass-morphism rounded-[40px]">
               <h3 className="text-xl font-bold mb-2">No items found</h3>
               <p className="text-gray-500">Try adjusting your search or filters.</p>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
