"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const VideoCall = dynamic(() => import("@/components/VideoCall"), { ssr: false });

interface CallContextType {
  initiateCall: (recipientId: string, recipientName: string, productId: string, type: 'video' | 'audio') => void;
  activeCall: any;
  endActiveCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error("useCall must be used within a CallProvider");
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const [activeCall, setActiveCall] = useState<{ roomId: string; type: 'video' | 'audio'; recipientId?: string } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callerId: string; callerName: string; roomId: string; type: 'video' | 'audio' } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id || socketRef.current) return;

    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
    const s = io(socketUrl, { transports: ["websocket"], reconnection: true });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("join", user._id);
    });

    s.on("incomingCall", (data) => {
      setIncomingCall(data);
      // Play a subtle sound or just show the toast-like notification
    });

    s.on("callAccepted", (data) => {
      setActiveCall({ roomId: data.roomId, type: data.type, recipientId: data.recipientId });
    });

    s.on("callRejected", () => {
      toast.error("Call rejected");
      setActiveCall(null);
    });

    s.on("callEnded", () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  const initiateCall = (recipientId: string, recipientName: string, productId: string, type: 'video' | 'audio') => {
    if (!user?._id) return;
    const roomId = [user._id, recipientId].sort().join("-") + "-" + productId;
    const callData = {
      callerId: user._id,
      callerName: user.name,
      recipientId,
      type,
      roomId
    };
    socketRef.current?.emit("startCall", callData);
    setActiveCall({ roomId, type, recipientId });
    toast.success(`Calling ${recipientName}...`);
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    socketRef.current?.emit("acceptCall", { 
      callerId: incomingCall.callerId, 
      roomId: incomingCall.roomId, 
      type: incomingCall.type,
      recipientId: user?._id 
    });
    setActiveCall({ roomId: incomingCall.roomId, type: incomingCall.type, recipientId: incomingCall.callerId });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socketRef.current?.emit("rejectCall", { callerId: incomingCall.callerId });
    setIncomingCall(null);
  };

  const endActiveCall = () => {
    if (activeCall) {
      socketRef.current?.emit("endCall", { recipientId: activeCall.recipientId });
      setActiveCall(null);
    }
  };

  return (
    <CallContext.Provider value={{ initiateCall, activeCall, endActiveCall }}>
      {children}

      {/* Global Incoming Call Notification (Side Toast Style) */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-20 right-4 z-[200] w-72 glass-morphism p-4 rounded-2xl border border-primary/20 shadow-2xl flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center animate-pulse">
              {incomingCall.type === 'video' ? <Video size={24} /> : <Phone size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{incomingCall.callerName}</p>
              <p className="text-[10px] text-muted">Incoming {incomingCall.type} call...</p>
            </div>
            <div className="flex gap-2">
              <button onClick={rejectCall} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all">
                <X size={16} />
              </button>
              <button onClick={acceptCall} className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-all">
                <Check size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Call UI */}
      {activeCall && (
        <div className="fixed inset-0 z-[210] bg-black">
          <VideoCall 
            roomId={activeCall.roomId}
            userId={user?._id || ""}
            userName={user?.name || "User"}
            isAudioOnly={activeCall.type === 'audio'}
            onLeave={endActiveCall}
          />
        </div>
      )}
    </CallContext.Provider>
  );
};
