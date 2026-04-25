"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <img src="/logo.png" alt="EduTrade Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">EduTrade</span>
          </Link>
          <p className="text-sm text-gray-500 max-w-xs text-center md:text-left">
            The most trusted campus marketplace for students to buy, sell, and trade.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
            <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</Link>
            <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">Marketplace</Link>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 flex items-center gap-1.5">
            Developed with <Heart size={10} className="text-red-500 fill-red-500" /> by <span className="text-primary">ByteBazzar Team</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EduTrade Inc.
          </p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
