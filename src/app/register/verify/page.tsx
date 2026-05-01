"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingData, setPendingData] = useState<{userId: string, email: string} | null>(null);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const data = sessionStorage.getItem("pendingVerification") || sessionStorage.getItem("pendingReset");
    if (!data) {
      router.push("/register");
      return;
    }
    setPendingData(JSON.parse(data));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingData) return;
    if (otp.length !== 6) return toast.error("Please enter a 6-digit OTP");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", {
        userId: pendingData.userId,
        email: pendingData.email,
        otp
      });
      
      setAuth(data.data.user, data.token);
      toast.success("Account verified! Welcome to EduTrade 🎓");
      sessionStorage.removeItem("pendingVerification");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingData) return;
    setResending(true);
    try {
      const { data } = await api.post("/auth/resend-otp", { 
        userId: pendingData.userId,
        email: pendingData.email
      });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
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
          <Mail size={32} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Verify Email</h1>
        <p className="text-muted mb-8">
          We've sent a 6-digit code to <br />
          <span className="text-foreground font-bold">{pendingData?.email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="input-field text-center text-3xl tracking-[1rem] font-bold"
            autoFocus
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Verify & Continue <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-muted text-sm">
          Didn't receive the code?{" "}
          <button 
            onClick={handleResend}
            disabled={resending}
            className="text-primary font-bold hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
