"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DepositDialog } from "@/components/sections/depositDialog";
import { ListenerRegistrationDialog } from "@/components/sections/listenerRegistration";
import { Wallet } from "lucide-react";
import { ConnectWallet } from "@/components/ui/connectButton";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { SUBGRAPH_URL } from "@/lib/consts";
import request, { gql } from "graphql-request";
import { pinata } from "@/lib/pinata";
import { refreshToken } from "@/helpers/auth";
import useAuthStatus from "@/hooks/useAuthStatus";
import Link from "next/link";
import dynamic from "next/dynamic";
import BottomNavbar from "@/components/sections/BottomNavbar";

interface FetchedUser {
  username: string;
  walletAddress: string;
  voicecallRate: string;
  videoCallRate: string;
  languages: string[];
  role: string;
}

// Create a client-only wrapper component
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

// Create the main profile content component
const ProfileContent = () => {
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showListenerDialog, setShowListenerDialog] = useState(false);
  const [isListener, setIsListener] = useState(false);
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState<string>("");
  const [user, setUser] = useState<FetchedUser | null>(null);
  const { address, isReconnecting, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { authStatus } = useAuthStatus();

  console.log("expert:::", expert);
  

  const fetchUserProfile = async (userAddress: string) => {
    try {
      const data: any = await request(
        SUBGRAPH_URL,
        gql`
          query MyQuery {
            experts(where: { id: "${userAddress.toLowerCase()}" }) {
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
            users(where: { id: "${userAddress.toLowerCase()}" }) {
              balance
              id
            }
          }
        `
      );
      console.log("data::", data);
      
      if (data.users.length > 0) {
        setBalance(data.users[0].balance / 10 ** 6);
      }
      if (data.experts.length > 0) {
        setIsListener(true);
        setExpert(data.experts[0]);
        // if (data.experts[0].cid) {
        //   try {
        //     const profileImage = await pinata.gateways.get(data.experts[0].cid);
        //     const url = URL.createObjectURL(profileImage.data as Blob);
        //     setProfile(url);
        //   } catch (error) {
        //     console.error("Error fetching profile image:", error);
        //   }
        // }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserProfile(address);

      const fetchProfileData = async () => {
        const token = localStorage.getItem("token");

        try {
          const response = await fetch(
            `https://heartly.live/api/users/wallet/${address}`,
            {
              method: "GET",
              cache: "no-store",
              headers: {
                authorization: `${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setUser(data);
          }

          if (data.error === "Invalid Token") {
            refreshToken(address);
            fetchProfileData();
          }
          if (data.error === "No user found") {
            setUser(null);
          }
        } catch (error) {
          console.error("Username check error:", error);
        }
      };

      void fetchProfileData();
    }
  }, [address]);

  const handleLogout = () => {
    if (disconnect) {
      disconnect();
      router.push("/test");
    }
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!address && !isReconnecting && !isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-md mx-auto p-4 pb-16">
          <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold">You are not logged in</h1>
            <div className="flex items-center gap-2">
              <Link
                href="/test"
                className="bg-gradient-to-r from-[#FBB03B] to-[#FBB4D5] text-white px-3 py-1 rounded-md text-sm font-nunito"
              >
                Go back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  console.log("isListener::", isListener);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-md mx-auto p-4 pb-16">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white relative">
              <AvatarImage
                src={isListener ? profile : ""}
                alt={isListener ? expert?.name : "Anonymous User"}
              />
              <AvatarFallback>
                {isListener ? expert?.name : "Anonymous"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full blur-xl opacity-50" />
          </div>
          {/* <h1 className="text-2xl font-bold">
            {isListener ? expert?.name : user?.username ?? "Anonymous User"}
          </h1> */}
          {/* <div className="flex items-center gap-2">
            <ConnectWallet />
          </div> */}
        </div>

        <Card className="mb-6 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Balance</h2>
                <p className="text-3xl font-bold text-primary">
                  ${balance.toFixed(2)}
                </p>
              </div>
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white"
              onClick={() => setShowDepositDialog(true)}
            >
              Add Balance
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-white">
            {!isListener ? (
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">
                  Become a Listener
                </h2>
                <p className="text-muted-foreground mb-4">
                  Help others and earn money by becoming a listener
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white"
                  onClick={() => setShowListenerDialog(true)}
                >
                  Register as Listener
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="mt-4 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Listener Profile</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expertise</span>
                    <span className="font-medium">{expert?.expertise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice Rate</span>
                    <span className="font-medium">
                      ${expert.voiceRatePerMinute / 10 ** 6}/min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Video Rate</span>
                    <span className="font-medium">
                      ${expert.videoRatePerMinute / 10 ** 6}/min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">⭐️ {expert?.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Calls</span>
                    <span className="font-medium">
                      {expert?.calls?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flags</span>
                    <span className="font-medium">{expert?.flags ?? 0}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DepositDialog
        open={showDepositDialog}
        onOpenChange={setShowDepositDialog}
        account={address}
      />

      <ListenerRegistrationDialog
        open={showListenerDialog}
        onOpenChange={setShowListenerDialog}
        account={address}
      />
       <BottomNavbar />
    </div>
  );
};

// Export the wrapped component with dynamic import and SSR disabled
export default dynamic(
  () =>
    Promise.resolve(function ProfilePage() {
      return (
        <ClientOnly>
          <ProfileContent />
        </ClientOnly>
      );
    }),
  { ssr: false }
);

// to navigate to the login page if the user is not connected
// useEffect(() => {
//   if (
//     authStatus !== "loading" &&
//     !address &&
//     !isReconnecting &&
//     authStatus !== "authenticated"
//   ) {
//     router.push("/test");
//   }
// }, [authStatus, address, isReconnecting]);
