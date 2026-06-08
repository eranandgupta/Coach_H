'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Search, Users } from 'lucide-react';

interface TrainerAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Trainer {
  id: number;
  name: string | null;
  image: string | null;
}

interface Client {
  id: number;
  name: string | null;
  image: string | null;
  subscriptions?: { plan: { name: string }; endDate: string }[];
}

interface Assignment {
  id: number;
  trainerId: number;
  clientId: number;
  trainer: Trainer;
  client: Client;
}

export default function TrainerAssignmentModal({ isOpen, onClose, onSuccess }: TrainerAssignmentModalProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch trainers, clients, and assignments in parallel
      const [trainersRes, clientsRes, assignmentsRes] = await Promise.all([
        fetch('/api/trainer-clients/trainers', { headers }),
        fetch('/api/clients', { headers }),
        fetch('/api/trainer-clients', { headers }),
      ]);

      if (trainersRes.ok) {
        const data = await trainersRes.json();
        setTrainers(data.trainers || []);
      }
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        // Only show Elite 1:1 clients with active subscriptions
        const eliteClients = (data.clients || []).filter((c: any) => {
          const sub = c.subscriptions?.[0];
          if (!sub) return false;
          return sub.plan.name.startsWith('Elite 1:1') && new Date(sub.endDate) >= new Date();
        });
        setClients(eliteClients);
      }
      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (clientId: number) => {
    if (!selectedTrainer) return;
    setAssigning(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/trainer-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ trainerId: selectedTrainer, clientId }),
      });

      if (res.ok) {
        await fetchData();
        onSuccess?.();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to assign client');
      }
    } catch {
      alert('Failed to assign client');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (trainerId: number, clientId: number) => {
    if (!confirm('Unassign this client from the trainer? Their chat history will also be removed.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trainer-clients?trainerId=${trainerId}&clientId=${clientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchData();
        onSuccess?.();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to unassign client');
      }
    } catch {
      alert('Failed to unassign client');
    }
  };

  // Get assigned client IDs for the selected trainer
  const assignedClientIds = new Set(
    assignments
      .filter((a) => a.trainerId === selectedTrainer)
      .map((a) => a.clientId)
  );

  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignedClients = filteredClients.filter((c) => assignedClientIds.has(c.id));
  const unassignedClients = filteredClients.filter((c) => !assignedClientIds.has(c.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-brand-navy border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue/20 rounded-lg">
              <Users className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Assign Clients to Trainer</h2>
              <p className="text-xs text-gray-400">Only Elite 1:1 clients can be assigned</p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trainers.map((trainer) => {
                  const isSelected = selectedTrainer === trainer.id;
                  const assignCount = assignments.filter((a) => a.trainerId === trainer.id).length;
                  return (
                    <button
                      key={trainer.id}
                      onClick={() => setSelectedTrainer(trainer.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-brand-blue/20 border-brand-blue/50 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {trainer.name?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-medium truncate">{trainer.name || 'Trainer'}</p>
                        <p className="text-xs text-gray-500">{assignCount} client{assignCount !== 1 ? 's' : ''}</p>
                      </div>
                    </button>
                  );
                })}
                {trainers.length === 0 && (
                  <p className="text-gray-500 text-sm col-span-full">No trainers found</p>
                )}
              </div>
            </div>

            {selectedTrainer && (
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search clients..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue/50"
                  />
                </div>

                {/* Assigned Clients */}
                {assignedClients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      Assigned ({assignedClients.length})
                    </h3>
                    <div className="space-y-2">
                      {assignedClients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                              {client.name?.[0]?.toUpperCase() || 'C'}
                            </div>
                            <div>
                              <p className="text-sm text-white font-medium">{client.name || 'Client'}</p>
                              {client.subscriptions?.[0] && (
                                <p className="text-[10px] text-green-400/70">{client.subscriptions[0].plan.name}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnassign(selectedTrainer!, client.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unassigned Clients */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    Available Clients ({unassignedClients.length})
                  </h3>
                  {unassignedClients.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">
                      {searchTerm ? 'No matching clients' : 'No available Elite 1:1 clients'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {unassignedClients.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {client.name?.[0]?.toUpperCase() || 'C'}
                            </div>
                            <div>
                              <p className="text-sm text-white font-medium">{client.name || 'Client'}</p>
                              {client.subscriptions?.[0] && (
                                <p className="text-[10px] text-gray-500">{client.subscriptions[0].plan.name}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAssign(client.id)}
                            disabled={assigning}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-lg hover:bg-brand-blue/20 transition-all disabled:opacity-50"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Assign
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
