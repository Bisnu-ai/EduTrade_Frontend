"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Search, ShoppingBag, User as UserIcon, LogOut, Menu, Heart, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";

import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 md:gap-3 group">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
          <img src="/logo.png" alt="EduTrade Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">EduTrade</span>
      </Link>

      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="/products" className="hover:text-white transition-colors">Marketplace</Link>
        <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell />
        <div className="hidden sm:flex items-center glass-morphism rounded-full px-4 py-2 w-64 focus-within:border-primary/50 transition-all">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-foreground"
          />
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link href="/sell">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all"
              >
                Sell Item
              </motion.button>
            </Link>
            <div className="relative" ref={profileRef}>
               <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary transition-all flex items-center justify-center bg-secondary"
               >
                 {user?.avatar ? (
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                     {user?.name.charAt(0)}
                   </div>
                 )}
               </button>
               
               <AnimatePresence>
                 {isProfileOpen && (
                   <div className="absolute right-0 top-[calc(100%+8px)] w-52 z-50">
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="glass-morphism rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-2"
                     >
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                          <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                          <p className="text-[10px] text-muted truncate">{user?.email}</p>
                        </div>
                        <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-foreground">
                          <UserIcon size={16} /> My Profile
                        </Link>
                        <Link href="/my-listings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-foreground">
                          <ShoppingBag size={16} /> My Listings
                        </Link>
                        <Link href="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-foreground">
                          <Heart size={16} /> Wishlist
                        </Link>
                        
                        {(user?.role === "admin" || user?.email === "bytebazzar.org@gmail.com") && (
                          <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold">
                            <ShieldAlert size={16} /> Admin Panel
                          </Link>
                        )}
    
                        <div className="my-2 border-t border-white/5" />
                        <button 
                          onClick={() => { logout(); setIsProfileOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-accent hover:bg-accent/10 rounded-xl flex items-center gap-2 transition-all"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                     </motion.div>
                   </div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-white transition-colors">Login</Link>
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        )}
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2 hover:bg-secondary rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-card border-l border-white/10 z-50 p-6 md:hidden"
            >
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground">Marketplace</Link>
                <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground">How it works</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground">About</Link>
                <hr className="border-white/5" />
                {!isAuthenticated && (
                  <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold">Login</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-white px-6 py-3 rounded-2xl text-center font-bold">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
