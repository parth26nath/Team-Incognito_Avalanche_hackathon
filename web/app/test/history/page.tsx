"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CallDetailsDialog from "./historyDialog";
import { PhoneCall, Video } from "lucide-react";
import { formatDuration, formatDate } from "@/lib/formatters";
import { useDisconnectWallet } from "@/components/ui/connectButton";
import { useRouter } from "next/navigation";
import { SUBGRAPH_URL } from "@/lib/consts";
import request, { gql } from "graphql-request";
import { useAccount } from "wagmi";

interface Call {
  id: string;
  callType: string;
  status: string;
  startTime: string;
  endTime: string;
  actualDuration: string;
  scheduledDuration: string;
  amountPaid: string;
  stakedAmount: string;
  user: { id: string };
  expert: { id: string };
}

const mockCalls: Call[] = [
  {
    id: "0xea2743f947ec8a64bd3ce85c07892d78b0f7b8e2869c71e24f637bff9a27cdd7",
    callType: "VOICE",
    status: "ENDED",
    startTime: "1735303072",
    endTime: "1735303072",
    scheduledDuration: "2",
    actualDuration: "2",
    amountPaid: "1000000",
    stakedAmount: "1000000",
    user: { id: "0x4b4b30e2e7c6463b03cdffd6c42329d357205334" },
    expert: { id: "0x76050f043a864114eafaecc35be4ad8dbe8fea9b" },
  },
  {
    id: "0xea2743f947ec8a64bd3ce85c07892d78b0f7b8e2869c71e24f637bff9a27cdd7",
    callType: "VIDEO",
    status: "ENDED",
    startTime: "1735303072",
    endTime: "1735303072",
    scheduledDuration: "2",
    actualDuration: "2",
    amountPaid: "1000000",
    stakedAmount: "1000000",
    user: { id: "0x4b4b30e2e7c6463b03cdffd6c42329d357205334" },
    expert: { id: "0x76050f043a864114eafaecc35be4ad8dbe8fea9b" },
  },
  // Add more mock calls here for testing
];

export default function HistoryPage() {
  const disconnectWallet = useDisconnectWallet();
  const router = useRouter();
  const [history, setHistory] = useState<any>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const { address } = useAccount();

  const handleLogout = () => {
    disconnectWallet(); // Disconnect the wallet
    router.push("/test"); // Navigate back to the previous screen
  };

  const callHistory = async (address: string) => {
    try {
      const data: any = await request(
        SUBGRAPH_URL,
        gql`
          query MyQuery {
            users(where: { id: "${address.toLowerCase()}" }) {
              balance
              id
              calls {
                actualDuration
                amountPaid
                callType
                endTime
                flag
                id
                platformFee
                rating
                scheduledAt
                startTime
                stakedAmount
                status
                expert {
                  id
                  name
                      expertise
                }
              }
            }
          }
        `
      );
      console.log(data);
      setHistory(data.users[0].calls);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (address) {
      callHistory(address);
    }
  }, [address]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFA2C933] to-[#FEBF5D33] p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">Call History</h1>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {history.map((call: any) => (
          <Card
            key={call.id}
            className="hover:shadow-md bg-white transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {call.callType === "VOICE" ? "Voice" : "Video"} Call
                  </span>
                  {call.callType === "VOICE" ? (
                    <PhoneCall className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Video className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    call.status === "ENDED"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {call.status}
                </span>
              </div>
              {call.startTime && (
                <div className="text-sm text-gray-600 mb-2">
                  {formatDate(parseInt(call.startTime))}
                </div>
              )}
              <div className="text-sm text-gray-600 flex gap-2 justify-between">
                {call.expert && (
                  <div>
                    Expert:{" "}
                    <span className="font-semibold">{call.expert.name}</span>
                  </div>
                )}
                <div>
                  {call.expert && (
                    <span className="font-semibold">
                      {call.expert.expertise}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>
                  Duration:{" "}
                  {(call.actualDuration &&
                    formatDuration(parseInt(call.actualDuration))) ||
                    "00:00"}
                </span>

                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-white py-2 px-4 rounded hover:bg-gradient-to-r hover:from-[#FFA2C9] hover:to-[#FEBF5D] hover:transition-colors duration-300 font-nunito text-base self-end "
                  size="sm"
                  onClick={() =>
                    setSelectedCall({
                      id: call.id,
                      callType: call.callType,
                      status: call.status,
                      startTime: call.startTime,
                      endTime: call.endTime,
                      actualDuration: call.actualDuration,
                      scheduledDuration: call.scheduledDuration,
                      amountPaid: call.amountPaid,
                      stakedAmount: call.stakedAmount,
                      user: { id: address as string },
                      expert: { id: call.expert.id },
                    })
                  }
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCall && (
        <CallDetailsDialog
          call={selectedCall}
          open={!!selectedCall}
          onOpenChange={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}
