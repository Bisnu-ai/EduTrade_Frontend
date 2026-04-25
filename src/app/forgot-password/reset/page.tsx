"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingData, setPendingData] = useState<{userId: string, phone: string} | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("pendingReset");
    if (!data) {
      router.push("/forgot-password");
      return;
    }
    setPendingData(JSON.parse(data));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingData) return;
    if (otp.length !== 6) return toast.error("Please enter a 6-digit OTP");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        userId: pendingData.userId,
        otp,
        newPassword
      });
      
      toast.success("Password reset successful! 🔐");
      sessionStorage.removeItem("pendingReset");
      
      // Short delay before redirecting to login
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP or Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-morphism p-10 rounded-[40px] text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Lock size={32} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-muted mb-8">
          Enter the code sent to <br />
          <span className="text-foreground font-bold">{pendingData?.phone}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted ml-1">OTP Code</label>
            <input 
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="input-field text-center text-2xl tracking-[0.5rem] font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted ml-1">New Password</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field !pr-12"
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
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Update Password <CheckCircle2 size={20} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
