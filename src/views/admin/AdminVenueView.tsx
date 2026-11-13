import React, { useState } from 'react';
import { VenueInfo } from '../../types';
import { Map, MapPin, CheckCircle2, Compass, Save, HelpCircle, Calendar } from 'lucide-react';

interface AdminVenueViewProps {
  venueInfo: VenueInfo;
  onUpdateVenue: (venue: VenueInfo) => void;
}

export const AdminVenueView: React.FC<AdminVenueViewProps> = ({
  venueInfo,
  onUpdateVenue,
}) => {
  const [activeFormTab, setActiveFormTab] = useState<'day1' | 'day2'>('day1');

  // Day 1 Setup States
  const [day1VenueName, setDay1VenueName] = useState(venueInfo.day1VenueName || 'KIET, Ahsanabad Campus');
  const [day1Address, setDay1Address] = useState(venueInfo.day1Address || 'Karachi Institute of Economics & Technology, Ahsanabad Campus, Ahsanabad, Karachi, Pakistan');
  const [day1Arrival, setDay1Arrival] = useState(venueInfo.day1ArrivalInformation || 'Ahsanabad Campus is located near Scheme 33, accessible via the Super Highway / M-9. Please show your QR pass at the entrance gate.');
  const [day1Latitude, setDay1Latitude] = useState(venueInfo.day1Latitude?.toString() || '24.986058');
  const [day1Longitude, setDay1Longitude] = useState(venueInfo.day1Longitude?.toString() || '67.124417');
  const [day1MapEmbed, setDay1MapEmbed] = useState(venueInfo.day1MapEmbedUrl || 'https://maps.google.com/maps?q=Karachi%20Institute%20of%20Economics%20and%20Technology%20Ahsanabad%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed');

  // Day 2 Setup States
  const [day2VenueName, setDay2VenueName] = useState(venueInfo.day2VenueName || 'IBHM (DUHS), Ojha Campus');
  const [day2Address, setDay2Address] = useState(venueInfo.day2Address || 'Institute of Business and Health Management, Dow University of Health Sciences, Ojha Campus, Karachi, Pakistan');
  const [day2Arrival, setDay2Arrival] = useState(venueInfo.day2ArrivalInformation || 'DUHS Ojha Campus is situated on University Road. The IBHM building is accessible through the main gate, with clear signage to the seminar halls.');
  const [day2Latitude, setDay2Latitude] = useState(venueInfo.day2Latitude?.toString() || '24.9450');
  const [day2Longitude, setDay2Longitude] = useState(venueInfo.day2Longitude?.toString() || '67.1419');
  const [day2MapEmbed, setDay2MapEmbed] = useState(venueInfo.day2MapEmbedUrl || 'https://maps.google.com/maps?q=Dow%20University%20Ojha%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed');

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const d1Lat = parseFloat(day1Latitude);
    const d1Lng = parseFloat(day1Longitude);
    const d2Lat = parseFloat(day2Latitude);
    const d2Lng = parseFloat(day2Longitude);

    onUpdateVenue({
      ...venueInfo,
      // Backward compatibility for base properties
      venueName: 'KIET (Ahsanabad) & IBHM DUHS (Ojha)',
      address: 'Karachi, Pakistan',
      arrivalInformation: 'Refer to respective Day 1 & Day 2 venue tabs.',

      // Day 1 values
      day1VenueName: day1VenueName.trim(),
      day1Address: day1Address.trim(),
      day1ArrivalInformation: day1Arrival.trim(),
      day1Latitude: isNaN(d1Lat) ? undefined : d1Lat,
      day1Longitude: isNaN(d1Lng) ? undefined : d1Lng,
      day1MapEmbedUrl: day1MapEmbed.trim() || undefined,

      // Day 2 values
      day2VenueName: day2VenueName.trim(),
      day2Address: day2Address.trim(),
      day2ArrivalInformation: day2Arrival.trim(),
      day2Latitude: isNaN(d2Lat) ? undefined : d2Lat,
      day2Longitude: isNaN(d2Lng) ? undefined : d2Lng,
      day2MapEmbedUrl: day2MapEmbed.trim() || undefined,
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleResetToPresets = () => {
    // Day 1 Presets
    setDay1VenueName('KIET, Ahsanabad Campus');
    setDay1Address('Karachi Institute of Economics & Technology, Ahsanabad Campus, Ahsanabad, Karachi, Pakistan');
    setDay1Arrival('Ahsanabad Campus is located near Scheme 33, accessible via the Super Highway / M-9. Please show your QR pass at the entrance gate.');
    setDay1Latitude('24.986058');
    setDay1Longitude('67.124417');
    setDay1MapEmbed('https://maps.google.com/maps?q=Karachi%20Institute%20of%20Economics%20and%20Technology%20Ahsanabad%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed');

    // Day 2 Presets
    setDay2VenueName('IBHM (DUHS), Ojha Campus');
    setDay2Address('Institute of Business and Health Management, Dow University of Health Sciences, Ojha Campus, Karachi, Pakistan');
    setDay2Arrival('DUHS Ojha Campus is situated on University Road. The IBHM building is accessible through the main gate, with clear signage to the seminar halls.');
    setDay2Latitude('24.9450');
    setDay2Longitude('67.1419');
    setDay2MapEmbed('https://maps.google.com/maps?q=Dow%20University%20Ojha%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F0F5F9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF6FB] flex items-center justify-center text-[#1793D1]">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B2038]">Dual-Venue &amp; Map Configuration</h2>
              <p className="text-xs text-[#63788E]">Configure separate locations, maps, addresses, and GPS coordinates for Day 1 and Day 2.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetToPresets}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-bold text-[#1793D1] hover:text-white bg-[#EBF6FB] hover:bg-[#1793D1] rounded-lg transition-colors border border-[#BAE3F7]"
          >
            Reset to Defaults
          </button>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">Both Day 1 &amp; Day 2 venue settings updated successfully!</span>
          </div>
        )}

        {/* Administration Venue Sub-Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 p-1 bg-[#2C323E] rounded-xl border border-[#2C323E]">
          <button
            type="button"
            onClick={() => setActiveFormTab('day1')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeFormTab === 'day1'
                ? 'bg-white !text-[#262B37] shadow-xs border border-[#A091A3]/30'
                : '!text-[#E0DCD5]/80 hover:!text-white hover:bg-white/10'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeFormTab === 'day1' ? 'text-amber-600' : 'text-[#E0DCD5]/60'}`} />
            <span>Day 1 Venue Setup (Nov 23)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('day2')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeFormTab === 'day2'
                ? 'bg-white !text-[#262B37] shadow-xs border border-[#A091A3]/30'
                : '!text-[#E0DCD5]/80 hover:!text-white hover:bg-white/10'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeFormTab === 'day2' ? 'text-indigo-600' : 'text-[#E0DCD5]/60'}`} />
            <span>Day 2 Venue Setup (Nov 24)</span>
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeFormTab === 'day1' ? (
            /* DAY 1: KIET AHSANABAD CAMPUS SETUP */
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-amber-900 uppercase">Day 1 Location Settings</h4>
                <p className="text-[11px] text-amber-700">These settings populate the Day 1 Venue details on the public Venue screen.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                    Day 1 Venue Name
                  </label>
                  <input
                    type="text"
                    required
                    value={day1VenueName}
                    onChange={(e) => setDay1VenueName(e.target.value)}
                    placeholder="e.g. KIET, Ahsanabad Campus"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-medium transition-shadow"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                    Day 1 Full Physical Address
                  </label>
                  <input
                    type="text"
                    required
                    value={day1Address}
                    onChange={(e) => setDay1Address(e.target.value)}
                    placeholder="e.g. Ahsanabad Campus, Ahsanabad, Karachi, Pakistan"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-medium transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                  Day 1 Arrival &amp; Entrance Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  value={day1Arrival}
                  onChange={(e) => setDay1Arrival(e.target.value)}
                  placeholder="Provide driving tips, entry gates, parking, or check-in instructions..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] leading-relaxed transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#F0F5F9] pt-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Day 1 GPS Latitude (Decimal)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={day1Latitude}
                    onChange={(e) => setDay1Latitude(e.target.value)}
                    placeholder="e.g. 24.986058"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Day 1 GPS Longitude (Decimal)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={day1Longitude}
                    onChange={(e) => setDay1Longitude(e.target.value)}
                    placeholder="e.g. 67.124417"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-[#F0F5F9] pt-5">
                <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                  Day 1 Google Maps Iframe Embed URL (`src` attribute)
                </label>
                <input
                  type="text"
                  required
                  value={day1MapEmbed}
                  onChange={(e) => setDay1MapEmbed(e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-mono"
                />
              </div>

              {day1MapEmbed.trim() && (
                <div className="space-y-2.5 border-t border-[#F0F5F9] pt-5">
                  <div className="text-xs font-bold text-[#4B6178] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Day 1 Map Live Preview:</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-[#E2EDF4] h-64 bg-slate-50 shadow-inner">
                    <iframe
                      title="Day 1 Live Map Preview"
                      src={day1MapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* DAY 2: IBHM DUHS OJHA CAMPUS SETUP */
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50/50 border border-indigo-200 p-4 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-indigo-900 uppercase">Day 2 Location Settings</h4>
                <p className="text-[11px] text-indigo-700">These settings populate the Day 2 Venue details on the public Venue screen.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                    Day 2 Venue Name
                  </label>
                  <input
                    type="text"
                    required
                    value={day2VenueName}
                    onChange={(e) => setDay2VenueName(e.target.value)}
                    placeholder="e.g. IBHM (DUHS), Ojha Campus"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-medium transition-shadow"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                    Day 2 Full Physical Address
                  </label>
                  <input
                    type="text"
                    required
                    value={day2Address}
                    onChange={(e) => setDay2Address(e.target.value)}
                    placeholder="e.g. IBHM (DUHS), Ojha Campus, Karachi, Pakistan"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-medium transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                  Day 2 Arrival &amp; Entrance Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  value={day2Arrival}
                  onChange={(e) => setDay2Arrival(e.target.value)}
                  placeholder="Provide driving tips, entry gates, parking, or check-in instructions..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] leading-relaxed transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#F0F5F9] pt-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Day 2 GPS Latitude (Decimal)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={day2Latitude}
                    onChange={(e) => setDay2Latitude(e.target.value)}
                    placeholder="e.g. 24.9450"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Day 2 GPS Longitude (Decimal)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={day2Longitude}
                    onChange={(e) => setDay2Longitude(e.target.value)}
                    placeholder="e.g. 67.1419"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-[#F0F5F9] pt-5">
                <label className="block text-xs font-bold text-[#4B6178] uppercase tracking-wider">
                  Day 2 Google Maps Iframe Embed URL (`src` attribute)
                </label>
                <input
                  type="text"
                  required
                  value={day2MapEmbed}
                  onChange={(e) => setDay2MapEmbed(e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#DCE8F1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038] font-mono"
                />
              </div>

              {day2MapEmbed.trim() && (
                <div className="space-y-2.5 border-t border-[#F0F5F9] pt-5">
                  <div className="text-xs font-bold text-[#4B6178] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Day 2 Map Live Preview:</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-[#E2EDF4] h-64 bg-slate-50 shadow-inner">
                    <iframe
                      title="Day 2 Live Map Preview"
                      src={day2MapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick instructions block */}
          <div className="bg-[#F8FAFC] border border-[#E2EDF4] p-4 rounded-xl space-y-2 text-xs text-[#4B6178] border-t pt-5">
            <div className="flex items-center gap-1.5 font-bold text-[#0B2038]">
              <HelpCircle className="w-3.5 h-3.5 text-[#1793D1]" />
              <span>How to extract the Map Embed URL:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-[#63788E]">
              <li>Search for your location (e.g. <em>DUHS Ojha Campus</em>) on <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#1793D1] underline">Google Maps</a>.</li>
              <li>Click the <strong>Share</strong> button, then select the <strong>Embed a map</strong> tab.</li>
              <li>Copy and paste ONLY the web address from the <code className="bg-slate-100 px-1 rounded font-mono">src=&quot;...&quot;</code> attribute into the respective tab above.</li>
            </ol>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1793D1] hover:bg-[#127EB5] text-white font-semibold text-sm rounded-xl shadow-sm transition-all hover:shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Both Venues &amp; Map Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
