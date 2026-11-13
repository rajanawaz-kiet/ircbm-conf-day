import React, { useState } from 'react';
import { Participant } from '../types';
import { User, Check, Edit2 } from 'lucide-react';

interface MyProfileViewProps {
  currentUser: Participant | null;
  onUpdateProfile: (updates: Partial<Participant>) => { success: boolean; participant?: Participant };
  onNavigateToSignIn: () => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onNavigateToSignIn,
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0B2038]">My Profile</h1>
        <p className="text-[#4B6178] text-sm">Please sign in to view your profile.</p>
        <button
          onClick={onNavigateToSignIn}
          className="px-5 py-2.5 bg-[#1793D1] text-white text-sm font-semibold rounded-lg hover:bg-[#127EB5] active:bg-[#0F6B9B] shadow-sm transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentUser.title || '');
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [designation, setDesignation] = useState(currentUser.designation || '');
  const [mobile, setMobile] = useState(currentUser.mobile || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [country, setCountry] = useState(currentUser.country || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fullName = `${currentUser.title ? `${currentUser.title} ` : ''}${currentUser.firstName} ${currentUser.lastName}`.trim();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const result = onUpdateProfile({
      title: title.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      institution: institution.trim(),
      designation: designation.trim(),
      mobile: mobile.trim(),
      city: city.trim(),
      country: country.trim(),
    });

    if (result.success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
            My Profile
          </h1>
        </div>

        {!isEditing ? (
          <button
            id="edit-profile-btn"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1793D1] bg-[#EBF6FB] border border-[#BAE3F7] rounded-lg hover:bg-[#DDF0FA] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs font-semibold text-[#4B6178] hover:text-[#0B2038] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-[#EBF6FB] border border-[#BAE3F7] text-[#1793D1] text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-[#1793D1]" />
          Profile updated successfully.
        </div>
      )}

      {!isEditing ? (
        /* Display view: exactly Section 17 fields */
        <div className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F0F5F9]">
            <div className="w-12 h-12 bg-[#EBF6FB] rounded-full flex items-center justify-center text-[#1793D1]">
              <User className="w-6 h-6" />
            </div>
            <div>
              {/* Participant Name */}
              <h2 className="text-xl font-bold text-[#0B2038]">{fullName}</h2>
              {/* Participant ID */}
              <div className="text-xs font-mono text-[#63788E] font-semibold">
                ID: {currentUser.participantId}
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-sm">
            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#F0F5F9]">
              <span className="text-xs font-semibold text-[#63788E] uppercase tracking-wide">
                Email
              </span>
              <span className="font-semibold text-[#0B2038]">{currentUser.email}</span>
            </div>

            {/* Institution */}
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#F0F5F9]">
              <span className="text-xs font-semibold text-[#63788E] uppercase tracking-wide">
                Institution
              </span>
              <span className="font-semibold text-[#0B2038]">{currentUser.institution || '—'}</span>
            </div>

            {/* Designation */}
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#F0F5F9]">
              <span className="text-xs font-semibold text-[#63788E] uppercase tracking-wide">
                Designation
              </span>
              <span className="font-semibold text-[#0B2038]">{currentUser.designation || '—'}</span>
            </div>

            {/* Participant Category */}
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#F0F5F9]">
              <span className="text-xs font-semibold text-[#63788E] uppercase tracking-wide">
                Participant Category
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7] w-fit">
                {currentUser.participantCategory}
              </span>
            </div>

            {/* Location (City, Country) */}
            {(currentUser.city || currentUser.country) && (
              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#F0F5F9]">
                <span className="text-xs font-semibold text-[#63788E] uppercase tracking-wide">
                  Location
                </span>
                <span className="font-semibold text-[#0B2038]">
                  {[currentUser.city, currentUser.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Edit view: basic profile editing */
        <form onSubmit={handleSave} className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#4B6178] mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4B6178] mb-1">
                First Name
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
                Last Name
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

          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
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
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B6178] mb-1">
              Mobile
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg px-3 py-2 text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-[#4B6178] hover:text-[#0B2038] transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              className="px-5 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
