'use client';

import { useState } from 'react';
import { Clock, Search, ChevronRight } from 'lucide-react';

interface MockRoute {
  id: string;
  num: number;
  name: string;
  busNumber: string;
  morningTime: string;
  eveningTime: string;
  stops: string[];
}

const ALL_ROUTES: MockRoute[] = [
  {
    id: 'route-1',
    num: 1,
    name: 'Route 01: Kadapa Central → AITS',
    busNumber: 'AP 04 TX 1022',
    morningTime: '07:15 AM',
    eveningTime: '04:45 PM',
    stops: [
      'Kadapa Old Bus Stand',
      'Seven Roads Circle',
      'RIMS Hospital',
      'Utukur Cross',
      'Guvalacheruvu',
      'AITS Campus Gate',
    ],
  },
  {
    id: 'route-2',
    num: 2,
    name: 'Route 02: Tirupati Bypass → AITS',
    busNumber: 'AP 04 TX 4589',
    morningTime: '06:45 AM',
    eveningTime: '05:00 PM',
    stops: [
      'Tirupati RTC Stand',
      'Renigunta Checkpost',
      'Settigunta',
      'Railway Kodur',
      'Pullampet',
      'Rajampet Bypass',
      'AITS Campus Gate',
    ],
  },
  {
    id: 'route-3',
    num: 3,
    name: 'Route 03: Rayachoty Town → AITS',
    busNumber: 'AP 04 TX 8812',
    morningTime: '07:20 AM',
    eveningTime: '04:45 PM',
    stops: [
      'Rayachoty Bus Station',
      'Masapet Junction',
      'Sanipaya',
      'Nandalur Cross',
      'AITS Campus Gate',
    ],
  },
  {
    id: 'route-4',
    num: 4,
    name: 'Route 04: Badvel → AITS',
    busNumber: 'AP 04 TX 9044',
    morningTime: '07:00 AM',
    eveningTime: '04:50 PM',
    stops: [
      'Badvel Clock Tower',
      'Gopavaram',
      'Siddavatam Bridge',
      'Vontimitta',
      'Madhavaram',
      'AITS Campus Gate',
    ],
  },
];

export default function StudentRoutesPage() {
  const [search, setSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const filtered = ALL_ROUTES.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.stops.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-4 pt-5 bg-[#F2F2F7] min-h-screen">
      {/* Apple Large Title Header */}
      <header className="px-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
          AITS Bus Network
        </p>
        <h1 className="font-heading text-[28px] font-bold tracking-[-0.025em] text-[#1C1C1E]">
          Timetables
        </h1>
      </header>

      {/* iOS Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes or stops"
          className="w-full h-10 bg-[#E5E5EA]/75 rounded-[12px] pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] transition-all"
        />
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {filtered.map((route) => {
          const isExpanded = selectedRoute === route.id;

          return (
            <div
              key={route.id}
              className="apple-card rounded-[20px] p-4 space-y-3 cursor-pointer"
              onClick={() => setSelectedRoute(isExpanded ? null : route.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#007AFF]/12 text-[#007AFF] font-display font-bold text-[15px] tabular-nums flex items-center justify-center shrink-0">
                    {route.num}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#007AFF]">
                      {route.busNumber}
                    </span>
                    <h3 className="font-heading text-[14px] font-semibold text-[#1C1C1E]">
                      {route.name}
                    </h3>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-[#C7C7CC] transition-transform mt-2 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F2F2F7] rounded-[10px]">
                  <Clock className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span className="text-[12px] font-medium text-[#1C1C1E] tabular-nums">
                    {route.morningTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F2F2F7] rounded-[10px]">
                  <Clock className="w-3.5 h-3.5 text-[#FF9500]" />
                  <span className="text-[12px] font-medium text-[#1C1C1E] tabular-nums">
                    {route.eveningTime}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="pt-3 border-t border-black/[0.06] space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8E8E93]">
                    Stops ({route.stops.length})
                  </p>
                  <div className="space-y-1.5">
                    {route.stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[13px] text-[#1C1C1E]">
                        <span className="w-5 h-5 rounded-full bg-[#F2F2F7] text-[#1C1C1E] flex items-center justify-center text-[10px] font-semibold tabular-nums">
                          {i + 1}
                        </span>
                        <span className="font-medium">{stop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
