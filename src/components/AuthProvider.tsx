"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const PROTECTED_ROUTES = ["/chat", "/sell", "/profile", "/wishlist", "/my-listings"];
const AUTH_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
    const isAuth = AUTH_ROUTES.includes(pathname);
    const isProductDetail = /^\/products\/.+/.test(pathname);

    if (isProtected && !isAuthenticated) {
      router.replace("/login");
    }
    if (isAuth && isAuthenticated) {
      router.replace("/");
    }
    if (isProductDetail && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname]);

  return <>{children}</>;
}
