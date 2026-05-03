'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Link2, Check, Trash2, Edit3, Users } from 'lucide-react';

interface SessionLink {
  id: number;
  link: string;
  title: string | null;
  planName: string;
  isActive: boolean;
  updatedAt: string;
}

interface LiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LIVE_PLANS = [
  { name: 'She Strong Program', label: 'She Strong Program', color: 'violet' },
  { name: 'Active Parents Program', label: 'Active Parents Program', color: 'emerald' },
  { name: 'Elite 1:1 - 1 Month (24 Sessions)', label: '1:1 Elite (24 Sessions)', color: 'amber' },
  { name: 'Elite 1:1 - 1 Month (12 Sessions)', label: '1:1 Elite (12 Sessions)', color: 'amber' },
  { name: 'Elite 1:1 - 3 Months (72 Sessions)', label: '1:1 Elite (72 Sessions)', color: 'amber' },
  { name: 'Elite 1:1 - 3 Months (36 Sessions)', label: '1:1 Elite (36 Sessions)', color: 'amber' },
];

export default function LiveSessionModal({ isOpen, onClose }: LiveSessionModalProps) {
  const [links, setLinks] = useState<SessionLink[]>([]);
  const [selectedPlan, setSelectedPlan] = useState(LIVE_PLANS[0].name);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) fetchLinks();
  }, [isOpen]);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/live-sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLinks(data.links || []);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    }
  };

  const handleSubmit = async () => {
    if (!link.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/live-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ link, title, planName: selectedPlan }),
      });
      setLink('');
      setTitle('');
      fetchLinks();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/live-sessions?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLinks();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getLinkForPlan = (planName: string) => links.find(l => l.planName === planName);

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
          className="glass-card-strong rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08]" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)' }}>
                <Video className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Live Session Links</h2>
                <p className="text-gray-500 text-xs">Share session links with clients</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-5 space-y-5">
            {/* Current Active Links */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                Active Session Links
              </p>
              <div className="space-y-3">
                {LIVE_PLANS.map((plan) => {
                  const activeLink = getLinkForPlan(plan.name);
                  return (
                    <div
                      key={plan.name}
                      className="p-4 rounded-xl border border-white/[0.06]"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${plan.color === 'violet' ? 'text-violet-400' : 'text-emerald-400'}`}>
                          {plan.label}
                        </span>
                        {activeLink && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-[10px] font-medium">Live</span>
                          </div>
                        )}
                      </div>
                      {activeLink ? (
                        <div>
                          {activeLink.title && (
                            <p className="text-white/70 text-xs mb-1">{activeLink.title}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <a
                              href={activeLink.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-brand-blue text-xs truncate hover:underline"
                            >
                              {activeLink.link}
                            </a>
                            <button
                              onClick={() => handleDelete(activeLink.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-gray-600 text-[10px] mt-1.5">
                            Updated {new Date(activeLink.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-xs">No active link set</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Set/Update Link */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                <Link2 className="w-3 h-3" />
                Set Session Link
              </p>

              {/* Plan selector */}
              <div className="flex gap-2 mb-3">
                {LIVE_PLANS.map((plan) => (
                  <button
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedPlan === plan.name
                        ? plan.color === 'violet'
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.05]'
                    }`}
                  >
                    {plan.label.replace(' Program', '')}
                  </button>
                ))}
              </div>

              {/* Title (optional) */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Session title (optional) e.g. Monday HIIT Session"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-blue/40 mb-2"
              />

              {/* Link */}
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste meeting link (Zoom, Google Meet, etc.)"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-blue/40 mb-3"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !link.trim()}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/20 transition-all"
              >
                {loading ? 'Saving...' : 'Update Session Link'}
              </button>
              <p className="text-gray-600 text-[10px] mt-2 text-center">
                This link will be shown to all clients on this plan
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
