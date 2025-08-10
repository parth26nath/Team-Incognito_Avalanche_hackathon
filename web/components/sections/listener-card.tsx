import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import ListenerModal from "./listenerModal";
import { useState } from "react";

interface ListenerCardProps {
  listener: any;
}

export default function ListenerCard({ listener }: ListenerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" alt={listener.name} />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <h3 className="font-medium">{listener.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{listener.rating}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {listener.expertise}
              </div>
              <div className="text-sm text-muted-foreground">
                {listener.calls.length} calls
              </div>
              <div className="text-sm text-muted-foreground">
              {listener.time} average call time
              </div>
              <div className="text-sm text-muted-foreground">
                {listener.flags} flags
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ListenerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listener={{
          name: listener.name,
          credentials: listener.expertise,
          rating: listener.rating,
          calls: listener.calls.length,
          expertAddress: listener.id,
          voiceRate: listener.voiceRatePerMinute,
          videoRate: listener.videoRatePerMinute,
          flags: listener.flags,
          time: listener.time,
        }}
      />
    </div>
  );
}
