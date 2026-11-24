'use client';

import { Clock, AlertTriangle, Info, Wrench } from 'lucide-react';

interface AlertNotice {
  id: string;
  type: 'delay' | 'info' | 'maintenance';
  title: string;
  busNumber: string;
  message: string;
  time: string;
}

const MOCK_NOTICES: AlertNotice[] = [
  {
    id: 'notice-1',
    type: 'delay',
    title: '15-Minute Highway Delay',
    busNumber: 'AP 04 TX 4589',
    message:
      'Bus is currently delayed due to road maintenance near Kodur bypass. Please wait at your designated stop.',
    time: '10m ago',
  },
  {
    id: 'notice-2',
    type: 'maintenance',
    title: 'Replacement Shuttle Deployed',
    busNumber: 'AP 04 TX 1022',
    message:
      'Bus AP 04 TX 1022 undergoing scheduled inspection. Backup Bus AP 04 TX 9900 will operate today.',
    time: '1h ago',
  },
  {
    id: 'notice-3',
    type: 'info',
    title: 'Exam Schedule Update',
    busNumber: 'All Buses',
    message: 'Evening buses will depart campus at 05:15 PM instead of 04:45 PM during exam week.',
    time: 'Yesterday',
  },
];

export default function StudentNotificationsPage() {
  return (
    <div className="p-4 space-y-4 pt-5 bg-[#F2F2F7] min-h-screen">
      {/* Apple Large Title Header */}
      <header className="px-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
          Dispatch Feed
        </p>
        <h1 className="font-heading text-[28px] font-bold tracking-[-0.025em] text-[#1C1C1E]">
          Alerts
        </h1>
      </header>

      {/* Apple Grouped Notification Cards */}
      <div className="space-y-3">
        {MOCK_NOTICES.map((notice) => {
          const isDelay = notice.type === 'delay';
          const isMaint = notice.type === 'maintenance';

          return (
            <div key={notice.id} className="apple-card rounded-[20px] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-[7px] flex items-center justify-center ${
                      isDelay
                        ? 'bg-[#FF9500]/15 text-[#FF9500]'
                        : isMaint
                          ? 'bg-[#007AFF]/15 text-[#007AFF]'
                          : 'bg-[#34C759]/15 text-[#34C759]'
                    }`}
                  >
                    {isDelay && <AlertTriangle className="w-3.5 h-3.5" />}
                    {isMaint && <Wrench className="w-3.5 h-3.5" />}
                    {!isDelay && !isMaint && <Info className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[12px] font-semibold text-[#1C1C1E]">
                    {notice.busNumber}
                  </span>
                </div>
                <span className="text-[11px] text-[#8E8E93] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {notice.time}
                </span>
              </div>

              <div className="pl-8">
                <h3 className="font-heading text-[14px] font-semibold text-[#1C1C1E]">
                  {notice.title}
                </h3>
                <p className="text-[13px] text-[#8E8E93] mt-0.5 leading-snug">{notice.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
