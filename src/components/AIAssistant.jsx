import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  AlertOctagon,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldAlert,
  PhoneCall,
  Calendar,
  FileWarning,
  Activity,
  RotateCcw,
  Info,
  Settings,
  Copy,
  Check,
  Zap,
  RefreshCw,
  MessageSquare,
  Cpu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SYMPTOM_OPTIONS, ONSET_TIMELINES, evaluateSymptoms, generateChatResponse } from '../data/triageLogic';
import { VACCINE_DATABASE } from '../data/vaccineDatabase';
import {
  callGroqChat,
  callGroqTriageAnalysis,
  AVAILABLE_MODELS,
  getSelectedModel,
  setSelectedModel,
  getGroqApiKey,
  setCustomGroqApiKey,
  testGroqConnection
} from '../services/groqService';
import { MarkdownRenderer } from './MarkdownRenderer';

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
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  // Settings & Engine State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModel, setActiveModel] = useState(getSelectedModel());
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [pingResult, setPingResult] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  // Triage Form State
  const [selectedVaccineId, setSelectedVaccineId] = useState('covid-mrna');
  const [selectedOnset, setSelectedOnset] = useState('next_day');
  const [selectedSymptomIds, setSelectedSymptomIds] = useState(['arm_pain', 'fatigue']);
  const [severity, setSeverity] = useState(4);
  const [temperature, setTemperature] = useState('99.2');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [triageResult, setTriageResult] = useState(null);

  // Deep AI Triage Analysis State
  const [aiTriageLoading, setAiTriageLoading] = useState(false);
  const [aiTriageAnalysis, setAiTriageAnalysis] = useState(null);

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      modelName: 'VaxCare AI',
      text: `Hello ${user.name || 'there'}! I am your **VaxCare Clinical Assistant**.\n\nI can evaluate your post-vaccination symptoms, explain expected recovery timelines, and suggest simple home comfort care.\n\n⚠️ **Medical Notice**: If experiencing signs like difficulty breathing, throat swelling, or severe chest pain, please call emergency services (911 / 112) immediately.`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatScrollRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, activeTab]);

  const toggleSymptom = (id) => {
    setSelectedSymptomIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Run Rule-Based Triage + prompt for AI deep analysis
  const handleRunTriage = async (e) => {
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
    setAiTriageAnalysis(null);

    // Proactively generate Deep AI Second Opinion
    generateDeepAiTriage(result);
  };

  const generateDeepAiTriage = async (currentTriageResult = triageResult) => {
    setAiTriageLoading(true);
    const chosenVaccine = VACCINE_DATABASE.find(v => v.id === selectedVaccineId)?.name || 'Vaccination';
    const onsetObj = ONSET_TIMELINES.find(t => t.value === selectedOnset)?.label || selectedOnset;
    const selectedSymptoms = SYMPTOM_OPTIONS.filter(s => selectedSymptomIds.includes(s.id)).map(s => s.label);

    try {
      const response = await callGroqTriageAnalysis({
        vaccineName: chosenVaccine,
        onsetLabel: onsetObj,
        symptomsList: selectedSymptoms,
        severity: Number(severity),
        temperature: Number(temperature) || 98.6,
        additionalNotes,
        ruleResult: currentTriageResult,
        userProfile: user
      });
      setAiTriageAnalysis(response);
    } catch (err) {
      console.warn('Deep triage connection interrupted, fallback to basic guidance', err);
      setAiTriageAnalysis({
        analysis: `**Summary**: Symptoms following **${chosenVaccine}** at **${onsetObj}** represent typical post-vaccine reactogenicity.\n\n**What to Do**:\n- Rest, hydrate, and apply a cool compress to the sore area.\n- Acetaminophen or ibuprofen can help relieve discomfort.\n\n**When to Call a Doctor**:\n- Fever over 102.5°F lasting more than 48 hours or severe spreading swelling.`,
        isEmergency: false,
        model: 'VaxCare Protocol'
      });
    } finally {
      setAiTriageLoading(false);
    }
  };

  // Chat Submission with Groq AI API & Resilient Fallback
  const handleSendChat = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      // Call live Groq API with conversation context and user health record
      const groqRes = await callGroqChat({
        messages: newHistory,
        userProfile: user
      });

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: groqRes.text,
        modelName: groqRes.model,
        isEmergency: groqRes.isEmergency
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Groq AI API Call Error:', error);
      // Fallback to local rule engine so user is never stranded
      const fallback = generateChatResponse(text);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `${fallback.text}\n\n*(Notice: Network issue contacting cloud AI. Standard CDC rule guidance provided above.)*`,
        modelName: 'VaxCare Offline Protocol',
        isEmergency: fallback.isEmergency
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      showToast('Live AI connection fallback applied.', 'info');
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear your current AI conversation?')) {
      setChatMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          modelName: 'VaxCare AI',
          text: `Chat cleared. Hello ${user.name || 'there'}! How can I assist you with your vaccination questions or recovery today?`
        }
      ]);
    }
  };

  // Quick Action: Discuss Triage in Chat
  const handleDiscussTriageInChat = () => {
    const chosenVaccine = VACCINE_DATABASE.find(v => v.id === selectedVaccineId)?.name || 'my vaccine';
    const onsetObj = ONSET_TIMELINES.find(t => t.value === selectedOnset)?.label || selectedOnset;
    const selectedSymptoms = SYMPTOM_OPTIONS.filter(s => selectedSymptomIds.includes(s.id)).map(s => s.label).join(', ');
    
    setActiveTab('chat');
    const prompt = `I completed a post-vaccine triage for ${chosenVaccine}. My symptoms are: ${selectedSymptoms || 'soreness'}, onset ${onsetObj}, discomfort level ${severity}/10, temp ${temperature}°F. Can you review this and advise me on what to monitor?`;
    handleSendChat(prompt);
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
      notes: `AI Triage rating: ${triageResult?.level}. ${additionalNotes || 'Evaluated via VaxCare AI'}`
    });
    showToast("Symptoms saved to your recovery timeline.", "success");
    setCurrentView('tracker');
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    setActiveModel(modelId);
    showToast(`AI Model set to ${modelId}`, 'success');
  };

  const handleSaveCustomKey = () => {
    setCustomGroqApiKey(customKeyInput);
    showToast('Custom API key updated.', 'success');
    setCustomKeyInput('');
  };

  const handlePingTest = async () => {
    setIsPinging(true);
    setPingResult(null);
    const res = await testGroqConnection();
    setPingResult(res);
    setIsPinging(false);
  };

  return (
    <div className="assistant-view-container animate-in">
      {/* Sleek Clinical Disclaimer Banner */}
      <div className="disclaimer-banner" role="region" aria-label="Medical Disclaimer">
        <ShieldAlert size={20} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <strong>Educational Triage Notice:</strong> VaxCare AI provides evidence-based reactogenicity guidance compliant with CDC and WHO protocols. <strong>It does not make clinical diagnoses.</strong> If experiencing signs of anaphylaxis or chest pain, dial emergency services immediately.
        </div>
        
        {/* Live AI Status Pill */}
        <div className="groq-status-badge" onClick={() => setIsSettingsOpen(true)} title="AI Assistant Settings & Health Check">
          <span className="live-pulse-dot"></span>
          <Zap size={13} color="#38BDF8" />
          <span className="badge-text">AI Active</span>
          <Settings size={13} className="settings-icon-hint" />
        </div>
      </div>

      {/* Mode Switcher Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0 }}>AI Health Assistant</h2>
            <span className="ai-model-chip">
              <Cpu size={12} /> {activeModel.split('/')[1] || activeModel}
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
            High-speed clinical triage and evidence-based post-immunization Q&A.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

          <button
            className="btn-secondary"
            style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => setIsSettingsOpen(true)}
            title="Configure AI Engine & API Key"
          >
            <Settings size={15} />
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
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Post-Immunization Evaluator</h3>
                <p style={{ fontSize: '0.78125rem', margin: 0, color: 'var(--slate-400)' }}>
                  Evaluated with CDC clinical rules & evidence-based medical reasoning.
                </p>
              </div>
            </div>
            {triageResult && (
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                onClick={() => {
                  setTriageResult(null);
                  setAiTriageAnalysis(null);
                }}
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

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label" htmlFor="triage-notes">
                Additional Observations / Medical Notes (Optional)
              </label>
              <textarea
                id="triage-notes"
                className="form-control"
                rows="2"
                placeholder="e.g. Took 500mg acetaminophen, soreness started spreading toward elbow..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.9375rem', marginTop: '0.5rem' }}
            >
              <Sparkles size={16} />
              Evaluate Symptoms & Generate AI Triage
            </button>
          </form>

          {/* Triage Result Card */}
          {triageResult && (
            <div className={`triage-result-card ${triageResult.level}`} role="alert" style={{ marginTop: '1.5rem' }}>
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

              {/* AI Deep Clinical Second Opinion Box */}
              <div className="ai-deep-opinion-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)' }}>
                    <Sparkles size={16} /> AI Clinical Second Opinion
                  </div>
                  {aiTriageLoading && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <RefreshCw size={12} className="spin-icon" /> Analyzing symptoms...
                    </span>
                  )}
                </div>

                {aiTriageLoading ? (
                  <div className="ai-thinking-shimmer">
                    <div className="shimmer-line" style={{ width: '90%' }}></div>
                    <div className="shimmer-line" style={{ width: '75%' }}></div>
                    <div className="shimmer-line" style={{ width: '85%' }}></div>
                  </div>
                ) : aiTriageAnalysis ? (
                  <div className="ai-analysis-rendered">
                    <MarkdownRenderer content={aiTriageAnalysis.analysis} />
                  </div>
                ) : (
                  <button
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '0.8125rem', justifyContent: 'center' }}
                    onClick={() => generateDeepAiTriage()}
                  >
                    <Sparkles size={14} /> Request AI Clinical Analysis
                  </button>
                )}
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
                      onClick={handleDiscussTriageInChat}
                    >
                      <MessageSquare size={15} /> Discuss with AI in Chat
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
          {/* Top Chat Bar with Clear Action and Model Tag */}
          <div className="chat-top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={18} color="var(--primary)" />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>VaxCare Clinical AI</span>
              <span className="chat-online-pill">
                <span className="live-pulse-dot" style={{ width: 6, height: 6 }}></span> Online
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="chat-action-btn"
                onClick={handleClearChat}
                title="Clear Chat Conversation"
              >
                <RotateCcw size={13} /> Reset Chat
              </button>
            </div>
          </div>

          <div className="chat-messages-scroll" ref={chatScrollRef}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
                <div className={`chat-avatar ${msg.sender === 'assistant' ? 'assistant-avatar' : 'user-avatar'}`}>
                  {msg.sender === 'assistant' ? <Bot size={18} /> : user.name?.charAt(0) || 'U'}
                </div>

                <div className={`chat-bubble ${msg.sender === 'assistant' ? 'assistant-bubble' : 'user-bubble'}`}>
                  {/* Assistant Model Attribution Tag */}
                  {msg.sender === 'assistant' && msg.modelName && (
                    <div className="chat-model-meta">
                      <Zap size={11} color="#38BDF8" /> {msg.modelName}
                    </div>
                  )}

                  {/* Render formatted Markdown or plain text */}
                  <MarkdownRenderer content={msg.text} />

                  {/* Message Tools (Copy, Emergency dispatch) */}
                  {msg.sender === 'assistant' && (
                    <div className="chat-msg-actions">
                      <button
                        className="msg-tool-btn"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy text"
                      >
                        {copiedMsgId === msg.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {msg.isEmergency && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <button
                        className="btn-primary"
                        style={{ background: '#DC2626', color: '#FFFFFF', padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}
                        onClick={() => setIsEmergencyModalOpen(true)}
                      >
                        <AlertOctagon size={14} /> Open Emergency Dispatch (911 / 112)
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
                <div className="chat-bubble assistant-bubble" style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '0.75rem 1.1rem' }}>
                  <span className="live-dot-pulse"></span>
                  <span className="live-dot-pulse" style={{ animationDelay: '200ms' }}></span>
                  <span className="live-dot-pulse" style={{ animationDelay: '400ms' }}></span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginLeft: '0.4rem' }}>
                    Clinical AI is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggested Prompts */}
          <div className="suggested-prompts-bar">
            <span style={{ fontSize: '0.71875rem', color: '#64748B', fontWeight: 700 }}>Suggested:</span>
            <button className="prompt-chip" onClick={() => handleSendChat("Is my 100.4°F fever normal 24 hours after the COVID-19 booster?")}>
              Is 100.4°F fever normal after COVID booster?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("Can I take Ibuprofen or Tylenol for my sore arm?")}>
              Can I take pain relievers?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("What are the early warning signs of an allergic reaction?")}>
              Signs of severe allergic reaction?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("Why does the Shingrix shingles vaccine cause strong chills?")}>
              Shingrix side effects?
            </button>
            <button className="prompt-chip" onClick={() => handleSendChat("How do I file an official AEFI safety report?")}>
              How to file AEFI report?
            </button>
          </div>

          {/* Chat Input */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask anything about post-vaccine symptoms, safety, or pain relief..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
              className="chat-input-field"
              disabled={isTyping}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSendChat()}
              aria-label="Send message"
              disabled={isTyping || !inputMessage.trim()}
              style={{ opacity: !inputMessage.trim() || isTyping ? 0.6 : 1 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Engine Settings Modal */}
      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-card animate-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>AI Health Engine Settings</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '0.35rem' }}>
                  Clinical AI Model
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {AVAILABLE_MODELS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleModelChange(m.id)}
                      className={`model-select-card ${activeModel === m.id ? 'active' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{m.name}</strong>
                        {activeModel === m.id && <CheckCircle2 size={16} color="var(--primary)" />}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'monospace' }}>
                        {m.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">
                  API Key Status
                </label>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', color: '#38BDF8' }}>
                    {getGroqApiKey().substring(0, 8)}••••••••••••••••••••••••{getGroqApiKey().slice(-4)}
                  </span>
                  <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Check size={12} /> Configured & Active
                  </span>
                </div>
              </div>

              <div>
                <label className="form-label">
                  Custom API Key Override (Optional)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="password"
                    placeholder="Enter custom API key"
                    value={customKeyInput}
                    onChange={(e) => setCustomKeyInput(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <button className="btn-secondary" onClick={handleSaveCustomKey} style={{ whiteSpace: 'nowrap' }}>
                    Save Key
                  </button>
                </div>
              </div>

              {/* Ping Connectivity Test */}
              <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem' }}>Health Check</strong>
                    <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--slate-400)' }}>
                      Measure live response latency to the AI service.
                    </p>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={handlePingTest}
                    disabled={isPinging}
                    style={{ fontSize: '0.78125rem', padding: '0.35rem 0.75rem' }}
                  >
                    {isPinging ? <RefreshCw size={12} className="spin-icon" /> : <Zap size={12} />}
                    {isPinging ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {pingResult && (
                  <div style={{ marginTop: '0.65rem', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8125rem', background: pingResult.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${pingResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: pingResult.success ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                        {pingResult.success ? '✓ Operational' : '✕ Connection Issue'}
                      </span>
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>
                        Latency: {pingResult.latencyMs}ms
                      </span>
                    </div>
                    {pingResult.message && (
                      <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: 'var(--slate-300)' }}>
                        {pingResult.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn-primary" onClick={() => setIsSettingsOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
