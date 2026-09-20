import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Calendar,
  Clock,
  Thermometer,
  Trash2,
  CheckCircle2,
  TrendingUp,
  FileWarning,
  ArrowRight,
  Filter,
  Check,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export function SymptomTracker() {
  const {
    symptoms,
    addSymptom,
    updateSymptomStatus,
    deleteSymptom,
    user,
    setCurrentView
  } = useApp();

  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Form inputs
  const [symptomName, setSymptomName] = useState('');
  const [vaccineName, setVaccineName] = useState(
    user.vaccineHistory?.[0]?.vaccineName || 'COVID-19 mRNA (Spikevax Updated)'
  );
  const [severity, setSeverity] = useState(3);
  const [temperature, setTemperature] = useState('98.6');
  const [location, setLocation] = useState('Left Deltoid');
  const [onsetTime, setOnsetTime] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState('12 hours');
  const [notes, setNotes] = useState('');

  const commonPresets = [
    "Arm Soreness & Swelling",
    "Fatigue & Malaise",
    "Mild Headache",
    "Muscle Aches",
    "Chills",
    "Low Fever (<101°F)",
    "Nausea",
    "Axillary Node Swelling"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptomName.trim()) return;

    addSymptom({
      symptomName,
      vaccineName,
      severity: Number(severity),
      temperature: Number(temperature) || 98.6,
      location,
      onsetTime,
      duration,
      notes
    });

    setSymptomName('');
    setNotes('');
    setIsAddingSymptom(false);
  };

  const handleResolve = (id) => {
    updateSymptomStatus(id, 'Resolved');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#06B6D4', '#3B82F6', '#6366F1']
      });
    } catch {
      // Fallback
    }
  };

  const filteredSymptoms = symptoms.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  const activeCount = symptoms.filter(s => s.status === 'Active').length;
  const improvingCount = symptoms.filter(s => s.status === 'Improving').length;
  const resolvedCount = symptoms.filter(s => s.status === 'Resolved').length;
  const peakSeverity = symptoms.reduce((max, s) => Math.max(max, s.severity || 0), 0);

  return (
    <div className="tracker-layout">
      {/* Header */}
      <div className="section-title-wrap animate-in">
        <div>
          <h2>Post-Vaccination Symptom Tracker</h2>
          <p>Monitor your recovery trajectory, record temperatures, and maintain clean logs for your doctor.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsAddingSymptom(!isAddingSymptom)}
        >
          <Plus size={16} />
          {isAddingSymptom ? 'Close Form' : 'Log New Symptom'}
        </button>
      </div>

      {/* Top 4 Metric Cards with Subtle Entrance Animation */}
      <div className="tracker-metrics-grid animate-in stagger-1">
        <div className="metric-card">
          <span className="metric-label">Active Symptoms</span>
          <span className="metric-value" style={{ color: activeCount > 0 ? '#D97706' : '#059669' }}>
            {activeCount}
          </span>
          <span className="metric-hint">
            {activeCount > 0 ? 'Under observation' : 'All clear'}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Improving</span>
          <span className="metric-value" style={{ color: '#0D9488' }}>
            {improvingCount}
          </span>
          <span className="metric-hint">Diminishing</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Resolved</span>
          <span className="metric-value" style={{ color: '#059669' }}>
            {resolvedCount}
          </span>
          <span className="metric-hint">Recovered</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Peak Severity</span>
          <span className="metric-value" style={{ color: peakSeverity >= 7 ? '#E11D48' : '#0284C7' }}>
            {peakSeverity} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ 10</span>
          </span>
          <span className="metric-hint">
            {peakSeverity <= 3 ? 'Mild' : peakSeverity <= 7 ? 'Moderate' : 'Significant'}
          </span>
        </div>
      </div>

      {/* New Symptom Form (Animated Dropdown) */}
      {isAddingSymptom && (
        <div className="panel-card animate-in" style={{ border: '2px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <div style={{ background: '#E0F2FE', padding: '0.45rem', borderRadius: '8px', color: '#0284C7' }}>
              <Plus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Record a New Symptom</h3>
              <p style={{ fontSize: '0.78125rem' }}>Document precise onset, location, and severity rating.</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Quick Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {commonPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSymptomName(preset)}
                  className="prompt-chip"
                  style={{
                    background: symptomName === preset ? '#E0F2FE' : '#FFFFFF',
                    borderColor: symptomName === preset ? 'var(--primary)' : '#CBD5E1'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="symptom-name">
                  Symptom Name *
                </label>
                <input
                  id="symptom-name"
                  type="text"
                  required
                  placeholder="e.g. Arm soreness, mild headache..."
                  value={symptomName}
                  onChange={(e) => setSymptomName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vaccine-ref">
                  Associated Vaccine
                </label>
                <select
                  id="vaccine-ref"
                  className="form-control"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                >
                  {user.vaccineHistory?.map(v => (
                    <option key={v.id} value={v.vaccineName}>
                      {v.vaccineName} ({v.date})
                    </option>
                  )) || <option value="COVID-19 mRNA">COVID-19 mRNA</option>}
                </select>
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="symptom-location">
                  Body Location
                </label>
                <input
                  id="symptom-location"
                  type="text"
                  placeholder="e.g. Left Deltoid, Forehead"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="symptom-temp">
                  Temperature (°F)
                </label>
                <input
                  id="symptom-temp"
                  type="number"
                  step="0.1"
                  min="95.0"
                  max="108.0"
                  placeholder="98.6"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="symptom-onset">
                  Onset Date & Time
                </label>
                <input
                  id="symptom-onset"
                  type="datetime-local"
                  value={onsetTime}
                  onChange={(e) => setOnsetTime(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="symptom-duration">
                  Duration
                </label>
                <input
                  id="symptom-duration"
                  type="text"
                  placeholder="e.g. 18 hours, 2 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="slider-container">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">
                  Severity: <strong>{severity} / 10</strong>
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: severity <= 3 ? '#10B981' : severity <= 7 ? '#D97706' : '#EF4444' }}>
                  {severity <= 3 ? 'Mild' : severity <= 7 ? 'Moderate' : 'Severe'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="severity-slider"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="symptom-notes">
                Notes & Comfort Measures
              </label>
              <textarea
                id="symptom-notes"
                rows={2}
                placeholder="e.g. Applied cool compress, took acetaminophen with relief."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsAddingSymptom(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save to Timeline
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Columns: Timeline + Visual Severity Chart */}
      <div className="tracker-content-columns">
        {/* Left: Timeline Feed */}
        <div className="timeline-card-feed animate-in stagger-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem' }}>Progression Timeline</h3>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={13} color="#64748B" />
              {['ALL', 'Active', 'Improving', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: filterStatus === st ? 'var(--slate-800)' : '#F1F5F9',
                    color: filterStatus === st ? '#FFFFFF' : '#475569',
                    border: 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredSymptoms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--slate-50)', borderRadius: '12px' }}>
              <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto 0.5rem auto' }} />
              <h4 style={{ fontSize: '1rem', color: '#0F172A' }}>No symptoms in this category</h4>
              <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                All logged items are organized above. Click "Log New Symptom" to add an entry.
              </p>
            </div>
          ) : (
            <div className="timeline-items-wrapper">
              {filteredSymptoms.map((sym) => {
                const isSevHigh = sym.severity >= 8;
                const isSevMod = sym.severity >= 4 && sym.severity < 8;
                const sevClass = isSevHigh ? 'badge-sev-high' : isSevMod ? 'badge-sev-mod' : 'badge-sev-mild';

                return (
                  <div key={sym.id} className="timeline-entry">
                    <div className="timeline-node"></div>
                    <div className="timeline-entry-body">
                      <div className="entry-header">
                        <span className="entry-title">{sym.symptomName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            className="badge-subtle"
                            style={{
                              background: sym.status === 'Resolved' ? '#DCFCE7' : sym.status === 'Improving' ? '#CCFBF1' : '#FEF3C7',
                              color: sym.status === 'Resolved' ? '#15803D' : sym.status === 'Improving' ? '#0F766E' : '#B45309',
                              fontWeight: 700
                            }}
                          >
                            {sym.status}
                          </span>
                          <button
                            onClick={() => deleteSymptom(sym.id)}
                            style={{ color: '#94A3B8' }}
                            title="Delete entry"
                            aria-label="Delete symptom"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="entry-badges-row">
                        <span className={`badge-severity ${sevClass}`}>
                          Severity: {sym.severity} / 10
                        </span>
                        {sym.temperature && (
                          <span className="badge-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Thermometer size={12} /> {sym.temperature}°F
                          </span>
                        )}
                        <span className="badge-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Clock size={12} /> {sym.duration}
                        </span>
                        <span className="badge-subtle">
                          {sym.location}
                        </span>
                      </div>

                      {sym.notes && (
                        <p className="entry-notes">
                          "{sym.notes}"
                        </p>
                      )}

                      <div className="entry-actions">
                        <span style={{ fontSize: '0.71875rem', color: '#64748B' }}>
                          Vaccine: <strong>{sym.vaccineName}</strong>
                        </span>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {sym.status !== 'Improving' && sym.status !== 'Resolved' && (
                            <button
                              onClick={() => updateSymptomStatus(sym.id, 'Improving')}
                              style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--teal-primary)', padding: '0.2rem 0.5rem', background: '#CCFBF1', borderRadius: '4px' }}
                            >
                              Mark Improving
                            </button>
                          )}
                          {sym.status !== 'Resolved' && (
                            <button
                              onClick={() => handleResolve(sym.id)}
                              style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', padding: '0.2rem 0.55rem', background: '#DCFCE7', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              <Check size={12} /> Mark Resolved 🎉
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Visual Recovery Chart & Quick AEFI Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Recovery Curve Visualizer */}
          <div className="panel-card animate-in stagger-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '1.0625rem' }}>Visual Severity Analysis</h4>
            </div>

            <div style={{ background: '#F8FAFD', borderRadius: '10px', padding: '1rem', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Discomfort Distribution
              </div>

              {symptoms.map(s => {
                const percent = Math.min(100, (s.severity / 10) * 100);
                const barColor = s.severity <= 3 ? '#10B981' : s.severity <= 7 ? '#F59E0B' : '#EF4444';

                return (
                  <div key={s.id} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{s.symptomName.slice(0, 22)}...</span>
                      <span style={{ fontWeight: 700, color: barColor }}>{s.severity}/10</span>
                    </div>
                    <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percent}%`,
                          background: barColor,
                          borderRadius: '4px',
                          transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#10B981" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: '#15803D', margin: 0 }}>
                Mild soreness peaks within 24 hours and resolves steadily within 48 to 72 hours.
              </p>
            </div>
          </div>

          {/* Quick Action: Transfer data to Adverse Event Report */}
          <div className="panel-card animate-in stagger-4" style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)', borderColor: '#FECDD3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#9F1239' }}>
              <FileWarning size={18} />
              <h4 style={{ fontSize: '1rem' }}>Suspect an Adverse Event?</h4>
            </div>
            <p style={{ fontSize: '0.78125rem', color: '#475569', marginBottom: '0.85rem' }}>
              If your symptoms were severe or unexpected, transfer these records directly into a formal AEFI report.
            </p>
            <button
              className="btn-primary"
              style={{ width: '100%', background: '#E11D48', color: '#FFFFFF', justifyContent: 'center', fontSize: '0.8125rem' }}
              onClick={() => setCurrentView('report')}
            >
              Transfer to AEFI Form <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
