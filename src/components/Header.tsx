import React, { useState } from 'react';
import { ActivePage, Participant } from '../types';
import { OfficialLogo } from './OfficialLogo';
import { Menu, X, User, Shield, LogOut, QrCode } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: Participant | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  currentUser,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = currentUser?.role === 'tracker'
    ? [
        { id: 'home', label: 'Home' },
        { id: 'tracker', label: 'Attendance Terminal' },
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'programme', label: 'Programme' },
        { id: 'my-schedule', label: 'My Schedule' },
        { id: 'my-qr-pass', label: 'My QR Pass' },
        { id: 'venue', label: 'Venue' },
        { id: 'announcements', label: 'Announcements' },
      ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#A091A3]">
      {/* Top Banner Bar - matching the upper dark navy header bar from image palette */}
      <div className="bg-[#262B37] text-[#E0DCD5] text-xs py-1.5 px-4 hidden sm:block border-b border-[#A091A3]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
          <span>Faculty of Management Sciences (FoMS), KIET</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8D7A68]" />
            <span className="text-[#E0DCD5]">IRCBM 2026 Official Conference Companion</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with appropriate spacing */}
          <div className="flex items-center gap-3">
            <button
              id="header-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left focus:outline-none focus:ring-2 focus:ring-[#8D7A68] rounded-md p-1 -m-1"
              aria-label="IRCBM 2026 Home"
            >
              <OfficialLogo size="md" />
            </button>
          </div>

          {/* Desktop Navigation: Exactly what is required */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-[#262B37] bg-[#F3F2F0] font-semibold'
                      : 'text-[#2C323E] hover:text-[#262B37] hover:bg-[#E0DCD5]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Admin / Sign In / My Profile */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Admin Area Button - Always accessible */}
            {currentUser?.role !== 'tracker' && (
              <button
                id="admin-area-btn"
                onClick={() => handleNavClick('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  activePage === 'admin'
                    ? 'bg-[#262B37] text-[#E0DCD5] border-[#262B37] shadow-xs'
                    : 'border-[#A091A3] text-[#262B37] hover:bg-[#F3F2F0] hover:text-[#262B37] hover:border-[#8D7A68]'
                }`}
                title="Conference Administration Area"
              >
                <Shield className="w-3.5 h-3.5 text-[#8D7A68]" />
                <span>Admin Area</span>
              </button>
            )}

            {currentUser ? (
              <>
                {currentUser.role !== 'tracker' ? (
                  <button
                    id="nav-my-profile"
                    onClick={() => handleNavClick('my-profile')}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activePage === 'my-profile'
                        ? 'text-[#262B37] bg-[#F3F2F0] font-semibold'
                        : 'text-[#2C323E] hover:text-[#262B37] hover:bg-[#E0DCD5]'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#8D7A68]" />
                    My Profile
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                    Staff Scanner Terminal
                  </span>
                )}

                <button
                  id="sign-out-btn"
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-2 text-[#4B6178] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="sign-in-nav-btn"
                  onClick={() => handleNavClick('sign-in')}
                  className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    activePage === 'sign-in'
                      ? 'bg-[#262B37] text-[#E0DCD5] border-[#262B37]'
                      : 'border-[#A091A3] text-[#262B37] hover:bg-[#F3F2F0] hover:text-[#262B37]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="register-nav-btn"
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-[#262B37] text-white hover:bg-[#1E222D] active:bg-[#14171E] transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser && (
              <button
                id="mobile-quick-qr-btn"
                onClick={() => handleNavClick('my-qr-pass')}
                className="p-2 text-[#262B37] hover:bg-[#F3F2F0] rounded-md"
                aria-label="My QR Pass"
              >
                <QrCode className="w-5 h-5 text-[#8D7A68]" />
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4B6178] hover:text-[#0B2038] hover:bg-[#F4F8FA] rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2EDF4] bg-white px-4 pt-2 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-[#1793D1] bg-[#EBF6FB] font-semibold'
                    : 'text-[#4B6178] hover:text-[#0B2038] hover:bg-[#F4F8FA]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#E2EDF4] mt-3 space-y-2">
            {currentUser ? (
              <>
                <div className="px-3 py-1.5 text-xs text-[#63788E] font-medium truncate">
                  Signed in as {currentUser.firstName} {currentUser.lastName}
                </div>
                <button
                  id="mobile-nav-profile"
                  onClick={() => handleNavClick('my-profile')}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md ${
                    activePage === 'my-profile'
                      ? 'bg-[#EBF6FB] text-[#1793D1] font-semibold'
                      : 'text-[#0B2038] hover:bg-[#F4F8FA]'
                  }`}
                >
                  <User className="w-5 h-5 text-[#1793D1]" />
                  My Profile
                </button>

                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md ${
                    activePage === 'admin'
                      ? 'bg-[#091B2E] text-white font-semibold'
                      : 'text-[#0B2038] hover:bg-[#EBF6FB]'
                  }`}
                >
                  <Shield className="w-5 h-5 text-[#1793D1]" />
                  Administration Area
                </button>

                <button
                  id="mobile-sign-out-btn"
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="mobile-sign-in-btn"
                    onClick={() => handleNavClick('sign-in')}
                    className="w-full py-2.5 text-center text-sm font-medium text-[#0B2038] bg-[#EBF6FB] hover:bg-[#DDF0FA] border border-[#BAE3F7] rounded-md transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    id="mobile-register-btn"
                    onClick={() => handleNavClick('register')}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#1793D1] hover:bg-[#127EB5] rounded-md shadow-sm transition-colors"
                  >
                    Register
                  </button>
                </div>
                <button
                  id="mobile-nav-admin-guest"
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#0B2038] border border-[#D0E5F2] hover:bg-[#EBF6FB] rounded-md transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#1793D1]" />
                  Organizer Administration Area
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
