'use client';

import { ChatInterface } from '@/components/sections/ChatInterface';
import { useAccount } from 'wagmi';
import { SocketProvider } from '@/context/SocketContext';

export default function ChatPage() {
  const { address } = useAccount();

  return (
    <SocketProvider>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Anonymous Chat</h1>
          <p className="text-center mb-8 text-gray-600">
            Connect with random people and chat anonymously. Your identity is protected through blockchain authentication.
          </p>
          {address ? (
            <ChatInterface currentUser={address} />
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-lg">Please connect your wallet to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
}