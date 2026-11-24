'use client';

import { useState, useEffect } from 'react';
import { StopDocument } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { StopRepository } from '@/repositories/StopRepository';

export default function AdminStopsPage() {
  const [stops, setStops] = useState<StopDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<StopDocument | null>(null);

  const [stopId, setStopId] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    fetchStops();
  }, []);

  async function fetchStops() {
    setLoading(true);
    try {
      const data = await StopRepository.getAllStops();
      setStops(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StopDocument = {
      stopId,
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      if (editing && editing.stopId === stopId) {
        await StopRepository.updateStop(stopId, payload);
      } else {
        await StopRepository.addStop(payload);
      }
      setIsModalOpen(false);
      fetchStops();
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save stop');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stop?')) {
      try {
        await StopRepository.deleteStop(id);
        fetchStops();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const openModal = (stop?: StopDocument) => {
    if (stop) {
      setEditing(stop);
      setStopId(stop.stopId);
      setName(stop.name);
      setLatitude(stop.latitude.toString());
      setLongitude(stop.longitude.toString());
    } else {
      setEditing(null);
      setStopId('stp_' + Math.random().toString(36).substring(2, 7));
      setName('');
      setLatitude('');
      setLongitude('');
    }
    setIsModalOpen(true);
  };

  const filtered = stops.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Geofenced Stops Management
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-normal">
            Define GPS coordinates and geofences for precision student pickup points.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
          Add Stop
        </Button>
      </div>

      <div className="flex items-center bg-white border border-neutral-300/80 rounded-xl px-3 py-2 w-full max-w-sm shadow-2xs">
        <Search className="w-4 h-4 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search stops..."
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
                <th className="px-5 py-3.5">Stop Name</th>
                <th className="px-5 py-3.5">Latitude</th>
                <th className="px-5 py-3.5">Longitude</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-neutral-400 font-medium">
                    Loading stops...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-neutral-400 font-medium">
                    No stops found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.stopId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-neutral-900">{s.name}</td>
                    <td className="px-5 py-3.5 font-mono text-neutral-600">{s.latitude}</td>
                    <td className="px-5 py-3.5 font-mono text-neutral-600">{s.longitude}</td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openModal(s)}
                        className="text-neutral-600 hover:text-neutral-900 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.stopId)}
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
              {editing ? 'Edit Stop' : 'Add Stop'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Stop Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seven Roads Circle"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="14.4673"
                    className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="78.8242"
                    className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
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
                  Save Stop
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
