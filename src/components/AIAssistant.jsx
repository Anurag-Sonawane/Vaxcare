import React, { useState } from 'react';
import {
  Bot,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  Calendar,
  FileWarning,
  Activity,
  RotateCcw,
  Info,
  HeartPulse
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SYMPTOM_OPTIONS, ONSET_TIMELINES, evaluateSymptoms, generateChatResponse } from '../data/triageLogic';
import { VACCINE_DATABASE } from '../data/vaccineDatabase';

export function AIAssistant() {
  const {
    user,
    setCurrentView,
    setIsEmergencyModalOpen,
    addSymptom,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('triage'); // 'triage' or 'chat'
  const [isTyping, setIsTyping] = useState(false);

  // Triage Form State
  const [selectedVaccineId, setSelectedVaccineId] = useState('covid-mrna');
  const [selectedOnset, setSelectedOnset] = useState('next_day');
  const [selectedSymptomIds, setSelectedSymptomIds] = useState(['arm_pain', 'fatigue']);
  const [severity, setSeverity] = useState(4);
  const [temperature, setTemperature] = useState('99.2');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [triageResult, setTriageResult] = useState(null);

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello ${user.name || 'there'}! I am your **VaxCare AI Health Assistant**.\n\nI can evaluate whether your post-vaccination symptoms represent normal expected reactogenicity or if clinical evaluation is recommended.\n\n⚠️ **Important Medical Notice**: I provide evidence-based educational triage and guidance. I do not replace a licensed physician. If you experience emergency signs like trouble breathing, chest pain, or facial swelling, please call emergency services (911 / 112) immediately.`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleSymptom = (id) => {
    setSelectedSymptomIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRunTriage = (e) => {
    e.preventDefault();
    const selectedSymptoms = SYMPTOM_OPTIONS.filter(s => selectedSymptomIds.includes(s.id));
    const result = evaluateSymptoms({
      vaccineId: selectedVaccineId,
      onset: selectedOnset,
      selectedSymptoms,
      severity: Number(severity),
      temperature: Number(temperature) || 98.6,
      additionalNotes
    });
    setTriageResult(result);
  };

  const handleSendChat = (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateChatResponse(text);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: botResponse.text,
        isEmergency: botResponse.isEmergency,
        suggestConsultation: botResponse.suggestConsultation
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleQuickLogToTracker = () => {
    const selectedObj = SYMPTOM_OPTIONS.filter(s => selectedSymptomIds.includes(s.id));
    const symptomNames = selectedObj.map(s => s.label).join(', ') || 'Post-vaccine symptoms';
    const chosenVaccine = VACCINE_DATABASE.find(v => v.id === selectedVaccineId)?.name || 'Vaccination';

    addSymptom({
      symptomName: symptomNames,
      vaccineName: chosenVaccine,
      severity: Number(severity),
      temperature: Number(temperature) || 98.6,
      location: 'Post-Vaccine',
      onsetTime: new Date().toISOString().slice(0, 16),
      duration: selectedOnset,
      notes: `AI Triage rating: ${triageResult?.level}. ${additionalNotes || 'Evaluated via VaxCare Guard AI'}`
    });
    showToast("Symptoms saved to your recovery timeline.", "success");
    setCurrentView('tracker');
  };

  return (
    <div className="assistant-view-container animate-in">
      {/* Sleek Clinical Disclaimer Banner */}
      <div className="disclaimer-banner" role="region" aria-label="Medical Disclaimer">
        <ShieldAlert size={20} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Educational Triage Notice:</strong> VaxCare AI assists you in understanding common vaccine reactions. <strong>It does not make clinical diagnoses or claim causality.</strong> Consult a healthcare provider for severe or persistent symptoms.
        </div>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <h2>AI Health Assistant</h2>
          <p style={{ margin: 0 }}>Structured clinical evaluation or conversational guidance.</p>
        </div>

        <div className="assistant-mode-toggle">
          <button
            className={`mode-tab-btn ${activeTab === 'triage' ? 'active' : ''}`}
            onClick={() => setActiveTab('triage')}
          >
            <Activity size={15} /> Structured Triage
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <Bot size={15} /> Health Q&A Chat
          </button>
        </div>
      </div>

      {/* Mode 1: Structured Triage Assessment */}
      {activeTab === 'triage' && (
        <div className="triage-card animate-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ background: '#E0F2FE', padding: '0.45rem', borderRadius: '8px', color: '#0284C7' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Post-Immunization Evaluator</h3>
                <p style={{ fontSize: '0.78125rem', margin: 0 }}>Select your vaccine and symptoms for an evidence-based triage tier.</p>
              </div>
            </div>
            {triageResult && (
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                onClick={() => setTriageResult(null)}
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>

          <form onSubmit={handleRunTriage}>
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="triage-vaccine">
                  Vaccine Administered
                </label>
                <select
                  id="triage-vaccine"
                  className="form-control"
                  value={selectedVaccineId}
                  onChange={(e) => setSelectedVaccineId(e.target.value)}
                >
                  {VACCINE_DATABASE.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.manufacturer})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="triage-onset">
                  Onset Window
                </label>
                <select
                  id="triage-onset"
                  className="form-control"
                  value={selectedOnset}
                  onChange={(e) => setSelectedOnset(e.target.value)}
                >
                  {ONSET_TIMELINES.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symptoms Selection Chips */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">
                Observed Symptoms (Select all that apply)
              </label>
              <div className="symptoms-checkbox-grid">
                {SYMPTOM_OPTIONS.map(s => {
                  const isSelected = selectedSymptomIds.includes(s.id);
                  const isEmergency = s.emergency;
                  const isUrgent = s.urgent;

                  return (
                    <div
                      key={s.id}
                      className={`symptom-chip-label ${isSelected ? 'selected' : ''} ${isEmergency ? 'emergency-flag' : ''}`}
                      onClick={() => toggleSymptom(s.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                        tabIndex={-1}
                      />
                      <span>{s.label}</span>
                      {isEmergency && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.625rem', background: '#FFE4E6', color: '#BE123C', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                          RED FLAG
                        </span>
                      )}
                      {isUrgent && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.625rem', background: '#FEF3C7', color: '#B45309', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                          URGENT
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Severity Slider & Temperature */}
            <div className="form-grid-2col">
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="severity-range">
                    Discomfort Level: <strong>{severity} / 10</strong>
                  </label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: severity <= 3 ? '#10B981' : severity <= 7 ? '#D97706' : '#EF4444' }}>
                    {severity <= 3 ? 'Mild' : severity <= 7 ? 'Moderate' : 'Significant'}
                  </span>
                </div>
                <input
                  id="severity-range"
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="severity-slider"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="temperature-input">
                  Body Temperature (°F)
                </label>
                <input
                  id="temperature-input"
                  type="number"
                  step="0.1"
                  min="95.0"
                  max="108.0"
                  placeholder="e.g. 99.2"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.9375rem', marginTop: '0.5rem' }}
            >
              <Sparkles size={16} />
              Evaluate Symptoms & Generate Triage
            </button>
          </form>

          {/* Triage Result Card */}
          {triageResult && (
            <div className={`triage-result-card ${triageResult.level}`} role="alert">
              <div className="triage-result-header">
                <div>
                  <span className={`triage-status-badge badge-${triageResult.badgeColor}`}>
                    {triageResult.level.replace('_', ' ')}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {triageResult.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0 }}>
                    {triageResult.summary}
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '0.85rem 1rem', marginTop: '0.85rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '0.84375rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                  <Info size={15} color="var(--primary)" /> Actionable Recommendations:
                </div>
                <ul className="triage-recommendations-list">
                  {triageResult.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="triage-action-bar">
                {triageResult.isEmergency ? (
                  <button
                    className="btn-primary"
                    style={{ background: '#E11D48', color: '#FFFFFF' }}
                    onClick={() => setIsEmergencyModalOpen(true)}
                  >
                    <PhoneCall size={15} /> Open Immediate Emergency Dispatch
                  </button>
                ) : (
                  <>
                    <button
                      className="btn-primary"
                      style={{ background: 'var(--teal-primary)' }}
                      onClick={handleQuickLogToTracker}
                    >
                      <Activity size={15} /> Save to Symptom Tracker
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setCurrentView('doctor')}
                    >
                      <Calendar size={15} /> Consult Doctor
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setCurrentView('report')}
                    >
                      <FileWarning size={15} /> File AEFI Report
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Conversational Health Q&A Assistant */}
      {activeTab === 'chat' && (
        <div className="chat-window-card animate-in">
          <div className="chat-messages-scroll">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
                <div className={`chat-avatar ${msg.sender === 'assistant' ? 'assistant-avatar' : 'user-avatar'}`}>
                  {msg.sender === 'assistant' ? <Bot size={18} /> : user.name?.charAt(0) || 'U'}
                </div>
                <div className={`chat-bubble ${msg.sender === 'assistant' ? 'assistant-bubble' : 'user-bubble'}`}>
                  {msg.text}

                  {msg.isEmergency && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <button
                        className="btn-primary"
                        style={{ background: '#DC2626', color: '#FFFFFF', padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}
                        onClick={() => setIsEmergencyModalOpen(true)}
                      >
                        <AlertOctagon size={14} /> Open Emergency Services
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-wrap assistant">
                <div className="chat-avatar assistant-avatar">
                  <Bot size={18} />
                </div>
                <div className="chat-bubble assistant-bubble" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.6rem 1rem' }}>
                  <span style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%', display: 'inline-block', animation: 'liveDotPulse 1.2s infinite' }}></span>
                  <span style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%', display: 'inline-block', animation: 'liveDotPulse 1.2s infinite 200ms' }}></span>
                  <span style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%', display: 'inline-block', animation: 'liveDotPulse 1.2s infinite 400ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggested Prompts */}
          <div className="suggested-prompts-bar">
            <span style={{ fontSize: '0.71875rem', color: '#64748B', fontWeight: 700 }}>Quick Questions:</span>
            <button className="prompt-chip" onClick={() => handleSendChat("Is my fever normal 24 hours after the flu shot?")}>
              Is fever normal after flu shot?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("Can I take Tylenol or Ibuprofen for my sore arm?")}>
              Can I take pain relievers?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("What are the warning signs of anaphylaxis?")}>
              Signs of severe allergic reaction?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("Why did Shingrix give me strong muscle aches?")}>
              Shingrix side effects?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("How do I file an adverse event report with VAERS?")}>
              How to file AEFI report?
            </button>
          </div>

          {/* Chat Input */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask anything about your vaccine, symptoms, or safety..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              className="chat-input-field"
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSendChat()}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
