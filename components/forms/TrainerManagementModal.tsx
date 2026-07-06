'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock, Loader2, Settings, Check } from 'lucide-react';

interface Trainer {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
}

interface TrainerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainerManagementModal({ isOpen, onClose }: TrainerManagementModalProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTrainers();
      setSelectedTrainer(null);
      setEmail('');
      setPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/trainer-clients/trainers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTrainers(data.trainers || []);
      }
    } catch (err) {
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setEmail(trainer.email);
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!selectedTrainer) return;
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const noEmailChange = email === selectedTrainer.email;
    if (noEmailChange && !password) {
      setError('No changes to save');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const body: any = { id: selectedTrainer.id };
      if (!noEmailChange) body.email = email;
      if (password) body.password = password;

      const res = await fetch('/api/trainer-clients/trainers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update trainer');
        return;
      }

      setSuccess('Trainer updated successfully');
      setPassword('');
      // Update local state
      setTrainers((prev) =>
        prev.map((t) => (t.id === selectedTrainer.id ? { ...t, email: data.trainer.email } : t))
      );
      setSelectedTrainer({ ...selectedTrainer, email: data.trainer.email });
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-brand-navy border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Settings className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manage Trainer Credentials</h2>
              <p className="text-xs text-gray-400">Change email or password for trainers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Trainer Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Select Trainer</label>
              <div className="space-y-2">
                {trainers.map((trainer) => {
                  const isSelected = selectedTrainer?.id === trainer.id;
                  return (
                    <button
                      key={trainer.id}
                      onClick={() => handleSelectTrainer(trainer)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-orange-500/10 border-orange-500/30 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {trainer.name?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{trainer.name || 'Trainer'}</p>
                        <p className="text-xs text-gray-500 truncate">{trainer.email}</p>
                      </div>
                    </button>
                  );
                })}
                {trainers.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">No trainers found</p>
                )}
              </div>
            </div>

            {/* Edit Form */}
            {selectedTrainer && (
              <div className="space-y-4">
                <div className="h-px bg-white/10 mb-4" />

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                    placeholder="trainer@example.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    New Password (leave blank to keep unchanged)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); setSuccess(''); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                    placeholder="Enter new password"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
