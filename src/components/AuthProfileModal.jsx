import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Plus,
  Trash2,
  Calendar,
  Building,
  Heart,
  AlertCircle,
  X,
  CheckCircle2,
  LogOut,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VACCINE_DATABASE } from '../data/vaccineDatabase';

export function AuthProfileModal() {
  const {
    user,
    updateUserProfile,
    addVaccineDose,
    isAuthModalOpen,
    setIsAuthModalOpen,
    resetAllData,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'doses', 'auth'

  // Editable Profile State
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    dob: user.dob || '',
    age: user.age || 34,
    gender: user.gender || 'Female',
    bloodGroup: user.bloodGroup || 'A+',
    allergies: (user.allergies || []).join(', '),
    chronicConditions: (user.chronicConditions || []).join(', ')
  });

  // New Dose Form
  const [newDose, setNewDose] = useState({
    vaccineName: 'COVID-19 mRNA (Spikevax Updated)',
    manufacturer: 'Moderna',
    dose: 'Booster Dose',
    date: new Date().toISOString().split('T')[0],
    lotNumber: 'SPK-9042A',
    facility: 'Metro Community Health Pavilion',
    injectionSite: 'Left Deltoid'
  });

  if (!isAuthModalOpen) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      ...profileData,
      allergies: profileData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: profileData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsAuthModalOpen(false);
  };

  const handleAddDoseSubmit = (e) => {
    e.preventDefault();
    addVaccineDose(newDose);
    setActiveTab('doses');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#E0F2FE', padding: '0.5rem', borderRadius: '50%', color: '#0284C7' }}>
              <User size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>User Health Profile & Immunization History</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                Secure patient record used to personalize AI triage and clinical reports
              </p>
            </div>
          </div>

          <button onClick={() => setIsAuthModalOpen(false)} style={{ color: '#64748B' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-card)', background: 'var(--slate-50)', padding: '0.5rem 1.75rem', gap: '0.5rem' }}>
          <button
            className={`prompt-chip ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ background: activeTab === 'profile' ? '#0F172A' : '#FFFFFF', color: activeTab === 'profile' ? '#FFFFFF' : '#475569' }}
            onClick={() => setActiveTab('profile')}
          >
            Personal Health Profile
          </button>
          <button
            className={`prompt-chip ${activeTab === 'doses' ? 'active' : ''}`}
            style={{ background: activeTab === 'doses' ? '#0F172A' : '#FFFFFF', color: activeTab === 'doses' ? '#FFFFFF' : '#475569' }}
            onClick={() => setActiveTab('doses')}
          >
            Vaccination History ({user.vaccineHistory?.length || 0})
          </button>
          <button
            className={`prompt-chip ${activeTab === 'add-dose' ? 'active' : ''}`}
            style={{ background: activeTab === 'add-dose' ? '#0F172A' : '#FFFFFF', color: activeTab === 'add-dose' ? '#FFFFFF' : '#475569' }}
            onClick={() => setActiveTab('add-dose')}
          >
            + Add New Dose
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Tab 1: Profile Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-name">Full Name</label>
                  <input
                    id="prof-name"
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData(p => ({ ...p, name: e.target.value }))}
                    className="form-control"
                  />
                </div>

                <div className="form-grid-2col" style={{ gap: '0.75rem', margin: 0 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prof-age">Age</label>
                    <input
                      id="prof-age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData(p => ({ ...p, age: e.target.value }))}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prof-blood">Blood Group</label>
                    <input
                      id="prof-blood"
                      type="text"
                      value={profileData.bloodGroup}
                      onChange={(e) => setProfileData(p => ({ ...p, bloodGroup: e.target.value }))}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-email">Email Address</label>
                  <input
                    id="prof-email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prof-phone">Phone Number</label>
                  <input
                    id="prof-phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(p => ({ ...p, phone: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" htmlFor="prof-allergies">
                  Known Allergies (comma separated)
                </label>
                <input
                  id="prof-allergies"
                  type="text"
                  placeholder="e.g. Penicillin, Latex, Eggs, Tree nuts"
                  value={profileData.allergies}
                  onChange={(e) => setProfileData(p => ({ ...p, allergies: e.target.value }))}
                  className="form-control"
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Helps AI detect potential allergic cross-reactivity</span>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="prof-conditions">
                  Chronic Illnesses or Pre-Existing Conditions (comma separated)
                </label>
                <input
                  id="prof-conditions"
                  type="text"
                  placeholder="e.g. Asthma, Hypertension, Diabetes, Autoimmune condition"
                  value={profileData.chronicConditions}
                  onChange={(e) => setProfileData(p => ({ ...p, chronicConditions: e.target.value }))}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={resetAllData}
                  style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'underline' }}
                >
                  Reset Demo Health Records
                </button>
                <button type="submit" className="btn-primary">
                  Save Health Profile
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Vaccination History List */}
          {activeTab === 'doses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0F172A' }}>Official Recorded Doses</h4>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.78125rem', padding: '0.3rem 0.65rem' }}
                  onClick={() => setActiveTab('add-dose')}
                >
                  <Plus size={14} /> Record Another Dose
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {user.vaccineHistory && user.vaccineHistory.map(dose => (
                  <div
                    key={dose.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A' }}>
                        {dose.vaccineName}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Dose: <strong>{dose.dose}</strong> • Date: <strong>{dose.date}</strong> • Site: {dose.injectionSite}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
                        Lot #{dose.lotNumber} • {dose.facility}
                      </div>
                    </div>
                    <span className="badge-subtle" style={{ background: '#DCFCE7', color: '#166534', fontWeight: 700 }}>
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Add New Dose Form */}
          {activeTab === 'add-dose' && (
            <form onSubmit={handleAddDoseSubmit}>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Vaccine Received *</label>
                  <select
                    className="form-control"
                    value={newDose.vaccineName}
                    onChange={(e) => {
                      const v = VACCINE_DATABASE.find(item => item.name === e.target.value);
                      setNewDose(prev => ({
                        ...prev,
                        vaccineName: e.target.value,
                        manufacturer: v ? v.manufacturer.split('/')[0].trim() : prev.manufacturer
                      }));
                    }}
                  >
                    {VACCINE_DATABASE.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Dose Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dose 1, Booster, Annual Flu Shot"
                    value={newDose.dose}
                    onChange={(e) => setNewDose(p => ({ ...p, dose: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Date Administered *</label>
                  <input
                    type="date"
                    required
                    value={newDose.date}
                    onChange={(e) => setNewDose(p => ({ ...p, date: e.target.value }))}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lot / Batch Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPK-9042A (From immunization card)"
                    value={newDose.lotNumber}
                    onChange={(e) => setNewDose(p => ({ ...p, lotNumber: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Injection Site</label>
                  <select
                    className="form-control"
                    value={newDose.injectionSite}
                    onChange={(e) => setNewDose(p => ({ ...p, injectionSite: e.target.value }))}
                  >
                    <option value="Left Deltoid">Left Deltoid (Upper Arm)</option>
                    <option value="Right Deltoid">Right Deltoid (Upper Arm)</option>
                    <option value="Left Thigh">Left Thigh</option>
                    <option value="Right Thigh">Right Thigh</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Administering Clinic / Pharmacy</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Community Health Center"
                    value={newDose.facility}
                    onChange={(e) => setNewDose(p => ({ ...p, facility: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab('doses')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vaccine Dose
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
