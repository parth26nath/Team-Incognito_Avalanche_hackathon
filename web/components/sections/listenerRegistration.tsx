"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PinataSDK } from "pinata-web3";
import { registerExpert } from "@/lib/contractHelpers/helper";
import { services } from "@/core/services";
import { UPDATE_USER } from "@/core/services/api-urls";
import { useAccount } from "wagmi";

interface ListenerRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: any;
}

export function ListenerRegistrationDialog({
  open,
  onOpenChange,
  account,
}: ListenerRegistrationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    voiceRate: "",
    videoRate: "",
    // timepledged: "",
    languages: "",
    image: null as File | null,
  });
  const { address } = useAccount();

  const [IpfsHash, setIpfsHash] = useState("");
  const handleSubmit = async () => {
    try {
      // Handle registration logic here
      const cid = await uploadImage();
      console.log(account);
      await registerExpert(
        formData.name,
        formData.expertise,
        parseFloat(formData.voiceRate),
        parseFloat(formData.videoRate),
        cid,
        account
      );
      console.log("Submitting:", formData, cid);
      const resp = await services.put(UPDATE_USER + address, {
        languages: [formData.languages],
      });
      console.log("resp:", resp);
      if (resp) {
        onOpenChange(false);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const uploadImage = async () => {
    // Handle image upload logic here
    // if (!formData.image) return;
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
      pinataGateway: "orange-select-opossum-767.mypinata.cloud",
    });
    const upload = await pinata.upload.file(formData.image!);
    console.log(upload.IpfsHash);
    return upload.IpfsHash;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Become a Listener
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  formData.image
                    ? URL.createObjectURL(formData.image)
                    : "/placeholder.svg"
                }
                alt="Profile preview"
              />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, image: file }));
                }
              }}
            />
            <Label
              htmlFor="image-upload"
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              Upload Profile Picture
            </Label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Expertise</Label>
              <Input
                value={formData.expertise}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expertise: e.target.value,
                  }))
                }
                placeholder="e.g., Clinical Psychology"
              />
            </div>
            <div className="space-y-2">
              <Label>Languages known</Label>
              <Input
                value={formData.languages}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    languages: e.target.value,
                  }))
                }
                placeholder="e.g., English, Hindi"
              />
            </div>

            <div className="space-y-2">
              <Label>Voice Call Rate (per minute)</Label>
              <Input
                type="number"
                value={formData.voiceRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    voiceRate: e.target.value,
                  }))
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Video Call Rate (per minute)</Label>
              <Input
                type="number"
                value={formData.videoRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    videoRate: e.target.value,
                  }))
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {/* <div className="space-y-2">
              <Label>Time Pledged (hrs per week)</Label>
              <Input
                type="number"
                value={formData.timepledged}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    videoRate: e.target.value,
                  }))
                }
                placeholder="0 hrs"
                min="0"
                step="0.01"
              />
            </div> */}
          </div>

          <Button
            className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white"
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.expertise ||
              !formData.voiceRate ||
              !formData.videoRate
            }
          >
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
