"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { Search, ShoppingBag, User as UserIcon, LogOut, Menu, Heart, ShieldAlert, X, Bell, Moon, Sun } from "lucide-react";
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
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 relative">
          <Image src="/logo.png" alt="EduTrade Logo" fill className="object-cover" priority />
        </div>
        <span className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">EduTrade</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="/products" className="hover:text-white transition-colors">Marketplace</Link>
        <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search - Hidden on Mobile */}
        <div className="hidden sm:flex items-center glass-morphism rounded-full px-4 py-2 w-48 lg:w-64 focus-within:border-primary/50 transition-all">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-foreground"
          />
        </div>

        {/* Action Icons - Desktop Only */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && <NotificationBell />}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 md:gap-4">
            {/* Sell Button - Desktop/Tablet Only */}
            <Link href="/sell" className="hidden sm:block">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-primary/20 transition-all"
              >
                Sell Item
              </motion.button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
               <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary transition-all flex items-center justify-center bg-secondary relative"
               >
                 {user?.avatar ? (
                   <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs md:text-sm">
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
          <div className="hidden md:flex items-center gap-2">
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
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-foreground p-1.5 md:p-2 hover:bg-white/5 rounded-xl transition-all"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-background/95 backdrop-blur-2xl border-l border-white/10 z-50 p-6 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8 pt-2">
                <span className="text-xl font-black text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto flex-grow">
                {/* Mobile Quick Actions */}
                <div className={`grid ${isAuthenticated ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-6`}>
                  <div className="flex items-center justify-center p-4 glass-morphism rounded-2xl gap-3">
                    <ThemeToggle />
                    <span className="text-xs font-bold uppercase tracking-wider">Theme</span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center justify-center p-4 glass-morphism rounded-2xl gap-3">
                      <NotificationBell />
                      <span className="text-xs font-bold uppercase tracking-wider">Alerts</span>
                    </div>
                  )}
                </div>

                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all text-foreground group">
                  <span className="text-lg font-bold">Marketplace</span>
                  <ShoppingBag size={20} className="text-muted group-hover:text-primary transition-colors" />
                </Link>
                <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-primary/10 text-primary rounded-2xl transition-all font-bold">
                  <span>Sell New Item</span>
                  <Zap size={20} />
                </Link>
                <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all text-foreground">
                  <span className="text-lg font-bold">How it works</span>
                </Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all text-foreground">
                  <span className="text-lg font-bold">About</span>
                </Link>
                
                <hr className="border-white/5 my-4" />
                
                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3 mt-auto">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="p-4 text-center text-foreground font-bold hover:bg-white/5 rounded-2xl">Login</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="p-4 text-center bg-white text-black rounded-2xl font-bold">Get Started</Link>
                  </div>
                ) : (
                   <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="mt-auto p-4 flex items-center justify-center gap-2 text-accent font-bold bg-accent/5 rounded-2xl"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { Zap } from "lucide-react";
