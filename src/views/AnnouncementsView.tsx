import React from 'react';
import { Announcement } from '../types';
import { Calendar } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
}) => {
  // Sort reverse chronological
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
          Announcements
        </h1>
      </div>

      {sortedAnnouncements.length === 0 ? (
        <div className="bg-white border border-[#E2EDF4] rounded-xl p-8 sm:p-12 text-center text-[#4B6178] shadow-xs">
          {/* Exactly as specified in Section 30 */}
          <p className="text-base font-medium">
            No announcements are currently available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => {
            const formattedDate = new Date(announcement.publishedAt).toLocaleString(
              undefined,
              {
                dateStyle: 'medium',
                timeStyle: 'short',
              }
            );

            return (
              <article
                key={announcement.id}
                id={`announcement-${announcement.id}`}
                className="bg-white border border-[#E2EDF4] rounded-xl p-5 sm:p-6 space-y-2.5 shadow-xs hover:border-[#1793D1]/40 transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#63788E]">
                  <Calendar className="w-3.5 h-3.5 text-[#1793D1]" />
                  <time dateTime={announcement.publishedAt}>{formattedDate}</time>
                </div>

                <h2 className="text-lg font-bold text-[#0B2038] leading-snug">
                  {announcement.title}
                </h2>

                <p className="text-sm text-[#4B6178] leading-relaxed whitespace-pre-line">
                  {announcement.message}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
