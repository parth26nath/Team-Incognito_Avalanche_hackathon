"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackDialog({
  isOpen,
  onClose,
}: FeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log({ rating, feedback });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[320px] p-6 rounded-2xl">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            How did it go?
          </h2>

          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 rounded-full"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating >= star
                      ? "fill-orange-400 text-orange-400"
                      : "text-neutral-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Feedback Input */}
          <div className="w-full space-y-2">
            <label className="text-sm text-muted-foreground">
              Anything we could improve?
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="resize-none h-24"
              placeholder="Type your feedback here..."
            />
          </div>

          {/* Submit button appears when rating is selected */}
          {rating > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Skip
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
