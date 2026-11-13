import {
  Participant,
  ParticipantCategory,
  ProgrammeItem,
  SavedScheduleItem,
  Announcement,
  VenueInfo,
  ConferenceAsset,
} from '../types';

const STORAGE_KEYS = {
  PARTICIPANTS: 'ircbm_participants_v1',
  CURRENT_USER: 'ircbm_current_user_v1',
  PROGRAMME: 'ircbm_programme_v1',
  SCHEDULE: 'ircbm_schedule_v1',
  ANNOUNCEMENTS: 'ircbm_announcements_v1',
  VENUE: 'ircbm_venue_v1',
  ASSETS: 'ircbm_assets_v1',
};

// Initial admin account for conference organizers (Faculty of Management Sciences, KIET)
const DEFAULT_ADMIN: Participant = {
  participantId: 'IRCBM-ADMIN-01',
  title: 'Prof.',
  firstName: 'Conference',
  lastName: 'Admin',
  email: 'admin@ircbm2026.kiet.edu.pk',
  mobile: '+92 21 35091114',
  institution: 'Faculty of Management Sciences (FoMS), KIET',
  designation: 'Conference Administrator',
  city: 'Karachi',
  country: 'Pakistan',
  participantCategory: 'Faculty / Academic',
  qrToken: 'IRCBM:PASS:IRCBM-ADMIN-01:masterkey',
  checkedIn: true,
  checkedInAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  role: 'admin',
  passwordHash: 'Rajarubnawaz42201',
};

// Initial sample participant for demo / testing
const DEFAULT_PARTICIPANT: Participant = {
  participantId: 'IRCBM-2026-1001',
  title: 'Dr.',
  firstName: 'Tariq',
  lastName: 'Rahman',
  email: 'tariq.rahman@kiet.edu.pk',
  mobile: '+92 300 9876543',
  institution: 'Faculty of Management Sciences (FoMS), KIET',
  designation: 'Associate Professor',
  city: 'Karachi',
  country: 'Pakistan',
  participantCategory: 'Presenter',
  submissionReferenceId: 'IRCBM-2026-MGT-042',
  qrToken: 'IRCBM:PASS:IRCBM-2026-1001:demo-token-9988',
  checkedIn: false,
  checkedInAt: null,
  createdAt: new Date().toISOString(),
  role: 'participant',
  passwordHash: 'welcome2026',
};

// Initial venue meeting specification
const DEFAULT_VENUE: VenueInfo = {
  venueName: 'KIET (North Nazimabad) & IBHM DUHS (Ojha)',
  address: 'Karachi, Pakistan',
  arrivalInformation: 'Delegates are requested to present their IRCBM 2026 QR Pass at the Registration Desk of the respective venue.',
  rooms: [
    { roomName: 'Auditorium A', location: 'Ground Floor, North Nazimabad Campus (Day 1)' },
    { roomName: 'Seminar Hall 1', location: '1st Floor, North Nazimabad Campus (Day 1)' },
    { roomName: 'Conference Room 2', location: '2nd Floor, North Nazimabad Campus (Day 1)' },
    { roomName: 'IBHM Main Hall', location: 'Ground Floor, DUHS Ojha Campus (Day 2)' },
    { roomName: 'IBHM Seminar Room B', location: '1st Floor, DUHS Ojha Campus (Day 2)' },
  ],
  latitude: 24.9372,
  longitude: 67.0406,
  mapEmbedUrl: 'https://maps.google.com/maps?q=Karachi%20Institute%20of%20Economics%20and%20Technology%20North%20Nazimabad%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed',

  // Day 1: KIET North Nazimabad Campus
  day1VenueName: 'KIET, North Nazimabad Campus, Karachi, Pakistan',
  day1Address: 'KIET City Campus (North Nazimabad)\n\nAddress:\nNorth Nazimabad Campus F-103 & 103/1, Block-F, North Nazimabad, Allama Rasheed Turabi Road, Karachi, Pakistan',
  day1ArrivalInformation: 'The North Nazimabad Campus is situated on Allama Rasheed Turabi Road in Block-F. It is easily accessible via public transport or private vehicle. Please present your QR Pass at the registration desk upon arrival.',
  day1MapEmbedUrl: 'https://maps.google.com/maps?q=Karachi%20Institute%20of%20Economics%20and%20Technology%20North%20Nazimabad%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed',
  day1Latitude: 24.9372,
  day1Longitude: 67.0406,

  // Day 2: IBHM DUHS Ojha Campus
  day2VenueName: 'IBHM (DUHS), Ojha Campus',
  day2Address: 'Institute of Business and Health Management, Dow University of Health Sciences, Ojha Campus, Karachi, Pakistan',
  day2ArrivalInformation: 'DUHS Ojha Campus is situated on University Road. The IBHM building is accessible through the main gate, with clear signage to the seminar halls.',
  day2MapEmbedUrl: 'https://maps.google.com/maps?q=Dow%20University%20Ojha%20Campus%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed',
  day2Latitude: 24.9450,
  day2Longitude: 67.1419,
};

