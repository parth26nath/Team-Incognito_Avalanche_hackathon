"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
  rate: number;
}

export default function PaymentDialog({
  isOpen,
  onClose,
  duration,
  rate,
}: PaymentDialogProps) {
  const router = useRouter();
  const totalAmount = (duration * rate).toFixed(2);

  const handlePayment = () => {
    setShowSuccess(true);
    // Payment processing logic here
    onClose();
  };
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[320px] p-6 rounded-2xl">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Payment Details
            </h2>

            <div className="text-lg">Duration: {duration} minutes</div>

            <div className="text-xl font-bold">
              Total Amount: ${totalAmount}
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Proceed to Pay
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-[320px] p-6 rounded-2xl">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Payment Successful!
            </h2>

            <div className="text-lg text-center">
              Thank you for using Heartly. Your payment has been processed
              successfully.
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push("/");
              }}
              className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
