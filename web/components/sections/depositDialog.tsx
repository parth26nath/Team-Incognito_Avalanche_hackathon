"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { approve, deposit } from "@/lib/contractHelpers/helper";
import { useState } from "react";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: any;
}

export function DepositDialog({
  open,
  onOpenChange,
  account,
}: DepositDialogProps) {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    // Handle deposit logic here

    console.log("Depositing:", amount);
    console.log(account);
    await approve(parseFloat(amount), account);
    await deposit(parseFloat(amount), account);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Add Balance
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Enter amount to add
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              min="0"
              step="0.01"
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white"
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Add ${amount || "0.00"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
