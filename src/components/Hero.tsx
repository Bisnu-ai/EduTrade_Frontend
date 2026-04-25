"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Repeat, Users, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
      <div className="hero-glow" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 md:mb-6">
            The Student Marketplace
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 md:mb-8 tracking-tight">
            Trade, Save, and <br />
            <span className="gradient-text italic">Elevate Your Campus Life</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
            EduTrade is the #1 marketplace exclusively for college students. Buy and sell textbooks, electronics, dorm essentials, and more within your campus community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/30 transition-all"
              >
                Browse Marketplace <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Join Community
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: "Active Users", value: "12K+", icon: Users },
            { label: "Total Trades", value: "45K+", icon: Repeat },
            { label: "Items Sold", value: "30K+", icon: Zap },
            { label: "Safe & Secure", value: "100%", icon: Shield },
          ].map((stat, i) => (
            <div key={i} className="glass-morphism p-6 rounded-3xl group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                <stat.icon className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
