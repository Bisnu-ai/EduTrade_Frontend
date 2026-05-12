import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusKart | Secure Campus Marketplace 🎓",
  description: "The official marketplace for college students. Buy, sell, and trade textbooks, electronics, and dorm essentials with verified students in your campus.",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CampusKart",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { CallProvider } from "@/components/CallProvider";
import GoogleAuthProvider from "@/components/GoogleAuthProvider";
import Script from "next/script";
import OptimizedChatBot from "@/components/OptimizedChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased transition-colors duration-300`}>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleAuthProvider>
          <AuthProvider>
          <CallProvider>
            <Navbar />
            <main>{children}</main>
            <OptimizedChatBot />
            <Footer />
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
              },
            }} />
          </CallProvider>
          </AuthProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
