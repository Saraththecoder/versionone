'use client';

import { useState, useEffect, useRef } from 'react';
import { StudentDocument, StudentSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit2, Trash2, Upload, Download } from 'lucide-react';
import { FirestoreService } from '@/services/FirestoreService';
import { parseCSV, exportCSV } from '@/lib/csv';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<StudentDocument | null>(null);

  // Form states
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [assignedBusId, setAssignedBusId] = useState('');

  // Bulk Import state
  const [importReport, setImportReport] = useState<{
    success: number;
    errors: { row: number; error: string }[];
  } | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const data = await FirestoreService.getDocuments<StudentDocument>('students');
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StudentDocument = {
      uid,
      name,
      email,
      role: 'student',
      createdAt: editing ? editing.createdAt : Date.now(),
      assignedBusId: assignedBusId || undefined,
    };

    try {
      if (editing && editing.uid === uid) {
        await FirestoreService.updateDocument('students', uid, payload);
      } else {
        await FirestoreService.setDocument('students', uid, payload, false);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error('Failed to save student', err);
      alert('Failed to save student');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student pass?')) {
      try {
        await FirestoreService.deleteDocument('students', id);
        fetchStudents();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleExport = () => {
    exportCSV(students, `aits_students_${Date.now()}.csv`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const res = parseCSV<StudentDocument>(text, StudentSchema);
      let successCount = 0;
      const errors: { row: number; error: string }[] = [];

      for (let i = 0; i < res.data.length; i++) {
        const row = res.data[i];
        if (!row.name || !row.email) {
          errors.push({ row: i + 1, error: 'Missing required name or email field' });
          continue;
        }

        const studentUid = row.uid || 'stu_' + Math.random().toString(36).substring(2, 7);
        const payload: StudentDocument = {
          uid: studentUid,
          name: row.name,
          email: row.email,
          role: 'student',
          createdAt: Date.now(),
          assignedBusId: row.assignedBusId || undefined,
        };

        try {
          await FirestoreService.setDocument('students', studentUid, payload, false);
          successCount++;
        } catch (err: unknown) {
          errors.push({
            row: i + 1,
            error: err instanceof Error ? err.message : 'Failed to write document',
          });
        }
      }

      setImportReport({ success: successCount, errors: [...errors, ...res.errors] });
      fetchStudents();
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openModal = (student?: StudentDocument) => {
    if (student) {
      setEditing(student);
      setUid(student.uid);
      setName(student.name);
      setEmail(student.email);
      setAssignedBusId(student.assignedBusId || '');
    } else {
      setEditing(null);
      setUid('stu_' + Math.random().toString(36).substring(2, 7));
      setName('');
      setEmail('');
      setAssignedBusId('');
    }
    setIsModalOpen(true);
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Student Passes Directory
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-normal">
            Manage registered student passes, bus allocations, and bulk CSV uploads.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full text-xs font-medium"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
            Import CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-full text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
            Export CSV
          </Button>
          <Button
            onClick={() => openModal()}
            className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold px-4 py-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Add Student
          </Button>
        </div>
      </div>

      {importReport && (
        <div
          className={`p-4 rounded-xl border text-xs ${importReport.errors.length > 0 ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'}`}
        >
          <h3 className="font-bold mb-1">Import Report</h3>
          <p>
            Successfully imported: <span className="font-bold">{importReport.success}</span> passes
          </p>
          {importReport.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-red-600 mb-1">
                Errors ({importReport.errors.length}):
              </p>
              <ul className="text-xs text-red-700 max-h-32 overflow-y-auto space-y-1 bg-white p-2 rounded-lg border border-red-200">
                {importReport.errors.map((e, i) => (
                  <li key={i}>
                    Row {e.row}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            variant="outline"
            size="xs"
            className="mt-2.5 rounded-full"
            onClick={() => setImportReport(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex items-center bg-white border border-neutral-300/80 rounded-xl px-3 py-2 w-full max-w-sm shadow-2xs">
        <Search className="w-4 h-4 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search students..."
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
                <th className="px-5 py-3.5">Assigned Bus</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-neutral-400 font-medium">
                    Loading students...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-neutral-400 font-medium">
                    No students found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.uid} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-neutral-900">{s.name}</td>
                    <td className="px-5 py-3.5 font-medium text-neutral-700">{s.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {s.assignedBusId || 'None'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openModal(s)}
                        className="text-neutral-600 hover:text-neutral-900 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.uid)}
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
              {editing ? 'Edit Student' : 'Add Student'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Reddy"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@aitsrajampet.ac.in"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Assigned Bus ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. bus_14"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={assignedBusId}
                  onChange={(e) => setAssignedBusId(e.target.value)}
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
                  Save Student Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
