import React from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function PrivacyConsentModal() {
  const {
    isConsentModalOpen,
    setIsConsentModalOpen,
    user,
    symptoms,
    reports,
    consultations,
    resetAllData,
    showToast
  } = useApp();

  if (!isConsentModalOpen) return null;

  const handleExportAllData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      user,
      symptoms,
      reports,
      consultations,
      platform: "VaxCare Guard Health Vigilance"
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaxcare-health-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Full personal health archive exported.", "success");
  };

  return (
    <div className="modal-overlay" onClick={() => setIsConsentModalOpen(false)}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#CCFBF1', padding: '0.5rem', borderRadius: '50%', color: '#0D9488' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Privacy, Consent & Medical Safety Standards</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                How your clinical data is handled, encrypted, and protected
              </p>
            </div>
          </div>

          <button onClick={() => setIsConsentModalOpen(false)} style={{ color: '#64748B' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Non-definitive diagnosis statement */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9375rem', color: '#1E40AF', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={16} /> Non-Diagnostic & Non-Causality Safety Charter
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#1E3A8A', lineHeight: 1.5 }}>
              VaxCare Guard is structured under strict digital health guidelines:
              <br />
              • <strong>No definitive diagnoses:</strong> AI triage assessments calculate statistical likelihoods and reactogenicity bands, not formal clinical diagnoses.
              <br />
              • <strong>Causality determination:</strong> Post-vaccination symptom reports represent *temporally associated* observations. Proving true vaccine causality requires formal clinical evaluation by medical toxicologists or adverse event review committees.
            </p>
          </div>

          {/* Privacy Principles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.84375rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Client-Side Health Privacy:</strong> All logged symptoms and AEFI drafts are stored in your secure device storage, giving you 100% data sovereignty.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Explicit Consent for Sharing:</strong> Health summaries are only transmitted to doctors when you explicitly click "Share with Physician" or during a telehealth consultation.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>HIPAA & GDPR Best Practices:</strong> Structured reports follow standardized clinical schemas with unique verification identifiers to protect identity.</span>
            </div>
          </div>

          {/* User Data Ownership & Export */}
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.5rem' }}>
              Your Data Controls & Portability
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.8125rem' }}
                onClick={handleExportAllData}
              >
                <Download size={14} /> Export My Complete Health Record (JSON)
              </button>

              <button
                className="btn-outline-danger"
                style={{ fontSize: '0.8125rem' }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all symptoms, reports, and profile records?")) {
                    resetAllData();
                    setIsConsentModalOpen(false);
                  }
                }}
              >
                <Trash2 size={14} /> Clear Local Health Data
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={() => setIsConsentModalOpen(false)}>
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
