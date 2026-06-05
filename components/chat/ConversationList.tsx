'use client';

import { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';

interface ConversationItem {
  id: number;
  participant: { id: number; name: string | null; image: string | null };
  lastMessage: { content: string; createdAt: string; senderId: number; isRead: boolean } | null;
  unreadCount: number;
  updatedAt: string;
}

interface ConversationListProps {
  conversations: ConversationItem[];
  selectedId?: number;
  onSelect: (conversation: ConversationItem) => void;
  showSearch?: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  showSearch = false,
}: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? conversations.filter((c) =>
        c.participant.name?.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  return (
    <div className="flex flex-col h-full bg-brand-navy">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-white font-bold text-xl mb-3">Messages</h2>
        {showSearch && (
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-blue/50"
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center mb-3">
              <MessageSquare size={24} className="text-brand-blue/50" />
            </div>
            <p className="text-white/40 text-sm">No conversations yet</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const initials = (conv.participant.name || '?').charAt(0).toUpperCase();
            const isSelected = selectedId === conv.id;
            const hasUnread = conv.unreadCount > 0;
            const preview = conv.lastMessage?.content
              ? conv.lastMessage.content.length > 40
                ? conv.lastMessage.content.slice(0, 40) + '...'
                : conv.lastMessage.content
              : 'No messages yet';

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                  isSelected
                    ? 'bg-white/[0.08]'
                    : 'hover:bg-white/[0.04]'
                } border-b border-white/[0.04]`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conv.participant.image ? (
                    <img
                      src={conv.participant.image}
                      alt={conv.participant.name || ''}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {initials}
                    </div>
                  )}
                  {hasUnread && (
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center border-2 border-brand-navy">
                      <span className="text-[9px] font-bold text-white">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${hasUnread ? 'text-white font-semibold' : 'text-white/80 font-medium'}`}>
                      {conv.participant.name || 'Unknown'}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-white/30 flex-shrink-0 ml-2">
                        {timeAgo(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${hasUnread ? 'text-white/60' : 'text-white/30'}`}>
                    {preview}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
