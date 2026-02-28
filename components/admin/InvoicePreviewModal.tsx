'use client';

import { useRef, useState } from 'react';
import { Loader2, Download } from 'lucide-react';
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
  plan: { id: number; name: string; price: string; duration: number };
  user: { id: number; name: string | null; email: string; phone: string | null };
}

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

export default function InvoicePreviewModal({
  open,
  onOpenChange,
  subscription,
}: InvoicePreviewModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!subscription) return null;

  const sub = subscription;
  const invoiceNumber = `INV-${sub.id}-${new Date(sub.startDate).getTime()}`;
  const invoiceDate = new Date(sub.startDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const periodStart = new Date(sub.startDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const periodEnd = new Date(sub.endDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const amount = sub.plan.price;

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${sub.user.name || 'Client'}-${sub.plan.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            Review the invoice below and download as PDF.
          </DialogDescription>
        </DialogHeader>

        {/* Invoice HTML - inline styles for html2canvas accuracy */}
        <div
          ref={invoiceRef}
          style={{
            background: '#ffffff',
            color: '#1a1a2e',
            fontFamily: 'Arial, Helvetica, sans-serif',
            padding: '32px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#1a1a2e',
              borderRadius: '8px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Coach Himanshu"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
              <span
                style={{
                  color: '#d4a843',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                }}
              >
                Coach Himanshu
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                }}
              >
                INVOICE
              </div>
              <div
                style={{
                  color: '#9ca3af',
                  fontSize: '11px',
                  marginTop: '4px',
                }}
              >
                {invoiceNumber}
              </div>
            </div>
          </div>

          {/* From / To */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
              gap: '16px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  fontWeight: 'bold',
                }}
              >
                From
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e' }}>
                Coach Himanshu
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}>
                Fitness & Wellness Coach
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563' }}>
                contact@coachhimanshu.com
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  fontWeight: 'bold',
                }}
              >
                Bill To
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e' }}>
                {sub.user.name || 'Client'}
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}>
                {sub.user.email}
              </div>
              {sub.user.phone && (
                <div style={{ fontSize: '12px', color: '#4b5563' }}>
                  {sub.user.phone}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: '#e5e7eb',
              marginBottom: '20px',
            }}
          />

          {/* Details Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>
                Invoice Date
              </div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px' }}>
                {invoiceDate}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>
                Subscription Period
              </div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px' }}>
                {periodStart} - {periodEnd}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>
                Payment Mode
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#1a1a2e',
                  marginTop: '2px',
                  textTransform: 'capitalize',
                }}
              >
                {sub.paymentMode || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>
                Transaction ID
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#1a1a2e',
                  marginTop: '2px',
                  fontFamily: 'monospace',
                }}
              >
                {sub.transactionId || 'N/A'}
              </div>
            </div>
          </div>

          {/* Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  Plan
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '10px 12px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  Duration (Days)
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '10px 12px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#1a1a2e',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {sub.plan.name}
                </td>
                <td
                  style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#1a1a2e',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {sub.plan.duration}
                </td>
                <td
                  style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#1a1a2e',
                    textAlign: 'right',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 'bold',
                  }}
                >
                  ₹{amount}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: '#1a1a2e',
                borderRadius: '8px',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                minWidth: '200px',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: '#d4a843',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                }}
              >
                Total
              </span>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                ₹{amount}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '20px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#1a1a2e',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}
            >
              Thank you for choosing Coach Himanshu!
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              This is a computer-generated invoice and does not require a signature.
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
