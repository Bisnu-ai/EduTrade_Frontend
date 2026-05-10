"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-morphism p-10 rounded-[40px] relative z-10 text-center"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Join CampusKart</h1>
          <p className="text-muted text-sm px-4">
            The fastest and most secure way to trade on campus. 
            Sign up with your college Google account to get started.
          </p>
        </div>

        <div className="space-y-6">
          <GoogleSignInButton mode="register" />
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Secure Verification</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-left">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Why Google Sign-in?
            </h3>
            <ul className="text-xs text-muted space-y-2">
              <li>• Instant identity verification</li>
              <li>• No more forgetting passwords</li>
              <li>• Automatic campus network matching</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-muted text-sm">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-foreground/5">
            <Link href="/how-it-works" className="text-xs text-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
                Learn how we protect your data <ArrowRight size={12} />
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
