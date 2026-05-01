"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

function MarketplaceContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial state from URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  
  const debouncedSearch = useDebounce(search, 500);

  // Sync URL when search/category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    
    if (category) params.set("category", category);
    else params.delete("category");

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [debouncedSearch, category, pathname, router, searchParams]);

  // Use SWR for high-performance data fetching
  const { data, isLoading } = useSWR(
    `/products?search=${debouncedSearch}&category=${category}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10s deduplication
    }
  );

  const products = data?.products || [];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="px-2">
          <h1 className="text-2xl md:text-4xl font-bold mb-1">Marketplace</h1>
          <p className="text-[11px] md:text-base text-gray-400">Discover items for your campus life.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto px-2">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 md:pl-12 py-2.5 md:py-3 text-sm"
            />
          </div>
          <button className="p-2.5 md:p-3 glass-morphism rounded-xl md:rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-6 md:gap-10">
        {/* Categories Bar for Mobile */}
        <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar px-2">
          {["All", "Textbooks", "Electronics", "Dorm Essentials", "Fashion", "Bicycles", "Others"].map((cat) => {
            const catId = cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, "-");
            const isActive = category === catId;
            return (
              <button 
                key={cat}
                onClick={() => setCategory(catId)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-primary text-white border-primary" 
                    : "glass-morphism text-muted border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filters Sidebar for Desktop */}
        <aside className="hidden lg:block space-y-8">
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Categories</h3>
            <div className="space-y-2">
              {["All", "Textbooks", "Electronics", "Dorm Essentials", "Fashion", "Bicycles", "Others"].map((cat) => {
                const catId = cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, "-");
                const isActive = category === catId;
                return (
                  <button 
                    key={cat}
                    onClick={() => setCategory(catId)}
                    className={`block w-full text-left px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-white font-bold" 
                        : "hover:bg-primary/10 text-muted"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid / Main Content */}
        <main className="px-0 md:px-0">
           {isLoading ? (
             <div className="-mt-12">
               <ProductGridSkeleton />
             </div>
           ) : products.length > 0 ? (
             <div className="-mt-12">
               <FeaturedProducts manualProducts={products} title="" subtitle="" showAllLink={false} />
             </div>
           ) : (
             <div className="text-center py-12 md:py-20 glass-morphism rounded-3xl md:rounded-[40px] mx-2">
               <h3 className="text-lg md:text-xl font-bold mb-2">No items found</h3>
               <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
