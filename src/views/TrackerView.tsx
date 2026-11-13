import React from 'react';
import { Participant } from '../types';
import { AdminCheckInView } from './admin/AdminCheckInView';
import { LogOut, ShieldCheck, Sparkles } from 'lucide-react';

interface TrackerViewProps {
  currentUser: Participant | null;
  participants: Participant[];
  onCheckInParticipant: (id: string) => { success: boolean; participant?: Participant; alreadyCheckedIn?: boolean };
  onSignOut: () => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  currentUser,
  participants,
  onCheckInParticipant,
  onSignOut,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Tracker Status Card */}
      <div className="bg-gradient-to-r from-[#0B2038] to-[#123E6B] rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#1793D1]">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Attendance Portal
              </span>
            </div>
            <h1 className="text-lg font-bold mt-1 tracking-tight">IRCBM 2026 Scanner</h1>
            <p className="text-xs text-[#E2EDF4]/80 mt-0.5">
              Logged in as: <strong className="text-white">Volunteer Gatekeeper</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white hover:text-red-200 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          Disconnect Portal
        </button>
      </div>

      {/* Embedded Operational Terminal */}
      <div className="bg-slate-50/50 rounded-2xl border border-[#E2EDF4]/60 p-1">
        <AdminCheckInView
          participants={participants}
          onCheckIn={onCheckInParticipant}
        />
      </div>
    </div>
  );
};
