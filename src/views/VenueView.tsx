import React, { useState } from 'react';
import { VenueInfo } from '../types';
import { MapPin, Info, ArrowRight, Building2, Map, Navigation, Calendar } from 'lucide-react';

interface VenueViewProps {
  venueInfo: VenueInfo;
  onNavigateToProgramme: () => void;
}

export const VenueView: React.FC<VenueViewProps> = ({
  venueInfo,
  onNavigateToProgramme,
}) => {
  const [activeTab, setActiveTab] = useState<'day1' | 'day2'>('day1');

  // fallback to defaults if properties are missing
  const currentVenue = {
    name: activeTab === 'day1' 
      ? (venueInfo.day1VenueName || 'KIET, North Nazimabad Campus, Karachi, Pakistan') 
      : (venueInfo.day2VenueName || 'IBHM (DUHS), Ojha Campus'),
    address: activeTab === 'day1' 
      ? (venueInfo.day1Address || 'KIET City Campus (North Nazimabad)\n\nAddress:\nNorth Nazimabad Campus F-103 & 103/1, Block-F, North Nazimabad, Allama Rasheed Turabi Road, Karachi, Pakistan') 
      : (venueInfo.day2Address || 'Institute of Business and Health Management, Dow University of Health Sciences, Ojha Campus, Karachi, Pakistan'),
    arrivalInfo: activeTab === 'day1' 
      ? (venueInfo.day1ArrivalInformation || venueInfo.arrivalInformation || 'The North Nazimabad Campus is situated on Allama Rasheed Turabi Road in Block-F. It is easily accessible via public transport or private vehicle. Please present your QR Pass at the registration desk upon arrival.') 
      : (venueInfo.day2ArrivalInformation || 'DUHS Ojha Campus is situated on University Road. The IBHM building is accessible through the main gate, with clear signage to the seminar halls.'),
    mapEmbedUrl: activeTab === 'day1' 
      ? (venueInfo.day1MapEmbedUrl || 'https://maps.google.com/maps?q=Karachi%20Institute%20of%20Economics%20and%20Technology%20North%20Nazimabad%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed') 
      : (venueInfo.day2MapEmbedUrl || 'https://maps.google.com/maps?q=Dow%20University%20Ojha%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed'),
    latitude: activeTab === 'day1' 
      ? (venueInfo.day1Latitude || 24.9372) 
      : (venueInfo.day2Latitude || 24.9450),
    longitude: activeTab === 'day1' 
      ? (venueInfo.day1Longitude || 67.0406) 
      : (venueInfo.day2Longitude || 67.1419),
  };

  const filteredRooms = venueInfo.rooms.filter((room) => {
    const loc = (room.location || '').toLowerCase();
    const name = (room.roomName || '').toLowerCase();
    if (activeTab === 'day1') {
      return (
        loc.includes('nazimabad') ||
        loc.includes('ahsanabad') || 
        loc.includes('day 1') || 
        name.includes('auditorium a') || 
        name.includes('seminar hall 1') || 
        name.includes('conference room 2')
      );
    } else {
      return (
        loc.includes('ojha') || 
        loc.includes('day 2') || 
        loc.includes('ibhm') || 
        name.includes('ibhm')
      );
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Title & Two Venue Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
            Conference Venues
          </h1>
          <p className="text-xs text-[#526375] mt-1">
            IRCBM 2026 takes place across two premier locations in Karachi. Select a day to view location specifics.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 p-1 bg-[#2C323E] rounded-xl border border-[#2C323E]">
          <button
            type="button"
            onClick={() => setActiveTab('day1')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'day1'
                ? 'bg-white !text-[#262B37] shadow-xs border border-[#A091A3]/30'
                : '!text-[#E0DCD5]/80 hover:!text-white hover:bg-white/10'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'day1' ? 'text-amber-600' : 'text-[#E0DCD5]/60'}`} />
            <span>Day 1 Location • Nov 23</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('day2')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'day2'
                ? 'bg-white !text-[#262B37] shadow-xs border border-[#A091A3]/30'
                : '!text-[#E0DCD5]/80 hover:!text-white hover:bg-white/10'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'day2' ? 'text-indigo-600' : 'text-[#E0DCD5]/60'}`} />
            <span>Day 2 Location • Nov 24</span>
          </button>
        </div>
      </div>

      {/* Venue Information Card */}
      <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
              activeTab === 'day1' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {activeTab === 'day1' ? 'Day 1 Venue' : 'Day 2 Venue'}
            </span>
            <span className="text-xs font-bold text-slate-400">Nov {activeTab === 'day1' ? '23' : '24'}, 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2038]">
            {currentVenue.name}
          </h2>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5 text-sm bg-[#F8FAFC] p-4 rounded-xl border border-[#E2EDF4]">
          <MapPin className="w-5 h-5 text-[#1793D1] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-[#1793D1] uppercase tracking-wide">
              Physical Address
            </div>
            <p className="font-semibold text-[#0B2038] leading-relaxed whitespace-pre-line">
              {currentVenue.address}
            </p>
          </div>
        </div>

        {/* Arrival Information */}
        <div className="flex items-start gap-2.5 text-sm bg-[#F8FAFC] p-4 rounded-xl border border-[#E2EDF4]">
          <Info className="w-5 h-5 text-[#1793D1] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-[#1793D1] uppercase tracking-wide">
              Arrival &amp; Entry Guide
            </div>
            <p className="text-[#4B6178] leading-relaxed">
              {currentVenue.arrivalInfo}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map with Mobile Navigation Prompts */}
      <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#F0F5F9] pb-3">
          <Map className="w-5 h-5 text-[#1793D1]" />
          <h2 className="text-base font-bold text-[#0B2038]">
            Interactive Location Map &amp; Directions
          </h2>
        </div>

        {/* Google Map iframe */}
        {currentVenue.mapEmbedUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-[#E2EDF4] h-[350px] bg-slate-50 shadow-inner">
            <iframe
              title={`${currentVenue.name} Google Map Location`}
              src={currentVenue.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="p-6 bg-[#F8FAFC] border border-dashed border-[#DCE8F1] rounded-xl text-center text-[#63788E] text-xs">
            No interactive map has been configured yet. Administrators can configure custom map embeds in the Administration venue panel.
          </div>
        )}

        {/* Turn-by-Turn Mobile Navigation */}
        <div className="bg-[#EBF6FB] border border-[#BAE3F7] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0B2038] font-bold text-sm">
              <Navigation className="w-4 h-4 text-[#1793D1]" />
              <span>Mobile Driving Assistant</span>
            </div>
            <p className="text-xs text-[#4B6178] leading-relaxed max-w-xl">
              Tap the button to open Google Maps directly on your mobile device for turn-by-turn routing from your current location to <strong>{currentVenue.name}</strong>.
            </p>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${currentVenue.latitude},${currentVenue.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1793D1] hover:bg-[#127EB5] text-white text-xs font-bold rounded-lg shadow-xs transition-all whitespace-nowrap self-stretch md:self-auto text-center cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-white" />
            <span>Launch turn-by-turn Navigation</span>
          </a>
        </div>
      </div>

      {/* Conference Rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B2038]">
              Designated Conference Rooms
            </h2>
            <p className="text-xs text-[#63788E]">Rooms operating on {activeTab === 'day1' ? 'Day 1' : 'Day 2'}</p>
          </div>
          <button
            id="venue-view-programme-btn"
            onClick={onNavigateToProgramme}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1793D1] hover:text-[#127EB5] underline underline-offset-4"
          >
            View Programme
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="p-6 bg-[#F8FAFC] border border-[#E2EDF4] rounded-xl text-center text-[#63788E] text-xs">
            No rooms have been specifically listed for this venue day yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRooms.map((room, idx) => (
              <div
                key={idx}
                id={`venue-room-${idx}`}
                className="bg-white border border-[#E2EDF4] rounded-xl p-4 sm:p-5 space-y-1 shadow-2xs hover:border-[#1793D1]/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-[#0B2038] font-bold text-base">
                  <Building2 className="w-4 h-4 text-[#1793D1]" />
                  <span>{room.roomName || '[Room Name]'}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B6178] pl-6">
                  {room.location || '[Location]'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
