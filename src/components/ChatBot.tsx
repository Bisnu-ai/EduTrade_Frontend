"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);
  const [chat, setChat] = useState<{role: string, text: string}[]>([
    { role: "model", text: "Hi! I'm EduBot. Ask me anything about EduTrade! 🎓" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage("");
    setChat(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { 
        message: userMsg,
        history: history 
      });

      const botReply = data.data.reply;
      setChat(prev => [...prev, { role: "model", text: botReply }]);
      
      // Update history for next call
      setHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: userMsg }] },
        { role: "model", parts: [{ text: botReply }] }
      ]);
    } catch (error) {
      setChat(prev => [...prev, { role: "model", text: "Sorry, I'm having trouble connecting. Please try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }}
      className="fixed bottom-6 right-6 z-[100] cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4 w-[90vw] max-w-[380px] h-[500px] bg-card/95 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-white/10"
          >
            {/* Header */}
            <div className="p-5 bg-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">EduBot AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white/5 text-foreground border border-white/5 rounded-tl-none"
                  }`}>
                    <ReactMarkdown 
                      components={{
                        a: ({node, ...props}) => {
                          const isInternal = props.href?.startsWith("/");
                          if (isInternal) {
                            return <Link href={props.href!} className="text-primary-hover font-bold underline underline-offset-4 decoration-2 hover:text-white transition-colors" {...props as any} />;
                          }
                          return <a className="text-primary-hover font-bold underline underline-offset-4 decoration-2" target="_blank" rel="noopener noreferrer" {...props} />;
                        },
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader2 size={18} className="animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-2">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary/50 transition-all"
              />
              <button 
                disabled={loading}
                className="bg-primary p-2.5 rounded-xl text-white hover:bg-primary-hover transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
               <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
               <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center animate-bounce shadow-lg">
             <Sparkles size={8} className="text-white" />
           </span>
        )}
      </motion.button>
    </motion.div>
  );
}
