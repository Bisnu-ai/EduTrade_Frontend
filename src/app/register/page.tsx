"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, GraduationCap, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { LOCAL_COLLEGES } from "@/constants/colleges";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    department: "",
    year: "",
  });
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [showColleges, setShowColleges] = useState(false);
  const [isFetchingColleges, setIsFetchingColleges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (formData.email.includes("@gamil.com") || formData.email.includes("@gmial.com")) {
      return toast.error("Typo detected! Did you mean @gmail.com?");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      const { data } = await api.post("/auth/register", formData);
      toast.success(data.message || "OTP sent to your email! 📧");
      
      sessionStorage.setItem("pendingVerification", JSON.stringify({
        userId: data.data.userId,
        email: data.data.email
      }));
      
      router.push("/register/verify");
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "college") {
      if (value.length > 1) {
        setIsFetchingColleges(true);
        try {
          // 1. Search in Local List first
          const localMatches = LOCAL_COLLEGES.filter(c => 
            c.toLowerCase().includes(value.toLowerCase())
          );

          // 2. Search in Global API
          const res = await axios.get(`http://universities.hipolabs.com/search?country=India&name=${value}`);
          const apiMatches = res.data.map((univ: any) => univ.name);

          // 3. Merge and remove duplicates, limit to top 15
          const merged = Array.from(new Set([...localMatches, ...apiMatches])).slice(0, 15);
          
          setFilteredColleges(merged);
          setShowColleges(true);
        } catch (error) {
          console.error("Error fetching colleges", error);
        } finally {
          setIsFetchingColleges(false);
        }
      } else {
        setShowColleges(false);
        setFilteredColleges([]);
      }
    }
  };

  const handleSelectCollege = (name: string) => {
    setFormData({ ...formData, college: name });
    setShowColleges(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-morphism p-10 rounded-[40px] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Join the Community</h1>
          <p className="text-muted">Start trading with students in your college</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Full Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field !pl-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Email <span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className="input-field !pl-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                className="input-field !pl-12"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field !pl-12 !pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-foreground/80 ml-1">College <span className="text-red-500">*</span></label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="college"
                required
                autoComplete="off"
                value={formData.college}
                onChange={handleChange}
                onFocus={() => formData.college.length > 1 && setShowColleges(true)}
                onBlur={() => setTimeout(() => setShowColleges(false), 300)}
                placeholder="Type your college name..."
                className="input-field !pl-12"
              />
              {isFetchingColleges && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="animate-spin text-primary" size={16} />
                </div>
              )}
            </div>
            
            {/* College Suggestions Dropdown */}
            <AnimatePresence>
              {showColleges && filteredColleges.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 glass-morphism rounded-2xl overflow-hidden z-50 border border-white/10 shadow-2xl max-h-60 overflow-y-auto"
                >
                  {filteredColleges.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectCollege(c)}
                      className="w-full text-left px-5 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-all border-b border-white/5 last:border-none"
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Year of Study <span className="text-red-500">*</span></label>
            <select 
              name="year"
              required
              value={formData.year}
              onChange={handleChange}
              className="input-field appearance-none"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="Passout">Passout</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="md:col-span-2 bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Create Account <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-muted text-sm">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}
