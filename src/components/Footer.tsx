"use client";

import Link from "next/link";
import { Heart, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 px-6 border-t border-white/5 bg-[#0a0a0b] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <img src="/logo.png" alt="EduTrade Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">EduTrade</span>
          </Link>
          <p className="text-sm text-gray-500 max-w-xs text-center md:text-left leading-relaxed">
            The most trusted campus marketplace. Built for students, by students.
          </p>
        </div>

        {/* Links & Socials */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">About</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Safety</Link>
            <Link href="/products" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Marketplace</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
              <Github size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            Crafted with <Heart size={10} className="text-red-500 fill-red-500" /> by <span className="text-primary">ByteBazzar</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} EduTrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
