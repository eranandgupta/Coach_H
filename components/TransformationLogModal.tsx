'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Download, Loader2, Check, FileText, ChevronDown } from 'lucide-react';

interface TransformationLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;        // the client this logbook belongs to (self, or a client a coach is viewing)
  userName?: string;     // display name on the sheet
}

type Pair = { d1: string; d30: string };
const pair = (): Pair => ({ d1: '', d30: '' });

// Canonical shape of TransformationLog.data. Loaded data is deep-merged onto this
// so every field is always defined (older logs stay compatible as fields are added).
function defaultData() {
  return {
    clientInfo: {
      age: '', gender: '', height: '', startingWeight: '', otherGoals: '',
      goals: { fatLoss: false, muscleGain: false, strength: false, generalFitness: false, sportsPerformance: false },
    },
    fitness: { run12min: pair(), pushups60: pair(), squats60: pair(), plankHold: pair(), sitReach: pair() },
    strength: { primaryLift: '', primary1RM: pair(), bench: pair(), squat: pair(), deadlift: pair(), shoulderPress: pair(), rowPullup: pair() },
    measurements: {
      unit: 'cm', neck: pair(), shoulders: pair(), chest: pair(), rightBiceps: pair(), leftBiceps: pair(),
      waist: pair(), belly: pair(), hips: pair(), rightThigh: pair(), leftThigh: pair(), rightCalf: pair(), leftCalf: pair(),
    },
    composition: { weight: pair(), bodyFat: pair(), muscleMass: pair(), bmi: pair() },
    reflection: { wentWell: '', challenges: '', doBetter: '', otherNotes: '' },
  };
}

type LogData = ReturnType<typeof defaultData>;

// Deep-merge loaded JSON onto defaults so missing keys never break the form.
function mergeData(loaded: any): LogData {
  const base: any = defaultData();
  if (!loaded || typeof loaded !== 'object') return base;
  const merge = (target: any, src: any) => {
    for (const k of Object.keys(target)) {
      if (src[k] === undefined || src[k] === null) continue;
      if (typeof target[k] === 'object' && !Array.isArray(target[k])) merge(target[k], src[k]);
      else target[k] = src[k];
    }
  };
  merge(base, loaded);
  return base;
}

const num = (v: string): number | null => {
  if (v === '' || v == null) return null;
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? null : n;
};

