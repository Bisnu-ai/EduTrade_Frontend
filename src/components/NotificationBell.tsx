"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageCircle, Heart, ShoppingBag, X, CheckCheck, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { io } from "socket.io-client";

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ICON_MAP: Record<string, any> = {
  message: <MessageCircle size={18} className="text-primary" />,
  wishlist: <Heart size={18} className="text-red-500" />,
  sold: <ShoppingBag size={18} className="text-green-500" />,
  system: <Bell size={18} className="text-yellow-500" />,
};

export function NotificationBell() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data.notifications);
      setUnread(data.data.unreadCount);
    } catch (e: any) {
      if (e.response?.status === 401) {
        console.warn("Session expired. Please re-login to see notifications.");
      } else {
        console.error("Failed to fetch notifications:", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    // Real-time via socket
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
    const socket = io(socketUrl, { transports: ["websocket"] });
    socket.on("connect", () => {
      if (user?._id) socket.emit("join", user._id);
    });
    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnread((prev) => prev + 1);
    });
    return () => { socket.disconnect(); };
  }, [isAuthenticated, user?._id]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch (e) {}
  };

  const handleNotificationClick = async (notif: any) => {
    // Mark as read
    if (!notif.isRead) {
      await api.put(`/notifications/${notif._id}/read`).catch(() => {});
      setNotifications((prev) => prev.map((n) => n._id === notif._id ? { ...n, isRead: true } : n));
      setUnread((prev) => Math.max(0, prev - 1));
    }
    setOpen(false);

    // Navigate to chat if message type
    if (notif.type === "message" && notif.sender?._id && notif.relatedId) {
      router.push(`/chat?user=${notif.sender._id}&product=${notif.relatedId}`);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-glass-border transition-all hover:bg-primary/10 hover:text-primary"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed md:absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 top-[80px] md:top-[calc(100%+12px)] w-[90vw] md:w-96 max-h-[70vh] md:max-h-[500px] flex flex-col glass-morphism rounded-3xl shadow-2xl border border-glass-border overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-bold text-base">Notifications</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-all p-1 rounded-lg hover:bg-white/5">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-primary" size={28} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell size={36} className="mx-auto text-gray-700 mb-3" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.button
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    className={`w-full text-left px-5 py-4 flex items-start gap-4 border-b border-white/5 transition-all relative ${!notif.isRead ? "bg-primary/5" : ""}`}
                  >
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                    )}

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary flex-shrink-0 overflow-hidden">
                      {notif.sender?.avatar
                        ? <img src={notif.sender.avatar} className="w-full h-full object-cover" />
                        : (notif.sender?.name?.charAt(0) || "?")}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {ICON_MAP[notif.type]}
                        <span className="font-bold text-sm truncate">{notif.sender?.name || "System"}</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 leading-snug">{notif.message}</p>
                      <p className="text-[10px] text-gray-600 font-bold mt-1.5 uppercase tracking-wide">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
