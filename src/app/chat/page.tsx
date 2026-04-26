"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, MoreVertical, ChevronLeft,
  Smile, Phone, Video,
  MessageSquare, Package, MapPin, Calendar, CheckCircle, Map as MapIcon, Star
} from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import nextDynamic from "next/dynamic";
import Link from "next/link";
const MeetupMap = nextDynamic(() => import("@/components/MeetupMap"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-secondary animate-pulse rounded-2xl" />
});

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CAMPUS_SPOTS = [
  "College Library", "Main Cafeteria", "Akash Bhawan","Bhaskar Bhawan","MP memorial stadium", 
  "Near Oc", "Near Doom", "Main Gate"
];

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recipientId = searchParams.get("user");
  const productId   = searchParams.get("product");
  const { user }    = useAuthStore();

  const [messages,  setMessages]  = useState<any[]>([]);
  const [newMsg,    setNewMsg]    = useState("");
  const [recipient, setRecipient] = useState<any>(null);
  const [product,   setProduct]   = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [showMeetup, setShowMeetup] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const socketRef  = useRef<Socket | null>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  /* ── Socket ── */
  useEffect(() => {
    if (!user?._id) return;
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
    const s = io(socketUrl, { transports: ["websocket"], reconnection: true });
    socketRef.current = s;
    s.on("connect",        () => s.emit("join", user._id));
    s.on("receiveMessage", (m) => setMessages((p) => [...p, m]));
    s.on("showRating", () => {
      setShowRatingModal(true);
    });

    return () => {
      s.disconnect();
    };
  }, [recipientId, productId, user?._id]);

  const handleRating = async (val: number) => {
    try {
      await api.post(`/auth/user/${recipientId}/rate`, { rating: val });
      toast.success("Thanks for the rating! ⭐");
      setShowRatingModal(false);
    } catch (err) {
      toast.error("Failed to submit rating");
    }
  };

  /* ── Data ── */
  useEffect(() => {
    if (!recipientId || !productId) return;
    (async () => {
      const [u, p, h] = await Promise.allSettled([
        api.get(`/auth/user/${recipientId}`),
        api.get(`/products/${productId}`),
        api.get(`/chat/history?recipientId=${recipientId}&productId=${productId}`),
      ]);
      if (u.status === "fulfilled") setRecipient(u.value.data.data.user);
      if (p.status === "fulfilled") setProduct(p.value.data.data.product);
      if (h.status === "fulfilled") {
        setMessages(h.value.data.data.messages.map((m: any) => ({
          senderId: m.sender, message: m.content, timestamp: m.createdAt,
        })));
      }
      setLoading(false);
    })();
  }, [recipientId, productId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send ── */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMsg.trim();
    if (!text || !recipientId || !productId || sending) return;

    const msgData = {
      senderId:    user?._id,
      senderName:  user?.name,
      recipientId,
      message:     text,
      productId,
      timestamp:   new Date().toISOString(),
    };

    setMessages((p) => [...p, msgData]);
    setNewMsg("");
    setSending(true);

    socketRef.current?.emit("sendMessage", msgData);
    try {
      await api.post("/chat/message", { recipientId, productId, message: text });
    } catch {
      toast.error("Failed to send");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const sendMeetupSuggestion = async (spot: string) => {
    const text = `Hey! Let's meet at ${spot} to exchange the item. Is 4 PM today okay? 🤝`;
    setNewMsg(text);
    setShowMeetup(false);
    inputRef.current?.focus();
  };

  const generateReceipt = (p: any, u: any, r: any) => {
    const doc = new jsPDF() as any;
    const primaryColor = [79, 70, 229]; // Indigo-600
    const secondaryColor = [15, 23, 42]; // Slate-900

    // ── Header Section ──
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 0, 210, 50, "F");
    
    // Logo Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("EduTrade", 20, 32);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL TRANSACTION RECEIPT", 20, 42);
    
    // Date & ID (Top Right)
    doc.setFontSize(9);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`DATE: ${dateStr}`, 140, 32);
    const transId = `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    doc.text(`ID: ${transId}`, 140, 38);

    // ── Body ──
    let y = 70;

    // Item Header
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ITEM DETAILS", 20, y);
    y += 10;

    // Item Table
    autoTable(doc, {
      startY: y,
      head: [["Description", "Category", "Condition", "Final Price"]],
      body: [[p.title, p.category, p.condition, `INR ${p.price}`]],
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 5 },
      margin: { left: 20, right: 20 }
    });

    y = (doc as any).lastAutoTable.finalY + 25;

    // Parties Involved
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.text("PARTIES INVOLVED", 20, y);
    y += 12;

    // Seller & Buyer Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SELLER", 20, y);
    doc.text("BUYER", 110, y);
    
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(u.name, 20, y);
    doc.text(r.name, 110, y);
    
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(u.college || "EduTrade Member", 20, y);
    doc.text(r.college || "EduTrade Member", 110, y);

    // ── Footer ──
    const footerY = 270;
    doc.setDrawColor(230, 230, 230);
    doc.line(20, footerY - 10, 190, footerY - 10);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("This is an electronically generated receipt and does not require a physical signature.", 105, footerY, { align: "center" });
    doc.text("Thank you for contributing to a sustainable campus economy! 🌿", 105, footerY + 5, { align: "center" });
    
    // Verified Badge
    doc.setFillColor(...primaryColor);
    doc.roundedRect(160, 265, 30, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("VERIFIED", 175, 271, { align: "center" });

    doc.save(`EduTrade_Receipt_${p.title.replace(/\s+/g, "_")}.pdf`);
  };

  const handleMarkAsSold = async () => {
    if (!product?._id) return;
    try {
      // 1. Generate Receipt for Seller
      generateReceipt(product, user, recipient);

      // 2. Mark product as sold & clean from DB (using seller-specific endpoint)
      await api.put(`/products/${product._id}/mark-sold`, { soldTo: recipientId });
      
      setProduct({ ...product, isAvailable: false });
      toast.success("Product SOLD & Cleaned from DB! 📄✨");
      
      // 3. Notify the buyer and send receipt notice
      const msgData = {
        senderId: user?._id,
        senderName: user?.name,
        recipientId,
        message: "Item Sold! I've sent the receipt. 📑 Please check your downloads.",
        productId,
        timestamp: new Date().toISOString(),
      };
      setMessages((p) => [...p, msgData]);
      socketRef.current?.emit("sendMessage", msgData);
      socketRef.current?.emit("showRating", { recipientId }); 
    } catch (err) {
      console.error(err);
      toast.error("Process failed");
    }
  };

  /* ── Empty state ── */
  if (!recipientId || !productId)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6" style={{ marginTop: 72 }}>
        <MessageSquare size={56} className="text-gray-700" />
        <h2 className="text-2xl font-bold">No conversation selected</h2>
        <p className="text-gray-500">Go to a product listing and tap "Start Chat" to begin.</p>
      </div>
    );

  return (
    <div
      className="fixed inset-0 flex flex-col bg-background z-[60]"
      style={{ height: "100dvh" }}
    >
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 py-3 glass-morphism border-b border-white/5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-xl hover:bg-white/5 transition-all text-gray-400"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Avatar */}
        <Link href={`/profile/${recipientId}`} className="relative flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden">
            {recipient?.avatar
              ? <img src={recipient.avatar} className="w-full h-full object-cover" alt="" />
              : <span>{recipient?.name?.charAt(0) || "?"}</span>}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        </Link>

        <Link href={`/profile/${recipientId}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
          <p className="font-bold text-sm leading-none truncate">{recipient?.name || "Loading…"}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{recipient?.college || "Online"}</p>
        </Link>

        <div className="flex items-center gap-1 flex-shrink-0 relative">
          <button 
            onClick={() => setShowMeetup(!showMeetup)}
            title="Suggest Meetup Spot"
            className={`p-2 rounded-xl transition-all ${showMeetup ? "bg-primary text-white" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
          >
            <MapPin size={18} />
          </button>

          <AnimatePresence>
            {showMeetup && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-64 glass-morphism p-4 rounded-3xl shadow-2xl border border-primary/20 z-50"
              >
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Suggest Meetup Spot</p>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => { setShowMap(!showMap); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-bold transition-all hover:bg-primary/90 mb-1"
                  >
                    <MapIcon size={14} /> {showMap ? "Hide Map" : "Select on Map 🗺️"}
                  </button>

                  {showMap && (
                    <div className="mb-2">
                      <MeetupMap onSelect={(lat, lng) => {
                        const text = `Let's meet here! 📍 View on Maps: https://www.google.com/maps?q=${lat},${lng}`;
                        setNewMsg(text);
                        setShowMap(false);
                        setShowMeetup(false);
                      }} />
                      <p className="text-[9px] text-gray-500 mt-1 text-center italic">Click on campus map to pick a spot</p>
                    </div>
                  )}

                  {!showMap && CAMPUS_SPOTS.map(spot => (
                    <button
                      key={spot}
                      onClick={() => sendMeetupSuggestion(spot)}
                      className="text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary text-xs font-medium transition-all flex items-center gap-2"
                    >
                      <MapPin size={12} /> {spot}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-primary transition-all"><Phone size={18} /></button>
          <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-primary transition-all"><Video size={18} /></button>
          <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 transition-all"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* ── Product context pill ── */}
      {product && (
        <div className="flex-shrink-0 mx-4 mt-3 mb-1 flex items-center gap-3 px-3 py-2 rounded-2xl bg-primary/5 border border-primary/10 transition-all">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
            {product.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" alt="" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-none truncate">{product.title}</p>
            <p className="text-xs text-primary font-black mt-0.5">₹{product.price}</p>
          </div>
          
          {product.isAvailable ? (
            (user?._id && (product.seller?._id || product.seller) === user._id) && (
              <button 
                onClick={handleMarkAsSold}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-xl text-[10px] font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
              >
                <CheckCircle size={12} /> Mark as Sold
              </button>
            )
          ) : (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-500/10 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-tighter">
              <Package size={12} /> Sold Out
            </div>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-center text-[10px] text-gray-600 font-semibold uppercase tracking-widest pb-2">
              🔒 Secure Campus Chat
            </p>

            {messages.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">
                Say hi to {recipient?.name?.split(" ")[0] || "the seller"}! 👋
              </p>
            )}

            {messages.map((m, i) => {
              const isMe = m.senderId === user?._id;
              const showAvatar = !isMe && (i === 0 || messages[i - 1]?.senderId !== m.senderId);
              return (
                <div key={i} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                  {/* Recipient avatar */}
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0 overflow-hidden mb-0.5" style={{ opacity: showAvatar ? 1 : 0 }}>
                      {recipient?.avatar
                        ? <img src={recipient.avatar} className="w-full h-full object-cover" alt="" />
                        : recipient?.name?.charAt(0)}
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-primary text-white rounded-br-sm"
                        : "glass-morphism rounded-bl-sm"
                    }`}
                  >
                    <p className="break-words">{m.message}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-white/50 text-right" : "text-gray-500"}`}>
                      {timeAgo(m.timestamp)}
                    </p>
                  </motion.div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/5 bg-background relative">
        <form onSubmit={handleSend} className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-2xl">
          <button type="button" className="p-1.5 text-gray-500 hover:text-primary transition-all flex-shrink-0">
            <Smile size={18} />
          </button>
          <input
            ref={inputRef}
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
            placeholder="Type a message…"
            className="flex-1 bg-transparent outline-none text-sm min-w-0 placeholder-gray-500"
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.88 }}
            type="submit"
            disabled={!newMsg.trim() || sending}
            className="w-9 h-9 rounded-xl bg-primary disabled:opacity-30 flex items-center justify-center text-white flex-shrink-0 transition-all"
          >
            <Send size={16} />
          </motion.button>
        </form>
      </div>
      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-morphism p-10 rounded-[3rem] max-w-sm w-full text-center border border-white/10 shadow-2xl"
            >
              <div className="w-20 h-20 bg-yellow-500/20 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Star size={40} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-black mb-2">Rate the Seller!</h2>
              <p className="text-gray-400 text-sm mb-8">How was your experience trading with {recipient?.name}?</p>
              
              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setUserRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star 
                      size={32} 
                      fill={star <= userRating ? "#EAB308" : "none"} 
                      className={star <= userRating ? "text-yellow-500" : "text-gray-600"} 
                    />
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleRating(userRating)}
                  disabled={userRating === 0}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50"
                >
                  Submit Rating
                </button>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
