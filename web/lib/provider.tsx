"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  authenticationAdapter,
  setCurrentAddress,
} from "@/helpers/authenticationAdapter";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import useAuthStatus from "@/hooks/useAuthStatus";
import dynamic from "next/dynamic";
// import { SocketProvider } from "@/context/SocketContext";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [baseSepolia, base],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false, // Changed to false to prevent hydration issues
});

// Create a new QueryClient instance for each request
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Client-side only wrapper
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Separate component for authentication logic
const AuthenticatedProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnecting } = useAccount();
  const { authStatus, handleAuthStatus } = useAuthStatus();

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleAuthStatus(address, isConnecting);
    }
  }, [address, isConnecting, handleAuthStatus]);

  useEffect(() => {
    if (address && typeof window !== "undefined") {
      setCurrentAddress(address);
    }
  }, [address]);

  return (
    <RainbowKitAuthenticationProvider
      status={authStatus}
      adapter={authenticationAdapter}
    >
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
};

// Main provider component without SSR
const ProviderComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ClientOnly>
          <AuthenticatedProvider>
            {/* <SocketProvider>{children}</SocketProvider> */}
            {children}
          </AuthenticatedProvider>
        </ClientOnly>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// Export with dynamic import and SSR disabled
export const Provider = dynamic(() => Promise.resolve(ProviderComponent), {
  ssr: false,
});
