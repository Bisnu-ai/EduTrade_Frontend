"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Phone, Building2, Calendar, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { LOCAL_COLLEGES } from "@/constants/colleges";

export default function CompleteProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [formData, setFormData] = useState({
    college: user?.college || "",
    department: user?.department || "",
    year: user?.year || "",
    phone: user?.phone || "",
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
    if (!formData.college || !formData.year) {
      return toast.error("College and Year are required");
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-morphism p-10 rounded-[40px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted">Just a few more details to help you connect with your campus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground/80 ml-1">College <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                name="college"
                required
                autoComplete="off"
                value={formData.college}
                onChange={handleChange}
                onFocus={() => formData.college.length > 1 && setShowColleges(true)}
                onBlur={() => setTimeout(() => setShowColleges(false), 300)}
                placeholder="Search your college..."
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
                  className="absolute left-0 right-0 top-full mt-2 glass-morphism rounded-2xl overflow-hidden z-50 border border-foreground/10 shadow-2xl max-h-60 overflow-y-auto"
                >
                  {filteredColleges.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCollege(c)}
                      className="w-full text-left px-5 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-all border-b border-foreground/5 last:border-none"
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 ml-1">Department</label>
              <input 
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 ml-1">Year of Study <span className="text-red-500">*</span></label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                <select 
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="input-field !pl-12 appearance-none"
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Passout">Passout</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Phone Number (Optional)</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="input-field !pl-12"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Finish Setup <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
