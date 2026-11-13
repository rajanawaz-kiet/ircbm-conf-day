import React, { useState } from 'react';
import { Participant } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { OfficialLogo } from '../components/OfficialLogo';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface MyQrPassViewProps {
  currentUser: Participant | null;
  onNavigateToSignIn: () => void;
  onNavigateToRegister: () => void;
}

export const MyQrPassView: React.FC<MyQrPassViewProps> = ({
  currentUser,
  onNavigateToSignIn,
  onNavigateToRegister,
}) => {
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // If not signed in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B2038]">My IRCBM 2026 Pass</h1>
        <p className="text-[#4B6178] text-sm">
          Please sign in or register to access your personal conference QR pass.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            id="qr-pass-sign-in-btn"
            onClick={onNavigateToSignIn}
            className="px-4 py-2 bg-[#EBF6FB] text-[#0B2038] text-sm font-semibold rounded-lg border border-[#BAE3F7] hover:bg-[#DDF0FA] transition-colors"
          >
            Sign In
          </button>
          <button
            id="qr-pass-register-btn"
            onClick={onNavigateToRegister}
            className="px-4 py-2 bg-[#1793D1] text-white text-sm font-semibold rounded-lg hover:bg-[#127EB5] active:bg-[#0F6B9B] shadow-sm transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  const participantName = `${currentUser.title ? `${currentUser.title} ` : ''}${currentUser.firstName} ${currentUser.lastName}`.trim();


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
          My IRCBM 2026 Pass
        </h1>
      </div>

      {/* Main Pass Card - strictly adhering to Section 11 */}
      <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-xs">
        {/* Check-in status pill */}
        {currentUser.checkedIn && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBF6FB] text-[#1793D1] text-xs font-semibold rounded-full border border-[#BAE3F7]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Checked In
          </div>
        )}

        {/* Participant Name */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2038]">
            {participantName}
          </h2>
          {/* Institution */}
          <p className="text-sm font-medium text-[#4B6178] mt-1">
            {currentUser.institution}
          </p>
          {/* Participant Category */}
          <div className="inline-block mt-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
              {currentUser.participantCategory}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] rounded-xl border border-[#E2EDF4]">
          <div className="p-3 bg-white rounded-lg shadow-2xs border border-[#E2EDF4]">
            <QRCodeSVG
              value={currentUser.qrToken || currentUser.participantId}
              size={210}
              level="H"
              includeMargin={true}
            />
          </div>
          {/* Participant ID */}
          <div className="mt-3 font-mono text-sm font-bold text-[#0B2038] tracking-wider">
            {currentUser.participantId}
          </div>
        </div>

        {/* Required Instruction: "Present this QR code at the conference registration desk for check-in." */}
        <p className="text-xs sm:text-sm text-[#4B6178] leading-relaxed font-medium">
          Present this QR code at the conference registration desk for check-in.
        </p>

        {/* Provide: View / Print Badge */}
        <div className="pt-2">
          <button
            id="view-print-badge-btn"
            onClick={() => setShowBadgeModal(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            View / Print Badge
          </button>
        </div>
      </div>

      {/* PARTICIPANT BADGE MODAL (Section 12) */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091B2E]/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#E2EDF4] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between p-3 border-b border-[#F0F5F9] bg-[#F8FAFC] print:hidden">
              <span className="text-xs font-semibold text-[#4B6178]">Participant Badge Preview</span>
              <button
                id="close-badge-modal-btn"
                onClick={() => setShowBadgeModal(false)}
                className="p-1 text-[#63788E] hover:text-[#0B2038] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Badge Content: strictly ONLY the 5 items specified in Section 12 */}
            <div
              id="printable-badge-content"
              className="p-8 text-center space-y-6 bg-white print:p-0 print:m-0"
            >
              {/* 1. Official uploaded branding headers: ConfLogo, Silver Jubilee, Gate Emblem */}
              <div className="flex flex-col items-center gap-4 pb-2">
                {/* Row 1: ConfLogo (bigger and centralized) */}
                <div className="flex justify-center">
                  <OfficialLogo size="badge" />
                </div>

                {/* Row 2: Silver Jubilee & Gate Emblem (centralized, side-by-side) */}
                <div className="flex items-center justify-center gap-4">
                  {/* Gate Emblem */}
                  <div className="bg-white border border-[#E2EDF4] px-3 py-1.5 rounded-lg flex items-center justify-center h-[52px] w-[90px] select-none">
                    <img src="/kiet-official.png" alt="KIET official logo" className="h-9 w-auto object-contain" />
                  </div>

                  {/* Silver Jubilee */}
                  <div className="bg-white border border-[#E2EDF4] px-2 py-1.5 rounded-lg flex items-center justify-center h-[52px] min-w-0 flex-1 select-none">
                    <img src="/kiet-25-years.jpg" alt="KIET anniversary banner" className="max-h-10 w-full object-contain" />
                  </div>
                </div>
              </div>

              {/* 2. [Participant Name] */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0B2038] tracking-tight leading-snug">
                  {participantName}
                </h3>

                {/* 3. [Institution] */}
                <p className="text-sm font-medium text-[#4B6178] mt-1">
                  {currentUser.institution}
                </p>

                {/* 4. [Participant Category] */}
                <p className="text-xs font-bold uppercase tracking-wider text-[#1793D1] mt-2">
                  {currentUser.participantCategory}
                </p>
              </div>

              {/* 5. [QR Code] */}
              <div className="flex flex-col items-center justify-center pt-1">
                <div className="p-2 border border-[#E2EDF4] rounded-lg">
                  <QRCodeSVG
                    value={currentUser.qrToken || currentUser.participantId}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="text-[11px] font-mono text-[#63788E] mt-2">
                  {currentUser.participantId}
                </div>
              </div>
            </div>

            {/* Actions (Hidden in Print) */}
            <div className="p-4 border-t border-[#F0F5F9] bg-[#F8FAFC] flex items-center justify-between gap-3 print:hidden">
              <button
                onClick={() => setShowBadgeModal(false)}
                className="text-xs font-medium text-[#4B6178] hover:text-[#0B2038]"
              >
                Close
              </button>
              <button
                id="print-badge-action-btn"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
