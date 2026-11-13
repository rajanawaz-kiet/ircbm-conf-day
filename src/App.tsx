/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ActivePage, ProgrammeItem, Participant, ConferenceAsset, VenueInfo } from './types';
import { store } from './services/store';
import { OfficialLogo } from './components/OfficialLogo';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { ProgrammeView } from './views/ProgrammeView';
import { MyScheduleView } from './views/MyScheduleView';
import { MyQrPassView } from './views/MyQrPassView';
import { VenueView } from './views/VenueView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { ParticipantRegistrationView } from './views/ParticipantRegistrationView';
import { SignInView } from './views/SignInView';
import { MyProfileView } from './views/MyProfileView';
import { AdminView } from './views/admin/AdminView';
import { TrackerView } from './views/TrackerView';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentUser, setCurrentUser] = useState<Participant | null>(() => store.getCurrentUser());
  const [programmeItems, setProgrammeItems] = useState(() => store.getProgrammeItems());
  const [announcements, setAnnouncements] = useState(() => store.getAnnouncements());
  const [venueInfo, setVenueInfo] = useState(() => store.getVenueInfo());
  const [participants, setParticipants] = useState(() => store.getParticipants());
  const [assets, setAssets] = useState<ConferenceAsset[]>(() => store.getAssets());
  const [savedScheduleIds, setSavedScheduleIds] = useState<string[]>(() => store.getScheduleItemIds());

  // Shared Programme Item Detail state for quick view from anywhere
  const [selectedProgrammeItem, setSelectedProgrammeItem] = useState<ProgrammeItem | null>(null);

  // Subscribe to changes in store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setProgrammeItems(store.getProgrammeItems());
      setAnnouncements(store.getAnnouncements());
      setVenueInfo(store.getVenueInfo());
      setParticipants(store.getParticipants());
      setSavedScheduleIds(store.getScheduleItemIds());
      setAssets(store.getAssets());
    });
    return unsubscribe;
  }, []);

  // Check URL for direct volunteer scanner link bypass (?gate=tracker)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('gate') === 'tracker' || params.get('mode') === 'tracker') {
      const res = store.signInTracker('2026');
      if (res.success && res.participant) {
        // Automatically route to tracker
        setActivePage('tracker');
        // Clear query parameters cleanly from address bar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Handlers
  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    store.signOut();
    handleNavigate('home');
  };

  const handleToggleSchedule = (itemId: string) => {
    store.toggleScheduleItem(itemId);
  };

  const handleViewProgrammeDetail = (item: ProgrammeItem) => {
    setSelectedProgrammeItem(item);
    handleNavigate('programme');
  };

  const handleRegisterParticipant = (data: any) => {
    return store.registerParticipant(data);
  };

  const handleSignIn = (email: string, password?: string) => {
    return store.signIn(email, password);
  };

  const handleUpdateProfile = (updates: Partial<Participant>) => {
    return store.updateProfile(updates);
  };

  // Admin actions
  const handleAddProgrammeItem = (item: Omit<ProgrammeItem, 'id'>) => {
    store.addProgrammeItem(item);
  };

  const handleUpdateProgrammeItem = (item: ProgrammeItem) => {
    store.updateProgrammeItem(item);
  };

  const handleDeleteProgrammeItem = (id: string) => {
    store.deleteProgrammeItem(id);
  };

  const handleCheckInParticipant = (id: string) => {
    return store.checkInParticipant(id);
  };

  const handleUpdateParticipant = (p: Participant) => {
    store.updateParticipant(p);
  };

  const handleAddAnnouncement = (title: string, message: string) => {
    store.addAnnouncement(title, message);
  };

  const handleUpdateAnnouncement = (ann: any) => {
    store.updateAnnouncement(ann);
  };

  const handleDeleteAnnouncement = (id: string) => {
    store.deleteAnnouncement(id);
  };

  // Assets CMS handlers
  const handleAddAsset = (name: string, type: 'logo' | 'banner' | 'brochure' | 'other', url: string, description?: string) => {
    store.addAsset(name, type, url, description);
  };

  const handleToggleAsset = (id: string) => {
    store.toggleAssetActive(id);
  };

  const handleDeleteAsset = (id: string) => {
    store.deleteAsset(id);
  };

  const handleReplaceLogo = (name: string, url: string, description?: string) => {
    store.replaceActiveLogo(name, url, description);
  };

  const handleCleanMemory = () => {
    store.cleanAssetMemory();
  };

  const handleResetAssets = () => {
    store.resetToDefaultAssets();
  };

  const handleUpdateVenue = (venue: VenueInfo) => {
    store.updateVenue(venue);
  };

  // Calculate user's saved items
  const userSavedItems = programmeItems.filter((i) => savedScheduleIds.includes(i.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#E0DCD5] text-[#262B37] font-sans antialiased selection:bg-[#F3F2F0] selection:text-[#262B37]">
      {/* Header with Official Logo & Participant Navigation */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activePage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            programmeItems={programmeItems}
            announcements={announcements}
            venueInfo={venueInfo}
            onViewProgrammeDetail={handleViewProgrammeDetail}
            assets={assets}
          />
        )}

        {activePage === 'programme' && (
          <ProgrammeView
            programmeItems={programmeItems}
            currentUser={currentUser}
            savedItemIds={savedScheduleIds}
            onToggleSchedule={handleToggleSchedule}
            onRequireSignIn={() => handleNavigate('sign-in')}
            selectedDetailItem={selectedProgrammeItem}
            setSelectedDetailItem={setSelectedProgrammeItem}
          />
        )}

        {activePage === 'my-schedule' && (
          <MyScheduleView
            currentUser={currentUser}
            savedItems={userSavedItems}
            onRemoveFromSchedule={handleToggleSchedule}
            onViewProgrammeDetail={handleViewProgrammeDetail}
            onNavigateToProgramme={() => handleNavigate('programme')}
            onNavigateToSignIn={() => handleNavigate('sign-in')}
          />
        )}

        {activePage === 'my-qr-pass' && (
          <MyQrPassView
            currentUser={currentUser}
            onNavigateToSignIn={() => handleNavigate('sign-in')}
            onNavigateToRegister={() => handleNavigate('register')}
          />
        )}

        {activePage === 'venue' && (
          <VenueView
            venueInfo={venueInfo}
            onNavigateToProgramme={() => handleNavigate('programme')}
          />
        )}

        {activePage === 'announcements' && (
          <AnnouncementsView announcements={announcements} />
        )}

        {activePage === 'register' && (
          <ParticipantRegistrationView
            onRegister={handleRegisterParticipant}
            onNavigateToQrPass={() => handleNavigate('my-qr-pass')}
            onNavigateToSignIn={() => handleNavigate('sign-in')}
          />
        )}

        {activePage === 'sign-in' && (
          <SignInView
            onSignIn={handleSignIn}
            onTrackerSignIn={(pin) => store.signInTracker(pin)}
            onNavigateToRegister={() => handleNavigate('register')}
            onSignedInSuccess={(user) => {
              if (user.role === 'admin') {
                handleNavigate('admin');
              } else if (user.role === 'tracker') {
                handleNavigate('tracker');
              } else {
                handleNavigate('my-qr-pass');
              }
            }}
          />
        )}

        {activePage === 'tracker' && (
          <TrackerView
            currentUser={currentUser}
            participants={participants}
            onCheckInParticipant={handleCheckInParticipant}
            onSignOut={handleSignOut}
          />
        )}

        {activePage === 'my-profile' && (
          <MyProfileView
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToSignIn={() => handleNavigate('sign-in')}
          />
        )}

        {activePage === 'admin' && (
          <AdminView
            currentUser={currentUser}
            programmeItems={programmeItems}
            participants={participants}
            announcements={announcements}
            assets={assets}
            venueInfo={venueInfo}
            onAddProgrammeItem={handleAddProgrammeItem}
            onUpdateProgrammeItem={handleUpdateProgrammeItem}
            onDeleteProgrammeItem={handleDeleteProgrammeItem}
            onCheckInParticipant={handleCheckInParticipant}
            onUpdateParticipant={handleUpdateParticipant}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onAddAsset={handleAddAsset}
            onToggleAsset={handleToggleAsset}
            onDeleteAsset={handleDeleteAsset}
            onReplaceLogo={handleReplaceLogo}
            onCleanMemory={handleCleanMemory}
            onResetAssets={handleResetAssets}
            onUpdateVenue={handleUpdateVenue}
            onNavigateToSignIn={() => handleNavigate('sign-in')}
            onDirectAdminSignIn={() => {
              const res = store.signIn('admin@ircbm2026.kiet.edu.pk', 'Rajarubnawaz42201');
              if (res.success && res.participant) {
                setCurrentUser(res.participant);
              }
            }}
            onSignIn={(email, password) => handleSignIn(email, password)}
          />
        )}
      </main>

      {/* Section 29: FOOTER
          Contains the official IRCBM 2026 logo on every page, with clean conference credentials and admin gateway.
          Features TWO distinct color shades as observed in the image footer palette.
      */}
      <footer id="conference-footer" className="print:hidden">
        {/* Upper Footer Shade: Deep Midnight Ocean Navy (#091B2E) */}
        <div className="bg-[#091B2E] border-t border-[#122A44] py-10 px-4 text-center text-xs text-[#96A9BD]">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
            <button
              id="footer-logo-btn"
              onClick={() => handleNavigate('home')}
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1793D1] rounded-md p-1 transition-opacity hover:opacity-90"
              aria-label="IRCBM 2026 Home"
            >
              <OfficialLogo size="md" light={true} className="h-9 md:h-10" />
            </button>
            <div className="space-y-1.5 text-center max-w-xl">
              <p className="font-bold text-white text-sm tracking-tight">
                International Research Conference on Business &amp; Management (IRCBM 2026)
              </p>
              <p className="text-[#96A9BD] text-xs leading-relaxed">
                Faculty of Management Sciences (FoMS), Karachi Institute of Economics and Technology (KIET)
              </p>
              <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-[#788DA2]">
                <span>Official Conference Portal</span>
                <span>•</span>
                <button
                  id="footer-admin-link"
                  onClick={() => handleNavigate('admin')}
                  className="text-white hover:text-slate-200 font-medium underline underline-offset-2 transition-colors"
                >
                  Organizer Administration Area
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer Shade: Darker Midnight Shade (#050E1A) */}
        <div className="bg-[#050E1A] border-t border-[#0F2236] py-4 px-4 text-center text-[11px] text-[#63788E]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © 2026 IRCBM • Faculty of Management Sciences (FoMS), Karachi Institute of Economics and Technology (KIET). All Rights Reserved.
            </p>
            <p className="text-[#7D93AA]">
              Official Conference Companion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
