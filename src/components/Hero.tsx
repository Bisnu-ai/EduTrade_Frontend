"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Zap, Shield, Repeat, Users, GraduationCap } from "lucide-react";
import Link from "next/link";

const FloatingElement = ({ delay = 0, className = "" }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [0, -20, 0] }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={`absolute rounded-full filter blur-[60px] opacity-20 pointer-events-none ${className}`}
  />
);

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section className="relative pt-24 md:pt-40 pb-20 md:pb-32 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} className="w-96 h-96 bg-primary -top-20 -left-20" />
        <FloatingElement delay={2} className="w-80 h-80 bg-blue-500 bottom-0 -right-20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <GraduationCap size={14} className="text-primary" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-300">
              Exclusive Campus Marketplace
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            Trade, Save, & <br />
            <span className="gradient-text italic font-serif">Level Up Campus</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Join thousands of students trading textbooks, gadgets, and dorm essentials securely within their own college community.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-primary/40 transition-all text-lg"
              >
                Browse Deals 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl font-bold transition-all text-lg"
              >
                Join Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Section with staggered reveal */}
          <motion.div
            variants={containerVariants}
            className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: "Active Users", value: "12K+", icon: Users },
              { label: "Total Trades", value: "45K+", icon: Repeat },
              { label: "Items Sold", value: "30K+", icon: Zap },
              { label: "Verified Safety", value: "100%", icon: Shield },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="glass-morphism p-8 rounded-[32px] group text-left border border-white/5 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-[10deg] transition-all duration-500">
                  <stat.icon className="text-primary group-hover:text-white transition-colors" size={28} />
                </div>
                <div className="text-3xl font-black mb-1 tracking-tight">{stat.value}</div>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
