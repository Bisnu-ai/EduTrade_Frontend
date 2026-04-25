"use client";

import Link from "next/link";
import { Heart, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 bg-[#0a0a0b] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-10">
          {/* Brand */}
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

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
              <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">Safety</Link>
              <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">Marketplace</Link>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 flex items-center gap-1.5">
              Developed with <Heart size={10} className="text-red-500 fill-red-500" /> by <span className="text-primary">ByteBazzar Team</span>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
               <Mail size={18} />
             </div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
               <Globe size={18} />
             </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright moved here */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} EduTrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
