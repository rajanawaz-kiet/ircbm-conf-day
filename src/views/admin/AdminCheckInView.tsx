import React, { useState } from 'react';
import { Participant } from '../../types';
import { QRScanner } from '../../components/QRScanner';
import { Search, CheckCircle2, AlertCircle, Clock, QrCode } from 'lucide-react';

interface AdminCheckInViewProps {
  participants: Participant[];
  onCheckIn: (participantId: string) => { success: boolean; participant?: Participant; alreadyCheckedIn?: boolean };
  showGatekeeperInfo?: boolean;
}

export const AdminCheckInView: React.FC<AdminCheckInViewProps> = ({
  participants,
  onCheckIn,
  showGatekeeperInfo = false,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedParticipant, setScannedParticipant] = useState<Participant | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'already' | 'not_found'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Manual Search State
  const [manualQuery, setManualQuery] = useState('');

  const findParticipantByTokenOrId = (tokenOrId: string): Participant | null => {
    const clean = tokenOrId.trim();
    // Direct ID match
    const byId = participants.find((p) => p.participantId.toLowerCase() === clean.toLowerCase());
    if (byId) return byId;

    // Token match
    const byToken = participants.find((p) => p.qrToken === clean);
    if (byToken) return byToken;

    // Email match
    const byEmail = participants.find((p) => p.email.toLowerCase() === clean.toLowerCase());
    if (byEmail) return byEmail;

    return null;
  };

  const handleQrDetected = (decodedText: string) => {
    const found = findParticipantByTokenOrId(decodedText);
    if (found) {
      setScannedParticipant(found);
      if (found.checkedIn) {
        setCheckInStatus('already');
      } else {
        setCheckInStatus('idle');
      }
    } else {
      setScannedParticipant(null);
      setCheckInStatus('not_found');
      setStatusMessage(`No participant record found for scanned code: "${decodedText.substring(0, 30)}..."`);
    }
  };

  const handlePerformCheckIn = (participant: Participant) => {
    const res = onCheckIn(participant.participantId);
    if (res.alreadyCheckedIn) {
      setCheckInStatus('already');
      if (res.participant) setScannedParticipant(res.participant);
    } else if (res.success && res.participant) {
      setCheckInStatus('success');
      setScannedParticipant(res.participant);
    }
  };

  const manualMatches = manualQuery.trim()
    ? participants.filter(
        (p) =>
          p.participantId.toLowerCase().includes(manualQuery.toLowerCase().trim()) ||
          p.firstName.toLowerCase().includes(manualQuery.toLowerCase().trim()) ||
          p.lastName.toLowerCase().includes(manualQuery.toLowerCase().trim()) ||
          p.email.toLowerCase().includes(manualQuery.toLowerCase().trim())
      )
    : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B2038]">
          Participant Check-In
        </h2>
        <p className="text-xs text-[#4B6178] mt-0.5">
          Scan attendee QR passes or look up credentials manually for badge verification
        </p>
      </div>

      {showGatekeeperInfo && (
        <div className="bg-[#EBF6FB] border border-[#BAE3F7] rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl text-[#1793D1] border border-[#E2EDF4] shrink-0 shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B2038]">Volunteer Scanner Stations (Passwordless Link)</h3>
              <p className="text-xs text-[#4B6178] mt-0.5 leading-relaxed">
                Need extra hands at the check-in gates? Your volunteers do NOT need your admin credentials or password. Have them scan this QR code or open the link below on their phones to activate instant <strong>Attendance Tracker Terminal</strong> mode!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-[#E2EDF4]">
            {/* Live QR generator for fast auto-login */}
            <div className="shrink-0 bg-slate-50 p-2 rounded-lg border border-[#E2EDF4]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?gate=tracker')}`}
                alt="Gatekeeper QR Link"
                className="w-28 h-28 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-2 text-center sm:text-left w-full">
              <span className="inline-block text-[10px] font-bold text-[#1793D1] bg-[#EBF6FB] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#BAE3F7]">
                Live Mobile Setup Link
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  readOnly
                  value={window.location.origin + window.location.pathname + '?gate=tracker'}
                  className="bg-slate-50 border border-[#E2EDF4] text-[11px] px-2.5 py-1.5 rounded-lg text-[#0B2038] font-mono select-all w-full focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '?gate=tracker');
                    alert('Portal setup URL copied! Share this with your co-organizers & volunteers.');
                  }}
                  className="px-3 py-1.5 bg-[#1793D1] hover:bg-[#127EB5] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-[10px] text-[#63788E]">
                * Opened browsers are auto-authorized. Trackers can scan participants concurrently. Security PIN is <strong>2026</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action: Scan QR Code */}
      <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 shadow-xs space-y-4">
        <QRScanner
          isScanning={isScanning}
          setIsScanning={setIsScanning}
          onScanSuccess={handleQrDetected}
        />
      </div>

      {/* Display Scanned Participant / Results */}
      {scannedParticipant && (
        <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in">
          {/* Status feedback banner */}
          {checkInStatus === 'success' && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-sm font-bold">Checked In Successfully</div>
                <div className="text-xs text-emerald-700">
                  Recorded at {new Date(scannedParticipant.checkedInAt || '').toLocaleTimeString()} ({new Date(scannedParticipant.checkedInAt || '').toLocaleDateString()})
                </div>
              </div>
            </div>
          )}

          {checkInStatus === 'already' && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-800">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-sm font-bold">Already Checked In</div>
                <div className="text-xs text-amber-700">
                  Recorded at {new Date(scannedParticipant.checkedInAt || '').toLocaleTimeString()} ({new Date(scannedParticipant.checkedInAt || '').toLocaleDateString()})
                </div>
              </div>
            </div>
          )}

          {/* Scanned Card Fields as strictly specified in Section 22:
              [Participant Name]
              [Institution]
              [Participant Category]
              [Participant ID]
          */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-[#63788E] uppercase tracking-wide">
                Participant Name
              </span>
              <h3 className="text-xl font-bold text-[#0B2038]">
                {scannedParticipant.title ? `${scannedParticipant.title} ` : ''}
                {scannedParticipant.firstName} {scannedParticipant.lastName}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2EDF4]">
                <span className="font-semibold text-[#63788E] uppercase tracking-wide block mb-0.5">
                  Institution
                </span>
                <span className="font-bold text-[#0B2038]">
                  {scannedParticipant.institution || '—'}
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2EDF4]">
                <span className="font-semibold text-[#63788E] uppercase tracking-wide block mb-0.5">
                  Participant Category
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
                  {scannedParticipant.participantCategory}
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2EDF4] sm:col-span-2">
                <span className="font-semibold text-[#63788E] uppercase tracking-wide block mb-0.5">
                  Participant ID
                </span>
                <span className="font-mono font-bold text-[#0B2038] text-sm">
                  {scannedParticipant.participantId}
                </span>
              </div>
            </div>
          </div>

          {/* Provide: Check In action */}
          <div className="pt-2 flex items-center justify-between border-t border-[#F0F5F9]">
            <button
              onClick={() => {
                setScannedParticipant(null);
                setCheckInStatus('idle');
              }}
              className="text-xs text-[#4B6178] hover:text-[#0B2038] font-semibold transition-colors"
            >
              Clear
            </button>

            {!scannedParticipant.checkedIn && (
              <button
                id="perform-checkin-btn"
                onClick={() => handlePerformCheckIn(scannedParticipant)}
                className="px-6 py-2.5 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Check In
              </button>
            )}
          </div>
        </div>
      )}

      {checkInStatus === 'not_found' && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Also provide: Search Participant (manual check-in if QR code cannot be scanned) */}
      <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0B2038]">Search Participant</h3>
          <p className="text-xs text-[#4B6178]">
            Manual look-up if participant's QR code cannot be scanned
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#63788E]" />
          <input
            id="manual-checkin-search"
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="Type participant name, ID, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2EDF4] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
          />
        </div>

        {manualQuery.trim() && (
          <div className="border border-[#E2EDF4] rounded-xl overflow-hidden divide-y divide-[#F0F5F9] max-h-60 overflow-y-auto">
            {manualMatches.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#4B6178]">
                No participants found matching "{manualQuery}".
              </div>
            ) : (
              manualMatches.map((p) => (
                <div
                  key={p.participantId}
                  className="p-3 hover:bg-[#F8FAFC]/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#0B2038]">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="text-[11px] text-[#4B6178] font-mono">
                      {p.participantId} · {p.participantCategory} · {p.institution}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.checkedIn ? (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        Checked In
                      </span>
                    ) : (
                      <button
                        id={`manual-checkin-${p.participantId}`}
                        onClick={() => {
                          setScannedParticipant(p);
                          handlePerformCheckIn(p);
                        }}
                        className="px-3 py-1 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setScannedParticipant(p);
                        setCheckInStatus(p.checkedIn ? 'already' : 'idle');
                      }}
                      className="px-2.5 py-1 text-[#1793D1] hover:bg-[#EBF6FB] border border-[#BAE3F7] rounded-lg text-[11px] font-bold transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
