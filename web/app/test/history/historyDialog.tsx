import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatDuration,
  formatDate,
  formatAmount,
  truncateAddress,
} from "@/lib/formatters";

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

interface CallDetailsDialogProps {
  call: Call;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CallDetailsDialog({
  call,
  open,
  onOpenChange,
}: CallDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Call Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Call Type:</span>
            <span className="font-medium">{call.callType}</span>

            <span className="text-muted-foreground">Status:</span>
            <span
              className={`font-medium ${
                call.status === "ENDED" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {call.status}
            </span>

            <span className="text-muted-foreground">Start Time:</span>
            <span className="font-medium">
              {formatDate(parseInt(call.startTime))}
            </span>

            <span className="text-muted-foreground">End Time:</span>
            <span className="font-medium">
              {formatDate(parseInt(call.endTime))}
            </span>

            <span className="text-muted-foreground">Actual Duration:</span>
            <span className="font-medium">
              {formatDuration(parseInt(call.actualDuration))}
            </span>

            <span className="text-muted-foreground">Scheduled Duration:</span>
            <span className="font-medium">
              {formatDuration(parseInt(call.scheduledDuration))}
            </span>

            <span className="text-muted-foreground">Amount Paid:</span>
            <span className="font-medium">{formatAmount(call.amountPaid)}</span>

            <span className="text-muted-foreground">Staked Amount:</span>
            <span className="font-medium">
              {formatAmount(call.stakedAmount)}
            </span>

            <span className="text-muted-foreground">User:</span>
            <span className="font-medium">{truncateAddress(call.user.id)}</span>

            <span className="text-muted-foreground">Expert:</span>
            <span className="font-medium">
              {truncateAddress(call.expert.id)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
