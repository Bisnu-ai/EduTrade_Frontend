"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, Package, ShoppingBag, 
  Star, Calendar, MapPin, Award, 
  MessageCircle, ExternalLink, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, productsRes] = await Promise.all([
          api.get(`/auth/user/${id}`),
          api.get(`/products?seller=${id}`)
        ]);
        setUser(userRes.data.data.user);
        setProducts(productsRes.data.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <Package size={64} opacity={0.2} />
      <p>User profile not found</p>
      <Link href="/" className="text-primary hover:underline">Back to Marketplace</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Header / Banner ── */}
      <div className="h-48 w-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 transition-all text-white z-10"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Sidebar (Profile Info) ── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                {user.totalSold > 5 && (
                  <div className="bg-yellow-500/20 text-yellow-500 p-2 rounded-2xl" title="Trusted Seller">
                    <Award size={20} />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 p-1 mb-6 shadow-xl shadow-primary/20">
                  <div className="w-full h-full rounded-[1.8rem] bg-secondary flex items-center justify-center text-4xl font-black text-white overflow-hidden ring-4 ring-background">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                  </div>
                </div>
                
                <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
                  {user.name}
                  {user.role === 'admin' && <ShieldCheck size={18} className="text-blue-500" />}
                </h1>
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-primary" /> {user.college}
                </p>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 gap-3 w-full mb-8">
                  <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
                    <p className="text-2xl font-black text-primary">{user.totalSold || 0}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Products Sold</p>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
                    {user.rating?.count > 0 ? (
                      <>
                        <p className="text-2xl font-black text-yellow-500">{user.rating.average.toFixed(1)}</p>
                        <div className="flex justify-center gap-0.5 text-yellow-500 mb-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < Math.round(user.rating.average) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Avg Rating</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-black text-gray-400 mt-1">New Seller</p>
                        <div className="flex justify-center gap-0.5 text-gray-600 mb-0.5 mt-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="none" />)}
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">No ratings yet</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-3 text-xs text-gray-400 bg-white/5 p-3 rounded-2xl">
                    <Calendar size={14} className="text-primary" />
                    <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 bg-white/5 p-3 rounded-2xl">
                    <ShoppingBag size={14} className="text-primary" />
                    <span>{user.totalListings || 0} active listings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content (Listings) ── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Active Listings</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                <Package size={18} className="text-primary" />
                {products.length} Items Available
              </div>
            </div>

            {products.length === 0 ? (
              <div className="glass-morphism rounded-[2.5rem] p-20 flex flex-col items-center text-center gap-4 text-gray-500">
                <ShoppingBag size={48} opacity={0.1} />
                <p className="font-bold">This user has no active listings at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -5 }}
                    className="glass-morphism group rounded-[2rem] overflow-hidden border border-white/5 shadow-lg"
                  >
                    <Link href={`/product/${product._id}`}>
                      <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                        {product.images?.[0] && (
                          <img 
                            src={product.images[0]} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            alt={product.title} 
                          />
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/product/${product._id}`}>
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors truncate mb-1">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-primary font-black text-xl mb-4">₹{product.price}</p>
                      
                      <button 
                        onClick={() => router.push(`/chat?user=${user._id}&product=${product._id}`)}
                        className="w-full py-3 bg-white/5 hover:bg-primary hover:text-white rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} /> Chat with Seller
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
