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

const URL_REGEX = /(https?:\/\/[^\s]+|(?:www\.)[^\s]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.(?:com|org|net|io|dev|app|life|in|co|me|info|xyz|tech|ai|gg|tv|cc|us|uk|ca|au|de|fr|es|it|nl|be|ch|at|se|no|dk|fi|pl|cz|pt|br|jp|kr|cn|ru|za|nz|ie|sg|hk|tw|my|ph|th|vn|id|ae|sa|eg|ke|ng|gh|tz|ug)(?:\/[^\s]*)?)/gi;

function renderWithLinks(text: string, isSender: boolean) {
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    parts.push(
      <a
        key={match.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline break-all ${isSender ? 'text-white/90 hover:text-white' : 'text-brand-blue hover:text-blue-400'}`}
      >
        {url}
      </a>
    );
    lastIndex = match.index + url.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
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
          {renderWithLinks(content, isSender)}
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
