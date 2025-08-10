"use client";

import React, { useEffect } from "react";
import ListenerCard from "@/components/sections/listener-card";
import { useSocket } from "@/context/SocketContext";

interface ListenersListProps {
  listeners: any[];
  filters: {
    expertise: string;
    language: string;
    rating: string;
  };
}

export const ListenersList = ({ listeners, filters }: ListenersListProps) => {
  const filteredListeners = listeners.filter((listener) => {
    if (filters.expertise && listener.expertise !== filters.expertise)
      return false;
    if (filters.language && !listener.languages?.includes(filters.language))
      return false;
    if (filters.rating && listener.rating < parseInt(filters.rating))
      return false;
    return true;
  });

  if (filteredListeners.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl font-nunito font-bold">
              No Listeners Found
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 space-y-4 w-full">
      {filteredListeners.map((listener: any, i: number) => (
        <ListenerCard key={i} listener={listener} />
      ))}
    </main>
  );
};