// d30 - d1 as a signed string, or '—' when either side isn't numeric.
function change(p: Pair): string {
  const a = num(p.d1), b = num(p.d30);
  if (a == null || b == null) return '—';
  const d = Math.round((b - a) * 100) / 100;
  return d > 0 ? `+${d}` : `${d}`;
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const plusDaysISO = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const fmtDate = (v?: string | null) => (v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

export default function TransformationLogModal({ isOpen, onClose, userId, userName }: TransformationLogModalProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<LogData>(defaultData());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const token = () => localStorage.getItem('token');

  const loadInto = useCallback((log: any) => {
    setActiveId(log.id);
    setTitle(log.title || '');
    setStartDate(log.startDate ? log.startDate.slice(0, 10) : '');
    setEndDate(log.endDate ? log.endDate.slice(0, 10) : '');
    setData(mergeData(log.data));
  }, []);

  const fetchLogs = useCallback(async (selectId?: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transformation-logs?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const d = await res.json();
        const list = d.logs || [];
        setLogs(list);
        const pick = selectId ? list.find((l: any) => l.id === selectId) : list[0];
        if (pick) loadInto(pick);
        else { setActiveId(null); setData(defaultData()); }
      }
    } catch (e) {
      console.error('Load logbooks failed', e);
    } finally {
      setLoading(false);
    }
  }, [userId, loadInto]);

  useEffect(() => {
    if (isOpen) fetchLogs();
  }, [isOpen, fetchLogs]);

  // Build a fresh log's auto-filled data from the client's assessment.
  const buildAutoFill = async (): Promise<LogData> => {
    const d = defaultData();
    try {
      const res = await fetch(`/api/assessment?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const a = (await res.json()).assessment;
        if (a) {
          if (a.dateOfBirth) {
            const age = Math.floor((Date.now() - new Date(a.dateOfBirth).getTime()) / (365.25 * 86400000));
            if (age > 0 && age < 120) d.clientInfo.age = String(age);
          }
          if (a.height != null) d.clientInfo.height = String(a.height);
          if (a.weight != null) { d.clientInfo.startingWeight = String(a.weight); d.composition.weight.d1 = String(a.weight); }
          if (a.fatPercentage != null) d.composition.bodyFat.d1 = String(a.fatPercentage);
          if (a.height && a.weight) {
            const h = Number(a.height) / 100;
            if (h > 0) d.composition.bmi.d1 = String(Math.round((Number(a.weight) / (h * h)) * 10) / 10);
          }
          d.clientInfo.goals.fatLoss = !!a.goalLoseFat;
          d.clientInfo.goals.muscleGain = !!a.goalMuscleGain;
          d.clientInfo.goals.sportsPerformance = !!a.goalSportsTraining;
          if (a.goalOther) d.clientInfo.otherGoals = String(a.goalOther);
        }
      }
    } catch {
      // assessment optional — leave blanks for the user to fill
    }
    return d;
  };

  const handleNew = async () => {
    setCreating(true);
    try {
      const autofill = await buildAutoFill();
      const res = await fetch('/api/transformation-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          userId,
          title: `Cycle ${logs.length + 1}`,
          startDate: todayISO(),
          endDate: plusDaysISO(30),
          data: autofill,
        }),
      });
      if (res.ok) {
        const { log } = await res.json();
        await fetchLogs(log.id);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!activeId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/transformation-logs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id: activeId, title, startDate, endDate, data }),
      });
      if (res.ok) {
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1800);
        // refresh list labels without disturbing the open sheet
        const list = logs.map((l) => (l.id === activeId ? { ...l, title, startDate, endDate } : l));
        setLogs(list);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeId || !confirm('Delete this logbook? This cannot be undone.')) return;
    const res = await fetch(`/api/transformation-logs?id=${activeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (res.ok) fetchLogs();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { downloadLogbookPdf } = await import('@/lib/pdf');
      await downloadLogbookPdf(
        { userName, title, startDate, endDate },
        data,
        `Transformation-Logbook-${(userName || 'Client').replace(/\s+/g, '-')}.pdf`,
      );
    } catch (e) {
      console.error('PDF generation failed', e);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // --- editing helpers (immutable nested updates) ---
  const setPair = (section: keyof LogData, field: string, side: 'd1' | 'd30', value: string) => {
    setData((prev) => {
      const next: any = structuredClone(prev);
      next[section][field][side] = value;
      return next;
    });
  };
  const setField = (path: (d: any) => void) => {
    setData((prev) => { const next: any = structuredClone(prev); path(next); return next; });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="bg-[#0a0f1f] border border-white/10 rounded-2xl w-full max-w-4xl my-4 flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dark chrome header + toolbar */}
          <div className="px-5 py-4 border-b border-white/10" style={{ background: 'linear-gradient(135deg,#0b1224 0%,#101a33 60%,#0b1224 100%)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue" /> TRANSFORMATION <span className="text-brand-blue">LOGBOOK</span>
                </h2>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">Measure progress, not just weight</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-gray-300" /></button>
            </div>

            {/* Cycle selector + actions */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {logs.length > 0 && (
                <div className="relative">
                  <select
                    value={activeId ?? ''}
                    onChange={(e) => { const l = logs.find((x) => x.id === Number(e.target.value)); if (l) loadInto(l); }}
                    className="appearance-none bg-white/[0.06] border border-white/10 rounded-xl pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50"
                  >
                    {logs.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#0a0f1f]">
                        {l.title || 'Logbook'} · {fmtDate(l.startDate)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              <button onClick={handleNew} disabled={creating} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-blue/20 text-brand-blue border border-brand-blue/30 hover:bg-brand-blue/30 transition-all disabled:opacity-50">
                {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} New Logbook
              </button>
              {activeId && (
                <>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : savedFlash ? <Check className="w-3.5 h-3.5" /> : null}
                    {saving ? 'Saving…' : savedFlash ? 'Saved!' : 'Save'}
                  </button>
                  <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] text-gray-200 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50">
                    {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF / Print
                  </button>
                  <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-[#0a0f1f]">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>
            ) : !activeId ? (
              <div className="text-center py-16 px-6">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-bold text-lg">No logbook yet</p>
                <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">Start a 30-day transformation logbook. We&apos;ll pre-fill what we already know from your assessment — you fill in the rest.</p>
                <button onClick={handleNew} disabled={creating} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 transition-all disabled:opacity-50">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Start My Logbook
                </button>
              </div>
            ) : (
              <LogSheet
                sheetRef={sheetRef}
                userName={userName}
                title={title} setTitle={setTitle}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                data={data} setPair={setPair} setField={setField}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ============================ The paper sheet (also the PDF capture target) ============================ */

const BODY_PARTS: [string, keyof LogData['measurements']][] = [
  ['Neck', 'neck'], ['Shoulders', 'shoulders'], ['Chest', 'chest'], ['Right Biceps', 'rightBiceps'],
  ['Left Biceps', 'leftBiceps'], ['Waist', 'waist'], ['Belly', 'belly'], ['Hips', 'hips'],
  ['Right Thigh', 'rightThigh'], ['Left Thigh', 'leftThigh'], ['Right Calf', 'rightCalf'], ['Left Calf', 'leftCalf'],
];
const FITNESS_ROWS: [string, keyof LogData['fitness']][] = [
  ['12-Minute Run Test (Distance)', 'run12min'], ['Push-ups in 60 sec', 'pushups60'],
  ['Squats in 60 sec', 'squats60'], ['Plank Hold Time', 'plankHold'], ['Sit & Reach Test', 'sitReach'],
];
const ADDITIONAL_LIFTS: [string, keyof LogData['strength']][] = [
  ['Bench Press', 'bench'], ['Squat', 'squat'], ['Deadlift', 'deadlift'], ['Shoulder Press', 'shoulderPress'], ['Row / Pull-up', 'rowPullup'],
];

function LogSheet(props: {
  sheetRef: React.RefObject<HTMLDivElement>;
  userName?: string;
  title: string; setTitle: (v: string) => void;
  startDate: string; setStartDate: (v: string) => void;
  endDate: string; setEndDate: (v: string) => void;
  data: LogData;
  setPair: (section: keyof LogData, field: string, side: 'd1' | 'd30', value: string) => void;
  setField: (path: (d: any) => void) => void;
}) {
  const { sheetRef, userName, title, setTitle, startDate, setStartDate, endDate, setEndDate, data, setPair, setField } = props;
  const unit = data.measurements.unit;

  return (
    <div ref={sheetRef} className="mx-auto max-w-3xl rounded-xl p-6 sm:p-8" style={{ background: '#ffffff', color: '#0a0f1f' }}>
      {/* Masthead */}
      <div className="flex items-start justify-between border-b-2 pb-4 mb-5" style={{ borderColor: '#0b1224' }}>
        <div>
          <p className="text-xl font-extrabold leading-tight">Coach Himanshu</p>
          <p className="text-2xl font-extrabold" style={{ color: '#175FFF' }}>30-DAY TRANSFORMATION</p>
          <p className="text-xs font-semibold tracking-wide" style={{ color: '#475569' }}>ASSESSMENT LOGBOOK · MEASURE PROGRESS, NOT JUST WEIGHT</p>
        </div>
        <div className="text-right text-xs" style={{ color: '#475569' }}>
          <LabeledDate label="START" value={startDate} onChange={setStartDate} />
          <LabeledDate label="END" value={endDate} onChange={setEndDate} />
        </div>
      </div>

      {/* Client info */}
      <SectionTitle>Client Information</SectionTitle>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
        <Line label="Name">
          <span className="font-semibold">{userName || '—'}</span>
        </Line>
        <Line label="Age"><PaperInput value={data.clientInfo.age} onChange={(v) => setField((d) => { d.clientInfo.age = v; })} w={60} /></Line>
        <Line label="Gender"><PaperInput value={data.clientInfo.gender} onChange={(v) => setField((d) => { d.clientInfo.gender = v; })} w={120} placeholder="M / F / Other" /></Line>
        <Line label="Height"><PaperInput value={data.clientInfo.height} onChange={(v) => setField((d) => { d.clientInfo.height = v; })} w={90} placeholder="cm" /></Line>
        <Line label="Starting Weight"><PaperInput value={data.clientInfo.startingWeight} onChange={(v) => setField((d) => { d.clientInfo.startingWeight = v; })} w={90} placeholder="kg" /></Line>
        <Line label="Logbook"><PaperInput value={title} onChange={setTitle} w={140} placeholder="Cycle name" /></Line>
      </div>
      <div className="text-sm mb-2">
        <span className="font-semibold mr-3" style={{ color: '#334155' }}>Goal:</span>
        {([['fatLoss', 'Fat Loss'], ['muscleGain', 'Muscle Gain'], ['strength', 'Strength'], ['generalFitness', 'General Fitness'], ['sportsPerformance', 'Sports Performance']] as const).map(([k, label]) => (
          <label key={k} className="inline-flex items-center gap-1.5 mr-4 cursor-pointer">
            <input type="checkbox" checked={(data.clientInfo.goals as any)[k]} onChange={(e) => setField((d) => { (d.clientInfo.goals as any)[k] = e.target.checked; })} />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="text-sm mb-6">
        <span className="font-semibold" style={{ color: '#334155' }}>Other Goals / Notes: </span>
        <PaperInput value={data.clientInfo.otherGoals} onChange={(v) => setField((d) => { d.clientInfo.otherGoals = v; })} w={420} placeholder="…" />
      </div>

      {/* Fitness performance */}
      <SectionTitle>Fitness Performance Assessment</SectionTitle>
      <Table head={['Test', 'Day 1', 'Day 30', 'Improvement']}>
        {FITNESS_ROWS.map(([label, key]) => (
          <Row3 key={key} label={label} p={data.fitness[key]} onD1={(v) => setPair('fitness', key, 'd1', v)} onD30={(v) => setPair('fitness', key, 'd30', v)} />
        ))}
      </Table>

      {/* Strength */}
      <SectionTitle>Strength Assessment</SectionTitle>
      <div className="text-sm mb-2">
        <span className="font-semibold" style={{ color: '#334155' }}>Primary Lift / Exercise: </span>
        <PaperInput value={data.strength.primaryLift} onChange={(v) => setField((d) => { d.strength.primaryLift = v; })} w={280} placeholder="e.g. Back Squat" />
      </div>
      <Table head={['1RM (kg)', 'Day 1', 'Day 30', 'Improvement']}>
        <Row3 label="Primary Lift 1RM" p={data.strength.primary1RM} onD1={(v) => setPair('strength', 'primary1RM', 'd1', v)} onD30={(v) => setPair('strength', 'primary1RM', 'd30', v)} />
      </Table>
      <p className="text-xs font-semibold mt-3 mb-1" style={{ color: '#334155' }}>Additional Lifts (optional)</p>
      <Table head={['Exercise', 'Day 1', 'Day 30', 'Change']}>
        {ADDITIONAL_LIFTS.map(([label, key]) => (
          <Row3 key={key} label={label} p={data.strength[key] as Pair} onD1={(v) => setPair('strength', key, 'd1', v)} onD30={(v) => setPair('strength', key, 'd30', v)} />
        ))}
      </Table>

      {/* Body measurements */}
      <div className="flex items-center justify-between mt-6">
        <SectionTitle noMargin>Body Measurements</SectionTitle>
        <div className="text-xs flex items-center gap-2" style={{ color: '#475569' }}>
          Unit:
          {(['cm', 'in'] as const).map((u) => (
            <button key={u} type="button" onClick={() => setField((d) => { d.measurements.unit = u; })}
              className="px-2 py-0.5 rounded border text-xs"
              style={u === unit ? { background: '#175FFF', color: '#fff', borderColor: '#175FFF' } : { borderColor: '#cbd5e1', color: '#475569' }}>
              {u}
            </button>
          ))}
        </div>
      </div>
      <Table head={['Body Part', `Day 1 (${unit})`, `Day 30 (${unit})`, 'Change']}>
        {BODY_PARTS.map(([label, key]) => (
          <Row3 key={key} label={label} p={data.measurements[key] as Pair} onD1={(v) => setPair('measurements', key, 'd1', v)} onD30={(v) => setPair('measurements', key, 'd30', v)} />
        ))}
      </Table>

      {/* Body composition */}
      <SectionTitle>Body Composition</SectionTitle>
      <Table head={['Measurement', 'Day 1', 'Day 30', 'Change']}>
        <Row3 label="Weight (kg)" p={data.composition.weight} onD1={(v) => setPair('composition', 'weight', 'd1', v)} onD30={(v) => setPair('composition', 'weight', 'd30', v)} />
        <Row3 label="Body Fat (%)" p={data.composition.bodyFat} onD1={(v) => setPair('composition', 'bodyFat', 'd1', v)} onD30={(v) => setPair('composition', 'bodyFat', 'd30', v)} />
        <Row3 label="Muscle Mass (kg)" p={data.composition.muscleMass} onD1={(v) => setPair('composition', 'muscleMass', 'd1', v)} onD30={(v) => setPair('composition', 'muscleMass', 'd30', v)} />
        <Row3 label="BMI" p={data.composition.bmi} onD1={(v) => setPair('composition', 'bmi', 'd1', v)} onD30={(v) => setPair('composition', 'bmi', 'd30', v)} />
      </Table>

      {/* Progress summary (computed) */}
      <SectionTitle>Progress Summary</SectionTitle>
      <Table head={['Metric', 'Day 1', 'Day 30', 'Change']}>
        <SummaryRow label="Weight (kg)" p={data.composition.weight} />
        <SummaryRow label="Waist" p={data.measurements.waist} />
        <SummaryRow label="Push-ups (reps)" p={data.fitness.pushups60} />
        <SummaryRow label="Squats (reps)" p={data.fitness.squats60} />
        <SummaryRow label="Plank (sec)" p={data.fitness.plankHold} />
        <SummaryRow label="Run (distance)" p={data.fitness.run12min} />
        <SummaryRow label="1RM (kg)" p={data.strength.primary1RM} />
      </Table>

      {/* Self reflection */}
      <SectionTitle>Self Reflection</SectionTitle>
      <div className="space-y-3 text-sm">
        <Reflect label="What went well in the last 30 days?" value={data.reflection.wentWell} onChange={(v) => setField((d) => { d.reflection.wentWell = v; })} />
        <Reflect label="What challenges did you face?" value={data.reflection.challenges} onChange={(v) => setField((d) => { d.reflection.challenges = v; })} />
        <Reflect label="What will you do better in the next 30 days?" value={data.reflection.doBetter} onChange={(v) => setField((d) => { d.reflection.doBetter = v; })} />
        <Reflect label="Any other notes for yourself:" value={data.reflection.otherNotes} onChange={(v) => setField((d) => { d.reflection.otherNotes = v; })} />
      </div>

      <div data-pdf-break className="mt-6 pt-4 border-t text-center" style={{ borderColor: '#e2e8f0' }}>
        <p className="text-sm font-extrabold" style={{ color: '#0b1224' }}>“WHAT GETS MEASURED GETS <span style={{ color: '#175FFF' }}>IMPROVED.”</span></p>
        <p className="text-[11px] mt-1" style={{ color: '#64748b' }}>Coach Himanshu · www.coachhimanshu.com · Evidence-Based Fitness. Real Results.</p>
      </div>
    </div>
  );
}

/* ---- small paper-styled primitives (inline colors so html2canvas captures cleanly) ---- */

function SectionTitle({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div data-pdf-break className={noMargin ? '' : 'mt-6 mb-2'}>
      <h3 className="text-sm font-extrabold uppercase tracking-wide inline-block px-2 py-1 rounded" style={{ background: '#0b1224', color: '#fff' }}>{children}</h3>
    </div>
  );
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-semibold whitespace-nowrap" style={{ color: '#334155' }}>{label}:</span>
      {children}
    </div>
  );
}

function PaperInput({ value, onChange, w, placeholder }: { value: string; onChange: (v: string) => void; w?: number; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: w ? `${w}px` : '100%', borderBottom: '1px solid #94a3b8', background: 'transparent', color: '#0a0f1f', outline: 'none', padding: '1px 2px' }}
      className="text-sm"
    />
  );
}

function LabeledDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-end gap-2 mb-1">
      <span className="font-bold" style={{ color: '#0b1224' }}>{label}:</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} style={{ borderBottom: '1px solid #94a3b8', background: 'transparent', color: '#0a0f1f', outline: 'none', fontSize: '12px' }} />
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-sm border-collapse mb-2" style={{ border: '1px solid #cbd5e1' }}>
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={h} className="text-left font-bold px-2 py-1.5" style={{ background: '#175FFF', color: '#fff', border: '1px solid #cbd5e1', textAlign: i === 0 ? 'left' : 'center', width: i === 0 ? '40%' : '20%' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function CellInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', background: 'transparent', color: '#0a0f1f', outline: 'none', textAlign: 'center' }} className="text-sm" />
  );
}

function Row3({ label, p, onD1, onD30 }: { label: string; p: Pair; onD1: (v: string) => void; onD30: (v: string) => void }) {
  return (
    <tr data-pdf-break>
      <td className="px-2 py-1.5" style={{ border: '1px solid #cbd5e1', color: '#0f172a' }}>{label}</td>
      <td className="px-2 py-1" style={{ border: '1px solid #cbd5e1' }}><CellInput value={p.d1} onChange={onD1} /></td>
      <td className="px-2 py-1" style={{ border: '1px solid #cbd5e1' }}><CellInput value={p.d30} onChange={onD30} /></td>
      <td className="px-2 py-1.5 text-center font-semibold" style={{ border: '1px solid #cbd5e1', color: '#175FFF' }}>{change(p)}</td>
    </tr>
  );
}

function SummaryRow({ label, p }: { label: string; p: Pair }) {
  return (
    <tr data-pdf-break>
      <td className="px-2 py-1.5" style={{ border: '1px solid #cbd5e1', color: '#0f172a' }}>{label}</td>
      <td className="px-2 py-1.5 text-center" style={{ border: '1px solid #cbd5e1' }}>{p.d1 || '—'}</td>
      <td className="px-2 py-1.5 text-center" style={{ border: '1px solid #cbd5e1' }}>{p.d30 || '—'}</td>
      <td className="px-2 py-1.5 text-center font-semibold" style={{ border: '1px solid #cbd5e1', color: '#175FFF' }}>{change(p)}</td>
    </tr>
  );
}

function Reflect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div data-pdf-break>
      <p className="font-semibold mb-1" style={{ color: '#334155' }}>{label}</p>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
        style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 6, background: 'transparent', color: '#0a0f1f', outline: 'none', padding: '6px 8px', resize: 'vertical' }} className="text-sm" />
    </div>
  );
}
