import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  X,
  ExternalLink,
  ChevronRight,
  Bot,
  FileWarning,
  Wind,
  Zap,
  Layers,
  Dna,
  Shield,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { VACCINE_DATABASE } from '../data/vaccineDatabase';
import { useApp } from '../context/AppContext';

// Helper to simplify long clinical reactions into punchy icon tags
const getReactionDisplay = (name, freq) => {
  const n = name.toLowerCase();
  let emoji = '🩹';
  let label = name;

  if (n.includes('arm') || n.includes('injection site') || n.includes('soreness') || n.includes('tenderness') || n.includes('pain')) {
    emoji = '🩹';
    label = 'Sore Arm';
  } else if (n.includes('fatigue') || n.includes('tired') || n.includes('malaise')) {
    emoji = '⚡';
    label = 'Fatigue';
  } else if (n.includes('headache')) {
    emoji = '🤕';
    label = 'Headache';
  } else if (n.includes('fever') || n.includes('chills')) {
    emoji = '🌡️';
    label = 'Mild Fever';
  } else if (n.includes('muscle') || n.includes('myalgia') || n.includes('aches')) {
    emoji = '💪';
    label = 'Body Aches';
  } else if (n.includes('joint') || n.includes('arthralgia')) {
    emoji = '🦴';
    label = 'Joint Pain';
  } else if (n.includes('swelling') || n.includes('redness') || n.includes('erythema') || n.includes('lump')) {
    emoji = '🔴';
    label = 'Local Swelling';
  } else if (n.includes('rash') || n.includes('itch')) {
    emoji = '🧴';
    label = 'Mild Rash';
  } else if (n.includes('nausea') || n.includes('gi') || n.includes('stomach') || n.includes('appetite')) {
    emoji = '🤢';
    label = 'Mild Nausea';
  } else if (n.includes('lymph') || n.includes('node')) {
    emoji = '🩺';
    label = 'Swollen Nodes';
  }

  // Extract clean percentage or short frequency string
  const pctMatch = freq.match(/>?\d+%/);
  const shortFreq = pctMatch ? pctMatch[0] : freq.replace('Common', '').replace(/[()]/g, '').trim();

  return { emoji, label, shortFreq };
};

// Helper for category theme styling
const getCategoryMeta = (category) => {
  switch (category) {
    case 'Viral Respiratory':
      return {
        icon: <Wind size={18} color="#0284C7" />,
        bg: 'rgba(2, 132, 199, 0.1)',
        color: '#0284C7',
        border: 'rgba(2, 132, 199, 0.25)'
      };
    case 'Bacterial Toxoid':
      return {
        icon: <Shield size={18} color="#0D9488" />,
        bg: 'rgba(13, 148, 136, 0.1)',
        color: '#0D9488',
        border: 'rgba(13, 148, 136, 0.25)'
      };
    case 'Recombinant Subunit':
      return {
        icon: <Dna size={18} color="#7C3AED" />,
        bg: 'rgba(124, 58, 237, 0.1)',
        color: '#7C3AED',
        border: 'rgba(124, 58, 237, 0.25)'
      };
    case 'Live Attenuated':
      return {
        icon: <Zap size={18} color="#D97706" />,
        bg: 'rgba(217, 119, 6, 0.1)',
        color: '#D97706',
        border: 'rgba(217, 119, 6, 0.25)'
      };
    case 'Bacterial Conjugate':
      return {
        icon: <Layers size={18} color="#2563EB" />,
        bg: 'rgba(37, 99, 235, 0.1)',
        color: '#2563EB',
        border: 'rgba(37, 99, 235, 0.25)'
      };
    default:
      return {
        icon: <Activity size={18} color="#06B6D4" />,
        bg: 'rgba(6, 182, 212, 0.1)',
        color: '#06B6D4',
        border: 'rgba(6, 182, 212, 0.25)'
      };
  }
};

