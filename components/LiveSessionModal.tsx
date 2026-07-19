'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Link2, Trash2, Crown } from 'lucide-react';

interface SessionLink {
  id: number;
  link: string;
  title: string | null;
  planName: string;
  clientId: number | null;
  isActive: boolean;
  updatedAt: string;
}

interface LiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSessionModal({ isOpen, onClose }: LiveSessionModalProps) {
  const [links, setLinks] = useState<SessionLink[]>([]);

  // 1:1 Elite client state (includes couple plans — they are Elite 1:1)
  const [eliteClients, setEliteClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clientLink, setClientLink] = useState('');
  const [clientTitle, setClientTitle] = useState('');
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLinks();
      fetchEliteClients();
    }
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

  const fetchEliteClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const clients = (data.clients || []).filter((c: any) => {
          const planName = c.subscriptions?.[0]?.plan?.name || '';
          return planName.startsWith('Elite 1:1') && (c.subscriptions?.[0]?.status === 'active' || c.subscriptions?.[0]?.status === 'paused');
        });
        setEliteClients(clients);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  // 1:1 client link submit
  const handleClientLinkSubmit = async () => {
    if (!clientLink.trim() || !selectedClientId) return;
    setClientLoading(true);
    try {
      const client = eliteClients.find(c => c.id === selectedClientId);
      const planName = client?.subscriptions?.[0]?.plan?.name || '';
      const token = localStorage.getItem('token');
      await fetch('/api/live-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ link: clientLink, title: clientTitle, planName, clientId: selectedClientId }),
      });
      setClientLink('');
      setClientTitle('');
      fetchLinks();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setClientLoading(false);
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

  const getLinkForClient = (clientId: number) => links.find(l => l.clientId === clientId);

  const ensureProtocol = (url: string) => {
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08]" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)' }}>
                <Video className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Live Session Links</h2>
                <p className="text-gray-500 text-xs">Share 1:1 session links with clients</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-5 space-y-5">
            {/* Active 1:1 Client Links */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                Active 1:1 Client Links
              </p>
              {eliteClients.length === 0 ? (
                <div className="text-center py-6 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                  <Crown className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No active 1:1 Elite clients</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eliteClients.map((client) => {
                    const activeLink = getLinkForClient(client.id);
                    return (
                      <div
                        key={client.id}
                        className="p-4 rounded-xl border border-white/[0.06]"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                              {client.name?.[0]?.toUpperCase() || 'C'}
                            </div>
                            <div>
                              <span className="text-amber-400 text-sm font-semibold">{client.name}</span>
                              <p className="text-gray-500 text-[10px]">{client.subscriptions?.[0]?.plan?.name}</p>
                            </div>
                          </div>
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
                              <a href={ensureProtocol(activeLink.link)} target="_blank" rel="noopener noreferrer" className="flex-1 text-brand-blue text-xs truncate hover:underline">
                                {activeLink.link}
                              </a>
                              <button onClick={() => handleDelete(activeLink.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-gray-600 text-[10px] mt-1.5">
                              Updated {new Date(activeLink.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-xs">No link set</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Set 1:1 Client Link */}
            {eliteClients.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Link2 className="w-3 h-3" />
                  Set Client Session Link
                </p>

                {/* Client selector */}
                <select
                  value={selectedClientId || ''}
                  onChange={(e) => setSelectedClientId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/40 mb-2"
                >
                  <option value="">Select client</option>
                  {eliteClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} — {client.subscriptions?.[0]?.plan?.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={clientTitle}
                  onChange={(e) => setClientTitle(e.target.value)}
                  placeholder="Session title (optional)"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/40 mb-2"
                />
                <input
                  type="url"
                  value={clientLink}
                  onChange={(e) => setClientLink(e.target.value)}
                  placeholder="Paste meeting link (Zoom, Google Meet, etc.)"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/40 mb-3"
                />
                <button
                  onClick={handleClientLinkSubmit}
                  disabled={clientLoading || !clientLink.trim() || !selectedClientId}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  {clientLoading ? 'Saving...' : 'Set Client Link'}
                </button>
                <p className="text-gray-600 text-[10px] mt-2 text-center">
                  This link is private — only this client will see it
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
