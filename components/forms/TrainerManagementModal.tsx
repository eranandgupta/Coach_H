'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock, Loader2, Settings, Check, Plus, User, Phone, ArrowLeft, RefreshCw } from 'lucide-react';
import {
  TRAINER_PERMISSIONS,
  ALL_TRAINER_PERMISSIONS,
  type TrainerPermission,
  type TrainerPermissions,
} from '@/lib/trainerPermissions';

interface Trainer {
  id: number;
  name: string | null;
  email: string;
  phone?: string | null;
  image: string | null;
  trainerPermissions: TrainerPermissions;
}

interface TrainerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'list' | 'edit' | 'create';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50';
const labelClass = 'block text-gray-300 text-sm font-medium mb-2';

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function samePermissions(a: TrainerPermissions, b: TrainerPermissions) {
  return TRAINER_PERMISSIONS.every((p) => a[p.key] === b[p.key]);
}

function AccessOptions({
  value,
  onChange,
}: {
  value: TrainerPermissions;
  onChange: (next: TrainerPermissions) => void;
}) {
  const toggle = (key: TrainerPermission) => onChange({ ...value, [key]: !value[key] });
  return (
    <div>
      <p className={labelClass}>Access</p>
      <p className="text-xs text-gray-500 mb-3">
        Trainers always see the clients assigned to them. Choose what else they can do.
      </p>
      <div className="space-y-2">
        {TRAINER_PERMISSIONS.map((p) => {
          const on = value[p.key];
          return (
            <label
              key={p.key}
              htmlFor={`perm-${p.key}`}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                on ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <input
                id={`perm-${p.key}`}
                type="checkbox"
                checked={on}
                onChange={() => toggle(p.key)}
                className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-white">{p.label}</span>
                <span className="block text-xs text-gray-400">{p.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function TrainerManagementModal({ isOpen, onClose }: TrainerManagementModalProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('list');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState<TrainerPermissions>(ALL_TRAINER_PERMISSIONS);
  const [sendEmail, setSendEmail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTrainers();
      showList();
      setSuccess('');
    }
  }, [isOpen]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainer-clients/trainers', { headers: authHeaders() });
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

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const showList = () => {
    setMode('list');
    setSelectedTrainer(null);
    setError('');
  };

  const startCreate = () => {
    setMode('create');
    setSelectedTrainer(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword(generatePassword());
    setPermissions({ ...ALL_TRAINER_PERMISSIONS });
    setSendEmail(true);
    clearMessages();
  };

  const startEdit = (trainer: Trainer) => {
    setMode('edit');
    setSelectedTrainer(trainer);
    setName(trainer.name || '');
    setEmail(trainer.email);
    setPassword('');
    setPermissions({ ...trainer.trainerPermissions });
    clearMessages();
  };

  const validate = (requirePassword: boolean) => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Invalid email format';
    if (requirePassword && !password) return 'Password is required';
    if (password && password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleCreate = async () => {
    clearMessages();
    const problem = validate(true);
    if (problem) return setError(problem);

    setSaving(true);
    try {
      const res = await fetch('/api/trainer-clients/trainers', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, email, phone, password, permissions, sendEmail }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to create trainer');

      setTrainers((prev) =>
        [...prev, data.trainer].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      );
      showList();
      setSuccess(
        data.emailSent
          ? `Trainer ${data.trainer.name} created. Login details were emailed to ${data.trainer.email}.`
          : `Trainer ${data.trainer.name} created. Share the login details with them: ${data.trainer.email} / ${password}`
      );
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTrainer) return;
    clearMessages();
    const problem = validate(false);
    if (problem) return setError(problem);

    const body: any = { id: selectedTrainer.id };
    if (name.trim() !== (selectedTrainer.name || '')) body.name = name.trim();
    if (email.trim() !== selectedTrainer.email) body.email = email.trim();
    if (password) body.password = password;
    if (!samePermissions(permissions, selectedTrainer.trainerPermissions)) body.permissions = permissions;
    if (Object.keys(body).length === 1) return setError('No changes to save');

    setSaving(true);
    try {
      const res = await fetch('/api/trainer-clients/trainers', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to update trainer');

      setTrainers((prev) => prev.map((t) => (t.id === data.trainer.id ? data.trainer : t)));
      setSelectedTrainer(data.trainer);
      setPassword('');
      setSuccess('Trainer updated');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const accessSummary = (t: Trainer) => {
    const on = TRAINER_PERMISSIONS.filter((p) => t.trainerPermissions[p.key]);
    if (on.length === TRAINER_PERMISSIONS.length) return 'Full access';
    if (on.length === 0) return 'Assigned clients only';
    return on.map((p) => p.label).join(', ');
  };

  const messages = (
    <>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-start gap-2">
          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-green-400 text-sm break-words min-w-0">{success}</p>
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-brand-navy border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {mode !== 'list' ? (
              <button
                onClick={() => { showList(); setSuccess(''); }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                aria-label="Back to trainers"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Settings className="w-5 h-5 text-orange-400" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white truncate">
                {mode === 'create' ? 'New Trainer' : mode === 'edit' ? selectedTrainer?.name || 'Trainer' : 'Manage Trainers'}
              </h2>
              <p className="text-xs text-gray-400">
                {mode === 'create'
                  ? 'Create a trainer login and choose their access'
                  : mode === 'edit'
                    ? 'Update login details and access'
                    : 'Create trainer logins and control what each trainer can do'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {mode === 'list' && (
              <div className="space-y-4">
                {messages}
                <button
                  onClick={startCreate}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-all text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Trainer
                </button>
                <div className="space-y-2">
                  {trainers.map((trainer) => (
                    <button
                      key={trainer.id}
                      onClick={() => startEdit(trainer)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {trainer.name?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{trainer.name || 'Trainer'}</p>
                        <p className="text-xs text-gray-500 truncate">{trainer.email}</p>
                        <p className="text-xs text-gray-400 truncate">{accessSummary(trainer)}</p>
                      </div>
                    </button>
                  ))}
                  {trainers.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No trainers yet. Add one to get started.</p>
                  )}
                </div>
              </div>
            )}

            {mode !== 'list' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="trainer-name" className={labelClass}>
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    id="trainer-name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearMessages(); }}
                    className={inputClass}
                    placeholder="Trainer's name"
                  />
                </div>

                <div>
                  <label htmlFor="trainer-email" className={labelClass}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address (login ID)
                  </label>
                  <input
                    id="trainer-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearMessages(); }}
                    className={inputClass}
                    placeholder="trainer@example.com"
                  />
                </div>

                {mode === 'create' && (
                  <div>
                    <label htmlFor="trainer-phone" className={labelClass}>
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone (optional)
                    </label>
                    <input
                      id="trainer-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); clearMessages(); }}
                      className={inputClass}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="trainer-password" className={labelClass}>
                    <Lock className="w-4 h-4 inline mr-2" />
                    {mode === 'create' ? 'Password' : 'New Password (leave blank to keep unchanged)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="trainer-password"
                      type={mode === 'create' ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearMessages(); }}
                      className={inputClass}
                      placeholder={mode === 'create' ? 'At least 6 characters' : 'Enter new password'}
                    />
                    {mode === 'create' && (
                      <button
                        type="button"
                        onClick={() => setPassword(generatePassword())}
                        className="px-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition-all"
                        aria-label="Generate a new password"
                        title="Generate a new password"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <AccessOptions value={permissions} onChange={(next) => { setPermissions(next); clearMessages(); }} />

                {mode === 'create' && (
                  <label htmlFor="trainer-send-email" className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                    <input
                      id="trainer-send-email"
                      type="checkbox"
                      checked={sendEmail}
                      onChange={() => setSendEmail(!sendEmail)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    Email the login details to the trainer
                  </label>
                )}

                {messages}

                <button
                  onClick={mode === 'create' ? handleCreate : handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'create' ? 'Create Trainer' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
