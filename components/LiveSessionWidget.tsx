'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, ExternalLink, Calendar, Clock, Users } from 'lucide-react';

interface LiveSessionWidgetProps {
  planName: string;
}

export default function LiveSessionWidget({ planName }: LiveSessionWidgetProps) {
  const [sessionLink, setSessionLink] = useState<{ link: string; title: string | null; updatedAt: string } | null>(null);

  const isElite = planName.startsWith('Elite 1:1');
  const isSheSstrong = planName === 'She Strong Program';
  const schedule = isElite
    ? { days: 'As per your schedule', time: 'Personalised' }
    : isSheSstrong
    ? { days: 'Monday & Wednesday', time: '8 sessions/month' }
    : { days: 'Tuesday & Thursday', time: '8 sessions/month' };

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/live-sessions?planName=${encodeURIComponent(planName)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.link) setSessionLink(data.link);
      } catch (error) {
        console.error('Failed to fetch session link:', error);
      }
    };
    fetchLink();
    // Refresh every 60 seconds in case coach updates the link
    const interval = setInterval(fetchLink, 60000);
    return () => clearInterval(interval);
  }, [planName]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Join Session Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-violet-500/15 p-5 md:p-6"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.02) 50%, rgba(23,95,255,0.03) 100%)' }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: 'rgba(139,92,246,0.15)' }} />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border border-violet-500/20"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)' }}
              >
                <Video className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Live Session</h3>
                <p className="text-violet-300/60 text-xs">{planName}</p>
              </div>
              {sessionLink && (
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-[10px] font-semibold uppercase">Ready</span>
                </div>
              )}
            </div>

            {/* Session Link */}
            {sessionLink ? (
              <div className="space-y-3">
                {sessionLink.title && (
                  <p className="text-white/80 text-sm font-medium">{sessionLink.title}</p>
                )}
                <a
                  href={sessionLink.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:shadow-violet-500/30"
                >
                  <Video className="w-4 h-4" />
                  Join Live Session
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-gray-600 text-[10px] text-center">
                  Link updated {new Date(sessionLink.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-1">No session link available yet</p>
                <p className="text-gray-500 text-xs">Your coach will share the link before the session</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Schedule Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-card p-5">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-blue" />
            {isElite ? '1:1 Session Info' : 'Session Schedule'}
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="text-white/80 text-sm">{isElite ? 'Schedule' : 'Days'}</span>
              </div>
              <span className="text-white font-medium text-sm">{schedule.days}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white/80 text-sm">Duration</span>
              </div>
              <span className="text-white font-medium text-sm">{isElite ? '60 Minutes' : '1 Hour'}</span>
            </div>
            {isElite ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-white/80 text-sm">Type</span>
                </div>
                <span className="text-white font-medium text-sm">1-on-1 Personal</span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80 text-sm">Group Size</span>
                </div>
                <span className="text-white font-medium text-sm">Max 10</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
