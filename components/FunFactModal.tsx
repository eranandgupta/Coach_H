'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Plus, Trash2, Edit3, Check, GripVertical, ArrowUp, ArrowDown, Zap } from 'lucide-react';

interface FunFact {
  id: number;
  content: string;
  position: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface FunFactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FunFactModal({ isOpen, onClose }: FunFactModalProps) {
  const [content, setContent] = useState('');
  const [queue, setQueue] = useState<FunFact[]>([]);
  const [activeFact, setActiveFact] = useState<FunFact | null>(null);
  const [publishedFacts, setPublishedFacts] = useState<FunFact[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFacts();
    }
  }, [isOpen]);

  const fetchFacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/fun-facts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActiveFact(data.activeFact || null);
      setQueue(data.queue || []);
      setPublishedFacts(data.publishedFacts || []);
    } catch (error) {
      console.error('Failed to fetch fun facts:', error);
    }
  };

  const handleAdd = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/fun-facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      setContent('');
      fetchFacts();
    } catch (error) {
      console.error('Failed to add fun fact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/fun-facts?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFacts();
    } catch (error) {
      console.error('Failed to delete fun fact:', error);
    }
  };

  const handleEdit = async (id: number) => {
    if (!editContent.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/fun-facts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, content: editContent }),
      });
      setEditingId(null);
      setEditContent('');
      fetchFacts();
    } catch (error) {
      console.error('Failed to edit fun fact:', error);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newQueue = [...queue];
    [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
    const orderedIds = newQueue.map((f) => f.id);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/fun-facts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds }),
      });
      fetchFacts();
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === queue.length - 1) return;
    const newQueue = [...queue];
    [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
    const orderedIds = newQueue.map((f) => f.id);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/fun-facts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds }),
      });
      fetchFacts();
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card-strong rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08]" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 100%)' }}>
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Fun Facts</h2>
                <p className="text-gray-500 text-xs">Goes live daily at 4:00 PM</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-5 space-y-5">
            {/* Currently Active Fact */}
            {activeFact && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-green-400 font-semibold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Currently Live
                </p>
                <div className="p-4 rounded-xl border border-green-500/20" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)' }}>
                  <p className="text-white text-sm leading-relaxed">{activeFact.content}</p>
                  <p className="text-gray-500 text-[10px] mt-2">
                    Published {activeFact.publishedAt ? new Date(activeFact.publishedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Add New Fact */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                <Plus className="w-3 h-3" />
                Add to Queue
              </p>
              <div className="flex gap-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter a fun fitness fact..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-blue/40 resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={loading || !content.trim()}
                className="mt-2 w-full px-4 py-2.5 bg-gradient-to-r from-brand-blue to-blue-500 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-blue/20 transition-all"
              >
                {loading ? 'Adding...' : 'Add to Queue'}
              </button>
            </div>

            {/* Queue */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Queue ({queue.length} {queue.length === 1 ? 'fact' : 'facts'} pending)
              </p>

              {queue.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Queue is empty. Add some fun facts!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {queue.map((fact, index) => (
                    <motion.div
                      key={fact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-2 p-3 rounded-xl border border-white/[0.06]"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                    >
                      {/* Position badge */}
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp className="w-3 h-3 text-gray-400" />
                        </button>
                        <span className="text-[10px] font-bold text-gray-500 w-5 text-center">{index + 1}</span>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === queue.length - 1}
                          className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {editingId === fact.id ? (
                          <div className="flex gap-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue/40 resize-none"
                              rows={2}
                              autoFocus
                            />
                            <button
                              onClick={() => handleEdit(fact.id)}
                              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors self-start"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditContent(''); }}
                              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors self-start"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-white/80 text-sm leading-relaxed">{fact.content}</p>
                        )}
                      </div>

                      {/* Actions */}
                      {editingId !== fact.id && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => { setEditingId(fact.id); setEditContent(fact.content); }}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(fact.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Published Facts */}
            {publishedFacts.length > 1 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Recently Published
                </p>
                <div className="space-y-1.5">
                  {publishedFacts.slice(1).map((fact) => (
                    <div key={fact.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-gray-400 text-xs truncate flex-1 mr-3">{fact.content}</p>
                      <span className="text-gray-600 text-[10px] flex-shrink-0">
                        {fact.publishedAt ? new Date(fact.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
