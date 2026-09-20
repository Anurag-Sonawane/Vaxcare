import React from 'react';
import {
  Bot,
  Activity,
  FileWarning,
  Stethoscope,
  BookOpen,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Calendar,
  Thermometer,
  Zap,
  HeartPulse,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function HomeDashboard() {
  const {
    setCurrentView,
    user,
    symptoms,
    reports,
    setIsEmergencyModalOpen,
    setIsAuthModalOpen
  } = useApp();

  const activeSymptoms = symptoms.filter(s => s.status !== 'Resolved');
  const latestDose = user.vaccineHistory && user.vaccineHistory.length > 0 ? user.vaccineHistory[0] : null;

  return (
    <div className="home-dashboard-container">
      {/* 1. Open Cinematic Clinical Hero (Awwwards-Caliber Dark Theme) */}
      <section className="hero-cinematic animate-in">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="indicator-dot"></span>
            <span>CLINICAL VIGILANCE PLATFORM • CDC & WHO ALIGNED</span>
          </div>

          <h1 className="hero-main-title">
            Evidence-Based Health Support <br />
            <span className="hero-gradient-text">After Every Immunization.</span>
          </h1>

          <p className="hero-subtitle">
            Instant AI triage for post-vaccine symptoms, personal recovery timeline tracking, and 24/7 direct access to licensed clinicians.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-hero-primary"
              onClick={() => setCurrentView('assistant')}
            >
              <Bot size={18} />
              <span>Evaluate Symptoms with AI</span>
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => setCurrentView('doctor')}
            >
              <Stethoscope size={18} />
              <span>Consult a Doctor</span>
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="hero-stat-val">24/7</span>
              <span className="hero-stat-lbl">Triage Engine</span>
            </div>
            <div className="hero-stat-sep"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-val">VAERS / WHO</span>
              <span className="hero-stat-lbl">AEFI Standard</span>
            </div>
            <div className="hero-stat-sep"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-val" style={{ color: '#34D399' }}>100% Private</span>
              <span className="hero-stat-lbl">Encrypted Locally</span>
            </div>
          </div>
        </div>

        {/* Fluid Clinical Vigilance Console */}
        <div className="hero-telemetry-card animate-in stagger-1">
          <div className="telemetry-console-header">
            <div className="telemetry-live-beacon">
              <span className="telemetry-live-dot"></span>
              <span className="telemetry-live-label">LIVE VIGILANCE TELEMETRY</span>
            </div>
            <span className="telemetry-sync-badge">
              <ShieldCheck size={13} color="var(--success-emerald)" />
              CDC & ACIP Synced
            </span>
          </div>

          {/* Autonomic Response Wave Stage */}
          <div className="telemetry-wave-stage">
            <div className="telemetry-wave-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <HeartPulse size={16} color="var(--info-blue)" />
                <span className="telemetry-wave-title">
                  Autonomic Response Waveform
                </span>
              </div>
              <span className="telemetry-wave-status">Live Sensor Stream</span>
            </div>

            <div className="telemetry-ekg-canvas">
              <svg className="ekg-svg" viewBox="0 0 500 40" preserveAspectRatio="none">
                <path
                  className="ekg-path"
                  d="M 0 20 L 80 20 L 95 12 L 105 28 L 115 5 L 125 35 L 135 16 L 145 22 L 155 20 L 250 20 L 265 12 L 275 28 L 285 5 L 295 35 L 305 16 L 315 22 L 325 20 L 420 20 L 435 12 L 445 28 L 455 5 L 465 35 L 475 16 L 485 22 L 500 20"
                />
              </svg>
            </div>
          </div>

          {/* 3-Column Minimalist Metrics Row */}
          <div className="telemetry-stats-row">
            <div className="telemetry-stat-chip">
              <span className="stat-chip-label">Reactogenicity</span>
              <span className="stat-chip-val" style={{ color: 'var(--success-emerald)' }}>Expected Mild</span>
            </div>
            <div className="telemetry-stat-chip">
              <span className="stat-chip-label">Red Flags</span>
              <span className="stat-chip-val" style={{ color: 'var(--info-blue)' }}>0 Active</span>
            </div>
            <div className="telemetry-stat-chip">
              <span className="stat-chip-label">Observation</span>
              <span className="stat-chip-val" style={{ color: 'var(--warning-amber)' }}>Day 2 of 3</span>
            </div>
          </div>

          {/* Console Footer with Patient Record */}
          <div className="telemetry-console-footer">
            <div className="telemetry-patient-meta">
              <Zap size={14} color="var(--warning-amber)" />
              <span>
                Patient: <strong>{user.name}</strong> • {latestDose ? `${latestDose.vaccineName}` : 'COVID-19 Booster'}
              </span>
            </div>
            <button
              onClick={() => setCurrentView('tracker')}
              className="telemetry-view-btn"
            >
              <span>Recovery Log</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. The 5 Core Pillars (Dark Luxury Feature Cards) */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="section-title-wrap animate-in stagger-1">
          <div>
            <div className="badge-subtle" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
              <Sparkles size={13} /> Integrated Care Suite
            </div>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
              Specialized Health Support Services
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9375rem', margin: 0 }}>
              Select a specialized tool to evaluate symptoms, track recovery, or connect with care.
            </p>
          </div>
        </div>

        <div className="core-features-grid">
          {/* 1. AI Health Assistant */}
          <div
            className="feature-action-card card-assistant animate-in stagger-1"
            onClick={() => setCurrentView('assistant')}
            role="button"
            tabIndex={0}
          >
            <div className="card-top-row">
              <div className="card-icon-box icon-blue">
                <Bot size={22} />
              </div>
              <span className="card-status-badge badge-blue">
                Instant AI
              </span>
            </div>
            <div className="card-body">
              <h4>AI Health Assistant</h4>
              <p>
                Instant evidence-based triage for post-vaccine symptoms, onset timelines, and emergency red flags.
              </p>
            </div>
            <div className="card-action-footer">
              <span className="card-link-text">
                Start AI Triage <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* 2. Track Symptoms */}
          <div
            className="feature-action-card card-tracker animate-in stagger-2"
            onClick={() => setCurrentView('tracker')}
            role="button"
            tabIndex={0}
          >
            <div className="card-top-row">
              <div className="card-icon-box icon-teal">
                <Activity size={22} />
              </div>
              <span className="card-status-badge badge-teal">
                {activeSymptoms.length} Active Log{activeSymptoms.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="card-body">
              <h4>Track Symptoms</h4>
              <p>
                Log soreness, temperature, or fatigue. Visualize your recovery progression on an interactive timeline.
              </p>
            </div>
            <div className="card-action-footer">
              <span className="card-link-text">
                Open Tracker <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* 3. Report an Adverse Event */}
          <div
            className="feature-action-card card-report animate-in stagger-3"
            onClick={() => setCurrentView('report')}
            role="button"
            tabIndex={0}
          >
            <div className="card-top-row">
              <div className="card-icon-box icon-rose">
                <FileWarning size={22} />
              </div>
              <span className="card-status-badge badge-rose">
                VAERS Schema
              </span>
            </div>
            <div className="card-body">
              <h4>Report Adverse Event</h4>
              <p>
                Standardized AEFI reporting form (VAERS/WHO). Export printable certificates or share directly with your doctor.
              </p>
            </div>
            <div className="card-action-footer">
              <span className="card-link-text">
                File AEFI Report <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* 4. Talk to a Doctor */}
          <div
            className="feature-action-card card-doctor animate-in stagger-4"
            onClick={() => setCurrentView('doctor')}
            role="button"
            tabIndex={0}
          >
            <div className="card-top-row">
              <div className="card-icon-box icon-indigo">
                <Stethoscope size={22} />
              </div>
              <span className="card-status-badge badge-indigo">
                Live On-Call
              </span>
            </div>
            <div className="card-body">
              <h4>Talk to a Doctor</h4>
              <p>
                Connect with board-certified vaccine safety physicians via live video call or schedule an urgent consultation.
              </p>
            </div>
            <div className="card-action-footer">
              <span className="card-link-text">
                Live Video Call <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* 5. Vaccine Information */}
          <div
            className="feature-action-card card-library animate-in stagger-5"
            onClick={() => setCurrentView('vaccines')}
            role="button"
            tabIndex={0}
          >
            <div className="card-top-row">
              <div className="card-icon-box icon-purple">
                <BookOpen size={22} />
              </div>
              <span className="card-status-badge badge-purple">
                8 Monitored
              </span>
            </div>
            <div className="card-body">
              <h4>Vaccine Safety Library</h4>
              <p>
                Explore side-effect profiles, expected reactogenicity windows, rare warning signs, and comfort tips for all vaccines.
              </p>
            </div>
            <div className="card-action-footer">
              <span className="card-link-text">
                Browse Library <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* 6. Health Profile Card */}
          <div
            className="feature-action-card animate-in stagger-6"
            onClick={() => setIsAuthModalOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className="card-top-row">
              <div className="card-icon-box icon-slate">
                <ShieldCheck size={22} />
              </div>
              <span className="card-status-badge badge-slate">
                {user.name}
              </span>
            </div>
            <div className="card-body">
              <h4>Health Profile & Doses</h4>
              <p>
                Manage known allergies, pre-existing conditions, and review your immunization dose verification records.
              </p>
            </div>
            <div className="card-action-footer">
              <span className="card-link-text">
                View Profile <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dual Panel: Emergency Alert + Animated Live Monitoring */}
      <section className="home-dual-panel">
        {/* Left: Emergency Protocol Card */}
        <div className="panel-card panel-emergency-callout animate-in stagger-2">
          <div className="panel-header">
            <div className="panel-header-title">
              <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '0.5rem', borderRadius: '10px', color: '#F43F5E' }}>
                <AlertOctagon size={22} />
              </div>
              <div>
                <h4 style={{ color: '#FDA4AF' }}>Emergency Warning Signs</h4>
                <p style={{ fontSize: '0.78125rem', color: '#F87171', margin: 0 }}>
                  Seek immediate emergency medical response if you experience:
                </p>
              </div>
            </div>
          </div>

          <div className="emergency-red-flag-list">
            <div className="red-flag-item">
              <div className="red-flag-bullet"></div>
              <span><strong>Airway Swelling & Breathing Distress:</strong> Lip, tongue, or throat tightness (Anaphylaxis).</span>
            </div>
            <div className="red-flag-item">
              <div className="red-flag-bullet"></div>
              <span><strong>Chest Tightness:</strong> Pressure, sharp pain, or heart fluttering (Cardiac check).</span>
            </div>
            <div className="red-flag-item">
              <div className="red-flag-bullet"></div>
              <span><strong>Neurological:</strong> Fainting, severe sudden headache with vision changes, or limb numbness.</span>
            </div>
            <div className="red-flag-item">
              <div className="red-flag-bullet"></div>
              <span><strong>High Spike Fever:</strong> Temperature over 104.0°F (40.0°C) not responding to antipyretics.</span>
            </div>
          </div>

          <button
            className="btn-emergency-action"
            onClick={() => setIsEmergencyModalOpen(true)}
          >
            <PhoneCall size={16} />
            <span>Emergency Services & 24/7 Hotline</span>
          </button>
        </div>

        {/* Right: Active Immunization Care with Animated Heartbeat Wave */}
        <div className="panel-card animate-in stagger-3">
          <div className="panel-header">
            <div className="panel-header-title">
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.5rem', borderRadius: '10px', color: '#06B6D4' }}>
                <HeartPulse size={22} />
              </div>
              <div>
                <h4 style={{ color: '#F8FAFC' }}>Active Post-Dose Telemetry</h4>
                <p style={{ fontSize: '0.78125rem', color: '#94A3B8', margin: 0 }}>
                  Observation status for {user.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('tracker')}
              style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Tracker →
            </button>
          </div>

          {/* Animated SVG EKG Pulse Line */}
          <div className="ekg-container" title="Live Vital Monitoring Wave">
            <svg className="ekg-svg" viewBox="0 0 500 40" preserveAspectRatio="none">
              <path
                className="ekg-path"
                d="M0,20 L120,20 L130,10 L140,30 L150,2 L160,38 L170,18 L180,22 L190,20 L320,20 L330,10 L340,30 L350,2 L360,38 L370,18 L380,22 L390,20 L500,20"
              />
            </svg>
          </div>

          <div className="recent-vax-summary">
            {latestDose && (
              <div className="vax-pill-item">
                <div className="vax-info-left">
                  <span className="vax-title">{latestDose.vaccineName}</span>
                  <span className="vax-meta">
                    Administered {latestDose.date} • {latestDose.injectionSite} • Lot #{latestDose.lotNumber}
                  </span>
                </div>
                <span className="badge-subtle" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  Active Observation
                </span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div className="telemetry-stat-box">
                <div className="telemetry-stat-label">Tracked Symptoms</div>
                <div className="telemetry-stat-val" style={{ color: '#F8FAFC' }}>
                  {activeSymptoms.length} Active
                </div>
              </div>

              <div className="telemetry-stat-box">
                <div className="telemetry-stat-label">Recovery Curve</div>
                <div className="telemetry-stat-val" style={{ color: '#34D399' }}>
                  Stable Trend
                </div>
              </div>
            </div>

            <div className="telemetry-note-box">
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
              <span>Expected mild soreness and low-grade fatigue indicate standard active immune response.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Recovery Principles (Clean Dark Glass Grid) */}
      <section className="animate-in stagger-4">
        <div className="section-title-wrap">
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
              Post-Vaccination Recovery Principles
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Evidence-based comfort steps to support your immune system.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="recovery-principle-card">
            <div className="recovery-principle-header" style={{ color: 'var(--teal-primary)' }}>
              <Clock size={16} /> Understanding Reactogenicity
            </div>
            <p className="recovery-principle-desc">
              Mild fever and fatigue signal that your immune system is actively assembling neutralizing antibodies.
            </p>
          </div>

          <div className="recovery-principle-card">
            <div className="recovery-principle-header" style={{ color: 'var(--primary)' }}>
              <Thermometer size={16} /> Cool Compress for Arm
            </div>
            <p className="recovery-principle-desc">
              Apply a clean, cool damp cloth over the injection site for 15 minutes to reduce local tenderness.
            </p>
          </div>

          <div className="recovery-principle-card">
            <div className="recovery-principle-header" style={{ color: '#818CF8' }}>
              <Zap size={16} /> Hydration & Rest
            </div>
            <p className="recovery-principle-desc">
              Drink plenty of fluids and allow your body restful sleep to power your immune synthesis.
            </p>
          </div>

          <div className="recovery-principle-card">
            <div className="recovery-principle-header" style={{ color: '#34D399' }}>
              <CheckCircle2 size={16} /> Clinical Review Triggers
            </div>
            <p className="recovery-principle-desc">
              If redness spreads after 48h or fever exceeds 102.5°F for more than 3 days, reach out to your doctor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
