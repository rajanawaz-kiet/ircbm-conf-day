import React, { useState } from 'react';
import { Participant, ProgrammeItem, Announcement, VenueInfo, ConferenceAsset } from '../../types';
import { OfficialLogo } from '../../components/OfficialLogo';
import { AdminProgrammeView } from './AdminProgrammeView';
import { AdminParticipantsView } from './AdminParticipantsView';
import { AdminAnnouncementsView } from './AdminAnnouncementsView';
import { AdminCheckInView } from './AdminCheckInView';
import { AdminAssetsView } from './AdminAssetsView';
import { AdminVenueView } from './AdminVenueView';
import { Calendar, Users, Bell, QrCode, Shield, ShieldCheck, LogIn, Sparkles, Mail, Lock, Image, Map } from 'lucide-react';

interface AdminViewProps {
  currentUser: Participant | null;
  programmeItems: ProgrammeItem[];
  participants: Participant[];
  announcements: Announcement[];
  assets: ConferenceAsset[];
  venueInfo: VenueInfo;
  onAddProgrammeItem: (item: Omit<ProgrammeItem, 'id'>) => void;
  onUpdateProgrammeItem: (item: ProgrammeItem) => void;
  onDeleteProgrammeItem: (id: string) => void;
  onCheckInParticipant: (id: string) => { success: boolean; participant?: Participant; alreadyCheckedIn?: boolean };
  onUpdateParticipant: (participant: Participant) => void;
  onAddAnnouncement: (title: string, message: string) => void;
  onUpdateAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddAsset: (name: string, type: 'logo' | 'banner' | 'brochure' | 'other', url: string, description?: string) => void;
  onToggleAsset: (id: string) => void;
  onDeleteAsset: (id: string) => void;
  onReplaceLogo: (name: string, url: string, description?: string) => void;
  onCleanMemory: () => void;
  onUpdateVenue: (venue: VenueInfo) => void;
  onNavigateToSignIn: () => void;
  onDirectAdminSignIn?: () => void;
  onSignIn?: (email: string, password?: string) => { success: boolean; participant?: Participant; error?: string };
}

