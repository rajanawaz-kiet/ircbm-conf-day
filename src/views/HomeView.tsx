import React from 'react';
import { ActivePage, Announcement, ProgrammeItem, VenueInfo, ConferenceAsset } from '../types';
import { Calendar, Clock, MapPin, QrCode, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: ActivePage) => void;
  programmeItems: ProgrammeItem[];
  announcements: Announcement[];
  venueInfo: VenueInfo;
  onViewProgrammeDetail: (item: ProgrammeItem) => void;
  assets?: ConferenceAsset[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  programmeItems,
  announcements,
  onViewProgrammeDetail,
  venueInfo,
  assets = [],
}) => {
  // Determine Happening Now & Coming Up Next
  // If actual programme items exist, we pick the first and second upcoming items.
  // Otherwise, display the exact placeholders required by the specification.
  const happeningNowItem: ProgrammeItem | null = programmeItems.length > 0 ? programmeItems[0] : null;
  const comingUpNextItem: ProgrammeItem | null = programmeItems.length > 1 ? programmeItems[1] : null;
  const latestAnnouncement: Announcement | null = announcements.length > 0 ? announcements[0] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Original official branding, versioned in GitHub with the deployment. */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 pb-4 min-w-0">
        <img src="/kiet-official.png" alt="KIET official logo" className="h-24 sm:h-28 w-auto max-w-full object-contain shrink-0" />
        <img src="/kiet-25-years.jpg" alt="KIET 25 Years — Centre of Excellence" className="w-full max-w-[440px] sm:w-[min(65%,440px)] h-auto max-h-36 object-contain" />
      </div>

      {/* Conference Header Information */}
      <div className="text-center space-y-3">
        <div className="inline-block text-xs font-bold tracking-widest text-[#1793D1] uppercase">
          Organized by Faculty of Management Sciences (FoMS), KIET
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B2038] tracking-tight">
          IRCBM 2026
        </h1>
        <p className="text-lg sm:text-xl font-medium text-[#4B6178] max-w-2xl mx-auto">
          International Research Conference on Business &amp; Management 2026
        </p>

        {/* Conference Date and Venue: Clear Placeholders or configured values */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm sm:text-base font-semibold">
          <div className="flex items-center gap-2 bg-[#262B37] border border-[#262B37] px-4 py-2 rounded-xl text-[#E0DCD5] shadow-sm">
            <Calendar className="w-4.5 h-4.5 text-[#8D7A68]" />
            <span>November 23 - 24, 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-[#262B37] border border-[#262B37] px-4 py-2 rounded-xl text-[#E0DCD5] shadow-sm">
            <MapPin className="w-4.5 h-4.5 text-[#8D7A68]" />
            <span>{venueInfo.venueName || '[Venue]'}</span>
          </div>
        </div>
      </div>

      {/* Four Prominent Quick-Access Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          id="home-quick-programme"
          onClick={() => onNavigate('programme')}
          className="flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-[#E2EDF4] hover:border-[#8D7A68] hover:shadow-md rounded-xl text-center transition-all group"
        >
          <div className="w-11 h-11 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8D7A68] mb-2.5 group-hover:bg-[#262B37] group-hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-[#0B2038]">Programme</span>
        </button>

        <button
          id="home-quick-schedule"
          onClick={() => onNavigate('my-schedule')}
          className="flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-[#E2EDF4] hover:border-[#8D7A68] hover:shadow-md rounded-xl text-center transition-all group"
        >
          <div className="w-11 h-11 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8D7A68] mb-2.5 group-hover:bg-[#262B37] group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-[#0B2038]">My Schedule</span>
        </button>

        <button
          id="home-quick-qr-pass"
          onClick={() => onNavigate('my-qr-pass')}
          className="flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-[#E2EDF4] hover:border-[#8D7A68] hover:shadow-md rounded-xl text-center transition-all group"
        >
          <div className="w-11 h-11 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8D7A68] mb-2.5 group-hover:bg-[#262B37] group-hover:text-white transition-colors">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-[#0B2038]">My QR Pass</span>
        </button>

        <button
          id="home-quick-venue"
          onClick={() => onNavigate('venue')}
          className="flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-[#E2EDF4] hover:border-[#8D7A68] hover:shadow-md rounded-xl text-center transition-all group"
        >
          <div className="w-11 h-11 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8D7A68] mb-2.5 group-hover:bg-[#262B37] group-hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-[#0B2038]">Venue</span>
        </button>
      </div>

      {/* Sections Below: ONLY Happening Now, Coming Up Next, Latest Announcement */}
      <div className="space-y-6">
        {/* HAPPENING NOW */}
        <section className="bg-white border border-[#E2EDF4] rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9] mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1793D1]">
              Happening Now
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
              Live Session
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-[#1793D1]">
              {happeningNowItem ? `${happeningNowItem.startTime} - ${happeningNowItem.endTime}` : '[Time]'}
            </div>
            <h3 className="text-lg font-bold text-black">
              {happeningNowItem ? happeningNowItem.title : '[Paper / Session Title]'}
            </h3>
            <div className="text-sm text-[#4B6178]">
              {happeningNowItem ? happeningNowItem.presenterName : '[Presenter Name]'}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#63788E]">
              <span><strong>Room:</strong> {happeningNowItem ? happeningNowItem.room : '[Room]'}</span>
              <span><strong>Track:</strong> {happeningNowItem ? happeningNowItem.track : '[Track]'}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F5F9] flex justify-end">
            <button
              id="happening-now-view-details"
              onClick={() => {
                if (happeningNowItem) {
                  onViewProgrammeDetail(happeningNowItem);
                } else {
                  onNavigate('programme');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* COMING UP NEXT */}
        <section className="bg-white border border-[#E2EDF4] rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9] mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1793D1]">
              Coming Up Next
            </h2>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-[#1793D1]">
              {comingUpNextItem ? `${comingUpNextItem.startTime} - ${comingUpNextItem.endTime}` : '[Time]'}
            </div>
            <h3 className="text-lg font-bold text-[#0B2038]">
              {comingUpNextItem ? comingUpNextItem.title : '[Paper / Session Title]'}
            </h3>
            <div className="text-sm text-[#4B6178]">
              {comingUpNextItem ? comingUpNextItem.presenterName : '[Presenter Name]'}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#63788E]">
              <span><strong>Room:</strong> {comingUpNextItem ? comingUpNextItem.room : '[Room]'}</span>
              <span><strong>Track:</strong> {comingUpNextItem ? comingUpNextItem.track : '[Track]'}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F5F9] flex justify-end">
            <button
              id="coming-up-view-details"
              onClick={() => {
                if (comingUpNextItem) {
                  onViewProgrammeDetail(comingUpNextItem);
                } else {
                  onNavigate('programme');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* LATEST ANNOUNCEMENT */}
        <section className="bg-white border border-[#E2EDF4] rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9] mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1793D1]">
              Latest Announcement
            </h2>
            <button
              id="home-view-all-announcements"
              onClick={() => onNavigate('announcements')}
              className="inline-flex items-center px-3 py-1 bg-[#EBF6FB] hover:bg-[#DDF0FA] text-[#1793D1] hover:text-[#127EB5] text-xs font-semibold rounded-md border border-[#BAE3F7] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[#0B2038]">
              {latestAnnouncement ? latestAnnouncement.title : '[Announcement Title]'}
            </h3>
            <p className="text-sm text-[#4B6178] leading-relaxed whitespace-pre-line">
              {latestAnnouncement ? latestAnnouncement.message : '[Announcement Text]'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
