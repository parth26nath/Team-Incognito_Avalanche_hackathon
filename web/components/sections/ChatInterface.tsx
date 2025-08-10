'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  currentUser: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partner, setPartner] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socket.on('partner-found', (partnerAddress: string) => {
      setPartner(partnerAddress);
      setIsSearching(false);
    });

    socket.on('partner-typing', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    });

    socket.on('chat-ended', () => {
      setPartner(null);
      setMessages([]);
    });

    return () => {
      socket.off('chat-message');
      socket.off('partner-found');
      socket.off('partner-typing');
      socket.off('chat-ended');
    };
  }, [socket]);

  const findRandomChat = () => {
    if (!socket) return;
    setIsSearching(true);
    socket.emit('find-random-chat');
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !inputMessage.trim() || !partner) return;

    const message: Message = {
      id: Math.random().toString(),
      sender: currentUser,
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    socket.emit('send-message', message);
    setMessages(prev => [...prev, message]);
    setInputMessage('');
    scrollToBottom();
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (!socket || !partner) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('typing');
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing');
    }, 1000);
  };

  const endChat = () => {
    if (!socket || !partner) return;
    socket.emit('end-chat');
    setPartner(null);
    setMessages([]);
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        {partner ? (
          <>
            <div className="flex items-center gap-2">
              <Avatar />
              <span className="font-medium">Anonymous User</span>
              {isTyping && (
                <span className="text-sm text-gray-500 animate-pulse">typing...</span>
              )}
            </div>
            <Button variant="destructive" onClick={endChat}>End Chat</Button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Button 
              onClick={findRandomChat}
              disabled={isSearching}
              className="w-48"
            >
              {isSearching ? 'Searching...' : 'Find Random Chat'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === currentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={handleTyping}
            placeholder={partner ? "Type a message..." : "Find a chat partner to start messaging"}
            disabled={!partner}
            className="flex-1"
          />
          <Button type="submit" disabled={!partner || !inputMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
};