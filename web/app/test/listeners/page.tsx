"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { gql, request } from "graphql-request";
import { SUBGRAPH_URL } from "@/lib/consts";
import { LoginForm } from "@/components/sections/loginform";
import { Header } from "@/components/sections/header";
import { ListenersList } from "@/components/sections/listenerlist";
import useAuthStatus from "@/hooks/useAuthStatus";
import BottomNavbar from "@/components/sections/BottomNavbar";
// import { getToken } from "@/lib/provider";

const Page = () => {
  const { address, isConnecting, isReconnecting, isConnected } = useAccount();
  const [listeners, setListeners] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false); // Changed initial state to false
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    expertise: "",
    language: "",
    rating: "",
  });
  // const [isToken, setIsToken] = useState<string | null>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);
  const { authStatus } = useAuthStatus();
  // console.log("authStatus::", authStatus);

  // let token = localStorage.getItem("token");
  // console.log("address::", address);
  // console.log("token::", token);

  // useEffect(() => {
  //   const fetchToken = () => {
  //     const token = getToken();
  //     console.log("Token fetched:", token);
  //     if (token) {
  //       setIsToken(token);
  //     }
  //   };
  //   // Trigger fetchToken when connected or authStatus changes
  //   if (isConnected) {
  //     fetchToken();
  //   }
  // }, [isConnected, authStatus]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  console.error("listeners:", listeners);

  const fetchListeners = async () => {
    if (!address) return; // Don't fetch if no address

    setIsLoading(true);
    setError(null);

    try {
      const data: any = await request(
        SUBGRAPH_URL,
        gql`
          query MyQuery {
            experts {
              balance
              cid
              expertise
              flags
              id
              isRegistered
              name
              rating
              voiceRatePerMinute
              videoRatePerMinute
              calls {
                id
              }
            }
          }
        `
      );
      setListeners(data.experts);
    } catch (error) {
      console.error("Error fetching listeners:", error);
      setError("Failed to fetch listeners. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have an address, no need to wait for authStatus
    if (address && !isConnecting && !isReconnecting) {
      fetchListeners();
    }
  }, [address, isConnecting, isReconnecting]); // Simplified dependencies

  // Show login form if not authenticated and not in a connecting state
  if (
    !address &&
    !isConnecting &&
    !isReconnecting &&
    authStatus !== "loading"
  ) {
    return <LoginForm />;
  }

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-center gap-4">
        <Header onFilterChange={handleFilterChange} />
        <ListenersList listeners={listeners} filters={filters} />
        <BottomNavbar />
      </div>
    </Fragment>
  );
};

export default Page;
