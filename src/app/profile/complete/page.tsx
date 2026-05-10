"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Phone, Building2, Calendar, ArrowRight, Loader2, User, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";
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
  
  const [filteredColleges, setFilteredColleges] = useState<string[]>(LOCAL_COLLEGES);
  const [showColleges, setShowColleges] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

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

  const handleCollegeSearch = (value: string) => {
    setFormData({ ...formData, college: value });
    const matches = LOCAL_COLLEGES.filter(c => 
      c.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredColleges(matches);
    setShowColleges(true);
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-morphism p-8 md:p-12 rounded-[48px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 relative">
            <GraduationCap className="text-primary" size={40} />
            <Sparkles className="text-primary absolute -top-1 -right-1" size={20} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Complete Profile</h1>
          <p className="text-muted text-sm md:text-base">Select your college from the list below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Full Name *</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                  className="input-field !pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Phone (Optional)</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="10-digit mobile"
                  className="input-field !pl-12"
                />
              </div>
            </div>
          </div>

          {/* College Dropdown */}
          <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">College / University *</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                name="college"
                required
                autoComplete="off"
                value={formData.college}
                onChange={(e) => handleCollegeSearch(e.target.value)}
                onFocus={() => setShowColleges(true)}
                onBlur={() => setTimeout(() => setShowColleges(false), 300)}
                placeholder="Select or search your college..."
                className="input-field !pl-12"
              />
            </div>
            
            <AnimatePresence>
              {showColleges && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 glass-morphism rounded-3xl overflow-hidden z-50 border border-foreground/10 shadow-2xl max-h-64 overflow-y-auto"
                >
                  {filteredColleges.length > 0 ? filteredColleges.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCollege(c)}
                      className="w-full text-left px-6 py-4 text-sm hover:bg-primary/10 hover:text-primary transition-all border-b border-foreground/5 last:border-none font-medium flex items-center justify-between"
                    >
                      {c}
                      {formData.college === c && <Check size={16} className="text-primary" />}
                    </button>
                  )) : (
                    <div className="px-6 py-4 text-sm text-muted">No matching college found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Department</label>
              <input 
                name="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g. Computer Science"
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Current Year *</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <select 
                  name="year"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
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

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">Date of Birth</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                name="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
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
