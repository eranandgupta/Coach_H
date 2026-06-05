'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatMessage {
  id: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Participant {
  id: number;
  name: string | null;
  image: string | null;
}

interface ChatViewProps {
  conversationId: number;
  participant: Participant;
  userId: number;
  onBack?: () => void;
}

export default function ChatView({ conversationId, participant, userId, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout>();

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetchMessages();

    pollRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (content: string) => {
    setSending(true);

    // Optimistic update
    const tempMessage: ChatMessage = {
      id: -Date.now(),
      senderId: userId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.message) {
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMessage.id ? data.message : m))
        );
      }
    } catch (error) {
      // Remove temp message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const label = date === today ? 'Today' : date === yesterday ? 'Yesterday' : date;

    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === label) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date: label, messages: [msg] });
    }
  });

  const initials = (participant.name || '?').charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex flex-col h-full bg-brand-navy"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10,15,31,0.95) 0%, rgba(10,15,31,0.85) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {onBack && (
          <button onClick={onBack} className="text-white/60 hover:text-white transition-colors p-1">
            <ArrowLeft size={22} />
          </button>
        )}
        {participant.image ? (
          <img src={participant.image} alt={participant.name || ''} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-sm">{participant.name || 'Unknown'}</p>
          <p className="text-white/40 text-[10px]">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-white/50 text-sm">No messages yet</p>
            <p className="text-white/30 text-xs mt-1">Say hi to start the conversation!</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <span className="text-[10px] text-white/30 bg-white/[0.05] rounded-full px-3 py-1">
                  {group.date}
                </span>
              </div>
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  createdAt={msg.createdAt}
                  isSender={msg.senderId === userId}
                  isRead={msg.isRead}
                />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={sending} />
    </motion.div>
  );
}
