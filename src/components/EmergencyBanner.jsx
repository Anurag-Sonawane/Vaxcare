import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, X, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function EmergencyBanner() {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen } = useApp();

  return (
    <>
      {/* Top red emergency banner removed per user request */}
      {isEmergencyModalOpen && <EmergencyModal onClose={() => setIsEmergencyModalOpen(false)} />}
    </>
  );
}

export function EmergencyModal({ onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card modal-card-emergency" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header emergency">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#FFE4E6', padding: '0.5rem', borderRadius: '50%', color: '#E11D48' }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <h3 style={{ color: '#9F1239', fontSize: '1.2rem', margin: 0 }}>Immediate Emergency Assistance</h3>
              <p style={{ fontSize: '0.8125rem', color: '#BE123C', margin: '0.15rem 0 0 0' }}>
                Seek urgent emergency medical care for acute or life-threatening symptoms
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#9F1239', padding: '0.25rem' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="emergency-hotline-card">
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9F1239', textTransform: 'uppercase' }}>
                Primary Emergency Dispatch
              </div>
              <div style={{ fontSize: '0.84375rem', color: '#475569' }}>
                United States & Canada (Ambulance / Fire / Police)
              </div>
            </div>
            <a href="tel:911" className="hotline-number">
              911
            </a>
          </div>

          <div className="emergency-hotline-card" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase' }}>
                International Hotlines
              </div>
              <div style={{ fontSize: '0.84375rem', color: '#64748B' }}>
                European Union & India: <strong>112</strong> | United Kingdom: <strong>999</strong>
              </div>
            </div>
            <a href="tel:112" className="hotline-number" style={{ color: '#0284C7' }}>
              112
            </a>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9375rem', color: '#0F172A', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="#E11D48" />
              Signs Requiring Immediate 911 / ER Response
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
              <li><strong>Anaphylaxis:</strong> Swelling of the lips, tongue, uvula, or throat causing stridor or wheezing.</li>
              <li><strong>Respiratory Distress:</strong> Inability to speak in full sentences, gasping, or blue-tinted lips/fingers.</li>
              <li><strong>Cardiovascular:</strong> Crushing chest tightness, acute pressure radiating to arm or jaw, or irregular racing heart.</li>
              <li><strong>Neurological:</strong> Sudden collapse, loss of consciousness, persistent seizure, or sudden severe confusion.</li>
              <li><strong>Extreme Hyperpyrexia:</strong> High fever spiking over 104°F (40°C) unresponsive to fever-reducers.</li>
            </ul>
          </div>

          <div style={{ marginTop: '1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '0.875rem' }}>
            <h5 style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} /> While Waiting for Emergency Responders:
            </h5>
            <p style={{ fontSize: '0.78125rem', color: '#15803D', lineHeight: 1.5, margin: 0 }}>
              1. Administer a prescribed Epinephrine auto-injector (EpiPen) if available.<br />
              2. Lie flat with your legs elevated, unless breathing is difficult (in which case sit upright).<br />
              3. Do not stand or walk suddenly.<br />
              4. Have your vaccination card or lot number ready for paramedics.
            </p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h5 style={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={16} color="#0D9488" /> Closest 24/7 Emergency Facilities (Simulated Local Area)
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div>
                  <strong>City General Hospital Emergency Department</strong>
                  <div style={{ color: '#64748B' }}>1.8 miles away • Open 24 Hours • Level 1 Trauma</div>
                </div>
                <a href="tel:911" style={{ fontWeight: 700, color: '#0284C7', textDecoration: 'none' }}>Call ER</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div>
                  <strong>Memorial Health Urgent Care & Emergency</strong>
                  <div style={{ color: '#64748B' }}>3.2 miles away • Wait time: ~12 mins</div>
                </div>
                <a href="tel:911" style={{ fontWeight: 700, color: '#0284C7', textDecoration: 'none' }}>Call Clinic</a>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <a href="tel:911" className="btn-primary" style={{ background: '#E11D48', color: '#FFFFFF', textDecoration: 'none' }}>
            <PhoneCall size={16} /> Dial Emergency 911 Now
          </a>
        </div>
      </div>
    </div>
  );
}
