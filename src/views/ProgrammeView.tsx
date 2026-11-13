import React, { useState, useMemo } from 'react';
import { ProgrammeItem, Participant } from '../types';
import { Search, Clock, MapPin, Check, Bookmark, X, Users, Building, Tag } from 'lucide-react';

interface ProgrammeViewProps {
  programmeItems: ProgrammeItem[];
  currentUser: Participant | null;
  savedItemIds: string[];
  onToggleSchedule: (itemId: string) => void;
  onRequireSignIn: () => void;
  selectedDetailItem: ProgrammeItem | null;
  setSelectedDetailItem: (item: ProgrammeItem | null) => void;
}

export const ProgrammeView: React.FC<ProgrammeViewProps> = ({
  programmeItems,
  currentUser,
  savedItemIds,
  onToggleSchedule,
  onRequireSignIn,
  selectedDetailItem,
  setSelectedDetailItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  // Available days and tracks derived dynamically from items
  const uniqueDays = useMemo(() => {
    const set = new Set<string>();
    programmeItems.forEach((i) => {
      if (i.date) set.add(i.date);
    });
    return Array.from(set).sort();
  }, [programmeItems]);

  const uniqueTracks = useMemo(() => {
    const set = new Set<string>();
    programmeItems.forEach((i) => {
      if (i.track) set.add(i.track);
    });
    return Array.from(set).sort();
  }, [programmeItems]);

  // Filter and sort chronologically
  const filteredItems = useMemo(() => {
    return programmeItems
      .filter((item) => {
        const matchesDay = selectedDay === 'All' || item.date === selectedDay;
        const matchesTrack = selectedTrack === 'All' || item.track === selectedTrack;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.presenterName.toLowerCase().includes(q) ||
          item.institution.toLowerCase().includes(q) ||
          item.room.toLowerCase().includes(q) ||
          item.track.toLowerCase().includes(q);

        return matchesDay && matchesTrack && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by date then start time
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [programmeItems, selectedDay, selectedTrack, searchQuery]);

  const handleScheduleClick = (itemId: string) => {
    if (!currentUser) {
      onRequireSignIn();
      return;
    }
    onToggleSchedule(itemId);
  };

  const getSessionVenue = (dateStr: string) => {
    if (dateStr && dateStr.toLowerCase().includes('nov 23')) {
      return {
        label: 'Day 1 • KIET North Nazimabad',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        venue: 'KIET, North Nazimabad Campus'
      };
    }
    if (dateStr && dateStr.toLowerCase().includes('nov 24')) {
      return {
        label: 'Day 2 • IBHM DUHS Ojha',
        color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        venue: 'IBHM (DUHS), Ojha Campus'
      };
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
          Conference Programme
        </h1>
        <p className="text-xs text-[#526375] mt-1">
          Browse sessions and manage your customized daily schedule.
        </p>
      </div>

      {/* Two-Campus Venue Quick Map & Information Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-[#E2EDF4] rounded-2xl p-4 sm:p-5 shadow-3xs">
        <div className="p-3 bg-white border border-[#E2EDF4] rounded-xl space-y-1 hover:border-[#1793D1]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 uppercase tracking-wide">
              Day 1 • Nov 23
            </span>
            <span className="text-xs font-extrabold text-[#0B2038]">KIET North Nazimabad Campus</span>
          </div>
          <p className="text-[11px] text-[#526375] leading-relaxed">
            Main Venue location for academic, technology tracks and corporate strategy sessions.
          </p>
        </div>

        <div className="p-3 bg-white border border-[#E2EDF4] rounded-xl space-y-1 hover:border-[#1793D1]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-wide">
              Day 2 • Nov 24
            </span>
            <span className="text-xs font-extrabold text-[#0B2038]">IBHM DUHS Ojha Campus</span>
          </div>
          <p className="text-[11px] text-[#526375] leading-relaxed">
            Healthcare management, financial innovation, and sustainable development tracks.
          </p>
        </div>
      </div>

      {/* Controls: Search, Day Selector, Track Filter ONLY */}
      <div className="bg-white p-4 rounded-xl border border-[#E2EDF4] space-y-3 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A91A8]" />
          <input
            id="programme-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, presenters, institutions, rooms..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
          />
        </div>

        {/* Day selector & Track filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Day Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Day selector
            </label>
            <select
              id="programme-day-selector"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            >
              <option value="All">All Days</option>
              {uniqueDays.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Track Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Track filter
            </label>
            <select
              id="programme-track-filter"
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            >
              <option value="All">All Tracks</option>
              {uniqueTracks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Programme Items List */}
      {programmeItems.length === 0 ? (
        <div className="bg-white border border-[#E2EDF4] rounded-xl p-8 sm:p-12 text-center text-[#4B6178]">
          <p className="text-base font-medium">
            Programme information will appear here once published.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E2EDF4] rounded-xl p-8 text-center text-[#63788E]">
          <p className="text-sm">No sessions match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isSaved = savedItemIds.includes(item.id);
            const venueDetails = getSessionVenue(item.date);

            return (
              <div
                key={item.id}
                id={`programme-item-${item.id}`}
                className="bg-white border border-[#E2EDF4] rounded-xl p-5 hover:border-[#1793D1]/50 transition-all shadow-xs space-y-3"
              >
                {/* Time & Track */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#63788E]">
                  <div className="flex items-center gap-1.5 text-[#0B2038] font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#1793D1]" />
                    <span>
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.date && (
                      <span className="text-[#7A91A8] ml-1">({item.date})</span>
                    )}
                  </div>
                  <span className="bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7] px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {item.track}
                  </span>
                </div>

                {/* Paper / Session Title */}
                <h3 className="text-lg font-bold text-[#0B2038] leading-snug">
                  {item.title}
                </h3>

                {/* Presenter Name & Institution */}
                <div className="text-sm space-y-0.5">
                  <div className="font-semibold text-[#0B2038]">{item.presenterName}</div>
                  <div className="text-xs text-[#63788E]">{item.institution}</div>
                </div>

                {/* Room & Dynamic Venue Badge */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#4B6178]">
                    <MapPin className="w-3.5 h-3.5 text-[#1793D1]" />
                    <span className="font-semibold text-[#0B2038]">Room: {item.room}</span>
                  </div>

                  {venueDetails && (
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border ${venueDetails.color}`}>
                      📍 {venueDetails.label}
                    </span>
                  )}
                </div>

                {/* Actions: View Details & Add to My Schedule / Added to My Schedule */}
                <div className="pt-3 border-t border-[#F0F5F9] flex flex-wrap items-center justify-between gap-2">
                  <button
                    id={`view-details-${item.id}`}
                    onClick={() => setSelectedDetailItem(item)}
                    className="text-sm font-semibold text-[#1793D1] hover:text-[#127EB5] underline underline-offset-4"
                  >
                    View Details
                  </button>

                  <button
                    id={`toggle-schedule-${item.id}`}
                    onClick={() => handleScheduleClick(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-[#EBF6FB] text-[#1793D1] border-[#BAE3F7] hover:bg-[#DDF0FA]'
                        : 'bg-white text-[#0B2038] border-[#D0E5F2] hover:bg-[#EBF6FB] hover:text-[#1793D1]'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1793D1]" />
                        Added to My Schedule
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-[#7A91A8]" />
                        Add to My Schedule
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROGRAMME DETAIL MODAL / DRAWER */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091B2E]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#E2EDF4] p-6 sm:p-7 space-y-5"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#F0F5F9]">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
                  <Tag className="w-3 h-3" />
                  {selectedDetailItem.track}
                </span>
                <h2 className="text-xl font-bold text-[#0B2038] leading-snug">
                  {selectedDetailItem.title}
                </h2>
              </div>
              <button
                id="close-programme-detail-btn"
                onClick={() => setSelectedDetailItem(null)}
                className="p-1.5 text-[#63788E] hover:text-[#0B2038] hover:bg-[#EBF6FB] rounded-lg transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: exact requested fields */}
            <div className="space-y-4 text-sm">
              {/* Presenter & Co-Authors */}
              <div className="space-y-1 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2EDF4]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1793D1] uppercase tracking-wide">
                  <Users className="w-3.5 h-3.5" /> Presenter &amp; Authors
                </div>
                <div className="font-bold text-[#0B2038] text-base">
                  {selectedDetailItem.presenterName}
                </div>
                {selectedDetailItem.coAuthors && (
                  <div className="text-xs text-[#4B6178]">
                    <span className="font-medium text-[#0B2038]">Co-Authors:</span>{' '}
                    {selectedDetailItem.coAuthors}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#63788E] pt-0.5">
                  <Building className="w-3.5 h-3.5 text-[#1793D1]" />
                  <span>{selectedDetailItem.institution}</span>
                </div>
              </div>

              {/* Schedule Timing & Location */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2EDF4] space-y-1">
                  <span className="font-semibold text-[#1793D1] uppercase tracking-wide">
                    Date &amp; Time
                  </span>
                  <div className="font-semibold text-[#0B2038]">
                    {selectedDetailItem.date}
                  </div>
                  <div className="text-[#4B6178] font-mono">
                    {selectedDetailItem.startTime} - {selectedDetailItem.endTime}
                  </div>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2EDF4] space-y-1">
                  <span className="font-semibold text-[#1793D1] uppercase tracking-wide">
                    Room
                  </span>
                  <div className="font-semibold text-[#0B2038]">
                    {selectedDetailItem.room}
                  </div>
                </div>
              </div>

              {/* Abstract / Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#1793D1] uppercase tracking-wide">
                  Abstract / Description
                </span>
                <p className="text-sm text-[#4B6178] leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-4 rounded-xl border border-[#E2EDF4]">
                  {selectedDetailItem.abstractDescription || 'No abstract provided.'}
                </p>
              </div>
            </div>

            {/* Modal Actions: Add to My Schedule / Remove from My Schedule */}
            <div className="pt-4 border-t border-[#F0F5F9] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 text-sm font-medium text-[#4B6178] hover:text-[#0B2038] rounded-lg transition-colors"
              >
                Close
              </button>

              {savedItemIds.includes(selectedDetailItem.id) ? (
                <button
                  id="detail-remove-from-schedule"
                  onClick={() => {
                    handleScheduleClick(selectedDetailItem.id);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                  Remove from My Schedule
                </button>
              ) : (
                <button
                  id="detail-add-to-schedule"
                  onClick={() => {
                    handleScheduleClick(selectedDetailItem.id);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] rounded-lg shadow-sm transition-colors"
                >
                  Add to My Schedule
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
