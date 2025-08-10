"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import FeedbackDialog from "@/components/sections/feedbackDialog";
import PaymentDialog from "@/components/sections/paymentDialog";

export default function CallPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [time, setTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(!isConnected);
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDisconnected = async () => {
    // Disconnect the Call here ...

    if (isConnected) {
      setShowFeedback(true);
    } else {
      console.log("Disconnected");
    }
  };
  const handleFeedbackComplete = () => {
    setShowFeedback(false);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-300 to-pink-300">
      {/* Ripple circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/20"
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{
              scale: [0.1, 2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: `${50 + i * 20}px`,
              height: `${50 + i * 20}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-screen flex flex-col items-center justify-between p-6">
        {isConnected ? (
          <motion.div
            className="flex flex-col items-center gap-4 mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Patient Listener"
                fill
                className="object-cover w-full h-full"
              />
            </div>

            {/* Name and Flags */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">
                Patient Listener
              </h2>
              <div className="text-sm text-white">Solidity</div>
            </div>

            {/* Timer */}
            <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-xl font-medium">{formatTime(time)}</span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="max-w-xs bg-white text-red-500 font-bold hover:text-red-600 transition-colors font-montserrat text-lg"
                onClick={() => handleDisconnected()}
              >
                Disconnect
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="max-w-xs bg-white text-yellow-500 font-bold hover:text-yellow-600 transition-colors font-montserrat text-lg"
                onClick={() => {
                  handleDisconnected();
                  // Add flag handling logic here
                }}
              >
                Flag Call
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.h1
            className="text-2xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Connecting{" "}
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </motion.h1>
        )}
        <FeedbackDialog
          isOpen={showFeedback}
          onClose={handleFeedbackComplete}
        />
        <PaymentDialog
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          duration={time}
          rate={10} // Set your rate here
        />
      </div>
    </div>
  );
}