const DEFAULT_ASSETS: ConferenceAsset[] = [
  {
    id: 'asset-kiet-logo',
    name: 'KIET Standalone Logo',
    type: 'logo',
    url: 'vector_kiet_logo',
    isActive: false,
    description: 'The official standalone KIET gate emblem with celestial orbit.',
    uploadedAt: new Date('2026-09-01').toISOString(),
  },
  {
    id: 'asset-kiet-25yrs',
    name: 'KIET 25 Years Anniversary Logo',
    type: 'logo',
    url: 'vector_kiet_coe',
    isActive: false,
    description: 'KIET Silver Jubilee anniversary Centre of Excellence branding.',
    uploadedAt: new Date('2026-09-01').toISOString(),
  }
];

// Initial programme items using clear placeholders or sample academic sessions
const DEFAULT_PROGRAMME: ProgrammeItem[] = [
  {
    id: 'prog-01',
    date: 'Nov 23, 2026',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    title: 'Inaugural Ceremony & Keynote Speech: Future of Business in AI Era',
    presenterName: 'Prof. Dr. Amjad Ali',
    coAuthors: 'Organizing Committee',
    institution: 'Karachi Institute of Economics and Technology (KIET)',
    track: 'Keynote Session',
    room: 'Auditorium A (Day 1)',
    abstractDescription: 'Official welcome address, guest introductions, and a comprehensive keynote speech outlining the impact of generative artificial intelligence on contemporary corporate strategy.',
  },
  {
    id: 'prog-02',
    date: 'Nov 23, 2026',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    title: 'Financial Innovation and Sustainable Corporate Governance',
    presenterName: 'Dr. Tariq Rahman',
    coAuthors: 'Prof. A. Siddiqui',
    institution: 'Faculty of Management Sciences (FoMS), KIET',
    track: 'Finance & Governance',
    room: 'Seminar Hall 1 (Day 1)',
    abstractDescription: 'An empirical examination of risk-adjusted ESG performance indicators across emerging South Asian economies.',
  },
  {
    id: 'prog-03',
    date: 'Nov 24, 2026',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    title: 'Artificial Intelligence in Supply Chain Optimization',
    presenterName: 'Ms. Nadia Farooq',
    coAuthors: 'Engr. M. Bilal',
    institution: 'Dow University of Health Sciences (DUHS)',
    track: 'Operations & Tech',
    room: 'IBHM Main Hall (Day 2)',
    abstractDescription: 'Machine learning applications for inventory forecasting and disruption resilience in volatile commercial markets.',
  },
  {
    id: 'prog-04',
    date: 'Nov 24, 2026',
    startTime: '12:00 PM',
    endTime: '01:30 PM',
    title: 'Health Management Systems & Sustainable Healthcare Delivery',
    presenterName: 'Dr. Sarah Bukhari',
    coAuthors: 'Dr. Faisal Naeem',
    institution: 'Institute of Business and Health Management (IBHM)',
    track: 'Healthcare Management',
    room: 'IBHM Seminar Room B (Day 2)',
    abstractDescription: 'Exploring operational design patterns, electronic health records security, and green hospital architecture within public healthcare systems.',
  }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: '[Announcement Title]',
    message: '[Announcement Text]',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'ann-02',
    title: 'Welcome to IRCBM 2026',
    message: 'Welcome to the International Research Conference on Business & Management 2026 organized by the Faculty of Management Sciences (FoMS), KIET. Please have your QR Pass ready at the check-in desk.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

class Store {
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Store listener error:', e);
      }
    });
  }

  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch {
      // Storage full or unavailable
    }
  }

  // --- USERS / PARTICIPANTS ---
  getParticipants(): Participant[] {
    const list = this.get<Participant[]>(STORAGE_KEYS.PARTICIPANTS, []);
    if (list.length === 0) {
      this.set(STORAGE_KEYS.PARTICIPANTS, [DEFAULT_ADMIN, DEFAULT_PARTICIPANT]);
      return [DEFAULT_ADMIN, DEFAULT_PARTICIPANT];
    }
    // Ensure default admin exists and has the correct password synced from code
    const adminIndex = list.findIndex((p) => p.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase());
    if (adminIndex === -1) {
      list.unshift(DEFAULT_ADMIN);
      this.set(STORAGE_KEYS.PARTICIPANTS, list);
    } else {
      if (list[adminIndex].passwordHash !== DEFAULT_ADMIN.passwordHash || list[adminIndex].role !== DEFAULT_ADMIN.role) {
        list[adminIndex] = {
          ...list[adminIndex],
          passwordHash: DEFAULT_ADMIN.passwordHash,
          role: DEFAULT_ADMIN.role,
        };
        this.set(STORAGE_KEYS.PARTICIPANTS, list);
      }
    }
    return list;
  }

  getCurrentUser(): Participant | null {
    const user = this.get<Participant | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) {
      // For immediate preview convenience, start signed in as the demo participant
      return DEFAULT_PARTICIPANT;
    }
    return user;
  }

  setCurrentUser(user: Participant | null): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  registerParticipant(
    data: Omit<
      Participant,
      'participantId' | 'qrToken' | 'checkedIn' | 'checkedInAt' | 'createdAt' | 'role'
    > & { password?: string }
  ): { success: boolean; participant?: Participant; error?: string } {
    const participants = this.getParticipants();
    const existing = participants.find(
      (p) => p.email.toLowerCase().trim() === data.email.toLowerCase().trim()
    );

    if (existing) {
      return { success: false, error: 'A participant with this email is already registered.' };
    }

    // Generate unique Participant ID (e.g. IRCBM-2026-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const participantId = `IRCBM-2026-${randomSuffix}`;
    // Secure token for QR verification (non-sensitive payload)
    const qrToken = `IRCBM:PASS:${participantId}:${Math.random().toString(36).substring(2, 10)}`;

    const newParticipant: Participant = {
      ...data,
      participantId,
      qrToken,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date().toISOString(),
      role: 'participant',
      passwordHash: data.password || 'welcome2026',
    };

    participants.push(newParticipant);
    this.set(STORAGE_KEYS.PARTICIPANTS, participants);
    this.setCurrentUser(newParticipant);

    return { success: true, participant: newParticipant };
  }

  signIn(email: string, password?: string): { success: boolean; participant?: Participant; error?: string } {
    const participants = this.getParticipants();
    const user = participants.find(
      (p) => p.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (password && user.passwordHash && user.passwordHash !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }

    this.setCurrentUser(user);
    return { success: true, participant: user };
  }

  signInTracker(pin: string): { success: boolean; participant?: Participant; error?: string } {
    if (pin.trim() === '2026') {
      const trackerUser: Participant = {
        participantId: 'TRACKER-2026-VOLUNTEER',
        title: 'Staff',
        firstName: 'Attendance',
        lastName: 'Tracker',
        email: 'tracker@ircbm2026.kiet.edu.pk',
        mobile: '',
        institution: 'KIET',
        designation: 'Staff',
        city: 'Karachi',
        country: 'Pakistan',
        participantCategory: 'Other',
        qrToken: 'TRACKER_SESSION',
        checkedIn: false,
        checkedInAt: null,
        createdAt: new Date().toISOString(),
        role: 'tracker',
      };
      this.setCurrentUser(trackerUser);
      return { success: true, participant: trackerUser };
    }
    return { success: false, error: 'Incorrect Tracker Access PIN.' };
  }

  signOut(): void {
    this.setCurrentUser(null);
  }

  updateProfile(updates: Partial<Participant>): { success: boolean; participant?: Participant } {
    const current = this.getCurrentUser();
    if (!current) return { success: false };

    const participants = this.getParticipants();
    const index = participants.findIndex((p) => p.participantId === current.participantId);
    if (index === -1) return { success: false };

    const updated: Participant = {
      ...participants[index],
      ...updates,
      participantId: participants[index].participantId,
      qrToken: participants[index].qrToken,
      role: participants[index].role,
    };

    participants[index] = updated;
    this.set(STORAGE_KEYS.PARTICIPANTS, participants);
    this.setCurrentUser(updated);

    return { success: true, participant: updated };
  }

  updateParticipant(participant: Participant): boolean {
    const participants = this.getParticipants();
    const idx = participants.findIndex((p) => p.participantId === participant.participantId);
    if (idx === -1) return false;
    participants[idx] = participant;
    this.set(STORAGE_KEYS.PARTICIPANTS, participants);

    const cur = this.getCurrentUser();
    if (cur && cur.participantId === participant.participantId) {
      this.setCurrentUser(participant);
    }
    return true;
  }

  // --- PROGRAMME ---
  getProgramme(): ProgrammeItem[] {
    const list = this.get<ProgrammeItem[]>(STORAGE_KEYS.PROGRAMME, []);
    const hasPlaceholders = list.length === 0 || list.some(item => item.date === '[Conference Date]' || item.title.includes('[Paper'));
    if (hasPlaceholders) {
      this.set(STORAGE_KEYS.PROGRAMME, DEFAULT_PROGRAMME);
      return DEFAULT_PROGRAMME;
    }
    return list;
  }

  getProgrammeItems(): ProgrammeItem[] {
    return this.getProgramme();
  }

  addProgrammeItem(item: Omit<ProgrammeItem, 'id'>): ProgrammeItem {
    const items = this.getProgramme();
    const id = `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: ProgrammeItem = { id, ...item };
    items.push(newItem);
    this.set(STORAGE_KEYS.PROGRAMME, items);
    return newItem;
  }

  updateProgrammeItem(item: ProgrammeItem): boolean {
    const items = this.getProgramme();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx === -1) return false;
    items[idx] = item;
    this.set(STORAGE_KEYS.PROGRAMME, items);
    return true;
  }

  deleteProgrammeItem(id: string): boolean {
    const items = this.getProgramme();
    const filtered = items.filter((i) => i.id !== id);
    this.set(STORAGE_KEYS.PROGRAMME, filtered);
    this.cleanupDeletedProgrammeItemFromSchedules(id);
    return true;
  }

  private cleanupDeletedProgrammeItemFromSchedules(programmeItemId: string) {
    const schedules = this.get<SavedScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    const filtered = schedules.filter((s) => s.programmeItemId !== programmeItemId);
    this.set(STORAGE_KEYS.SCHEDULE, filtered);
  }

  // --- MY SCHEDULE ---
  getScheduleItemIds(): string[] {
    const current = this.getCurrentUser();
    if (!current) return [];
    const schedules = this.get<SavedScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    return schedules
      .filter((s) => s.participantId === current.participantId)
      .map((s) => s.programmeItemId);
  }

  toggleScheduleItem(programmeItemId: string): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;

    const schedules = this.get<SavedScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    const existsIndex = schedules.findIndex(
      (s) => s.participantId === current.participantId && s.programmeItemId === programmeItemId
    );

    if (existsIndex >= 0) {
      schedules.splice(existsIndex, 1);
    } else {
      schedules.push({ participantId: current.participantId, programmeItemId });
    }

    this.set(STORAGE_KEYS.SCHEDULE, schedules);
    return true;
  }

  // --- ANNOUNCEMENTS ---
  getAnnouncements(): Announcement[] {
    const list = this.get<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, []);
    if (list.length === 0) {
      this.set(STORAGE_KEYS.ANNOUNCEMENTS, DEFAULT_ANNOUNCEMENTS);
      return DEFAULT_ANNOUNCEMENTS;
    }
    return [...list].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  addAnnouncement(title: string, message: string): Announcement {
    const list = this.getAnnouncements();
    const id = `ann-${Date.now()}`;
    const newAnnouncement: Announcement = {
      id,
      title,
      message,
      publishedAt: new Date().toISOString(),
    };
    list.unshift(newAnnouncement);
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return newAnnouncement;
  }

  updateAnnouncement(announcement: Announcement): boolean {
    const list = this.getAnnouncements();
    const idx = list.findIndex((a) => a.id === announcement.id);
    if (idx === -1) return false;
    list[idx] = announcement;
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return true;
  }

  deleteAnnouncement(id: string): boolean {
    const list = this.getAnnouncements();
    const filtered = list.filter((a) => a.id !== id);
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, filtered);
    return true;
  }

  // --- CHECK-IN / PARTICIPANT MANAGEMENT (ADMIN) ---
  checkInParticipant(participantId: string): {
    success: boolean;
    alreadyCheckedIn?: boolean;
    checkedInAt?: string;
    participant?: Participant;
    error?: string;
  } {
    const participants = this.getParticipants();
    const index = participants.findIndex(
      (p) => p.participantId.toLowerCase() === participantId.toLowerCase()
    );
    if (index === -1) {
      return { success: false, error: 'Participant not found.' };
    }

    const participant = participants[index];
    if (participant.checkedIn) {
      return {
        success: false,
        alreadyCheckedIn: true,
        checkedInAt: participant.checkedInAt || undefined,
        participant,
      };
    }

    const now = new Date().toISOString();
    participant.checkedIn = true;
    participant.checkedInAt = now;
    participants[index] = participant;
    this.set(STORAGE_KEYS.PARTICIPANTS, participants);

    const cur = this.getCurrentUser();
    if (cur && cur.participantId === participant.participantId) {
      this.setCurrentUser(participant);
    }

    return {
      success: true,
      checkedInAt: now,
      participant,
    };
  }

  // --- VENUE ---
  getVenue(): VenueInfo {
    const venue = this.get<VenueInfo>(STORAGE_KEYS.VENUE, DEFAULT_VENUE);
    // Dynamic Migration: If Day 1 or Day 2 fields are not set, merge or replace with our upgraded defaults
    if (!venue.day1VenueName || !venue.day2VenueName || venue.address.includes('Korangi Creek') || (venue.day1VenueName && venue.day1VenueName.includes('Ahsanabad'))) {
      const merged = { 
        ...DEFAULT_VENUE, 
        ...venue,
        venueName: DEFAULT_VENUE.venueName,
        address: DEFAULT_VENUE.address,
        arrivalInformation: DEFAULT_VENUE.arrivalInformation,
        day1VenueName: DEFAULT_VENUE.day1VenueName,
        day1Address: DEFAULT_VENUE.day1Address,
        day1ArrivalInformation: DEFAULT_VENUE.day1ArrivalInformation,
        day1MapEmbedUrl: DEFAULT_VENUE.day1MapEmbedUrl,
        day1Latitude: DEFAULT_VENUE.day1Latitude,
        day1Longitude: DEFAULT_VENUE.day1Longitude,
        day2VenueName: DEFAULT_VENUE.day2VenueName,
        day2Address: DEFAULT_VENUE.day2Address,
        day2ArrivalInformation: DEFAULT_VENUE.day2ArrivalInformation,
        day2MapEmbedUrl: DEFAULT_VENUE.day2MapEmbedUrl,
        day2Latitude: DEFAULT_VENUE.day2Latitude,
        day2Longitude: DEFAULT_VENUE.day2Longitude,
        rooms: DEFAULT_VENUE.rooms,
      };
      this.set(STORAGE_KEYS.VENUE, merged);
      return merged;
    }
    return venue;
  }

  getVenueInfo(): VenueInfo {
    return this.getVenue();
  }

  updateVenue(venue: VenueInfo): void {
    this.set(STORAGE_KEYS.VENUE, venue);
  }

  resetToDefaultAssets(): void {
    this.set(STORAGE_KEYS.ASSETS, DEFAULT_ASSETS);
  }

  // --- ASSETS (CMS) ---
  getAssets(): ConferenceAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (data === null) {
        this.set(STORAGE_KEYS.ASSETS, DEFAULT_ASSETS);
        return DEFAULT_ASSETS;
      }
      return JSON.parse(data) as ConferenceAsset[];
    } catch {
      return DEFAULT_ASSETS;
    }
  }

  addAsset(name: string, type: 'logo' | 'banner' | 'brochure' | 'other', url: string, description?: string): ConferenceAsset {
    const list = this.getAssets();
    const id = `asset-${Date.now()}`;
    const newAsset: ConferenceAsset = {
      id,
      name,
      type,
      url,
      isActive: false,
      description,
      uploadedAt: new Date().toISOString(),
    };
    list.push(newAsset);
    this.set(STORAGE_KEYS.ASSETS, list);
    return newAsset;
  }

  toggleAssetActive(id: string): boolean {
    const list = this.getAssets();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    
    const targetAsset = list[idx];
    targetAsset.isActive = !targetAsset.isActive;

    this.set(STORAGE_KEYS.ASSETS, list);
    return true;
  }

  deleteAsset(id: string): boolean {
    const list = this.getAssets();
    const filtered = list.filter((a) => a.id !== id);
    this.set(STORAGE_KEYS.ASSETS, filtered);
    return true;
  }

  replaceActiveLogo(name: string, url: string, description?: string): ConferenceAsset {
    const list = this.getAssets();
    
    // Add the new logo and set it to active without deactivating other assets
    const id = `asset-${Date.now()}`;
    const newAsset: ConferenceAsset = {
      id,
      name,
      type: 'logo',
      url,
      isActive: true,
      description: description || 'New conference logo uploaded by administrator.',
      uploadedAt: new Date().toISOString(),
    };
    list.push(newAsset);
    this.set(STORAGE_KEYS.ASSETS, list);
    return newAsset;
  }

  cleanAssetMemory(): void {
    const list = this.getAssets();
    // Keep only currently active assets, wiping all inactive clutter!
    const filtered = list.filter((asset) => asset.isActive);
    this.set(STORAGE_KEYS.ASSETS, filtered);
  }

  // --- CSV BULK IMPORT HELPERS ---
  importParticipants(items: Array<{
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    institution: string;
    designation: string;
    city: string;
    country: string;
    participantCategory: string;
    submissionReferenceId?: string;
    passwordHash?: string;
    participantId?: string;
    checkedIn?: boolean;
    checkedInAt?: string | null;
  }>): void {
    const list = this.getParticipants();
    items.forEach((item) => {
      if (!item.firstName || !item.email) return;
      // Avoid duplicate emails if any
      if (list.some((p) => p.email.toLowerCase().trim() === item.email.toLowerCase().trim())) {
        return;
      }
      const participantId = item.participantId?.trim() || `IRCBM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const qrToken = `IRCBM:PASS:${participantId}:${Math.random().toString(36).substring(2, 10)}`;
      
      // Map string category safely
      let category: ParticipantCategory = 'Other';
      const validCategories: ParticipantCategory[] = [
        'Presenter',
        'Faculty / Academic',
        'Student',
        'Industry Participant',
        'Guest',
        'Other',
      ];
      const foundCategory = validCategories.find(
        (c) => c.toLowerCase() === item.participantCategory.toLowerCase().trim()
      );
      if (foundCategory) {
        category = foundCategory;
      }

      list.push({
        title: (item.title || '').trim(),
        firstName: item.firstName.trim(),
        lastName: (item.lastName || '').trim(),
        email: item.email.trim(),
        mobile: (item.mobile || '').trim(),
        institution: (item.institution || '').trim(),
        designation: (item.designation || '').trim(),
        city: (item.city || '').trim(),
        country: (item.country || '').trim(),
        participantCategory: category,
        submissionReferenceId: (item.submissionReferenceId || '').trim() || undefined,
        participantId,
        qrToken,
        checkedIn: item.checkedIn ?? false,
        checkedInAt: item.checkedInAt ?? null,
        createdAt: new Date().toISOString(),
        role: 'participant',
        passwordHash: item.passwordHash || 'welcome2026',
      });
    });
    this.set(STORAGE_KEYS.PARTICIPANTS, list);
  }

  importProgrammeItems(items: Array<Omit<ProgrammeItem, 'id'>>): void {
    const list = this.getProgramme();
    items.forEach((item) => {
      if (!item.title || !item.startTime || !item.endTime) return;
      const id = `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      list.push({
        id,
        date: (item.date || '').trim(),
        startTime: (item.startTime || '').trim(),
        endTime: (item.endTime || '').trim(),
        title: item.title.trim(),
        presenterName: (item.presenterName || '').trim(),
        coAuthors: (item.coAuthors || '').trim(),
        institution: (item.institution || '').trim(),
        track: (item.track || '').trim(),
        room: (item.room || '').trim(),
        abstractDescription: (item.abstractDescription || '').trim(),
      });
    });
    this.set(STORAGE_KEYS.PROGRAMME, list);
  }
}

export const store = new Store();
