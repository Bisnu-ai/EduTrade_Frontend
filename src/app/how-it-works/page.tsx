"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: <Search className="text-primary" size={32} />,
    title: "Browse Items",
    description: "Explore textbooks, electronics, and more from students on your campus."
  },
  {
    icon: <MessageCircle className="text-primary" size={32} />,
    title: "Chat & Negotiate",
    description: "Message sellers instantly to ask questions and finalize the deal."
  },
  {
    icon: <ShoppingBag className="text-primary" size={32} />,
    title: "Meet & Trade",
    description: "Meet up safely on campus to inspect the item and exchange."
  },
  {
    icon: <ShieldCheck className="text-primary" size={32} />,
    title: "Verified Community",
    description: "Every user is a verified student, ensuring a trust-worthy experience."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-6 tracking-tight"
          >
            How <span className="text-primary">EduTrade</span> Works
          </motion.h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            The simplest and safest way to buy and sell within your college community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-morphism p-10 rounded-[40px] text-center relative group"
            >
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
              
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/30">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-32 glass-morphism p-12 rounded-[50px] text-center bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to start trading?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-primary hover:bg-primary-hover px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary/20">
                Join Now <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/products">
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-4 rounded-2xl font-bold transition-all">
                Browse Marketplace
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
