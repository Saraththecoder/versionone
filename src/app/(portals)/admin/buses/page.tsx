'use client';

import { useState, useEffect } from 'react';
import { BusRepository } from '@/repositories/BusRepository';
import { BusDocument } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<BusDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusDocument | null>(null);

  // Form states
  const [busId, setBusId] = useState('');
  const [registration, setRegistration] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState<BusDocument['status']>('active');

  useEffect(() => {
    fetchBuses();
  }, []);

  async function fetchBuses() {
    setLoading(true);
    try {
      const data = await BusRepository.getAllBuses();
      setBuses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: BusDocument = {
      busId,
      registrationNumber: registration,
      capacity: parseInt(capacity) || 0,
      status,
      currentDriverId: editingBus?.currentDriverId || null,
      currentRouteId: editingBus?.currentRouteId || null,
    };

    try {
      if (editingBus && editingBus.busId === busId) {
        await BusRepository.updateBus(busId, payload);
      } else {
        await BusRepository.addBus(payload);
      }
      setIsModalOpen(false);
      fetchBuses();
    } catch (err) {
      console.error('Failed to save bus', err);
      alert('Failed to save bus');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      try {
        await BusRepository.deleteBus(id);
        fetchBuses();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const openModal = (bus?: BusDocument) => {
    if (bus) {
      setEditingBus(bus);
      setBusId(bus.busId);
      setRegistration(bus.registrationNumber);
      setCapacity(bus.capacity.toString());
      setStatus(bus.status);
    } else {
      setEditingBus(null);
      setBusId('');
      setRegistration('');
      setCapacity('');
      setStatus('active');
    }
    setIsModalOpen(true);
  };

  const filtered = buses.filter(
    (b) =>
      b.busId.toLowerCase().includes(search.toLowerCase()) ||
      b.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Bus Fleet Management
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-normal">
            Manage college transport vehicles, seating capacities, and operational statuses.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
          Add Bus
        </Button>
      </div>

      <div className="flex items-center bg-white border border-neutral-300/80 rounded-xl px-3 py-2 w-full max-w-sm shadow-2xs">
        <Search className="w-4 h-4 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search buses..."
          className="bg-transparent border-none outline-none w-full text-xs text-neutral-900 placeholder:text-neutral-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50/80 text-neutral-500 uppercase font-semibold border-b border-neutral-100">
              <tr>
                <th className="px-5 py-3.5">Bus ID</th>
                <th className="px-5 py-3.5">Registration</th>
                <th className="px-5 py-3.5">Capacity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-neutral-400 font-medium">
                    Loading buses...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-neutral-400 font-medium">
                    No buses found.
                  </td>
                </tr>
              ) : (
                filtered.map((bus) => (
                  <tr key={bus.busId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-neutral-900">{bus.busId}</td>
                    <td className="px-5 py-3.5 font-medium text-neutral-700">
                      {bus.registrationNumber}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">{bus.capacity} seats</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          bus.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : bus.status === 'maintenance'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openModal(bus)}
                        className="text-neutral-600 hover:text-neutral-900 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bus.busId)}
                        className="text-neutral-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              {editingBus ? 'Edit Bus' : 'Add Bus'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Bus ID</label>
                <input
                  type="text"
                  required
                  disabled={!!editingBus}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 disabled:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Status</label>
                <select
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'active' | 'maintenance' | 'inactive')
                  }
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold"
                >
                  Save Bus
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
