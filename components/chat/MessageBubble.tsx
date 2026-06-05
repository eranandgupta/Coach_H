'use client';

import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isSender: boolean;
  isRead: boolean;
  showAvatar?: boolean;
  senderName?: string;
}

export default function MessageBubble({
  content,
  createdAt,
  isSender,
  isRead,
  showAvatar = true,
  senderName,
}: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`max-w-[75%] ${isSender ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
            isSender
              ? 'bg-brand-blue text-white rounded-2xl rounded-br-sm'
              : 'bg-white/[0.08] text-white rounded-2xl rounded-bl-sm'
          }`}
        >
          {content}
        </div>

        {/* Timestamp + read indicator */}
        <div
          className={`flex items-center gap-1 mt-0.5 px-1 ${
            isSender ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-white/30">{time}</span>
          {isSender && (
            isRead ? (
              <CheckCheck size={12} className="text-blue-400" />
            ) : (
              <Check size={12} className="text-white/30" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
