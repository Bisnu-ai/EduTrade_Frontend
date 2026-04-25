"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { 
  Camera, Tag, MapPin, 
  ChevronRight, AlertCircle, 
  CheckCircle2, Loader2, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics", "Books", "Clothing", "Dorm Essentials", "Stationery", "Others"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "",
    description: "",
    location: "",
    isDonation: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.data.product;
        
        // Safety check: Only owner can edit
        if (p.seller._id !== user?._id) {
          toast.error("You are not authorized to edit this product");
          router.push("/products");
          return;
        }

        setFormData({
          title: p.title,
          price: p.price.toString(),
          originalPrice: p.originalPrice?.toString() || "",
          category: p.category,
          condition: p.condition,
          description: p.description,
          location: p.location || "",
          isDonation: p.isDonation || false
        });
        setPreviews(p.images);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch product details");
        router.push("/my-listings");
      }
    };

    fetchProduct();
  }, [id, isAuthenticated, user?._id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    // Note: This logic for images is slightly complex if mixed with existing ones, 
    // but for now, we'll assume they re-upload or keep existing if no new images added.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });
      
      // Only append new images if they were selected
      images.forEach((image) => {
        data.append("images", image);
      });

      await api.put(`/products/${id}`, data);
      toast.success("Product updated successfully! ✨");
      router.push("/my-listings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-3">Edit Listing</h1>
          <p className="text-gray-500">Correct any mistakes or update your product details.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-morphism rounded-[32px] p-6 border border-white/5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Camera size={18} className="text-primary" /> Photos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img src={src} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/5 group">
                  <Camera size={24} className="text-gray-500 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-wider">Add More</span>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <p className="text-[10px] text-gray-500 mt-4 leading-relaxed italic">
                Tip: High-quality photos with good lighting sell 3x faster!
              </p>
            </div>
          </div>

          {/* Right: Form Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-morphism rounded-[32px] p-8 border border-white/5 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="What are you selling?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all font-black text-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Original (Optional)</label>
                  <input 
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="Retail price"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-gray-500"
                  />
                </div>
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-background">Select</option>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Condition</label>
                  <select 
                    required
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-background">Select</option>
                    {CONDITIONS.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Tell buyers more about the item..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Save Changes <CheckCircle2 size={24} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
