"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@gamil.com") || email.includes("@gmial.com")) {
      return toast.error("Typo detected! Did you mean @gmail.com?");
    }
    if (!email.includes("@")) {
      return toast.error("Please provide a valid email address");
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      
      toast.success("OTP sent to your email! 📧");
      
      // Store userId and email for the reset page
      sessionStorage.setItem("pendingReset", JSON.stringify({
        userId: data.data.userId,
        email: email
      }));
      
      router.push("/forgot-password/reset");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-morphism p-10 rounded-[32px] text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <KeyRound size={32} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-muted mb-8">
          Enter your registered email address <br /> to receive a reset code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field text-center text-xl font-bold"
              autoFocus
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Send Reset Code <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <Link href="/login" className="inline-flex items-center gap-2 mt-8 text-muted hover:text-primary transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
