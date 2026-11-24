'use client';

import { useState, useEffect } from 'react';
import { DriverDocument } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { FirestoreService } from '@/services/FirestoreService';

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<DriverDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DriverDocument | null>(null);

  // Form states
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setLoading(true);
    try {
      const data = await FirestoreService.getDocuments<DriverDocument>('drivers');
      setDrivers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DriverDocument = {
      uid,
      name,
      email,
      role: 'driver',
      createdAt: editing ? editing.createdAt : Date.now(),
      licenseNumber: licenseNumber || undefined,
      currentBusId: editing?.currentBusId || null,
    };

    try {
      if (editing && editing.uid === uid) {
        await FirestoreService.updateDocument('drivers', uid, payload);
      } else {
        await FirestoreService.setDocument('drivers', uid, payload, false);
      }
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save driver');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await FirestoreService.deleteDocument('drivers', id);
        fetchDrivers();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const openModal = (driver?: DriverDocument) => {
    if (driver) {
      setEditing(driver);
      setUid(driver.uid);
      setName(driver.name);
      setEmail(driver.email);
      setLicenseNumber(driver.licenseNumber || '');
    } else {
      setEditing(null);
      setUid('drv_' + Math.random().toString(36).substring(2, 7));
      setName('');
      setEmail('');
      setLicenseNumber('');
    }
    setIsModalOpen(true);
  };

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Driver Roster Management
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-normal">
            Manage verified college bus drivers, duty allocations, and license details.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
          Add Driver
        </Button>
      </div>

      <div className="flex items-center bg-white border border-neutral-300/80 rounded-xl px-3 py-2 w-full max-w-sm shadow-2xs">
        <Search className="w-4 h-4 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search drivers..."
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
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">License No</th>
                <th className="px-5 py-3.5">Assigned Bus</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-neutral-400 font-medium">
                    Loading drivers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-neutral-400 font-medium">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.uid} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-neutral-900">{d.name}</td>
                    <td className="px-5 py-3.5 font-medium text-neutral-700">{d.email}</td>
                    <td className="px-5 py-3.5 text-neutral-600">{d.licenseNumber || 'N/A'}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {d.currentBusId || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openModal(d)}
                        className="text-neutral-600 hover:text-neutral-900 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.uid)}
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
              {editing ? 'Edit Driver' : 'Add Driver'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
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
                  Save Driver
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
