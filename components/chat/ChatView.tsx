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
  showWhatsApp?: boolean;
  readOnly?: boolean;
  trainerName?: string;
  trainerUserId?: number;
}

export default function ChatView({ conversationId, participant, userId, onBack, showWhatsApp, readOnly, trainerName, trainerUserId }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  // Track optimistic (pending) message IDs so polls don't wipe them
  const pendingIdsRef = useRef<Set<number>>(new Set());

  const fetchMessages = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok || !mountedRef.current) return;
      const data = await res.json();
      if (data.messages) {
        setMessages((prev) => {
          // Keep any pending optimistic messages that the server doesn't have yet
          const serverIds = new Set(data.messages.map((m: ChatMessage) => m.id));
          const pendingMessages = prev.filter(
            (m) => m.id < 0 && pendingIdsRef.current.has(m.id) && !serverIds.has(m.id)
          );
          return [...data.messages, ...pendingMessages];
        });
      }
    } catch {
      // silent fail
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setMessages([]);
    fetchMessages();

    // Poll messages every 8s - only when tab is visible
    const startPoll = () => {
      pollRef.current = setInterval(fetchMessages, 8000);
    };
    const stopPoll = () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    const onVisibility = () => {
      if (document.hidden) {
        stopPoll();
      } else {
        fetchMessages();
        startPoll();
      }
    };

    startPoll();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mountedRef.current = false;
      stopPoll();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (content: string) => {
    setSending(true);

    // Optimistic update
    const tempId = -Date.now();
    const tempMessage: ChatMessage = {
      id: tempId,
      senderId: userId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    pendingIdsRef.current.add(tempId);
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
        pendingIdsRef.current.delete(tempId);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
      }
    } catch {
      pendingIdsRef.current.delete(tempId);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
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
        className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(99,145,255,0.04) 0%, rgba(10,15,31,0.95) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {onBack && (
          <button onClick={onBack} className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="relative">
          {participant.image ? (
            <img src={participant.image} alt={participant.name || ''} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/[0.1]" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm ring-1 ring-white/[0.1]">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-brand-navy" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{participant.name || 'Unknown'}</p>
          {readOnly && trainerName ? (
            <p className="text-amber-400/70 text-[10px] font-medium">Trainer: {trainerName} (View Only)</p>
          ) : (
            <p className="text-emerald-400/70 text-[10px] font-medium">Online</p>
          )}
        </div>
        {showWhatsApp && (
          <a
            href="https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20need%20help%20with%20my%20fitness%20plan."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full hover:bg-green-500/30 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-400 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-green-400 text-xs font-medium">WhatsApp</span>
          </a>
        )}
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
                  isSender={readOnly && trainerUserId ? msg.senderId === trainerUserId : msg.senderId === userId}
                  isRead={msg.isRead}
                  senderName={readOnly && trainerUserId ? (msg.senderId === trainerUserId ? trainerName : participant.name || 'Client') : undefined}
                />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pb-16 lg:pb-0">
        {readOnly ? (
          <div className="px-4 py-3 border-t border-white/[0.06] bg-amber-500/5">
            <p className="text-amber-400/60 text-xs text-center font-medium">
              View only — This is a conversation between {trainerName || 'Trainer'} and {participant.name || 'Client'}
            </p>
          </div>
        ) : (
          <MessageInput onSend={handleSend} disabled={sending} />
        )}
      </div>
    </motion.div>
  );
}
