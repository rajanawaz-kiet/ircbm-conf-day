import React from 'react';
import { ProgrammeItem, Participant } from '../types';
import { Clock, MapPin, Trash2, ArrowRight } from 'lucide-react';

interface MyScheduleViewProps {
  currentUser: Participant | null;
  savedItems: ProgrammeItem[];
  onRemoveFromSchedule: (itemId: string) => void;
  onViewProgrammeDetail: (item: ProgrammeItem) => void;
  onNavigateToProgramme: () => void;
  onNavigateToSignIn: () => void;
}

export const MyScheduleView: React.FC<MyScheduleViewProps> = ({
  currentUser,
  savedItems,
  onRemoveFromSchedule,
  onViewProgrammeDetail,
  onNavigateToProgramme,
  onNavigateToSignIn,
}) => {
  // If not signed in, prompt to sign in
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B2038]">My Schedule</h1>
        <p className="text-[#4B6178] text-sm">
          Please sign in to view and manage your personalized conference schedule.
        </p>
        <button
          id="schedule-sign-in-prompt-btn"
          onClick={onNavigateToSignIn}
          className="px-5 py-2.5 bg-[#1793D1] text-white text-sm font-semibold rounded-lg hover:bg-[#127EB5] active:bg-[#0F6B9B] shadow-sm transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Group chronologically by conference day
  const groupedByDay: { [day: string]: ProgrammeItem[] } = {};
  const sortedItems = [...savedItems].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  sortedItems.forEach((item) => {
    const dayKey = item.date || 'Conference Day';
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }
    groupedByDay[dayKey].push(item);
  });

  const dayKeys = Object.keys(groupedByDay).sort();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
          My Schedule
        </h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="bg-white border border-[#E2EDF4] rounded-xl p-10 sm:p-14 text-center space-y-5 shadow-xs">
          {/* Exact required text: "No sessions have been added to your schedule." */}
          <p className="text-base text-[#0B2038] font-semibold">
            No sessions have been added to your schedule.
          </p>
          <div>
            <button
              id="view-programme-btn"
              onClick={onNavigateToProgramme}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1793D1] text-white text-sm font-semibold rounded-lg hover:bg-[#127EB5] active:bg-[#0F6B9B] transition-colors shadow-sm"
            >
              View Programme
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {dayKeys.map((day) => {
            const isDay1 = day.toLowerCase().includes('nov 23');
            const venueLabel = isDay1 ? 'KIET, Ahsanabad Campus' : 'IBHM (DUHS), Ojha Campus';
            const badgeColor = isDay1 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200';

            return (
              <div key={day} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EDF4] pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#0B2038]">{day}</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
                      {groupedByDay[day].length} {groupedByDay[day].length === 1 ? 'session' : 'sessions'}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                    📍 {venueLabel}
                  </span>
                </div>

                <div className="space-y-3">
                  {groupedByDay[day].map((item) => {
                    return (
                      <div
                        key={item.id}
                        id={`schedule-item-${item.id}`}
                        className="bg-white border border-[#E2EDF4] rounded-xl p-4 sm:p-5 hover:border-[#1793D1]/50 transition-all shadow-xs space-y-3"
                      >
                        {/* Time */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B2038] font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#1793D1]" />
                          <span>
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>

                        {/* Paper / Session Title */}
                        <h3 className="text-base sm:text-lg font-bold text-[#0B2038] leading-snug">
                          {item.title}
                        </h3>

                        {/* Presenter Name */}
                        <div className="text-sm font-semibold text-[#0B2038]">
                          {item.presenterName}
                        </div>

                        {/* Room & Venue details */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-[#63788E]">
                            <MapPin className="w-3.5 h-3.5 text-[#1793D1]" />
                            <span>Room: {item.room}</span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded border ${badgeColor}`}>
                            {isDay1 ? 'Day 1 • Ahsanabad' : 'Day 2 • Ojha'}
                          </span>
                        </div>

                        {/* Actions: View Details & Remove */}
                        <div className="pt-3 border-t border-[#F0F5F9] flex items-center justify-between">
                          <button
                            id={`schedule-view-details-${item.id}`}
                            onClick={() => onViewProgrammeDetail(item)}
                            className="text-sm font-semibold text-[#1793D1] hover:text-[#127EB5] underline underline-offset-4"
                          >
                            View Details
                          </button>

                          <button
                            id={`schedule-remove-${item.id}`}
                            onClick={() => onRemoveFromSchedule(item.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
