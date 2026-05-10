"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    // If no Google Client ID is configured, just render children without Google OAuth
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
