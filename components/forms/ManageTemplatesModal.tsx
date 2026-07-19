'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Pencil, LayoutTemplate, Dumbbell, UtensilsCrossed, Users, Lock } from 'lucide-react';
import CreateWorkoutModal from './CreateWorkoutModal';
import CreateDietModal from './CreateDietModal';

interface ManageTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: number; // to tell "my templates" (editable) from shared ones (read-only)
}

type Tab = 'workout' | 'diet';

export default function ManageTemplatesModal({ isOpen, onClose, currentUserId }: ManageTemplatesModalProps) {
  const [tab, setTab] = useState<Tab>('workout');
  const [workoutTemplates, setWorkoutTemplates] = useState<any[]>([]);
  const [dietTemplates, setDietTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Nested create/edit modals (opened in template mode)
  const [workoutEditorOpen, setWorkoutEditorOpen] = useState(false);
  const [dietEditorOpen, setDietEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [wRes, dRes] = await Promise.all([
        fetch('/api/workout-templates', { headers }),
        fetch('/api/diet-templates', { headers }),
      ]);
      if (wRes.ok) setWorkoutTemplates((await wRes.json()).templates || []);
      if (dRes.ok) setDietTemplates((await dRes.json()).templates || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchTemplates();
  }, [isOpen, fetchTemplates]);

  const handleDelete = async (type: Tab, id: number) => {
    if (!confirm('Delete this template? This cannot be undone.')) return;
    setDeletingId(`${type}-${id}`);
    try {
      const token = localStorage.getItem('token');
      const url = type === 'workout' ? `/api/workout-templates?id=${id}` : `/api/diet-templates?id=${id}`;
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchTemplates();
      else alert((await res.json()).error || 'Failed to delete template');
    } catch {
      alert('Network error deleting template');
    } finally {
      setDeletingId(null);
    }
  };

  const openNew = (type: Tab) => {
    setEditingTemplate(null);
    if (type === 'workout') setWorkoutEditorOpen(true);
    else setDietEditorOpen(true);
  };

  const openEdit = (type: Tab, tpl: any) => {
    setEditingTemplate(tpl);
    if (type === 'workout') setWorkoutEditorOpen(true);
    else setDietEditorOpen(true);
  };

  const list = tab === 'workout' ? workoutTemplates : dietTemplates;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40"
              onClick={onClose}
            />
            <div className="fixed inset-0 z-40 flex items-start justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-brand-navy-light to-black border border-brand-navy-light/30 rounded-2xl p-8 relative max-w-3xl w-full my-8 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-blue/20 rounded-lg">
                    <LayoutTemplate className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Templates</h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setTab('workout')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === 'workout' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Dumbbell size={16} /> Workout ({workoutTemplates.length})
                  </button>
                  <button
                    onClick={() => setTab('diet')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === 'diet' ? 'bg-green-500/30 text-green-200 border border-green-500/50' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <UtensilsCrossed size={16} /> Diet ({dietTemplates.length})
                  </button>

                  <button
                    onClick={() => openNew(tab)}
                    className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      tab === 'workout'
                        ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30'
                        : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30'
                    }`}
                  >
                    <Plus size={16} /> New {tab === 'workout' ? 'Workout' : 'Diet'} Template
                  </button>
                </div>

                {/* List */}
                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {loading && <p className="text-gray-500 text-center py-8">Loading templates…</p>}
                  {!loading && list.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No {tab} templates yet. Create one, or use “Save as template” while building a plan.
                    </p>
                  )}
                  {!loading && list.map((tpl) => {
                    const mine = currentUserId != null && tpl.createdById === currentUserId;
                    const count = tab === 'workout' ? (tpl.exercises?.length || 0) : (tpl.meals?.length || 0);
                    return (
                      <div key={tpl.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-semibold truncate">{tpl.name}</span>
                            {tpl.isShared ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs"><Users size={11} /> Shared</span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-white/10 text-gray-400 rounded text-xs"><Lock size={11} /> Private</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            {count} {tab === 'workout' ? 'exercise' : 'meal'}{count === 1 ? '' : 's'}
                            {!mine && tpl.createdBy?.name ? ` · by ${tpl.createdBy.name}` : ''}
                          </p>
                          {tpl.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{tpl.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {mine ? (
                            <>
                              <button
                                onClick={() => openEdit(tab, tpl)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                title="Edit template"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(tab, tpl.id)}
                                disabled={deletingId === `${tab}-${tpl.id}`}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                title="Delete template"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 px-2">Read-only</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Nested editors (template mode) */}
      <CreateWorkoutModal
        isOpen={workoutEditorOpen}
        mode="template"
        template={editingTemplate}
        onClose={() => { setWorkoutEditorOpen(false); setEditingTemplate(null); }}
        onSuccess={fetchTemplates}
      />
      <CreateDietModal
        isOpen={dietEditorOpen}
        mode="template"
        template={editingTemplate}
        onClose={() => { setDietEditorOpen(false); setEditingTemplate(null); }}
        onSuccess={fetchTemplates}
      />
    </>
  );
}
