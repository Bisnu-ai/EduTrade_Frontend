"use client";

import { motion } from "framer-motion";
import { Heart, Users, Target, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl font-black mb-8 tracking-tighter"
          >
            Built by Students, <br/>
            <span className="text-primary italic">for Students.</span>
          </motion.h1>
          <p className="text-gray-400 text-xl leading-relaxed">
            EduTrade is more than just a marketplace. It's a platform designed to make 
            college life more affordable, sustainable, and connected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We believe that textbooks shouldn't cost a fortune and quality gear 
              shouldn't go to waste. Our mission is to empower students to trade 
              safely within their own campus walls.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Heart size={32} />
            </div>
            <h2 className="text-3xl font-bold">Community First</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              By restricting trade to verified college students, we create a 
              trusted environment where you can meet your peers and save money 
              together.
            </p>
          </div>
        </div>

        <div className="glass-morphism p-12 rounded-[50px] relative overflow-hidden">
           <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
           <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div>
               <div className="text-4xl font-black text-primary mb-2">5k+</div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Students</div>
             </div>
             <div>
               <div className="text-4xl font-black text-primary mb-2">12k+</div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Items Traded</div>
             </div>
             <div>
               <div className="text-4xl font-black text-primary mb-2">₹20L+</div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Saved by Students</div>
             </div>
             <div>
               <div className="text-4xl font-black text-primary mb-2">50+</div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Colleges Joined</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
