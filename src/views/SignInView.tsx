import React, { useState } from 'react';
import { Participant } from '../types';
import { OfficialLogo } from '../components/OfficialLogo';
import { Lock, Mail, ArrowRight, ShieldCheck, QrCode, ArrowLeft } from 'lucide-react';

interface SignInViewProps {
  onSignIn: (email: string, password?: string) => { success: boolean; participant?: Participant; error?: string };
  onTrackerSignIn?: (pin: string) => { success: boolean; participant?: Participant; error?: string };
  onNavigateToRegister: () => void;
  onSignedInSuccess: (user: Participant) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSignIn,
  onTrackerSignIn,
  onNavigateToRegister,
  onSignedInSuccess,
}) => {
  const [isTrackerMode, setIsTrackerMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trackerPin, setTrackerPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotSent(false);

    if (isTrackerMode) {
      if (!trackerPin.trim()) {
        setError('Please enter the volunteer access PIN.');
        return;
      }
      if (onTrackerSignIn) {
        const result = onTrackerSignIn(trackerPin);
        if (!result.success) {
          setError(result.error || 'Incorrect PIN entered.');
        } else if (result.participant) {
          onSignedInSuccess(result.participant);
        }
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }

      const result = onSignIn(email, password);
      if (!result.success) {
        setError(result.error || 'Unable to sign in. Please verify your credentials.');
      } else if (result.participant) {
        onSignedInSuccess(result.participant);
      }
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Please enter your registered email address above first.');
      return;
    }
    setError(null);
    setForgotSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16 space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-center pb-2">
        <OfficialLogo size="md" />
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2038] tracking-tight">
          {isTrackerMode ? 'Attendance Terminal' : 'Sign In'}
        </h1>
        <p className="text-sm text-[#4B6178]">
          {isTrackerMode 
            ? 'Authorized Staff & Volunteer Scanner Log-In' 
            : 'Access your conference schedule, QR Pass, and profile'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {forgotSent && (
        <div className="p-3 bg-[#EBF6FB] border border-[#BAE3F7] text-[#1793D1] text-xs rounded-lg">
          Password reset instructions have been logged for {email}.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#E2EDF4] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        {!isTrackerMode ? (
          <>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#4B6178] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A91A8]" />
                <input
                  id="signin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#4B6178]">
                  Password
                </label>
                <button
                  type="button"
                  id="forgot-password-btn"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#1793D1] hover:text-[#127EB5] underline"
                >
                  Forgot Password
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A91A8]" />
                <input
                  id="signin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
                />
              </div>
            </div>

            {/* Sign In button */}
            <div className="pt-2">
              <button
                id="signin-submit-btn"
                type="submit"
                className="w-full py-2.5 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Switch to Tracker mode */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsTrackerMode(true);
                }}
                className="w-full py-2 text-xs font-bold text-[#1793D1] hover:text-[#127EB5] border border-[#E2EDF4] hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <QrCode className="w-3.5 h-3.5" />
                Staff Attendance Tracker Portal (PIN)
              </button>
            </div>

            {/* Register link */}
            <div className="pt-3 border-t border-[#F0F5F9] text-center">
              <p className="text-xs text-[#4B6178]">
                Don't have a conference account yet?
              </p>
              <button
                type="button"
                id="signin-register-link"
                onClick={onNavigateToRegister}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1793D1] hover:text-[#127EB5] mt-1"
              >
                Register as Participant
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* PIN Entry Form */}
            <div className="space-y-1 text-center pb-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-[#EBF6FB] flex items-center justify-center text-[#1793D1]">
                <QrCode className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-[#0B2038] pt-1">Volunteer Access</h2>
              <p className="text-xs text-[#63788E]">
                Enter the Organizer's 4-digit tracking PIN code to activate scanner
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B6178] mb-1">
                Gatekeeper Security PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A91A8]" />
                <input
                  id="tracker-pin-input"
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={trackerPin}
                  onChange={(e) => setTrackerPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter Tracker PIN (e.g., 2026)"
                  className="w-full pl-9 pr-4 py-2.5 text-center text-lg font-mono tracking-widest bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
                />
              </div>
            </div>

            {/* Activate Scanner button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1793D1] hover:bg-[#127EB5] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Activate Scanner Portal
              </button>
            </div>

            {/* Back to normal Sign In */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsTrackerMode(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#63788E] hover:text-[#0B2038] py-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Standard Login
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
