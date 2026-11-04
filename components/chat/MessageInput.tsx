'use client';

import { useState, useRef } from 'react';
import { Play, Send, X } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  /** Staff only: opens the Video Library picker. */
  onShareVideo?: () => void;
  /** A chosen library video waiting to go out with this message. */
  attachedVideoTitle?: string;
  onRemoveVideo?: () => void;
}

export default function MessageInput({ onSend, disabled, onShareVideo, attachedVideoTitle, onRemoveVideo }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!text.trim() && !attachedVideoTitle) || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div>
    {attachedVideoTitle && (
      <div className="flex items-center gap-2 px-3 py-2 border-t border-white/[0.08] bg-white/[0.03]">
        <Play size={14} className="text-brand-blue shrink-0" fill="currentColor" aria-hidden />
        <p className="flex-1 min-w-0 truncate text-sm text-white">{attachedVideoTitle}</p>
        <button
          onClick={onRemoveVideo}
          aria-label="Remove video"
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    )}
    <div
      className="flex items-end gap-2 p-3 border-t border-white/[0.08]"
      style={{
        background: 'linear-gradient(180deg, rgb(var(--c-navy) / 0.95) 0%, rgb(var(--c-navy-dark) / 1) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {onShareVideo && (
        <button
          onClick={onShareVideo}
          aria-label="Share a video from the library"
          title="Share a video from the library"
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white/60 bg-white/[0.06] hover:text-white hover:bg-white/10 transition-colors"
        >
          <Play size={18} className="ml-0.5" />
        </button>
      )}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={attachedVideoTitle ? 'Add a note (optional)...' : 'Type a message...'}
        rows={1}
        className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2.5 text-base text-white placeholder-white/30 focus:outline-none focus:border-brand-blue/50 resize-none scrollbar-hide"
        style={{ maxHeight: '120px' }}
      />
      <button
        onClick={handleSend}
        disabled={(!text.trim() && !attachedVideoTitle) || disabled}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-20 transition-all duration-200 disabled:bg-white/[0.06] bg-gradient-to-br from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 active:scale-95"
      >
        <Send size={18} className="text-white ml-0.5" />
      </button>
    </div>
    </div>
  );
}
