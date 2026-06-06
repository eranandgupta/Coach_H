'use client';

import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
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
    <div
      className="flex items-end gap-2 p-3 border-t border-white/[0.08]"
      style={{
        background: 'linear-gradient(180deg, rgba(10,15,31,0.95) 0%, rgba(7,10,21,1) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2.5 text-base text-white placeholder-white/30 focus:outline-none focus:border-brand-blue/50 resize-none scrollbar-hide"
        style={{ maxHeight: '120px' }}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-20 transition-all duration-200 disabled:bg-white/[0.06] bg-gradient-to-br from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 active:scale-95"
      >
        <Send size={18} className="text-white ml-0.5" />
      </button>
    </div>
  );
}
