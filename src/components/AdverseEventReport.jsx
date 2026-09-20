import React, { useState } from 'react';
import {
  FileWarning,
  CheckCircle2,
  Download,
  Share2,
  Printer,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building,
  User,
  Activity,
  AlertTriangle,
  Stethoscope,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VACCINE_DATABASE } from '../data/vaccineDatabase';

export function AdverseEventReport() {
  const {
    user,
    reports,
    addReport,
    setCurrentView,
    showToast
  } = useApp();

  const [activeStep, setActiveStep] = useState(1);
  const [selectedReportForView, setSelectedReportForView] = useState(reports[0] || null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State initialized with realistic user context
  const [formData, setFormData] = useState({
    reporterType: "Patient / Self",
    reporterName: user.name || "Sarah Jenkins",
    reporterEmail: user.email || "sarah.jenkins@example.com",
    reporterPhone: user.phone || "+1 (555) 349-2180",
    patientName: user.name || "Sarah Jenkins",
    patientAge: user.age || 34,
    patientGender: user.gender || "Female",
    vaccineName: user.vaccineHistory?.[0]?.vaccineName || "COVID-19 mRNA (Spikevax Updated)",
    manufacturer: user.vaccineHistory?.[0]?.manufacturer || "Moderna",
    lotNumber: user.vaccineHistory?.[0]?.lotNumber || "SPK-9042A",
    vaccinationDate: user.vaccineHistory?.[0]?.date || "2026-09-18",
    injectionSite: user.vaccineHistory?.[0]?.injectionSite || "Left Deltoid",
    facility: user.vaccineHistory?.[0]?.facility || "Metro Community Health Pavilion",
    onsetInterval: "18 to 24 hours",
    symptomsObserved: "Pronounced arm soreness, fatigue, low fever (99.8°F), mild headache",
    highestSeverity: "Moderate",
    hospitalized: "No",
    erVisit: "No",
    lifeThreatening: "No",
    currentStatus: "Improving with home care",
    medicalNotes: (user.allergies || []).join(', ') + ". Pre-existing: " + (user.chronicConditions || []).join(', '),
    physicianFollowUp: "Dr. Elena Vance, MD"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep < 4) {
      setActiveStep(prev => prev + 1);
    } else {
      // Submit
      const newReport = addReport({
        ...formData,
        primarySymptoms: formData.symptomsObserved.split(',').map(s => s.trim())
      });
      setSelectedReportForView(newReport);
      setActiveStep(5); // View created report
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareSummary = () => {
    if (!selectedReportForView) return;
    const summary = `VAXCARE GUARD AEFI REPORT
ID: ${selectedReportForView.id}
Date: ${selectedReportForView.reportDate}
Patient: ${selectedReportForView.patientName} (Age: ${selectedReportForView.patientAge})
Vaccine: ${selectedReportForView.vaccineName} (Lot #${selectedReportForView.lotNumber})
Onset: ${selectedReportForView.onsetInterval}
Symptoms: ${Array.isArray(selectedReportForView.primarySymptoms) ? selectedReportForView.primarySymptoms.join(', ') : selectedReportForView.symptomsObserved}
Hospitalization: ${selectedReportForView.hospitalized} | ER Visit: ${selectedReportForView.erVisit}
Status: ${selectedReportForView.currentStatus}
Verification: ${selectedReportForView.verificationHash}`;

    navigator.clipboard.writeText(summary);
    setCopiedLink(true);
    showToast("Clinical summary copied to clipboard!", "success");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="aefi-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Adverse Event Following Immunization (AEFI)</h2>
          <p>Standardized clinical reporting aligned with CDC/FDA VAERS and WHO Pharmacovigilance criteria.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          {activeStep === 5 ? (
            <button
              className="btn-secondary"
              onClick={() => setActiveStep(1)}
            >
              File Another Report
            </button>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => setActiveStep(5)}
              disabled={!selectedReportForView}
            >
              View Recent Archived Report ({reports.length})
            </button>
          )}
        </div>
      </div>

      {/* Wizard Card (Steps 1-4) */}
      {activeStep <= 4 && (
        <div className="aefi-wizard-card">
          {/* Step Progress Bar */}
          <div className="wizard-steps-nav">
            <div className={`step-item-btn ${activeStep === 1 ? 'active' : activeStep > 1 ? 'completed' : ''}`}>
              <div className="step-number-circle">1</div>
              <span className="step-label-text">Reporter & Patient</span>
            </div>
            <div className={`step-item-btn ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}`}>
              <div className="step-number-circle">2</div>
              <span className="step-label-text">Vaccine Details</span>
            </div>
            <div className={`step-item-btn ${activeStep === 3 ? 'active' : activeStep > 3 ? 'completed' : ''}`}>
              <div className="step-number-circle">3</div>
              <span className="step-label-text">Adverse Symptoms</span>
            </div>
            <div className={`step-item-btn ${activeStep === 4 ? 'active' : ''}`}>
              <div className="step-number-circle">4</div>
              <span className="step-label-text">Medical History & Submit</span>
            </div>
          </div>

          <form onSubmit={handleNext}>
            {/* Step 1: Reporter & Patient Info */}
            {activeStep === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <User size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1875rem' }}>Step 1: Patient and Reporter Demographics</h3>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reporterType">Reporter Category</label>
                    <select
                      id="reporterType"
                      name="reporterType"
                      value={formData.reporterType}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Patient / Self">Patient / Self (Vaccine Recipient)</option>
                      <option value="Parent / Legal Guardian">Parent / Legal Guardian</option>
                      <option value="Healthcare Provider">Healthcare Provider / Nurse / Physician</option>
                      <option value="Other Proxy">Other Proxy / Relative</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="patientName">Patient Full Legal Name *</label>
                    <input
                      id="patientName"
                      name="patientName"
                      type="text"
                      required
                      value={formData.patientName}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="patientAge">Patient Age *</label>
                    <input
                      id="patientAge"
                      name="patientAge"
                      type="number"
                      min="0"
                      max="125"
                      required
                      value={formData.patientAge}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="patientGender">Biological Sex</label>
                    <select
                      id="patientGender"
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other / Non-disclosed">Other / Non-disclosed</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reporterEmail">Contact Email</label>
                    <input
                      id="reporterEmail"
                      name="reporterEmail"
                      type="email"
                      value={formData.reporterEmail}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reporterPhone">Contact Phone Number</label>
                    <input
                      id="reporterPhone"
                      name="reporterPhone"
                      type="tel"
                      value={formData.reporterPhone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vaccine & Administration */}
            {activeStep === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Building size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1875rem' }}>Step 2: Vaccine & Administration Data</h3>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="vaccineName">Vaccine Brand & Type *</label>
                    <select
                      id="vaccineName"
                      name="vaccineName"
                      value={formData.vaccineName}
                      onChange={(e) => {
                        const v = VACCINE_DATABASE.find(item => item.name === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          vaccineName: e.target.value,
                          manufacturer: v ? v.manufacturer.split('/')[0].trim() : prev.manufacturer
                        }));
                      }}
                      className="form-control"
                    >
                      {VACCINE_DATABASE.map(v => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="manufacturer">Manufacturer</label>
                    <input
                      id="manufacturer"
                      name="manufacturer"
                      type="text"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="lotNumber">Vaccine Lot / Batch Number *</label>
                    <input
                      id="lotNumber"
                      name="lotNumber"
                      type="text"
                      required
                      placeholder="e.g. SPK-9042A (Found on vaccine card)"
                      value={formData.lotNumber}
                      onChange={handleChange}
                      className="form-control"
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Critical for pharmacovigilance lot tracking</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="vaccinationDate">Administration Date *</label>
                    <input
                      id="vaccinationDate"
                      name="vaccinationDate"
                      type="date"
                      required
                      value={formData.vaccinationDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="injectionSite">Anatomical Injection Site</label>
                    <select
                      id="injectionSite"
                      name="injectionSite"
                      value={formData.injectionSite}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Left Deltoid">Left Deltoid (Upper Arm)</option>
                      <option value="Right Deltoid">Right Deltoid (Upper Arm)</option>
                      <option value="Left Anterolateral Thigh">Left Anterolateral Thigh</option>
                      <option value="Right Anterolateral Thigh">Right Anterolateral Thigh</option>
                      <option value="Nasal Spray / Intranasal">Nasal Spray / Intranasal</option>
                      <option value="Oral">Oral</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="facility">Administering Clinic / Pharmacy</label>
                    <input
                      id="facility"
                      name="facility"
                      type="text"
                      value={formData.facility}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Symptoms & Clinical Manifestations */}
            {activeStep === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Activity size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1875rem' }}>Step 3: Clinical Adverse Event Manifestation</h3>
                </div>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="onsetInterval">Onset Interval After Injection *</label>
                    <select
                      id="onsetInterval"
                      name="onsetInterval"
                      value={formData.onsetInterval}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Under 15 minutes">Under 15 minutes (Immediate)</option>
                      <option value="15 to 60 minutes">15 to 60 minutes</option>
                      <option value="1 to 6 hours">1 to 6 hours</option>
                      <option value="6 to 24 hours">6 to 24 hours (Next day)</option>
                      <option value="2 to 7 days">2 to 7 days</option>
                      <option value="Over 7 days">Over 7 days</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="highestSeverity">Severity Classification *</label>
                    <select
                      id="highestSeverity"
                      name="highestSeverity"
                      value={formData.highestSeverity}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Mild (Self-limiting, minimal interference with daily activity)">Mild (Self-limiting)</option>
                      <option value="Moderate (Prevented normal work or daily activities)">Moderate (Prevented daily activity)</option>
                      <option value="Severe (Required urgent outpatient medical visit)">Severe (Required outpatient visit)</option>
                      <option value="Life-threatening / Hospitalization Required">Life-threatening / Hospitalization</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="symptomsObserved">Detailed Clinical Manifestations & Symptoms *</label>
                  <textarea
                    id="symptomsObserved"
                    name="symptomsObserved"
                    rows={3}
                    required
                    value={formData.symptomsObserved}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Describe specific symptoms, onset progression, fever readings, rash characteristics, etc."
                  />
                </div>

                {/* Seriousness Criteria Checkboxes */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    Pharmacovigilance Seriousness Criteria (Check if applicable):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.erVisit === 'Yes'}
                        onChange={(e) => setFormData(prev => ({ ...prev, erVisit: e.target.checked ? 'Yes' : 'No' }))}
                      />
                      <span>Emergency Department (ER) Visit</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.hospitalized === 'Yes'}
                        onChange={(e) => setFormData(prev => ({ ...prev, hospitalized: e.target.checked ? 'Yes' : 'No' }))}
                      />
                      <span>Inpatient Hospital Admission</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.lifeThreatening === 'Yes'}
                        onChange={(e) => setFormData(prev => ({ ...prev, lifeThreatening: e.target.checked ? 'Yes' : 'No' }))}
                      />
                      <span>Immediate Life-Threatening Event</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="currentStatus">Current Event Outcome</label>
                  <select
                    id="currentStatus"
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Recovered completely">Recovered completely</option>
                    <option value="Improving with home care">Improving with home care</option>
                    <option value="Not yet recovered / Ongoing">Not yet recovered / Ongoing</option>
                    <option value="Recovered with sequelae / residual symptoms">Recovered with residual symptoms</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Medical History, Consent & Submit */}
            {activeStep === 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1875rem' }}>Step 4: Medical History, Verification & Consent</h3>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="medicalNotes">
                    Pre-Existing Conditions, Allergies & Concomitant Medications
                  </label>
                  <textarea
                    id="medicalNotes"
                    name="medicalNotes"
                    rows={2}
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Allergies to penicillin, asthma, daily multivitamin, blood thinners..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="physicianFollowUp">
                    Primary Care Doctor or Attending Clinic
                  </label>
                  <input
                    id="physicianFollowUp"
                    name="physicianFollowUp"
                    type="text"
                    value={formData.physicianFollowUp}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Dr. Elena Vance, MD / Metro Health Clinic"
                  />
                </div>

                {/* Consent & Truthfulness Verification */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1.125rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                    <input type="checkbox" required defaultChecked style={{ marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '0.8125rem', color: '#166534', lineHeight: 1.5 }}>
                      <strong>Consent & Accuracy Attestation:</strong> I confirm that the information provided is truthful to the best of my knowledge. I understand this report serves for personal health vigilance and documentation for my physician, and complies with standard pharmacovigilance formats.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-card)' }}>
              {activeStep > 1 ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div></div>}

              <button
                type="submit"
                className="btn-primary"
                style={{ background: activeStep === 4 ? '#E11D48' : 'var(--primary)' }}
              >
                {activeStep === 4 ? (
                  <>
                    <ShieldCheck size={16} /> Submit & Generate Official AEFI Document
                  </>
                ) : (
                  <>
                    Continue <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 5: Official Report View & Certificate Display */}
      {activeStep === 5 && selectedReportForView && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Action Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--white)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Document View
              </span>
              <h3 style={{ fontSize: '1.1875rem' }}>Report #{selectedReportForView.id}</h3>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                onClick={handleCopyShareSummary}
                title="Copy structured summary for your physician"
              >
                {copiedLink ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                {copiedLink ? 'Copied Summary!' : 'Copy Summary'}
              </button>

              <button
                className="btn-secondary"
                onClick={handlePrint}
                title="Print official document"
              >
                <Printer size={16} /> Print / Export PDF
              </button>

              <button
                className="btn-primary"
                style={{ background: 'var(--teal-primary)' }}
                onClick={() => setCurrentView('doctor')}
              >
                <Stethoscope size={16} /> Consult Doctor on this Report
              </button>
            </div>
          </div>

          {/* Official Document Sheet */}
          <div className="report-official-view" id="printable-aefi-report">
            <div className="report-print-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <FileWarning size={24} color="#E11D48" />
                  <h3 style={{ fontSize: '1.35rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                    Adverse Event Following Immunization (AEFI) Report
                  </h3>
                </div>
                <div style={{ fontSize: '0.78125rem', color: '#64748B' }}>
                  Standard Pharmacovigilance Documentation • VaxCare Guard Health Registry
                </div>
              </div>

              <div className="report-id-badge">
                {selectedReportForView.id}
              </div>
            </div>

            <div className="report-grid-summary">
              <div className="summary-data-cell">
                <div className="summary-data-lbl">Patient Name & Age</div>
                <div className="summary-data-val">
                  {selectedReportForView.patientName} ({selectedReportForView.patientAge} yrs, {selectedReportForView.patientGender || 'Female'})
                </div>
              </div>

              <div className="summary-data-cell">
                <div className="summary-data-lbl">Report Filing Date</div>
                <div className="summary-data-val">
                  {selectedReportForView.reportDate}
                </div>
              </div>

              <div className="summary-data-cell">
                <div className="summary-data-lbl">Vaccine Administered</div>
                <div className="summary-data-val" style={{ color: 'var(--primary)' }}>
                  {selectedReportForView.vaccineName}
                </div>
              </div>

              <div className="summary-data-cell">
                <div className="summary-data-lbl">Manufacturer & Lot Number</div>
                <div className="summary-data-val">
                  {selectedReportForView.manufacturer || 'Moderna'} • Lot #{selectedReportForView.lotNumber}
                </div>
              </div>

              <div className="summary-data-cell">
                <div className="summary-data-lbl">Vaccination Date & Site</div>
                <div className="summary-data-val">
                  {selectedReportForView.vaccinationDate} • {selectedReportForView.injectionSite}
                </div>
              </div>

              <div className="summary-data-cell">
                <div className="summary-data-lbl">Onset Interval</div>
                <div className="summary-data-val">
                  {selectedReportForView.onsetInterval}
                </div>
              </div>
            </div>

            {/* Clinical Manifestations Block */}
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Reported Clinical Manifestations
              </div>
              <div style={{ fontSize: '0.9375rem', color: '#0F172A', lineHeight: 1.5, fontWeight: 500 }}>
                {selectedReportForView.symptomsObserved || (selectedReportForView.primarySymptoms || []).join(', ')}
              </div>
            </div>

            {/* Severity & Hospitalization Matrix */}
            <div className="report-matrix-grid">
              <div className="summary-data-cell">
                <div className="summary-data-lbl">Severity Level</div>
                <div className="summary-data-val" style={{ color: '#E11D48' }}>
                  {selectedReportForView.highestSeverity}
                </div>
              </div>
              <div className="summary-data-cell">
                <div className="summary-data-lbl">ER Visit</div>
                <div className="summary-data-val">
                  {selectedReportForView.erVisit || 'No'}
                </div>
              </div>
              <div className="summary-data-cell">
                <div className="summary-data-lbl">Hospitalized</div>
                <div className="summary-data-val">
                  {selectedReportForView.hospitalized || 'No'}
                </div>
              </div>
              <div className="summary-data-cell">
                <div className="summary-data-lbl">Current Status</div>
                <div className="summary-data-val" style={{ color: '#059669' }}>
                  {selectedReportForView.currentStatus}
                </div>
              </div>
            </div>

            {/* Medical Background */}
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Known Allergies & Pre-Existing Medical History
              </div>
              <div style={{ fontSize: '0.875rem', color: '#334155' }}>
                {selectedReportForView.medicalNotes || "None documented."}
              </div>
            </div>

            {/* Footer Sign-off */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #CBD5E1', fontSize: '0.75rem', color: '#64748B' }}>
              <div>
                <strong>Digital Verification Hash:</strong> {selectedReportForView.verificationHash || 'VAX-AEFI-SHA256'}
              </div>
              <div>
                Reporter: {selectedReportForView.reporterType || 'Patient Self'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
