export type ParticipantCategory =
  | 'Presenter'
  | 'Faculty / Academic'
  | 'Student'
  | 'Industry Participant'
  | 'Guest'
  | 'Other';

export interface Participant {
  participantId: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  institution: string;
  designation: string;
  city: string;
  country: string;
  participantCategory: ParticipantCategory;
  submissionReferenceId?: string;
  qrToken: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
  role: 'participant' | 'admin' | 'tracker';
  passwordHash?: string;
}

export interface ProgrammeItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  presenterName: string;
  coAuthors: string;
  institution: string;
  track: string;
  room: string;
  abstractDescription: string;
}

export interface SavedScheduleItem {
  participantId: string;
  programmeItemId: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  publishedAt: string;
}

export interface ConferenceRoom {
  roomName: string;
  location: string;
}

export interface VenueInfo {
  venueName: string;
  address: string;
  arrivalInformation: string;
  rooms: ConferenceRoom[];
  latitude?: number;
  longitude?: number;
  mapEmbedUrl?: string;

  // Day 1 Specifics
  day1VenueName?: string;
  day1Address?: string;
  day1ArrivalInformation?: string;
  day1MapEmbedUrl?: string;
  day1Latitude?: number;
  day1Longitude?: number;

  // Day 2 Specifics
  day2VenueName?: string;
  day2Address?: string;
  day2ArrivalInformation?: string;
  day2MapEmbedUrl?: string;
  day2Latitude?: number;
  day2Longitude?: number;
}

export interface ConferenceAsset {
  id: string;
  name: string;
  type: 'logo' | 'banner' | 'brochure' | 'other';
  url: string;
  isActive: boolean;
  description?: string;
  uploadedAt: string;
}

export type ActivePage =
  | 'home'
  | 'programme'
  | 'my-schedule'
  | 'my-qr-pass'
  | 'venue'
  | 'announcements'
  | 'register'
  | 'sign-in'
  | 'my-profile'
  | 'admin'
  | 'tracker';

export type AdminSection =
  | 'programme'
  | 'participants'
  | 'announcements'
  | 'check-in'
  | 'assets';
