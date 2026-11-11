'use client';

import { useEffect, useState } from 'react';
import { Target, MessageSquareQuote, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { progressApi, type TargetsRow } from './api';
import { Card, Field, btnPrimary, inputCls } from './ui';
import { FeedbackList, type FeedbackItem } from './OverviewTab';

const TARGET_FIELDS = [
  { key: 'calories', label: 'Calories (kcal)' },
  { key: 'protein', label: 'Protein (g)' },
  { key: 'carbs', label: 'Carbs (g)' },
  { key: 'fats', label: 'Fats (g)' },
  { key: 'waterL', label: 'Water (L)' },
  { key: 'workoutsPerWeek', label: 'Workouts / week' },
] as const;

/** Staff-only: set the client's daily targets and leave feedback (the client gets a push). */
export default function CoachTab({ userId, targets, feedback, onChanged }: { userId: number; targets: TargetsRow; feedback: FeedbackItem[]; onChanged: () => void }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [savingTargets, setSavingTargets] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setForm(Object.fromEntries(TARGET_FIELDS.map((f) => [f.key, targets[f.key] != null ? String(targets[f.key]) : ''])));
  }, [targets]);

  const saveTargets = async () => {
    setSavingTargets(true);
    try {
      await progressApi('targets', { method: 'PUT', body: { ...form, userId } });
      toast.success('Targets updated');
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not save targets');
    } finally {
      setSavingTargets(false);
    }
  };

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await progressApi('feedback', { method: 'POST', body: { userId, message } });
      setMessage('');
      toast.success('Feedback sent');
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not send');
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this feedback note?')) return;
    try {
      await progressApi('feedback', { method: 'DELETE', query: { id } });
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not delete');
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Daily targets" icon={Target} action={<span className="text-[10px] uppercase tracking-wide text-gray-500">{targets.source === 'coach' ? 'Custom' : targets.source === 'diet-plan' ? 'From diet plan' : 'Not set'}</span>}>
        <p className="text-xs text-gray-500 -mt-1 mb-3">Diet adherence and progress bars are measured against these. Leave a field blank to use the active diet plan.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TARGET_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <input className={inputCls} inputMode="decimal" value={form[f.key] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value.replace(/[^\d.]/g, '') }))} />
            </Field>
          ))}
        </div>
        <button onClick={saveTargets} disabled={savingTargets} className={`${btnPrimary} w-full mt-3`}>{savingTargets && <Loader2 className="w-4 h-4 animate-spin" />} Save targets</button>
      </Card>

      <Card title="Feedback & recommendations" icon={MessageSquareQuote}>
        <textarea className={`${inputCls} min-h-[90px]`} placeholder="Great consistency this week. Add 2.5 kg to bench next session, and push protein to 120 g." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={send} disabled={sending || !message.trim()} className={`${btnPrimary} w-full mt-2`}>{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send to client</button>
        <div className="mt-4"><FeedbackList items={feedback} onDelete={remove} /></div>
      </Card>
    </div>
  );
}
