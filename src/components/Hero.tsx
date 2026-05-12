"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Zap, Shield, Repeat, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

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
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    activeStudents: "0+",
    itemsTraded: "0+",
    savedByStudents: "₹0+",
    collegesJoined: "0+"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/products/public-stats");
        if (data.success) {
          const s = data.data;
          setStats({
            activeStudents: `${s.activeStudents}+`,
            itemsTraded: `${s.itemsTraded < 1000 ? s.itemsTraded : (s.itemsTraded / 1000).toFixed(1) + "k"}+`,
            savedByStudents: `₹${s.savedByStudents < 1000 ? s.savedByStudents : (s.savedByStudents / 1000).toFixed(1) + "k"}+`,
            collegesJoined: `${s.collegesJoined}+`
          });
        }
      } catch (error) {
        console.error("Failed to fetch real-time stats:", error);
      }
    };
    fetchStats();
  }, []);

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

  const statItems = [
    { label: "Active Students", value: stats.activeStudents, icon: Users },
    { label: "Items Traded", value: stats.itemsTraded, icon: Repeat },
    { label: "Saved by Students", value: stats.savedByStudents, icon: Zap },
    { label: "Colleges Joined", value: stats.collegesJoined, icon: Shield },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 md:pt-32 pb-20 md:pb-32 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover object-contain bg-center bg-no-repeat transition-transform duration-1000"
          style={{
            backgroundImage: "url('/bg.png')",
            transform: "scale(1.05)"
          }}
        />
        {/* Sophisticated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-0" />
        <div className="absolute inset-0 backdrop-blur-[2px] z-0" />

        {/* Floating Accents */}
        <FloatingElement delay={0} className="w-96 h-96 bg-primary/30 -top-20 -left-20" />
        <FloatingElement delay={2} className="w-80 h-80 bg-blue-500/20 bottom-0 -right-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md mb-8">
            <GraduationCap size={14} className="text-primary" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-muted">
              Exclusive Campus Marketplace
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl">
            Trade, Save, & <br />
            <span className="gradient-text italic font-serif">Level Up Campus</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed font-semibold drop-shadow-lg">
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
            {isAuthenticated ? (
              <Link href="/sell">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-foreground/5 backdrop-blur-md border border-foreground/10 text-foreground px-10 py-5 rounded-2xl font-bold transition-all text-lg"
                >
                  Sell an Item
                </motion.button>
              </Link>
            ) : (
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-foreground/5 backdrop-blur-md border border-foreground/10 text-foreground px-10 py-5 rounded-2xl font-bold transition-all text-lg"
                >
                  Join Now
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Stats Section with staggered reveal */}
          <motion.div
            variants={containerVariants}
            className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statItems.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="glass-morphism p-8 rounded-[32px] group text-left border border-foreground/5 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-[10deg] transition-all duration-500">
                  <stat.icon className="text-primary group-hover:text-white transition-colors" size={28} />
                </div>
                <div className="text-3xl font-black mb-1 tracking-tight">{stat.value}</div>
                <div className="text-[10px] text-muted font-black uppercase tracking-[0.15em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
