'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Loader2 } from 'lucide-react';
import PreAssessmentForm from '@/components/PreAssessmentForm';
import CoupleAssessmentFlow from '@/components/CoupleAssessmentFlow';

interface EditAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  planName?: string;
}

export default function EditAssessmentModal({ isOpen, onClose, userId, planName }: EditAssessmentModalProps) {
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchAssessmentData();
    }
  }, [isOpen, userId]);

  const fetchAssessmentData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/assessment?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAssessmentData(data.assessment);
      } else {
        setError('Failed to load assessment data');
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-brand-navy border border-white/10 rounded-2xl w-full max-w-5xl mx-4 my-4 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-brand-navy/95 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-blue/20 rounded-lg">
                  <FileText className="w-5 h-5 text-brand-blue" />
                </div>
                <h2 className="text-xl font-bold text-white">Edit Assessment</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-brand-blue animate-spin mb-4" />
                  <p className="text-gray-400">Loading your assessment data...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchAssessmentData}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (planName || '').toLowerCase().includes('couple') ? (
                <CoupleAssessmentFlow
                  userId={userId}
                  planName={planName}
                  initialData={assessmentData}
                  initialPartner2={assessmentData?.partner2 || null}
                  isEditMode={true}
                  onSuccess={handleSuccess}
                  onCancel={handleClose}
                />
              ) : (
                <PreAssessmentForm
                  userId={userId}
                  initialData={assessmentData}
                  isEditMode={true}
                  planName={planName}
                  onSuccess={handleSuccess}
                  onCancel={handleClose}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
