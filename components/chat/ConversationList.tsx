'use client';

import { useState } from 'react';
import { Search, MessageSquare, ArrowLeft } from 'lucide-react';

interface ConversationItem {
  id: number;
  participant: { id: number; name: string | null; image: string | null; lastSeenAt?: string | null };
  lastMessage: { content: string; createdAt: string; senderId: number; isRead: boolean } | null;
  unreadCount: number;
  updatedAt: string;
  isTrainerConversation?: boolean;
  trainer?: { id: number; name: string | null; image: string | null };
}

interface AvailableClient {
  id: number;
  name: string | null;
  image: string | null;
  lastSeenAt?: string | null;
}

interface ConversationListProps {
  conversations: ConversationItem[];
  selectedId?: number;
  onSelect: (conversation: ConversationItem) => void;
  showSearch?: boolean;
  availableClients?: AvailableClient[];
  onStartChat?: (client: AvailableClient) => void;
  onBack?: () => void;
}

// Online if seen within the last 2 minutes (heartbeat runs every 60s).
function isOnline(lastSeenAt?: string | null) {
  return !!lastSeenAt && Date.now() - new Date(lastSeenAt).getTime() < 2 * 60 * 1000;
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
  availableClients = [],
  onStartChat,
  onBack,
}: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? conversations.filter((c) =>
        c.participant.name?.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  const filteredAvailable = search
    ? availableClients.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
      )
    : availableClients;

  return (
    <div className="flex flex-col h-full bg-brand-navy">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        {onBack && (
          <div className="flex items-center gap-3 mb-3 lg:hidden">
            <button onClick={onBack} className="text-white/60 hover:text-white transition-colors p-1 -ml-1">
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-white font-bold text-xl">Messages</h2>
          </div>
        )}
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
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-16 lg:pb-0">
        {filtered.length === 0 && filteredAvailable.length === 0 ? (
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
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-brand-navy ${isOnline(conv.participant.lastSeenAt) ? 'bg-emerald-400' : 'bg-gray-500'}`} title={isOnline(conv.participant.lastSeenAt) ? 'Online' : 'Offline'} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className={`text-sm truncate ${hasUnread ? 'text-white font-semibold' : 'text-white/80 font-medium'}`}>
                        {conv.participant.name || 'Unknown'}
                      </p>
                      {conv.isTrainerConversation && conv.trainer && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                          via {conv.trainer.name?.split(' ')[0] || 'Trainer'}
                        </span>
                      )}
                    </div>
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

        {/* Available clients without conversations */}
        {filteredAvailable.length > 0 && (
          <div>
            <div className="px-4 py-2 border-b border-white/[0.04]">
              <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Your Clients</p>
            </div>
            {filteredAvailable.map((client) => {
              const initials = (client.name || '?').charAt(0).toUpperCase();
              return (
                <button
                  key={client.id}
                  onClick={() => onStartChat?.(client)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors text-left border-b border-white/[0.04]"
                >
                  <div className="relative flex-shrink-0">
                    {client.image ? (
                      <img src={client.image} alt={client.name ? `${client.name} profile photo` : 'Client profile photo'} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/50 to-cyan-500/50 flex items-center justify-center text-white font-bold text-lg">
                        {initials}
                      </div>
                    )}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-brand-navy ${isOnline(client.lastSeenAt) ? 'bg-emerald-400' : 'bg-gray-500'}`} title={isOnline(client.lastSeenAt) ? 'Online' : 'Offline'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 font-medium truncate">{client.name || 'Unknown'}</p>
                    <p className="text-xs text-white/30 mt-0.5">Tap to start chatting</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