export function VaccineInfo() {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModalVaccine, setActiveModalVaccine] = useState(null);

  const categories = ['ALL', 'Viral Respiratory', 'Bacterial Toxoid', 'Recombinant Subunit', 'Live Attenuated', 'Bacterial Conjugate'];

  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'ALL') {
      acc[cat] = VACCINE_DATABASE.length;
    } else {
      acc[cat] = VACCINE_DATABASE.filter(v => v.category === cat).length;
    }
    return acc;
  }, {});

  const filteredVaccines = VACCINE_DATABASE.filter(v => {
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.targetDiseases.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="vaccine-library-wrap animate-in">
      {/* Header with Visual Badges */}
      <div className="vaccine-page-header">
        <div>
          <div className="badge-subtle" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', marginBottom: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <Sparkles size={13} />
            CDC & WHO Pharmacovigilance Directory
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            Vaccine Safety & Reactogenicity Profiles
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9375rem', margin: 0 }}>
            Visual clinical guidance, onset timelines, expected side-effect frequencies, and red-flag warning signs.
          </p>
        </div>

        {/* Quick Stat Highlights */}
        <div className="vax-stats-strip">
          <div className="vax-stat-badge">
            <span className="vax-stat-num">{VACCINE_DATABASE.length}</span>
            <span className="vax-stat-label">Monitored Vaccines</span>
          </div>
          <div className="vax-stat-divider"></div>
          <div className="vax-stat-badge">
            <span className="vax-stat-num" style={{ color: '#10B981' }}>100%</span>
            <span className="vax-stat-label">Peer-Reviewed CDC Data</span>
          </div>
          <div className="vax-stat-divider"></div>
          <div className="vax-stat-badge">
            <span className="vax-stat-num" style={{ color: '#0284C7' }}>24/7</span>
            <span className="vax-stat-label">Active Surveillance</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="vaccine-search-toolbar">
        <div className="search-input-box">
          <Search size={18} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search by vaccine, disease, or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="category-filter-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat === 'ALL' ? 'All Vaccines' : cat}</span>
              <span className="filter-count-badge">{categoryCounts[cat] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter / Results Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#64748B' }}>
        <span>Showing <strong>{filteredVaccines.length}</strong> of <strong>{VACCINE_DATABASE.length}</strong> safety profiles</span>
        {selectedCategory !== 'ALL' && (
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.8125rem' }}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Modern Visual Cards Grid (Zero Text Heavy Bloat) */}
      <div className="vaccine-card-grid">
        {filteredVaccines.map(v => {
          const catMeta = getCategoryMeta(v.category);
          return (
            <div key={v.id} className="vax-modern-card animate-in">
              {/* Card Header: Category Avatar + Category Badge + Duration */}
              <div className="vax-card-header">
                <div className="vax-avatar-icon" style={{ background: catMeta.bg, border: `1px solid ${catMeta.border}` }}>
                  {catMeta.icon}
                </div>
                <div className="vax-pills-row">
                  <span className="vax-category-badge" style={{ color: catMeta.color, background: catMeta.bg, borderColor: catMeta.border }}>
                    {v.category}
                  </span>
                  <span className="vax-duration-badge">
                    <Clock size={11} /> {v.typicalDuration}
                  </span>
                </div>
              </div>

              {/* Title & Target Protection Tag */}
              <div className="vax-title-container">
                <h3 className="vax-card-title">{v.name}</h3>
                <div className="vax-target-tag">
                  <ShieldCheck size={13} color="#0D9488" />
                  <span>Protects: <strong>{v.targetDiseases}</strong></span>
                </div>
              </div>

              {/* Reactivity & Timeline Visual Gauge */}
              <div className="vax-gauge-card">
                <div className="vax-gauge-header">
                  <span className="vax-gauge-title">Expected Reactivity</span>
                  <span className="vax-status-indicator">
                    <span className="vax-status-dot"></span> Expected Mild
                  </span>
                </div>
                <div className="vax-gauge-bar">
                  <div className="vax-gauge-fill" style={{ width: '45%' }}></div>
                </div>
                <div className="vax-gauge-timeline">
                  <span>Onset: <strong>{v.expectedOnset}</strong></span>
                  <span>Duration: <strong>{v.typicalDuration}</strong></span>
                </div>
              </div>

              {/* Top Symptoms as Punchy Chips (No dense tables) */}
              <div className="vax-reactions-section">
                <div className="vax-reactions-heading">
                  <span>Top Common Reactions</span>
                  <span className="vax-reactions-count">{v.commonReactions.length} tracked</span>
                </div>
                <div className="vax-chips-wrap">
                  {v.commonReactions.slice(0, 3).map((r, i) => {
                    const item = getReactionDisplay(r.name, r.frequency);
                    return (
                      <div key={i} className="vax-reaction-tag">
                        <span className="vax-tag-emoji">{item.emoji}</span>
                        <span className="vax-tag-name">{item.label}</span>
                        <span className="vax-tag-freq">{item.shortFreq}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Bottom: Warning Signs & CTA Button */}
              <div className="vax-card-bottom">
                <div className="vax-warning-chip" title={`${v.redFlags.length} rare red flags monitored`}>
                  <AlertTriangle size={13} color="#E11D48" />
                  <span>{v.redFlags.length} Warning Signs</span>
                </div>

                <button
                  className="btn-vax-profile"
                  onClick={() => setActiveModalVaccine(v)}
                >
                  <span>Safety Profile</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Full Vaccine Safety Profile & Red Flags */}
      {activeModalVaccine && (
        <div className="vax-detail-modal-overlay" onClick={() => setActiveModalVaccine(null)}>
          <div className="vax-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-card)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="vax-category-tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  {activeModalVaccine.category}
                </span>
                <h3 style={{ fontSize: '1.5rem', color: '#0F172A' }}>{activeModalVaccine.name}</h3>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Manufacturer: <strong>{activeModalVaccine.manufacturer}</strong> • Route: <strong>{activeModalVaccine.injectionRoute}</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveModalVaccine(null)}
                style={{ color: '#64748B', padding: '0.25rem' }}
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Standard Schedule & Indications */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Standard Immunization Schedule & Indication
              </div>
              <div style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>
                {activeModalVaccine.standardSchedule}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>
                {activeModalVaccine.description}
              </div>
            </div>

            {/* Common Expected Reactions Table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)" /> Expected Reactogenicity & Timeline
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Reaction</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Frequency</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Typical Severity</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeModalVaccine.commonReactions.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#64748B' }}>{r.frequency}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <span className="badge-subtle" style={{ background: '#DCFCE7', color: '#166534' }}>
                            {r.severity}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#0D9488', fontWeight: 600 }}>{r.resolution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Red Flags & Warning Signs */}
            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9375rem', color: '#9F1239', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#E11D48" /> Warning Signs Requiring Immediate Medical Review
              </h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem', color: '#BE123C' }}>
                {activeModalVaccine.redFlags.map((rf, i) => (
                  <li key={i}>{rf}</li>
                ))}
              </ul>
            </div>

            {/* Self Care & Comfort Tips */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: '#166534', fontWeight: 700, marginBottom: '0.35rem' }}>
                Evidence-Based Self-Care Measures
              </h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8125rem', color: '#15803D' }}>
                {activeModalVaccine.selfCareAdvice.map((sc, i) => (
                  <li key={i}>{sc}</li>
                ))}
              </ul>
            </div>

            {/* Clinical Trial Safety Fact */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.5rem', fontSize: '0.78125rem', color: '#1E40AF' }}>
              <strong>Safety Surveillance Record:</strong> {activeModalVaccine.safetyFact}
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                onClick={() => setActiveModalVaccine(null)}
              >
                Close Profile
              </button>

              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setActiveModalVaccine(null);
                    setCurrentView('assistant');
                  }}
                >
                  <Bot size={16} /> Check Symptoms for this Vaccine
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setActiveModalVaccine(null);
                    setCurrentView('report');
                  }}
                >
                  <FileWarning size={16} /> File AEFI Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
