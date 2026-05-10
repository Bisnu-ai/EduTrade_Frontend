"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Sub-component that actually uses the Google hook
function GoogleButton({ mode, loading, setLoading }: { mode: string, loading: boolean, setLoading: (v: boolean) => void }) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const { data } = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });
        setAuth(data.data.user, data.token);
        toast.success(data.message || "Welcome to CampusKart! 🎓");
        
        if (data.needsProfileUpdate) {
          router.push("/profile/complete");
        } else {
          router.push("/");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google sign-in was cancelled");
    },
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-semibold transition-all border border-foreground/10 hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed glass-morphism"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {mode === "register" ? "Sign up with Google" : "Continue with Google"}
        </>
      )}
    </button>
  );
}

export default function GoogleSignInButton({ mode = "login" }: { mode?: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    setClientId(id || null);
  }, []);

  const handleClick = () => {
    if (!clientId) {
      toast.error("Google Client ID missing! Please restart your server.");
      console.error("DEBUG: NEXT_PUBLIC_GOOGLE_CLIENT_ID is undefined in the browser.");
    }
  };

  if (!clientId) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-semibold transition-all border border-foreground/10 hover:bg-red-500/5 glass-morphism"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {mode === "register" ? "Sign up with Google" : "Continue with Google"}
      </button>
    );
  }

  return <GoogleButton mode={mode} loading={loading} setLoading={setLoading} />;
}
