"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Upload, X, Tag, DollarSign, List, Info, Loader2, Plus, Heart } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Textbooks", "Electronics", "Dorm Essentials", "Stationery", "Fashion", "Bicycles", "Others"];
const CONDITIONS = ["New", "Gently Used", "Fair", "Heavily Used"];

export default function SellPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    isDonation: false,
  });

  useEffect(() => {
    const title = searchParams.get("title");
    const price = searchParams.get("price");
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const description = searchParams.get("description");

    if (title || price || category || condition || description) {
      setFormData(prev => ({
        ...prev,
        title: title || prev.title,
        price: price || prev.price,
        description: description || prev.description,
        // Match category and condition case-insensitively
        category: CATEGORIES.find(c => c.toLowerCase() === category?.toLowerCase()) || prev.category,
        condition: CONDITIONS.find(c => c.toLowerCase().replace(/\s+/g, "-") === condition?.toLowerCase()) || prev.condition,
      }));
      
      if (searchParams.get("fromChat") === "true") {
        toast.success("Details imported from chat! Please add photos to finish.");
      }
    }
  }, [searchParams]);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      setImages([...images, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    setLoading(true);
    const sanitizedData = {
      ...formData,
      category: formData.category.toLowerCase().replace(/\s+/g, "-"),
      condition: formData.condition.toLowerCase().replace(/\s+/g, "-"),
    };

    const data = new FormData();
    Object.entries(sanitizedData).forEach(([key, value]) => {
      data.append(key, String(value));
    });
    images.forEach(image => data.append("images", image));

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Item listed successfully!");
      router.push("/products");
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        const errors: Record<string, string> = {};
        serverErrors.forEach((err: any) => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
        toast.error("Please fix the errors in the form");
      } else {
        toast.error(error.response?.data?.message || "Failed to list item");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-10 rounded-[40px]"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Sell an Item</h1>
          <p className="text-gray-400">List your item for other students to see</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Product Images (Max 5)</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {previews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Plus className="text-gray-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Add Image</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Item Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="What are you selling?"
                className={`w-full bg-white/5 border ${fieldErrors.title ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white`}
              />
              {fieldErrors.title && <p className="text-red-500 text-xs font-bold px-2">{fieldErrors.title}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide details about condition, age, etc."
                className={`w-full bg-white/5 border ${fieldErrors.description ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white resize-none`}
              />
              {fieldErrors.description && <p className="text-red-500 text-xs font-bold px-2">{fieldErrors.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Price (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="number"
                  required
                  disabled={formData.isDonation}
                  value={formData.isDonation ? "0" : formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className={`w-full bg-white/5 border ${fieldErrors.price ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all text-white disabled:opacity-50`}
                />
              </div>
              {fieldErrors.price && <p className="text-red-500 text-xs font-bold px-2">{fieldErrors.price}</p>}
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setFormData({...formData, isDonation: !formData.isDonation, price: !formData.isDonation ? "0" : ""})}
                className={`flex items-center justify-between gap-3 px-6 py-4 rounded-2xl border transition-all ${formData.isDonation ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"}`}
              >
                <div className="flex items-center gap-2">
                  <Heart size={18} fill={formData.isDonation ? "currentColor" : "none"} />
                  <span className="text-sm font-bold uppercase tracking-wider">Give for Free 🎁</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-all ${formData.isDonation ? "bg-red-500" : "bg-gray-700"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isDonation ? "right-1" : "left-1"}`} />
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full bg-[#161621] border ${fieldErrors.category ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white appearance-none`}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {fieldErrors.category && <p className="text-red-500 text-xs font-bold px-2">{fieldErrors.category}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Condition</label>
              <select 
                required
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className={`w-full bg-[#161621] border ${fieldErrors.condition ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white appearance-none`}
              >
                <option value="">Select Condition</option>
                {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
              </select>
              {fieldErrors.condition && <p className="text-red-500 text-xs font-bold px-2">{fieldErrors.condition}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Pickup Location</label>
              <input 
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Dorm, Library, etc."
                className={`w-full bg-white/5 border ${fieldErrors.location ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white`}
              />
              {fieldErrors.location && <p className="text-red-500 text-xs font-bold px-2">{fieldErrors.location}</p>}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Post Listing Now"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
