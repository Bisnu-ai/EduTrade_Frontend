"use client";

import Link from "next/link";
import { Heart, Globe, Mail, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] pt-20 pb-10 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Intelligent Design Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[120px] rounded-full -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                <img src="/logo.png" alt="EduTrade Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">EduTrade</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Revolutionizing campus commerce with a secure, student-first marketplace. Trade smarter, save more, and build your community.
            </p>
            <div className="flex gap-3">
              {[Globe, Mail, Zap].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <Zap size={16} className="text-primary" /> Marketplace
            </h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-gray-500 hover:text-white text-sm transition-colors">All Listings</Link></li>
              <li><Link href="/products?category=Electronics" className="text-gray-500 hover:text-white text-sm transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=Books" className="text-gray-500 hover:text-white text-sm transition-colors">Books & Study Material</Link></li>
              <li><Link href="/products?category=Dorm" className="text-gray-500 hover:text-white text-sm transition-colors">Dorm Essentials</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Support */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" /> Trust & Safety
            </h4>
            <ul className="space-y-4">
              <li><Link href="/how-it-works" className="text-gray-500 hover:text-white text-sm transition-colors">How it Works</Link></li>
              <li><Link href="/safety" className="text-gray-500 hover:text-white text-sm transition-colors">Safety Guidelines</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-white text-sm transition-colors">About ByteBazzar</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Join the Loop */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay in the Loop</h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="College Email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all pr-12"
              />
              <button className="absolute right-2 top-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary-hover transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-3 font-medium">
              Join 12,000+ students getting weekly campus deals.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-600">
            <span className="flex items-center gap-2"><Globe size={12} /> Global Campus Network</span>
            <span className="hidden md:block text-white/5">|</span>
            <span className="flex items-center gap-1.5">
              Developed with <Heart size={12} className="text-red-500 fill-red-500" /> by 
              <span className="text-primary hover:underline cursor-pointer">ByteBazzar Team</span>
            </span>
          </div>

          <div className="flex items-center gap-8 text-xs text-gray-600 font-medium">
            <p>&copy; {new Date().getFullYear()} EduTrade Inc.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
