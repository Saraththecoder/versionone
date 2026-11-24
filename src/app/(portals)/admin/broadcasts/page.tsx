'use client';

import { useState } from 'react';
import { BellRing, Send, Clock, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface BroadcastLog {
  id: string;
  target: string;
  type: string;
  message: string;
  timestamp: string;
}

const INITIAL_LOGS: BroadcastLog[] = [
  {
    id: '1',
    target: 'Bus #14 (Tirupati Route)',
    type: 'Traffic Delay',
    message:
      'Bus #14 delayed by 15 mins due to Kadapa bypass construction. Please wait at your designated stops.',
    timestamp: '10 mins ago',
  },
  {
    id: '2',
    target: 'All Routes',
    type: 'General Notice',
    message: 'Exam special evening shuttles will leave campus promptly at 05:15 PM today.',
    timestamp: '2 hours ago',
  },
];

export default function AdminBroadcastsPage() {
  const [targetBus, setTargetBus] = useState('all');
  const [incidentType, setIncidentType] = useState('delay');
  const [delayMins, setDelayMins] = useState('15');
  const [customMessage, setCustomMessage] = useState('');
  const [logs, setLogs] = useState<BroadcastLog[]>(INITIAL_LOGS);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      customMessage.trim() ||
      `Bus ${targetBus === 'all' ? 'All Routes' : targetBus} is delayed by ${delayMins} minutes.`;

    const newLog: BroadcastLog = {
      id: Date.now().toString(),
      target: targetBus === 'all' ? 'All Campus Routes' : `Bus ${targetBus}`,
      type: incidentType === 'delay' ? `Delay (+${delayMins}m)` : 'Emergency Notice',
      message: text,
      timestamp: 'Just now',
    };

    setLogs([newLog, ...logs]);
    toast.success('Broadcast dispatched successfully!', {
      description: 'Push notifications and student feed updated.',
    });
    setCustomMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200/90 p-6 md:p-8 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-900 mb-2">
            <Radio className="w-3.5 h-3.5 text-amber-600" />
            <span>Emergency Broadcast Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Broadcast Dispatches
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 font-normal mt-1">
            Instantly alert waiting students and drivers about delays, route diversions, or campus
            notices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-500" />
            <span>Dispatch New Alert</span>
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Target Route / Bus
              </label>
              <select
                value={targetBus}
                onChange={(e) => setTargetBus(e.target.value)}
                className="w-full h-11 bg-neutral-50/70 border border-neutral-300/80 rounded-xl px-3 font-medium text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="all">All Campus Buses (Broadcast to Everyone)</option>
                <option value="#14">Bus #14 (Tirupati Route)</option>
                <option value="#08">Bus #08 (Kadapa Route)</option>
                <option value="#03">Bus #03 (Rayachoty Route)</option>
                <option value="#11">Bus #11 (Badvel Route)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Incident Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIncidentType('delay')}
                  className={`h-10 rounded-xl font-semibold text-xs transition-all ${
                    incidentType === 'delay'
                      ? 'bg-amber-400 text-neutral-950 shadow-xs border border-amber-500/40'
                      : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  ⏱️ Traffic Delay
                </button>
                <button
                  type="button"
                  onClick={() => setIncidentType('emergency')}
                  className={`h-10 rounded-xl font-semibold text-xs transition-all ${
                    incidentType === 'emergency'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  🚨 Breakdown / SOS
                </button>
              </div>
            </div>

            {incidentType === 'delay' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Delay Duration
                </label>
                <div className="flex gap-2">
                  {['10', '15', '25', '45'].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDelayMins(mins)}
                      className={`flex-1 h-9 rounded-lg font-semibold text-xs transition-all ${
                        delayMins === mins
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Custom Message (Optional)
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g. Bus is delayed due to heavy train crossing traffic near Kodur station..."
                className="w-full bg-neutral-50/70 border border-neutral-300/80 rounded-xl p-3 font-normal text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Dispatch Broadcast Alert</span>
            </button>
          </form>
        </div>

        {/* Recent Dispatches Log Column */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-base font-bold text-neutral-900">Recent Dispatches</h2>
            <span className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 px-2.5 py-0.5 rounded-full">
              {logs.length} Sent
            </span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-50/60 border border-neutral-200/80 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300/70 px-2 py-0.5 rounded-md">
                    {log.target}
                  </span>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {log.timestamp}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900">{log.type}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