type AdminTab = 'programme' | 'participants' | 'announcements' | 'check-in' | 'assets' | 'venue';

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  programmeItems,
  participants,
  announcements,
  assets,
  venueInfo,
  onAddProgrammeItem,
  onUpdateProgrammeItem,
  onDeleteProgrammeItem,
  onCheckInParticipant,
  onUpdateParticipant,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onAddAsset,
  onToggleAsset,
  onDeleteAsset,
  onReplaceLogo,
  onCleanMemory,
  onUpdateVenue,
  onNavigateToSignIn,
  onDirectAdminSignIn,
  onSignIn,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('check-in');
  const [adminEmail, setAdminEmail] = useState('admin@ircbm2026.kiet.edu.pk');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check authorization
  const isAdmin = currentUser && currentUser.role === 'admin';

  const handleInlineAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (onSignIn) {
      const res = onSignIn(adminEmail, adminPassword);
      if (!res.success) {
        setLoginError(res.error || 'Invalid administrator credentials.');
      }
    } else if (onDirectAdminSignIn) {
      onDirectAdminSignIn();
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-2">
            <OfficialLogo size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBF6FB] border border-[#BAE3F7] text-[#1793D1] text-xs font-semibold rounded-full">
            <Shield className="w-3.5 h-3.5 text-[#1793D1]" />
            Organizer &amp; Secretariat Operations
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
            IRCBM 2026 Administration Area
          </h1>
          <p className="text-sm text-[#4B6178] max-w-lg mx-auto leading-relaxed">
            Welcome to the conference operations portal for the Faculty of Management Sciences (FoMS), KIET organizing committee.
          </p>
        </div>


        {/* 4 Operations Modules Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 bg-white border border-[#E2EDF4] rounded-xl space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#EBF6FB] text-[#1793D1] flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#0B2038]">QR Check-In Desk</h3>
            <p className="text-xs text-[#4B6178] leading-relaxed">
              Camera-based QR badge scanner &amp; instant participant verification desk.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E2EDF4] rounded-xl space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#EBF6FB] text-[#1793D1] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#0B2038]">Programme Schedule</h3>
            <p className="text-xs text-[#4B6178] leading-relaxed">
              Manage papers, tracks, keynote speakers, session rooms, and timings.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E2EDF4] rounded-xl space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#EBF6FB] text-[#1793D1] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#0B2038]">Delegate Directory</h3>
            <p className="text-xs text-[#4B6178] leading-relaxed">
              Browse registered academics, check-in statuses, and export roster.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E2EDF4] rounded-xl space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#EBF6FB] text-[#1793D1] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#0B2038]">Announcements</h3>
            <p className="text-xs text-[#4B6178] leading-relaxed">
              Broadcast critical conference advisories, room changes, and alerts.
            </p>
          </div>
        </div>

        {/* Inline Sign In Form */}
        <form onSubmit={handleInlineAdminSubmit} className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-[#F0F5F9] pb-3">
            <h3 className="text-sm font-bold text-[#0B2038]">
              Direct Administrator Sign In
            </h3>
            <p className="text-xs text-[#63788E]">
              Sign in with your organizing committee credentials
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {loginError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B6178] mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#63788E]" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B6178] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#63788E]" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Sign In to Admin Dashboard
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Admin Header with Official Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E2EDF4]">
        <div className="flex items-center gap-4">
          <OfficialLogo size="sm" />
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#1793D1] uppercase">
              IRCBM 2026 Operations
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B2038]">
              Administration Area
            </h1>
          </div>
        </div>

        <div className="text-xs text-[#4B6178] bg-[#F8FAFC] border border-[#E2EDF4] px-3 py-1.5 rounded-lg font-mono self-start sm:self-auto">
          Logged in: <strong className="text-[#0B2038]">{currentUser.email}</strong>
        </div>
      </div>

      {/* The administration area contains ONLY four operational sections:
          Programme, Participants, Announcements, Check-In */}
      <div className="flex flex-wrap gap-2 border-b border-[#E2EDF4] pb-2">
        <button
          id="admin-tab-check-in"
          onClick={() => setActiveTab('check-in')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'check-in'
              ? 'bg-[#1793D1] text-white shadow-xs'
              : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#EBF6FB]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Check-In
        </button>

        <button
          id="admin-tab-programme"
          onClick={() => setActiveTab('programme')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'programme'
              ? 'bg-[#1793D1] text-white shadow-xs'
              : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#EBF6FB]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Programme
        </button>

        <button
          id="admin-tab-participants"
          onClick={() => setActiveTab('participants')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'participants'
              ? 'bg-[#1793D1] text-white shadow-xs'
              : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#EBF6FB]'
          }`}
        >
          <Users className="w-4 h-4" />
          Participants
        </button>

        <button
          id="admin-tab-announcements"
          onClick={() => setActiveTab('announcements')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'announcements'
              ? 'bg-[#1793D1] text-white shadow-xs'
              : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#EBF6FB]'
          }`}
        >
          <Bell className="w-4 h-4" />
          Announcements
        </button>

        <button
          id="admin-tab-assets"
          onClick={() => setActiveTab('assets')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'assets'
              ? 'bg-[#1793D1] text-white shadow-xs'
              : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#EBF6FB]'
          }`}
        >
          <Image className="w-4 h-4" />
          Asset Management
        </button>

        <button
          id="admin-tab-venue"
          onClick={() => setActiveTab('venue')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'venue'
              ? 'bg-[#1793D1] text-white shadow-xs'
              : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#EBF6FB]'
          }`}
        >
          <Map className="w-4 h-4" />
          Venue &amp; Maps
        </button>
      </div>

      {/* Render Active Operational Section */}
      <div className="pt-2">
        {activeTab === 'check-in' && (
          <AdminCheckInView
            participants={participants}
            onCheckIn={onCheckInParticipant}
            showGatekeeperInfo={true}
          />
        )}

        {activeTab === 'programme' && (
          <AdminProgrammeView
            programmeItems={programmeItems}
            onAddItem={onAddProgrammeItem}
            onUpdateItem={onUpdateProgrammeItem}
            onDeleteItem={onDeleteProgrammeItem}
          />
        )}

        {activeTab === 'participants' && (
          <AdminParticipantsView
            participants={participants}
            onCheckIn={(id) => onCheckInParticipant(id)}
            onUpdateParticipant={onUpdateParticipant}
          />
        )}

        {activeTab === 'announcements' && (
          <AdminAnnouncementsView
            announcements={announcements}
            onAddAnnouncement={onAddAnnouncement}
            onUpdateAnnouncement={onUpdateAnnouncement}
            onDeleteAnnouncement={onDeleteAnnouncement}
          />
        )}

        {activeTab === 'assets' && (
          <AdminAssetsView
            assets={assets}
            onAddAsset={onAddAsset}
            onToggleAsset={onToggleAsset}
            onDeleteAsset={onDeleteAsset}
            onReplaceLogo={onReplaceLogo}
            onCleanMemory={onCleanMemory}
          />
        )}

        {activeTab === 'venue' && (
          <AdminVenueView
            venueInfo={venueInfo}
            onUpdateVenue={onUpdateVenue}
          />
        )}
      </div>
    </div>
  );
};
