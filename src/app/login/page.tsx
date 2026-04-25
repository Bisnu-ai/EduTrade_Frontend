"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@gamil.com") || email.includes("@gmial.com")) {
      return toast.error("Typo detected! Did you mean @gmail.com?");
    }
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data.data.user, data.token);
      toast.success(data.message || "Welcome back!");
      router.push("/");
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.data?.userId) {
        toast.error("Account not verified. OTP sent to email! 📧");
        sessionStorage.setItem("pendingVerification", JSON.stringify({
          userId: error.response.data.data.userId,
          email: error.response.data.data.email
        }));
        router.push("/register/verify");
        return;
      }
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-morphism p-10 rounded-[32px] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted">Log in to continue trading on campus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 ml-1">Email Address <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="input-field !pl-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-foreground/80">Password <span className="text-red-500">*</span></label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field !pl-12 !pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Login <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-muted text-sm">
          Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
}
