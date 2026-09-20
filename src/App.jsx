import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { AIAssistant } from './components/AIAssistant';
import { SymptomTracker } from './components/SymptomTracker';
import { AdverseEventReport } from './components/AdverseEventReport';
import { DoctorConsultation } from './components/DoctorConsultation';
import { VaccineInfo } from './components/VaccineInfo';
import { AuthProfileModal } from './components/AuthProfileModal';
import { PrivacyConsentModal } from './components/PrivacyConsentModal';
import {
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  ArrowUp,
  Activity,
  Bot,
  FileWarning,
  Stethoscope,
  BookOpen,
  Lock,
  Sparkles,
  ExternalLink,
  HeartPulse,
  AlertOctagon
} from 'lucide-react';

function MainAppLayout() {
  const {
    currentView,
    setCurrentView,
    toastNotification,
    setIsConsentModalOpen,
    setIsEmergencyModalOpen,
    setIsAuthModalOpen
  } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      {/* 1. Global Emergency Banner */}
      <EmergencyBanner />

      {/* 2. Top Navigation */}
      <Navbar />

      {/* 3. Primary Content Routed by State */}
      <main className="main-content">
        {currentView === 'home' && <HomeDashboard />}
        {currentView === 'assistant' && <AIAssistant />}
        {currentView === 'tracker' && <SymptomTracker />}
        {currentView === 'report' && <AdverseEventReport />}
        {currentView === 'doctor' && <DoctorConsultation />}
        {currentView === 'vaccines' && <VaccineInfo />}
      </main>

      {/* 4. Modals */}
      <AuthProfileModal />
      <PrivacyConsentModal />

      {/* 5. Toast Feedback Banner */}
      {toastNotification && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast-pill">
            <CheckCircle2 size={18} color="#10B981" />
            <span>{toastNotification.message}</span>
          </div>
        </div>
      )}

      {/* Streamlined Clean Modern Healthcare Footer (Styled like reference) */}
      <footer className="app-footer">
        <div className="footer-main-container">
          {/* Left Card: Brand Box */}
          <div className="footer-brand-card">
            <div className="footer-brand-header">
              <img src="/vaxcare-logo.jpg" alt="VaxCare Guard" className="footer-brand-logo" />
              <span className="footer-brand-title">VaxCare</span>
            </div>

            <p className="footer-brand-desc">
              Post-vaccination safety guidance made <strong>reliable</strong>. Real-time AI symptom triage, verified safety datasets, and direct telehealth support.
            </p>

            <div className="footer-social-row">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Twitter / X" title="Twitter / X">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="GitHub" title="GitHub">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn" title="LinkedIn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
              <button onClick={() => setIsConsentModalOpen(true)} className="footer-social-btn" aria-label="Security & Privacy" title="Data Security & Privacy">
                <ShieldCheck size={14} />
              </button>
            </div>
          </div>

          {/* Right Columns Grid */}
          <div className="footer-nav-grid">
            {/* Column 1: CARE SERVICES */}
            <div className="footer-nav-col">
              <div className="footer-nav-heading">
                <Activity size={14} color="#06B6D4" />
                <span>PRACTICE & CARE</span>
              </div>
              <ul className="footer-nav-links">
                <li>
                  <button onClick={() => setCurrentView('assistant')} className="footer-nav-link">
                    <span className="chevron">›</span> AI Symptom Triage
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('tracker')} className="footer-nav-link">
                    <span className="chevron">›</span> Recovery Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('report')} className="footer-nav-link">
                    <span className="chevron">›</span> Report Adverse Event (AEFI)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('doctor')} className="footer-nav-link">
                    <span className="chevron">›</span> Telehealth Doctor
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('vaccines')} className="footer-nav-link">
                    <span className="chevron">›</span> Vaccine Safety Library
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAuthModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Health Profile & Records
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: SAFETY RESOURCES */}
            <div className="footer-nav-col">
              <div className="footer-nav-heading">
                <BookOpen size={14} color="#38BDF8" />
                <span>RESOURCES</span>
              </div>
              <ul className="footer-nav-links">
                <li>
                  <a href="https://vaers.hhs.gov" target="_blank" rel="noopener noreferrer" className="footer-nav-link">
                    <span className="chevron">›</span> CDC & FDA VAERS Registry
                  </a>
                </li>
                <li>
                  <a href="https://www.who.int/vaccine_safety/en/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">
                    <span className="chevron">›</span> WHO Vaccine Safety (GACVS)
                  </a>
                </li>
                <li>
                  <a href="https://www.cdc.gov/vaccines/acip/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">
                    <span className="chevron">›</span> ACIP Immunization Guidelines
                  </a>
                </li>
                <li>
                  <button onClick={() => setIsEmergencyModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Anaphylaxis Warning Signs
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsEmergencyModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Emergency Triage Protocols
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('vaccines')} className="footer-nav-link">
                    <span className="chevron">›</span> Side Effect Frequency Guide
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: COMPANY & LEGAL */}
            <div className="footer-nav-col">
              <div className="footer-nav-heading">
                <ShieldCheck size={14} color="#10B981" />
                <span>COMPANY & LEGAL</span>
              </div>
              <ul className="footer-nav-links">
                <li>
                  <button onClick={() => setIsConsentModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Clinical Triage Notice
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsConsentModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Privacy & HIPAA Alignment
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsConsentModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Medical Data Sovereignty
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsConsentModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Contact & Feedback
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsConsentModalOpen(true)} className="footer-nav-link">
                    <span className="chevron">›</span> Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsEmergencyModalOpen(true)} className="footer-nav-link" style={{ color: '#FDA4AF' }}>
                    <span className="chevron">›</span> Emergency 911 / 112
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Minimal Sub-Footer Bar */}
        <div className="footer-simple-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} VaxCare Guard Inc. All rights reserved.
          </div>

          <div className="footer-bottom-links">
            <button onClick={() => setIsConsentModalOpen(true)} className="footer-bottom-link">
              Privacy
            </button>
            <button onClick={() => setIsConsentModalOpen(true)} className="footer-bottom-link">
              Terms
            </button>
            <button onClick={() => setIsConsentModalOpen(true)} className="footer-bottom-link">
              Support
            </button>
            <button onClick={() => setIsEmergencyModalOpen(true)} className="footer-bottom-link" style={{ color: '#F43F5E', fontWeight: 600 }}>
              Emergency 911
            </button>
            <button onClick={scrollToTop} className="footer-bottom-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Back to Top <ArrowUp size={11} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
