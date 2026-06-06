'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ConversationList from './ConversationList';
import ChatView from './ChatView';

interface Participant {
  id: number;
  name: string | null;
  image: string | null;
}

interface ConversationItem {
  id: number;
  participant: Participant;
  lastMessage: { content: string; createdAt: string; senderId: number; isRead: boolean } | null;
  unreadCount: number;
  updatedAt: string;
}

interface ChatContainerProps {
  userId: number;
  userRole: string;
  onClose?: () => void;
}

export default function ChatContainer({ userId, userRole, onClose }: ChatContainerProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const [coachInfo, setCoachInfo] = useState<Participant | null>(null);
  const [availableClients, setAvailableClients] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  const isCoach = userRole === 'coach' || userRole === 'admin';

  const fetchConversations = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok || !mountedRef.current) return;
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
      if (data.coachInfo) setCoachInfo(data.coachInfo);
      if (data.availableClients) setAvailableClients(data.availableClients);
    } catch {
      // silent fail
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchConversations();

    // Poll conversation list every 15s (lightweight - just list + last message)
    pollRef.current = setInterval(fetchConversations, 15000);

    // Pause polling when tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        if (pollRef.current) clearInterval(pollRef.current);
      } else {
        fetchConversations();
        pollRef.current = setInterval(fetchConversations, 15000);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchConversations]);

  // For clients: auto-create conversation with coach if none exists (one-time)
  const createdRef = useRef(false);
  useEffect(() => {
    if (!isCoach && !loading && conversations.length === 0 && coachInfo && !createdRef.current) {
      createdRef.current = true;
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coachId: coachInfo.id, clientId: userId }),
      })
        .then(() => fetchConversations())
        .catch(() => {});
    }
  }, [isCoach, loading, conversations.length, coachInfo, userId, fetchConversations]);

  // For clients: auto-select the single conversation
  useEffect(() => {
    if (!isCoach && conversations.length === 1 && !selectedConv) {
      setSelectedConv(conversations[0]);
    }
  }, [isCoach, conversations, selectedConv]);

  const handleSelect = (conv: ConversationItem) => {
    setSelectedConv(conv);
  };

  const handleStartChat = async (client: Participant) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coachId: userId, clientId: client.id }),
      });
      const data = await res.json();
      if (data.conversation) {
        await fetchConversations();
        setSelectedConv({
          id: data.conversation.id,
          participant: client,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {
      // silent fail
    }
  };

  const handleBack = () => {
    setSelectedConv(null);
    fetchConversations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-brand-navy">
        <div className="w-8 h-8 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  // Client: go straight to chat
  if (!isCoach && selectedConv) {
    return (
      <ChatView
        conversationId={selectedConv.id}
        participant={selectedConv.participant}
        userId={userId}
        showWhatsApp
        onBack={onClose}
      />
    );
  }

  return (
    <div className="flex h-full bg-brand-navy">
      <div
        className={`${
          selectedConv ? 'hidden lg:flex' : 'flex'
        } flex-col w-full lg:w-[320px] lg:border-r lg:border-white/[0.06] flex-shrink-0`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedConv?.id}
          onSelect={handleSelect}
          showSearch={isCoach}
          availableClients={isCoach ? availableClients : []}
          onStartChat={handleStartChat}
        />
      </div>

      <div className={`${selectedConv ? 'flex' : 'hidden lg:flex'} flex-col flex-1`}>
        <AnimatePresence mode="wait">
          {selectedConv ? (
            <ChatView
              key={selectedConv.id}
              conversationId={selectedConv.id}
              participant={selectedConv.participant}
              userId={userId}
              onBack={isCoach ? handleBack : undefined}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <p className="text-white/50 text-base font-medium">Select a conversation</p>
                <p className="text-white/30 text-sm mt-1">Choose a client to start chatting</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
