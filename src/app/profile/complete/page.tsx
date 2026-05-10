"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Phone, Building2, Calendar, ArrowRight, Loader2, User, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { LOCAL_COLLEGES } from "@/constants/colleges";

export default function CompleteProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    department: user?.department || "",
    year: user?.year || "",
    phone: user?.phone || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
  });
  
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [showColleges, setShowColleges] = useState(false);
  const [isFetchingColleges, setIsFetchingColleges] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Sync with user data if it loads late
  useEffect(() => {
    if (user && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        college: user.college || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "college") {
      if (value.length > 1) {
        const localMatches = LOCAL_COLLEGES.filter(c => 
          c.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredColleges(localMatches);
        if (localMatches.length > 0) setShowColleges(true);

        setIsFetchingColleges(true);
        try {
          const res = await axios.get(`https://universities.hipolabs.com/search?country=India&name=${value}`, { timeout: 5000 });
          const apiMatches = res.data.map((univ: any) => univ.name);
          const merged = Array.from(new Set([...localMatches, ...apiMatches])).slice(0, 10);
          setFilteredColleges(merged);
          if (merged.length > 0) setShowColleges(true);
        } catch (error) {
          console.error("External API error", error);
        } finally {
          setIsFetchingColleges(false);
        }
      } else {
        setShowColleges(false);
      }
    }
  };

  const handleSelectCollege = (name: string) => {
    setFormData({ ...formData, college: name });
    setShowColleges(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.college || !formData.year) {
      return toast.error("Name, College and Year are required");
    }
    
    setLoading(true);
    try {
      const { data } = await api.put("/auth/update-profile", formData);
      setAuth(data.data.user, token!);
      toast.success("Profile completed! Welcome to CampusKart 🎓");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-morphism p-8 md:p-12 rounded-[48px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 relative"
          >
            <GraduationCap className="text-primary" size={40} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="text-primary" size={20} />
            </motion.div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">One Last Step!</h1>
          <p className="text-muted text-sm md:text-base max-w-sm mx-auto">
            Help us personalize your experience by providing your campus details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Full Name <span className="text-red-500">*</span></label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="input-field !pl-12"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Phone (Optional)</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  className="input-field !pl-12"
                />
              </div>
            </div>
          </div>

          {/* College Search */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">College / University <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                name="college"
                required
                autoComplete="off"
                value={formData.college}
                onChange={handleChange}
                onFocus={() => formData.college.length > 1 && setShowColleges(true)}
                onBlur={() => setTimeout(() => setShowColleges(false), 300)}
                placeholder="Search your campus..."
                className="input-field !pl-12"
              />
              {isFetchingColleges && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={16} />}
            </div>
            
            <AnimatePresence>
              {showColleges && filteredColleges.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 glass-morphism rounded-3xl overflow-hidden z-50 border border-foreground/10 shadow-2xl max-h-60 overflow-y-auto"
                >
                  {filteredColleges.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCollege(c)}
                      className="w-full text-left px-6 py-4 text-sm hover:bg-primary/10 hover:text-primary transition-all border-b border-foreground/5 last:border-none font-medium"
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Department</label>
              <input 
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="input-field"
              />
            </div>

            {/* Year of Study */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Current Year <span className="text-red-500">*</span></label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <select 
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="input-field !pl-12 appearance-none font-medium"
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Passout">Passout / Alumni</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Date of Birth</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="input-field !pl-12"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Start Trading <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
