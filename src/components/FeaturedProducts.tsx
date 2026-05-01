"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Heart, MapPin, Tag, ArrowUpRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  college: string;
  createdAt: string;
  seller: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isDonation?: boolean;
}

interface FeaturedProductsProps {
  manualProducts?: Product[];
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
  isOwnerView?: boolean;
}

export default function FeaturedProducts({ 
  manualProducts, 
  title = "Newest Listings", 
  subtitle = "Freshly added items from your community.",
  showAllLink = true,
  isOwnerView = false
}: FeaturedProductsProps) {
  const [internalProducts, setInternalProducts] = useState<Product[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (manualProducts) return;
    
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products?limit=8");
        setInternalProducts(data.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setInternalLoading(false);
      }
    };
    fetchProducts();
  }, [manualProducts]);

  const products = manualProducts || internalProducts;
  const loading = manualProducts ? false : internalLoading;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/products/${id}`);
      setInternalProducts(prev => prev.filter(p => p._id !== id));
      toast.success("Listing deleted successfully");
    } catch (_error) {
      toast.error("Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <section className="px-4 md:px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`${(title || subtitle) ? "py-12 md:py-20" : "py-0"} px-4 md:px-6 max-w-7xl mx-auto`}>
      {(title || subtitle) && (
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{title}</h2>}
            {subtitle && <p className="text-sm md:text-base text-gray-500">{subtitle}</p>}
          </div>
          {showAllLink && (
            <Link href="/products" className="text-primary font-bold flex items-center gap-1 hover:underline text-sm md:text-base">
              View All <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="glass-morphism rounded-2xl md:rounded-3xl overflow-hidden group relative"
          >
            <div className="h-40 md:h-64 overflow-hidden relative">
              <Image 
                src={product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '')}${product.images[0]}`) : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'} 
                alt={product.title} 
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay Actions */}
              <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-2 z-20">
                {isOwnerView ? (
                  <>
                    <Link href={`/products/edit/${product._id}`}>
                      <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all">
                        <Edit size={14} className="md:w-[18px]" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-all"
                    >
                      <Trash2 size={14} className="md:w-[18px]" />
                    </button>
                  </>
                ) : (
                  <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:text-accent transition-colors">
                    <Heart size={16} className="md:w-[20px]" />
                  </button>
                )}
              </div>

              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary/80 backdrop-blur-md text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="p-3 md:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-secondary overflow-hidden relative">
                  {product.seller.avatar ? (
                      <Image src={product.seller.avatar} alt={product.seller.name} fill className="object-cover" />
                  ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] md:text-[10px] text-primary font-bold">
                            {product.seller?.name?.charAt(0) || "U"}
                        </div>
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-400 font-medium truncate max-w-[60px] md:max-w-none">{product.seller?.name || "Unknown"}</span>
                </div>
                <span className="text-[9px] md:text-xs text-gray-500">{formatDate(product.createdAt)}</span>
              </div>
              
              <h3 className="text-xs md:text-base font-bold mb-1 md:mb-2 line-clamp-1">{product.title}</h3>
              <div className={`text-lg md:text-2xl font-black mb-2 md:mb-4 ${product.isDonation ? "text-red-500" : "text-white"}`}>
                {product.isDonation ? "FREE" : `₹${product.price}`}
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Tag size={10} className="md:w-[12px]" /> {product.condition}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={10} className="md:w-[12px]" /> {product.college.split(' ')[0]}
                </span>
              </div>
            </div>
            
            {/* Clickable Area for Detail Page */}
            {!isOwnerView && <Link href={`/products/${product._id}`} className="absolute inset-0 z-10" />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
