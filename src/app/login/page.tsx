"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-morphism p-10 rounded-[40px] relative z-10 text-center"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted text-sm px-4">
            Sign in with your verified college account to continue trading on campus.
          </p>
        </div>

        <div className="space-y-6">
          <GoogleSignInButton mode="login" />
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Verified Access</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <div className="p-6 rounded-2xl bg-secondary/30 border border-foreground/5 text-left">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-primary" size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold mb-1">One-Click Login</h3>
                    <p className="text-xs text-muted leading-relaxed">
                        We use Google OAuth to ensure all users are verified students. No passwords to remember.
                    </p>
                </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-muted text-sm">
          Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-foreground/5 flex justify-between items-center px-2">
            <Link href="/about" className="text-[10px] text-muted hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/how-it-works" className="text-[10px] text-muted hover:text-primary transition-colors flex items-center gap-1">
                How it works <ArrowRight size={10} />
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
