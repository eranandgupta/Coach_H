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
}

export default function ChatContainer({ userId, userRole }: ChatContainerProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const [coachInfo, setCoachInfo] = useState<Participant | null>(null);
  const [availableClients, setAvailableClients] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<NodeJS.Timeout>();

  const isCoach = userRole === 'coach' || userRole === 'admin';

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
      if (data.coachInfo) {
        setCoachInfo(data.coachInfo);
      }
      if (data.availableClients) {
        setAvailableClients(data.availableClients);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    pollRef.current = setInterval(fetchConversations, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchConversations]);

  // For clients: auto-create conversation with coach if none exists
  useEffect(() => {
    if (!isCoach && !loading && conversations.length === 0 && coachInfo) {
      const createConversation = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/chat/conversations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ coachId: coachInfo.id, clientId: userId }),
          });
          const data = await res.json();
          if (data.conversation) {
            fetchConversations();
          }
        } catch (error) {
          console.error('Failed to create conversation:', error);
        }
      };
      createConversation();
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coachId: userId, clientId: client.id }),
      });
      const data = await res.json();
      if (data.conversation) {
        await fetchConversations();
        // Find the newly created conversation and select it
        setSelectedConv({
          id: data.conversation.id,
          participant: client,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleBack = () => {
    setSelectedConv(null);
    fetchConversations(); // Refresh unread counts
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-brand-navy">
        <div className="w-8 h-8 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  // Client: go straight to chat (no list needed for single coach)
  if (!isCoach && selectedConv) {
    return (
      <ChatView
        conversationId={selectedConv.id}
        participant={selectedConv.participant}
        userId={userId}
      />
    );
  }

  // Mobile layout: show list or chat
  // Desktop layout: side by side
  return (
    <div className="flex h-full bg-brand-navy">
      {/* Conversation List */}
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

      {/* Chat View */}
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
