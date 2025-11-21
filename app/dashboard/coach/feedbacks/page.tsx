'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, XCircle, Eye, EyeOff, Trash2, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/Button';

interface Feedback {
  id: number;
  name: string;
  email: string;
  location: string;
  phone: string | null;
  rating: number;
  review: string;
  transformation: string | null;
  profilePhoto: string | null;
  beforePhoto: string | null;
  afterPhoto: string | null;
  isApproved: boolean;
  isVisible: boolean;
  createdAt: string;
}

export default function FeedbacksManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/admin/feedbacks');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (id: number, updates: Partial<Feedback>) => {
    try {
      const response = await fetch('/api/admin/feedbacks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        fetchFeedbacks();
      }
    } catch (error) {
      console.error('Failed to update feedback:', error);
    }
  };

  const deleteFeedback = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await fetch(`/api/admin/feedbacks?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFeedbacks();
      }
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === 'pending') return !f.isApproved;
    if (filter === 'approved') return f.isApproved;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Feedbacks</h1>
          <p className="text-gray-400">Review and approve client testimonials</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-brand-blue text-white'
                : 'bg-brand-navy-light text-gray-400 hover:text-white'
            }`}
          >
            All ({feedbacks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-brand-blue text-white'
                : 'bg-brand-navy-light text-gray-400 hover:text-white'
            }`}
          >
            Pending ({feedbacks.filter(f => !f.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-brand-blue text-white'
                : 'bg-brand-navy-light text-gray-400 hover:text-white'
            }`}
          >
            Approved ({feedbacks.filter(f => f.isApproved).length})
          </button>
        </div>

        {/* Feedbacks List */}
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-navy-light p-6 rounded-2xl border border-brand-navy-light/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{feedback.name}</h3>
                  <p className="text-gray-400 text-sm">{feedback.email} • {feedback.location}</p>
                  {feedback.phone && <p className="text-gray-400 text-sm">{feedback.phone}</p>}
                </div>
                <div className="flex gap-2">
                  {!feedback.isApproved && (
                    <button
                      onClick={() => updateFeedback(feedback.id, { isApproved: true, isVisible: true })}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="text-green-500" size={20} />
                    </button>
                  )}
                  {feedback.isApproved && (
                    <button
                      onClick={() => updateFeedback(feedback.id, { isApproved: false, isVisible: false })}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Unapprove"
                    >
                      <XCircle className="text-red-500" size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => updateFeedback(feedback.id, { isVisible: !feedback.isVisible })}
                    className="p-2 bg-brand-blue/20 hover:bg-brand-blue/30 rounded-lg transition-colors"
                    title={feedback.isVisible ? 'Hide' : 'Show'}
                  >
                    {feedback.isVisible ? (
                      <Eye className="text-brand-blue" size={20} />
                    ) : (
                      <EyeOff className="text-gray-400" size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteFeedback(feedback.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="text-red-500" size={20} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(feedback.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-300 mb-3">{feedback.review}</p>

              {/* Transformation */}
              {feedback.transformation && (
                <div className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-3">
                  <span className="text-brand-gold text-sm font-semibold">{feedback.transformation}</span>
                </div>
              )}

              {/* Photos */}
              {(feedback.profilePhoto || feedback.beforePhoto || feedback.afterPhoto) && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <ImageIcon size={16} />
                    Uploaded Photos:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {feedback.profilePhoto && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Profile</p>
                        <img
                          src={feedback.profilePhoto}
                          alt="Profile"
                          className="w-full h-32 object-cover rounded-lg border border-brand-gold/30"
                        />
                      </div>
                    )}
                    {feedback.beforePhoto && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Before</p>
                        <img
                          src={feedback.beforePhoto}
                          alt="Before"
                          className="w-full h-32 object-cover rounded-lg border border-brand-gold/30"
                        />
                      </div>
                    )}
                    {feedback.afterPhoto && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">After</p>
                        <img
                          src={feedback.afterPhoto}
                          alt="After"
                          className="w-full h-32 object-cover rounded-lg border border-brand-gold/30"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="flex gap-2 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    feedback.isApproved
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}
                >
                  {feedback.isApproved ? 'Approved' : 'Pending'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    feedback.isVisible
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}
                >
                  {feedback.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </motion.div>
          ))}

          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No feedbacks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
