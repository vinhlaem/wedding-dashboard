"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60, retry: 1 },
        },
      }),
  );

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
