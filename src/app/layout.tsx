import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduTrade | Secure Campus Marketplace 🎓",
  description: "The official marketplace for college students. Buy, sell, and trade textbooks, electronics, and dorm essentials with verified students in your campus.",
  icons: {
    icon: "/favicon.ico?v=2",
  }
};

import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
              },
            }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
