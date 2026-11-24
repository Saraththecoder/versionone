'use client';

import { useState, useEffect } from 'react';
import { RouteDocument } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { RouteRepository } from '@/repositories/RouteRepository';

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RouteDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RouteDocument | null>(null);

  const [routeId, setRouteId] = useState('');
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [busId, setBusId] = useState('');
  const [stops, setStops] = useState(''); // Comma separated for MVP

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    setLoading(true);
    try {
      const data = await RouteRepository.getAllRoutes();
      setRoutes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: RouteDocument = {
      routeId,
      name,
      origin,
      destination,
      busId: busId || null,
      stops: stops
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editing && editing.routeId === routeId) {
        await RouteRepository.updateRoute(routeId, payload);
      } else {
        await RouteRepository.addRoute(payload);
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save route');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      try {
        await RouteRepository.deleteRoute(id);
        fetchRoutes();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const openModal = (route?: RouteDocument) => {
    if (route) {
      setEditing(route);
      setRouteId(route.routeId);
      setName(route.name);
      setOrigin(route.origin);
      setDestination(route.destination);
      setBusId(route.busId || '');
      setStops(route.stops.join(', '));
    } else {
      setEditing(null);
      setRouteId('rt_' + Math.random().toString(36).substring(2, 7));
      setName('');
      setOrigin('');
      setDestination('');
      setBusId('');
      setStops('');
    }
    setIsModalOpen(true);
  };

  const filtered = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Campus Routes Directory
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-normal">
            Build route networks, origins, destinations, and intermediate stop sequences.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
          Add Route
        </Button>
      </div>

      <div className="flex items-center bg-white border border-neutral-300/80 rounded-xl px-3 py-2 w-full max-w-sm shadow-2xs">
        <Search className="w-4 h-4 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search routes..."
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
                <th className="px-5 py-3.5">Route Name</th>
                <th className="px-5 py-3.5">Origin</th>
                <th className="px-5 py-3.5">Destination</th>
                <th className="px-5 py-3.5">Assigned Bus</th>
                <th className="px-5 py-3.5">Stops</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400 font-medium">
                    Loading routes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400 font-medium">
                    No routes found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.routeId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-neutral-900">{r.name}</td>
                    <td className="px-5 py-3.5 text-neutral-700">{r.origin}</td>
                    <td className="px-5 py-3.5 text-neutral-700">{r.destination}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {r.busId || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500 font-medium">
                      {r.stops?.length || 0} stops
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openModal(r)}
                        className="text-neutral-600 hover:text-neutral-900 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.routeId)}
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
              {editing ? 'Edit Route' : 'Add Route'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Route Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 01: Kadapa Central → AITS"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Assigned Bus ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. bus_14"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Stops (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Kadapa Old Stand, Seven Roads, AITS Gate"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={stops}
                  onChange={(e) => setStops(e.target.value)}
                />
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
                  Save Route
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
