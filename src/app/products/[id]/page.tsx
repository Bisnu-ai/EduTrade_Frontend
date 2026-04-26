"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Heart, 
  MapPin, 
  Tag, 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const ArrowUpRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data.product);
        setIsWishlisted(data.data.isWishlisted);
      } catch (error) {
        toast.error("Product not found");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.title} on EduTrade!`,
        url: window.location.href,
      }).catch(() => toast.error("Failed to share"));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleChat = () => {
    router.push(`/chat?user=${product.seller._id}&product=${product._id}`);
  };

  const handleWishlist = async () => {
    try {
      const { data } = await api.post(`/products/${product._id}/wishlist`);
      setIsWishlisted(data.data.isWishlisted);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4 md:space-y-6">
          <div className="relative aspect-[4/3] md:aspect-square rounded-[32px] md:rounded-[40px] overflow-hidden glass-morphism group">
             <img 
               src={product.images[activeImage].startsWith('http') ? product.images[activeImage] : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '')}${product.images[activeImage]}`} 
               alt={product.title} 
               className="w-full h-full object-cover"
             />
             
             {product.images.length > 1 && (
               <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => setActiveImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                   className="w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                 >
                   <ChevronLeft size={20} />
                 </button>
                 <button 
                   onClick={() => setActiveImage(prev => (prev + 1) % product.images.length)}
                   className="w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                 >
                   <ChevronRight size={20} />
                 </button>
               </div>
             )}
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImage === i ? "border-primary" : "border-transparent opacity-50"
                }`}
              >
                <img src={img.startsWith('http') ? img : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '')}${img}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> {formatDate(product.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">{product.title}</h1>
            <div className="text-3xl md:text-5xl font-black text-primary tracking-tighter">₹{product.price}</div>
          </div>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 py-6 md:py-8 border-y border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                <Tag size={18} />
              </div>
              <div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Condition</div>
                <div className="text-sm md:text-base font-bold">{product.condition}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Location</div>
                <div className="text-sm md:text-base font-bold truncate max-w-[100px] md:max-w-none">{product.location || "On Campus"}</div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="glass-morphism p-4 md:p-6 rounded-2xl md:rounded-[32px] flex items-center justify-between group">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-11 h-11 md:w-14 md:h-14 bg-secondary rounded-xl md:rounded-2xl overflow-hidden">
                {product.seller.avatar ? (
                  <img src={product.seller.avatar.startsWith('http') ? product.seller.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '')}${product.seller.avatar}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                    {product.seller.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Posted by</div>
                <div className="font-bold text-base md:text-lg">{product.seller.name}</div>
                <div className="text-[10px] text-primary font-medium">{product.seller.college}</div>
              </div>
            </div>
            <Link href={`/profile/${product.seller._id}`}>
              <button className="p-2.5 bg-white/5 rounded-lg md:rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-all">
                <ArrowUpRight size={18} />
              </button>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              onClick={handleChat}
              className="flex-[2] bg-primary hover:bg-primary-hover py-4 md:py-5 rounded-2xl md:rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all text-white"
            >
              <MessageCircle size={20} /> Start Chat
            </button>
            <div className="flex gap-3 flex-1">
              <button 
                onClick={handleWishlist}
                className={`flex-1 border py-4 md:py-5 rounded-2xl md:rounded-3xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isWishlisted 
                  ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-lg shadow-red-500/10" 
                  : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-red-500" : ""} /> 
              </button>
              <button 
                onClick={handleShare}
                className="w-14 md:w-16 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all text-gray-400"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
            <ShieldCheck size={12} className="text-green-500" /> Secure Campus Trade Policy Active
          </div>
        </div>
      </div>
    </div>
  );
}
