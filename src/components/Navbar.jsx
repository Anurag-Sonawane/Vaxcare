import React, { useState } from 'react';
import {
  Home,
  Bot,
  Activity,
  FileWarning,
  Stethoscope,
  BookOpen,
  User,
  ShieldCheck,
  PhoneCall,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const {
    currentView,
    setCurrentView,
    user,
    theme,
    toggleTheme,
    setIsAuthModalOpen,
    setIsConsentModalOpen,
    setIsEmergencyModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'assistant', label: 'AI Triage', icon: Bot },
    { id: 'tracker', label: 'Tracker', icon: Activity },
    { id: 'report', label: 'Report AEFI', icon: FileWarning },
    { id: 'doctor', label: 'Clinicians', icon: Stethoscope },
    { id: 'vaccines', label: 'Vaccines', icon: BookOpen }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* Streamlined Brand */}
        <div
          className="nav-brand"
          onClick={() => handleNavClick('home')}
          role="button"
          tabIndex={0}
        >
          <img
            src="/vaxcare-logo.jpg"
            alt="VaxCare Guard Logo"
            className="nav-brand-logo"
          />
          <div className="brand-title">
            <span className="brand-title-main">VaxCare</span>
            <span className="brand-title-accent">Guard</span>
            <span className="brand-title-dot"></span>
          </div>
        </div>

        {/* Floating Desktop Navigation Island */}
        <nav className="nav-links-desktop" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle, Emergency SOS & Profile Avatar */}
        <div className="nav-right-actions">
          {/* Theme Toggle (Light / Dark) */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Minimal Emergency Button */}
          <button
            className="btn-emergency-nav"
            onClick={() => setIsEmergencyModalOpen(true)}
            title="Immediate Emergency Hotline 911 / 112"
          >
            <span className="emergency-indicator-dot"></span>
            <span>Emergency</span>
          </button>

          {/* Clean User Profile Avatar */}
          <button
            className="btn-profile-avatar"
            onClick={() => setIsAuthModalOpen(true)}
            title={`Patient Profile: ${user.name || 'User'} (${user.vaccineHistory?.length || 0} doses)`}
            aria-label="User Profile"
          >
            <div className="user-avatar-circle">
              {user.name ? user.name.charAt(0) : 'S'}
            </div>
            <span className="user-avatar-status"></span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-items">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mobile-nav-footer">
            <button
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
              onClick={() => {
                setIsConsentModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <ShieldCheck size={16} color="var(--teal-primary)" />
              Privacy & Medical Charter
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
