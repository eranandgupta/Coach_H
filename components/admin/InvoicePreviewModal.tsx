'use client';

import { useRef, useState, useEffect } from 'react';
import { Loader2, Download, Plus, Trash2, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Subscription {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  transactionId: string | null;
  paymentMode: string | null;
  paidAmount?: string | number | null;
  plan: { id: number; name: string; price: string; duration: number };
  user: { id: number; name: string | null; email: string; phone: string | null };
}

interface LineItem {
  description: string;
  duration: string;
  amount: string;
}

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

const toISODate = (d: string | Date) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};
const fmtLong = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const fmtShort = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const num = (s: string | number | null | undefined) => {
  const n = parseFloat(String(s ?? '').replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
};
const money = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

const inputCls =
  'w-full bg-white/[0.06] border border-white/15 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-blue/60';
const labelCls = 'block text-[11px] uppercase tracking-wide text-white/40 font-semibold mb-1';

export default function InvoicePreviewModal({ open, onOpenChange, subscription }: InvoicePreviewModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Editable invoice fields — initialised from the subscription, then freely editable.
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [billToName, setBillToName] = useState('');
  const [billToEmail, setBillToEmail] = useState('');
  const [billToPhone, setBillToPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    if (!subscription || !open) return;
    const sub = subscription;
    setEditing(false);
    setInvoiceNumber(`INV-${sub.id}-${new Date(sub.startDate).getTime()}`);
    setInvoiceDate(toISODate(sub.startDate));
    setPeriodStart(toISODate(sub.startDate));
    setPeriodEnd(toISODate(sub.endDate));
    setPaymentMode(sub.paymentMode || '');
    setTransactionId(sub.transactionId || '');
    setBillToName(sub.user.name || '');
    setBillToEmail(sub.user.email || '');
    setBillToPhone(sub.user.phone || '');
    setNotes('');
    // Default the amount to what was actually paid (handles discounts); fall back to list price.
    const paid = num(sub.paidAmount);
    const defaultAmount = paid > 0 ? String(paid) : String(sub.plan.price);
    setLineItems([{ description: sub.plan.name, duration: String(sub.plan.duration), amount: defaultAmount }]);
  }, [subscription, open]);

  if (!subscription) return null;

  const total = lineItems.reduce((sum, li) => sum + num(li.amount), 0);

  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) => prev.map((li, idx) => (idx === i ? { ...li, [field]: value } : li)));
  };
  const addItem = () => setLineItems((prev) => [...prev, { description: '', duration: '', amount: '' }]);
  const removeItem = (i: number) => setLineItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${billToName || 'Client'}-${invoiceNumber || subscription.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle>Invoice</DialogTitle>
              <DialogDescription>
                {editing ? 'Edit any field — the preview updates live.' : 'Review the invoice, or edit it for discounts / split payments.'}
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing((v) => !v)}
              className="flex-shrink-0"
            >
              <Pencil className="mr-2 h-4 w-4" />
              {editing ? 'Done editing' : 'Edit invoice'}
            </Button>
          </div>
        </DialogHeader>

        {/* Edit panel */}
        {editing && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Invoice number</label><input className={inputCls} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} /></div>
              <div><label className={labelCls}>Invoice date</label><input type="date" className={inputCls} value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} /></div>
              <div><label className={labelCls}>Period start</label><input type="date" className={inputCls} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} /></div>
              <div><label className={labelCls}>Period end</label><input type="date" className={inputCls} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} /></div>
              <div><label className={labelCls}>Payment mode</label><input className={inputCls} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} placeholder="UPI / Card / Bank / N/A" /></div>
              <div><label className={labelCls}>Transaction ID</label><input className={inputCls} value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. pay_xxx" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Bill to — name</label><input className={inputCls} value={billToName} onChange={(e) => setBillToName(e.target.value)} /></div>
              <div><label className={labelCls}>Email</label><input className={inputCls} value={billToEmail} onChange={(e) => setBillToEmail(e.target.value)} /></div>
              <div><label className={labelCls}>Phone</label><input className={inputCls} value={billToPhone} onChange={(e) => setBillToPhone(e.target.value)} /></div>
            </div>

            <div>
              <label className={labelCls}>Line items</label>
              <div className="space-y-2">
                {lineItems.map((li, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input className={`${inputCls} flex-[3]`} value={li.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Description / plan" />
                    <input className={`${inputCls} flex-1`} value={li.duration} onChange={(e) => updateItem(i, 'duration', e.target.value)} placeholder="Days" />
                    <input className={`${inputCls} flex-1`} value={li.amount} onChange={(e) => updateItem(i, 'amount', e.target.value)} placeholder="Amount" inputMode="decimal" />
                    <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 p-1.5 disabled:opacity-30" disabled={lineItems.length === 1} title="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="mt-2 inline-flex items-center gap-1.5 text-brand-blue text-xs font-medium hover:text-brand-gold transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add line item
              </button>
              <p className="text-white/30 text-xs mt-2">Tip: for split payments, generate one invoice per payment (e.g. set the amount to 19199, download, then change it to 4800 and download again).</p>
            </div>

            <div><label className={labelCls}>Note (optional)</label><input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Part payment 1 of 2 · 20% discount applied" /></div>
          </div>
        )}

        {/* Invoice paper — inline styles for html2canvas accuracy; reflects the state above */}
        <div
          ref={invoiceRef}
          style={{ background: '#ffffff', color: '#1a1a2e', fontFamily: 'Arial, Helvetica, sans-serif', padding: '32px', width: '100%', boxSizing: 'border-box' }}
        >
          {/* Header */}
          <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto" alt="Coach Himanshu" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              <span style={{ color: '#d4a843', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Coach Himanshu</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>INVOICE</div>
              <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>{invoiceNumber}</div>
            </div>
          </div>

          {/* From / To */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: 'bold' }}>From</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e' }}>Coach Himanshu</div>
              <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}>Fitness &amp; Wellness Coach</div>
              <div style={{ fontSize: '12px', color: '#4b5563' }}>contact@coachhimanshu.com</div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: 'bold' }}>Bill To</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e' }}>{billToName || 'Client'}</div>
              {billToEmail && <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}>{billToEmail}</div>}
              {billToPhone && <div style={{ fontSize: '12px', color: '#4b5563' }}>{billToPhone}</div>}
            </div>
          </div>

          <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '20px' }} />

          {/* Details row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>Invoice Date</div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px' }}>{fmtLong(invoiceDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>Subscription Period</div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px' }}>{fmtShort(periodStart)} - {fmtShort(periodEnd)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>Payment Mode</div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px', textTransform: 'capitalize' }}>{paymentMode || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>Transaction ID</div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px', fontFamily: 'monospace' }}>{transactionId || 'N/A'}</div>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', background: '#f3f4f6', color: '#374151', fontSize: '12px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Plan / Item</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', background: '#f3f4f6', color: '#374151', fontSize: '12px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Duration (Days)</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', background: '#f3f4f6', color: '#374151', fontSize: '12px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#1a1a2e', borderBottom: '1px solid #e5e7eb' }}>{li.description || '—'}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#1a1a2e', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{li.duration || '—'}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#1a1a2e', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>₹{money(num(li.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: notes ? '16px' : '32px' }}>
            <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '200px', justifyContent: 'space-between' }}>
              <span style={{ color: '#d4a843', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>Total</span>
              <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>₹{money(total)}</span>
            </div>
          </div>

          {notes && (
            <div style={{ marginBottom: '24px', fontSize: '12px', color: '#4b5563', fontStyle: 'italic' }}>{notes}</div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
            <div style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 'bold', marginBottom: '4px' }}>Thank you for choosing Coach Himanshu!</div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>This is a computer-generated invoice and does not require a signature.</div>
          </div>
        </div>

        {/* Download */}
        <div className="flex justify-end pt-2">
          <Button onClick={handleDownload} disabled={downloading} className="bg-amber-600 hover:bg-amber-700 text-white">
            {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
