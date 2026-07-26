'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Plus, Scale } from 'lucide-react';
import { PLAN_GROUPS, comparePlans, type PlanItem } from '@/lib/plans';

const MAX_COMPARE = 3;

export default function PlanCompare() {
  const [selected, setSelected] = useState<PlanItem[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const isSelected = (plan: PlanItem) => selected.some((p) => p.name === plan.name);
  const atLimit = selected.length >= MAX_COMPARE;

  const toggle = (plan: PlanItem) => {
    setSelected((prev) => {
      if (prev.some((p) => p.name === plan.name)) {
        return prev.filter((p) => p.name !== plan.name);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, plan];
    });
  };

  const clearAll = () => {
    setSelected([]);
    setShowCompare(false);
  };

  const openCompare = () => {
    if (selected.length >= 2) setShowCompare(true);
  };

  // Close the comparison modal on Escape.
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowCompare(false);
  }, []);
  useEffect(() => {
    if (!showCompare) return;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [showCompare, onKey]);

  const rows = showCompare ? comparePlans(selected) : [];

  return (
    <div id="plans-list">
      {PLAN_GROUPS.map((group, gi) => (
        <section
          key={group.key}
          className={`py-16 md:py-24 ${gi % 2 === 1 ? 'border-y border-white/[0.06]' : ''}`}
          style={gi % 2 === 1 ? { background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' } : undefined}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{group.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{group.blurb}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.plans.map((plan) => {
                const active = isSelected(plan);
                const disableAdd = atLimit && !active;
                return (
                  <div
                    key={plan.name}
                    className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                      active
                        ? 'border-brand-gold bg-brand-gold/[0.04] shadow-lg shadow-brand-gold/10'
                        : plan.popular
                        ? 'border-brand-blue bg-brand-blue/5 shadow-lg shadow-brand-blue/10'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-blue text-white text-xs font-bold rounded-full whitespace-nowrap">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="text-sm text-gray-400 mb-1">{plan.durationLabel}</div>
                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-black text-brand-gold">{plan.priceLabel}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">{plan.tagline}</div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-brand-blue mt-0.5 flex-shrink-0">&#10003;</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-2">
                      <Link
                        href="/#plans"
                        className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                          plan.popular
                            ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                            : 'border border-white/20 text-white hover:border-brand-gold hover:bg-white/5'
                        }`}
                      >
                        Get Started
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggle(plan)}
                        disabled={disableAdd}
                        aria-pressed={active}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          active
                            ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/40'
                            : disableAdd
                            ? 'text-gray-600 border border-white/[0.06] cursor-not-allowed'
                            : 'text-gray-300 border border-white/10 hover:border-brand-gold/50 hover:text-brand-gold'
                        }`}
                        title={disableAdd ? `You can compare up to ${MAX_COMPARE} plans` : undefined}
                      >
                        {active ? <Check size={14} /> : <Plus size={14} />}
                        {active ? 'Added to compare' : 'Compare'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Sticky compare tray */}
      <AnimatePresence>
        {selected.length > 0 && !showCompare && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0b1120]/95 backdrop-blur-md"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-brand-gold font-semibold text-sm flex-shrink-0">
                <Scale size={18} /> Compare
              </div>
              <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {selected.map((p) => (
                  <span
                    key={p.name}
                    className="flex items-center gap-1.5 whitespace-nowrap text-xs text-white bg-white/[0.06] border border-white/10 rounded-full pl-3 pr-1.5 py-1.5"
                  >
                    {p.name}
                    <button
                      type="button"
                      onClick={() => toggle(p)}
                      aria-label={`Remove ${p.name}`}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {Array.from({ length: MAX_COMPARE - selected.length }).map((_, i) => (
                  <span
                    key={`empty-${i}`}
                    className="hidden sm:inline text-xs text-gray-600 border border-dashed border-white/10 rounded-full px-3 py-1.5 whitespace-nowrap"
                  >
                    Add plan
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={openCompare}
                disabled={selected.length < 2}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  selected.length < 2
                    ? 'bg-white/[0.06] text-gray-500 cursor-not-allowed'
                    : 'bg-brand-blue text-white hover:bg-brand-blue-dark shadow-lg shadow-brand-blue/25'
                }`}
              >
                Compare {selected.length > 1 ? `(${selected.length})` : ''}
              </button>
            </div>
            {selected.length < 2 && (
              <p className="text-center text-[11px] text-gray-500 pb-2">Select at least 2 plans to compare</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison modal */}
      <AnimatePresence>
        {showCompare && selected.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-3 md:p-6"
            onClick={() => setShowCompare(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-4xl my-4 rounded-2xl border border-white/10 bg-[#0b1120] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Compare plans"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale size={18} className="text-brand-gold" /> Compare Plans
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCompare(false)}
                  aria-label="Close comparison"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-[#0b1120] text-left text-gray-400 font-medium p-4 w-40 min-w-[140px]">
                        Feature
                      </th>
                      {selected.map((p) => (
                        <th key={p.name} className="p-4 text-center align-top min-w-[150px]">
                          <div className="text-white font-bold leading-snug">{p.name}</div>
                          <div className="text-brand-gold font-black text-xl mt-1">{p.priceLabel}</div>
                          <div className="text-[11px] text-gray-500">{p.durationLabel}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label} className="border-t border-white/[0.06]">
                        <td className="sticky left-0 z-10 bg-[#0b1120] text-gray-300 p-4 font-medium">
                          {row.label}
                        </td>
                        {row.values.map((v, i) => (
                          <td key={i} className="p-4 text-center">
                            {typeof v === 'boolean' ? (
                              v ? (
                                <Check size={18} className="inline text-brand-blue" aria-label="Included" />
                              ) : (
                                <span className="text-gray-600" aria-label="Not included">—</span>
                              )
                            ) : v ? (
                              <span className="text-white font-semibold">{v}</span>
                            ) : (
                              <span className="text-gray-600" aria-label="Not included">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t border-white/10">
                      <td className="sticky left-0 z-10 bg-[#0b1120] p-4" />
                      {selected.map((p) => (
                        <td key={p.name} className="p-4 text-center">
                          <Link
                            href="/#plans"
                            className="inline-block px-4 py-2 rounded-lg bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-dark transition-colors"
                          >
                            Get Started
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
