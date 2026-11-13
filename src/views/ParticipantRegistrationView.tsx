import React, { useState } from 'react';
import { ParticipantCategory, Participant } from '../types';
import { OfficialLogo } from '../components/OfficialLogo';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ParticipantRegistrationViewProps {
  onRegister: (
    data: Omit<
      Participant,
      'participantId' | 'qrToken' | 'checkedIn' | 'checkedInAt' | 'createdAt' | 'role'
    > & { password?: string }
  ) => { success: boolean; participant?: Participant; error?: string };
  onNavigateToQrPass: () => void;
  onNavigateToSignIn: () => void;
}

export const ParticipantRegistrationView: React.FC<ParticipantRegistrationViewProps> = ({
  onRegister,
  onNavigateToQrPass,
  onNavigateToSignIn,
}) => {
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [institution, setInstitution] = useState('');
  const [designation, setDesignation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [participantCategory, setParticipantCategory] = useState<ParticipantCategory>('Faculty / Academic');
  const [submissionReferenceId, setSubmissionReferenceId] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [registeredParticipant, setRegisteredParticipant] = useState<Participant | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in your name and email address.');
      return;
    }

    if (participantCategory === 'Presenter' && !submissionReferenceId.trim()) {
      setError('Please enter your Submission Reference ID for verification.');
      return;
    }

    const result = onRegister({
      title: title.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      institution: institution.trim(),
      designation: designation.trim(),
      city: city.trim(),
      country: country.trim(),
      participantCategory,
      submissionReferenceId: participantCategory === 'Presenter' ? submissionReferenceId.trim() : undefined,
      password: password || 'welcome2026',
    });

    if (!result.success) {
      setError(result.error || 'Registration failed. Please check your information.');
    } else if (result.participant) {
      setRegisteredParticipant(result.participant);
    }
  };

  // SUCCESS STATE as strictly specified in Section 15
  if (registeredParticipant) {
    const fullName = `${registeredParticipant.title ? `${registeredParticipant.title} ` : ''}${registeredParticipant.firstName} ${registeredParticipant.lastName}`.trim();

    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="flex justify-center pb-2">
          <OfficialLogo size="md" />
        </div>

        <div className="w-14 h-14 bg-[#EBF6FB] text-[#1793D1] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          {/* Registration Successful */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
            Registration Successful
          </h1>
          {/* [Participant Name] */}
          <div className="text-lg font-bold text-[#0B2038]">
            {fullName}
          </div>
        </div>

        {/* Participant ID: [Participant ID] */}
        <div className="bg-[#F8FAFC] border border-[#E2EDF4] rounded-xl p-4 space-y-1">
          <div className="text-xs font-semibold text-[#4B6178] uppercase tracking-wider">
            Participant ID
          </div>
          <div className="font-mono text-xl font-bold text-[#1793D1]">
            {registeredParticipant.participantId}
          </div>
        </div>

        {/* Your QR Pass is now available. */}
        <p className="text-sm text-[#4B6178]">
          Your QR Pass is now available.
        </p>

        {/* Provide: View My QR Pass */}
        <div>
          <button
            id="reg-view-my-qr-pass-btn"
            onClick={onNavigateToQrPass}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            View My QR Pass
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Official Logo at registration */}
      <div className="flex justify-center pb-2">
        <OfficialLogo size="md" />
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
          Participant Registration
        </h1>
        <p className="text-sm text-[#4B6178]">
          Already registered?{' '}
          <button
            onClick={onNavigateToSignIn}
            className="text-[#1793D1] font-semibold underline hover:text-[#127EB5]"
          >
            Sign In here
          </button>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Registration Form: ONLY the requested fields */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        {/* Title, First Name, Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dr/Mr"
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#4B6178] mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
          />
        </div>

        {/* Account Password */}
        <div>
          <label className="block text-xs font-semibold text-[#4B6178] mb-1">
            Password (for your Companion account) *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-[#4B6178] mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+92 300 1234567"
            className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
          />
        </div>

        {/* Institution & Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. University / Organization"
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Assistant Professor / Scholar"
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>
        </div>

        {/* City & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>
        </div>

        {/* Participant Category */}
        <div>
          <label className="block text-xs font-semibold text-[#4B6178] mb-1">
            Participant Category
          </label>
          <select
            value={participantCategory}
            onChange={(e) => setParticipantCategory(e.target.value as ParticipantCategory)}
            className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
          >
            <option value="Presenter">Presenter</option>
            <option value="Faculty / Academic">Faculty / Academic</option>
            <option value="Student">Student</option>
            <option value="Industry Participant">Industry Participant</option>
            <option value="Guest">Guest</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* If Presenter is selected, show one additional field: Submission Reference ID */}
        {participantCategory === 'Presenter' && (
          <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2EDF4] animate-in fade-in">
            <label className="block text-xs font-semibold text-[#0B2038] mb-1">
              Submission Reference ID *
            </label>
            <input
              type="text"
              required
              value={submissionReferenceId}
              onChange={(e) => setSubmissionReferenceId(e.target.value)}
              placeholder="e.g. IRCBM-SUB-1042"
              className="w-full text-sm bg-white border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
            <p className="text-[11px] text-[#63788E] mt-1">
              Reference code from your accepted manuscript or presentation.
            </p>
          </div>
        )}

        {/* Provide: Register */}
        <div className="pt-2">
          <button
            id="register-submit-btn"
            type="submit"
            className="w-full py-2.5 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
