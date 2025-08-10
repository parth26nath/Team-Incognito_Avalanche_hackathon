import { useState } from "react";

const useAuthStatus = () => {
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("unauthenticated");

  const handleAuthStatus = (
    address: `0x${string}` | undefined,
    isConnecting: boolean
  ) => {
    const token = localStorage.getItem("token");
    if (isConnecting && address) {
      setAuthStatus("loading");
    } else if (address && token) {
      setAuthStatus("authenticated");
    } else {
      setAuthStatus("unauthenticated");
    }
  };

  return { authStatus, handleAuthStatus };
};

export default useAuthStatus;
