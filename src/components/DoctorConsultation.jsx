import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  PhoneCall,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  User,
  Star,
  MapPin,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  X,
  Send,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export function DoctorConsultation() {
  const {
    consultations,
    bookConsultation,
    symptoms,
    reports,
    user,
    setIsEmergencyModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState('call');
  const [inLiveCall, setInLiveCall] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Booking Form State
  const [bookingSpecialty, setBookingSpecialty] = useState("Vaccine Pharmacovigilance & Allergy");
  const [bookingTime, setBookingTime] = useState("Today at 5:30 PM (Next Available)");
  const [consultReason, setConsultReason] = useState(
    "Evaluation of post-vaccine soreness, fever (99.8°F), and advice on arm swelling."
  );
  const [attachSymptoms, setAttachSymptoms] = useState(true);

  // Available Verified Doctors
  const verifiedDoctors = [
    {
      id: "doc_1",
      name: "Dr. Elena Vance, MD, MPH",
      specialty: "Vaccine Safety & Clinical Immunology",
      hospital: "St. Jude Health & University Medical Center",
      experience: "14 yrs clinical experience",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      rating: "4.98",
      reviewsCount: 184,
      availability: "Available Now",
      waitMinutes: "<2 mins wait"
    },
    {
      id: "doc_2",
      name: "Dr. Marcus Brody, MD, FAAP",
      specialty: "General Internal Medicine",
      hospital: "Metro Health Center",
      experience: "11 yrs experience",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
      rating: "4.94",
      reviewsCount: 142,
      availability: "Available in 15 mins",
      waitMinutes: "~15 mins"
    },
    {
      id: "doc_3",
      name: "Dr. Amina Patel, MD",
      specialty: "Adult Allergy & Immunology",
      hospital: "Pavilion Specialty Allergy Clinic",
      experience: "9 yrs experience",
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300",
      rating: "4.96",
      reviewsCount: 97,
      availability: "Tomorrow Morning",
      waitMinutes: "Scheduled only"
    }
  ];

  const handleStartLiveCall = (doctor) => {
    setSelectedDoctor(doctor || verifiedDoctors[0]);
    setInLiveCall(true);
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    bookConsultation({
      doctorName: "Dr. Elena Vance, MD, MPH",
      specialty: bookingSpecialty,
      dateTime: bookingTime,
      type: "Telehealth Video Consultation",
      concern: consultReason,
      hasAttachedSymptomLog: attachSymptoms
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div className="doctor-view-layout animate-in">
      {/* Clean Scope Distinction Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem'
        }}
      >
        <ShieldCheck size={24} color="#2563EB" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ color: '#1E40AF', fontSize: '0.9375rem', margin: 0, fontWeight: 700 }}>
            Licensed Medical Care vs. AI Guidance
          </h4>
          <p style={{ color: '#1E3A8A', fontSize: '0.8125rem', margin: '0.15rem 0 0 0', lineHeight: 1.45 }}>
            Our AI assistant provides educational triage; it does not replace a licensed physician. When you connect below, you consult directly with board-certified physicians.
          </p>
        </div>
      </div>

      {/* Header & Subtabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <h2>Doctor Consultation & Telehealth</h2>
          <p style={{ margin: 0 }}>Connect immediately with an on-call physician or schedule an appointment.</p>
        </div>

        <div className="assistant-mode-toggle">
          <button
            className={`mode-tab-btn ${activeTab === 'call' ? 'active' : ''}`}
            onClick={() => setActiveTab('call')}
          >
            <PhoneCall size={15} /> Call a Doctor
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            <Calendar size={15} /> Request Consultation
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'clinics' ? 'active' : ''}`}
            onClick={() => setActiveTab('clinics')}
          >
            <MapPin size={15} /> Urgent Care & Clinics
          </button>
        </div>
      </div>

      {/* Mode 1: Call a Doctor On-Demand */}
      {activeTab === 'call' && (
        <div>
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>On-Call Telehealth Physicians</h3>
              <p style={{ fontSize: '0.78125rem', margin: 0 }}>Board-certified practitioners ready for live video review.</p>
            </div>
            <span className="doctor-status-available">
              <span className="live-green-dot"></span>
              Doctors Online
            </span>
          </div>

          <div className="doctor-cards-grid">
            {verifiedDoctors.map((doc, idx) => (
              <div key={doc.id} className={`doctor-card animate-in stagger-${idx + 1}`}>
                <div>
                  <div className="doctor-profile-top">
                    <img src={doc.avatar} alt={doc.name} className="doctor-avatar-img" />
                    <div className="doctor-name-title">
                      <h4>{doc.name}</h4>
                      <div className="doctor-spec">{doc.specialty}</div>
                      <div className="doctor-credentials">{doc.hospital}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78125rem', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D97706', fontWeight: 700 }}>
                      <Star size={13} fill="#D97706" /> {doc.rating}
                    </span>
                    <span style={{ color: '#64748B' }}>({doc.reviewsCount} reviews)</span>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1rem', fontSize: '0.78125rem' }}>
                    <div style={{ color: '#0F172A', fontWeight: 600 }}>{doc.experience}</div>
                    <div style={{ color: '#059669', fontWeight: 700, marginTop: '0.15rem' }}>
                      {doc.availability} • {doc.waitMinutes}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #0284C7, #0D9488)', fontSize: '0.8125rem' }}
                    onClick={() => handleStartLiveCall(doc)}
                  >
                    <Video size={15} /> Live Video Call
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.75rem' }}
                    onClick={() => handleStartLiveCall(doc)}
                    title="Audio Phone Call"
                  >
                    <PhoneCall size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Request Consultation */}
      {activeTab === 'request' && (
        <div className="panel-card animate-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-card)' }}>
            <div style={{ background: '#EEF2FF', padding: '0.45rem', borderRadius: '8px', color: '#4F46E5' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Schedule a Consultation</h3>
              <p style={{ fontSize: '0.78125rem', margin: 0 }}>Book an appointment with a vaccine safety specialist.</p>
            </div>
          </div>

          <form onSubmit={handleBookSubmit}>
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="spec-select">Specialty</label>
                <select
                  id="spec-select"
                  className="form-control"
                  value={bookingSpecialty}
                  onChange={(e) => setBookingSpecialty(e.target.value)}
                >
                  <option value="Vaccine Pharmacovigilance & Allergy">Vaccine Pharmacovigilance & Clinical Allergy</option>
                  <option value="Adult General Physician / Internist">Adult General Physician / Internist</option>
                  <option value="Cardiologist (Chest Pain & Palpitations)">Cardiologist (Post-Vaccine Review)</option>
                  <option value="Pediatrician">Pediatrician (Childhood Immunization)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="time-select">Preferred Time</label>
                <select
                  id="time-select"
                  className="form-control"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                >
                  <option value="Today at 5:30 PM (Next Available)">Today at 5:30 PM (Next Available)</option>
                  <option value="Today at 7:00 PM">Today at 7:00 PM</option>
                  <option value="Tomorrow at 10:00 AM">Tomorrow at 10:00 AM</option>
                  <option value="Tomorrow at 2:30 PM">Tomorrow at 2:30 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="consultReason">
                Reason for Consultation *
              </label>
              <textarea
                id="consultReason"
                rows={2}
                required
                value={consultReason}
                onChange={(e) => setConsultReason(e.target.value)}
                className="form-control"
                placeholder="Describe your symptoms and questions for the clinician..."
              />
            </div>

            {/* Auto-Attach Checkbox */}
            <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={attachSymptoms}
                  onChange={(e) => setAttachSymptoms(e.target.checked)}
                />
                <span style={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 600 }}>
                  Attach My Symptom Tracker Log ({symptoms.length} items) to Doctor's Chart
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              <CheckCircle2 size={16} /> Confirm Consultation Request
            </button>
          </form>

          {/* Active Bookings List */}
          {consultations.length > 0 && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-card)' }}>
              <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>Your Scheduled Consultations</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {consultations.map(c => (
                  <div
                    key={c.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                        {c.doctorName} • {c.specialty}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Time: <strong>{c.dateTime}</strong> • Status: <span style={{ color: '#059669', fontWeight: 700 }}>{c.status}</span>
                      </div>
                    </div>

                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      onClick={() => handleStartLiveCall(null)}
                    >
                      Enter Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Nearby Clinics */}
      {activeTab === 'clinics' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Urgent Care & Emergency Clinics</h3>
            <p style={{ fontSize: '0.78125rem', margin: 0 }}>Walk-in facilities equipped for post-vaccine reaction assessment.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div className="panel-card animate-in stagger-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge-subtle" style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>Open Now</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>1.4 miles away</span>
              </div>
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.2rem' }}>Metro West Urgent Care</h4>
              <p style={{ fontSize: '0.78125rem', color: '#64748B', marginBottom: '0.85rem' }}>
                450 Healthcare Blvd • Walk-ins Accepted • Wait: ~15 mins
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href="tel:555019842" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78125rem' }}>
                  <PhoneCall size={13} /> Call Clinic
                </a>
                <button className="btn-primary" style={{ fontSize: '0.78125rem' }}>
                  Directions
                </button>
              </div>
            </div>

            <div className="panel-card animate-in stagger-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge-subtle" style={{ background: '#FFE4E6', color: '#BE123C', fontWeight: 700 }}>24/7 ER</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>2.8 miles away</span>
              </div>
              <h4 style={{ fontSize: '1.0625rem', marginBottom: '0.2rem' }}>St. Jude Memorial Hospital ER</h4>
              <p style={{ fontSize: '0.78125rem', color: '#64748B', marginBottom: '0.85rem' }}>
                1200 University Ave • Level 1 Trauma Resuscitation Center
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href="tel:911" className="btn-outline-danger" style={{ flex: 1, textAlign: 'center', fontSize: '0.78125rem' }}>
                  Call 911
                </a>
                <button className="btn-primary" style={{ fontSize: '0.78125rem' }}>
                  Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Live Telehealth Call Modal with Audio Wave Animation */}
      {inLiveCall && (
        <LiveTelehealthRoom
          doctor={selectedDoctor || verifiedDoctors[0]}
          patient={user}
          onEndCall={() => setInLiveCall(false)}
        />
      )}
    </div>
  );
}

function LiveTelehealthRoom({ doctor, patient, onEndCall }) {
  const [callSeconds, setCallSeconds] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "doctor",
      text: `Hello ${patient.name || 'Sarah'}, I'm ${doctor.name}. I see your post-vaccination record and symptoms. How are you feeling right now?`
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [...prev, { sender: "patient", text: inputMsg.trim() }]);
    setInputMsg("");

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "doctor",
          text: "I understand. Soreness and low fever around 99.8°F are very consistent with normal immune activation. Let's make sure there is no shortness of breath or swelling in your throat."
        }
      ]);
    }, 1200);
  };

  return (
    <div className="telehealth-room-modal" role="dialog" aria-modal="true">
      <div className="telehealth-screen-container">
        {/* Call Header with Live Audio Wave Animation */}
        <div className="call-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="live-green-dot"></span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {doctor.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                Encrypted Telehealth Session
              </div>
            </div>

            {/* Simulated Live Audio Waves */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '0.5rem' }} title="Live Audio Channel Active">
              <span style={{ width: '3px', height: '10px', background: '#10B981', borderRadius: '2px', animation: 'audioBar 0.9s ease-in-out infinite' }}></span>
              <span style={{ width: '3px', height: '18px', background: '#10B981', borderRadius: '2px', animation: 'audioBar 0.9s ease-in-out infinite 0.2s' }}></span>
              <span style={{ width: '3px', height: '14px', background: '#10B981', borderRadius: '2px', animation: 'audioBar 0.9s ease-in-out infinite 0.4s' }}></span>
              <span style={{ width: '3px', height: '8px', background: '#10B981', borderRadius: '2px', animation: 'audioBar 0.9s ease-in-out infinite 0.1s' }}></span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
              {formatTimer(callSeconds)}
            </span>
            <button onClick={onEndCall} style={{ color: '#94A3B8' }} aria-label="Close session">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Stage with Patient PiP */}
        <div className="call-video-stage">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="doctor-video-stream"
          />

          <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(15, 23, 42, 0.75)', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem' }}>
            {doctor.name} (Live)
          </div>

          {/* Patient Picture in Picture */}
          <div className="patient-pip-stream">
            {isVideoOff ? (
              <span style={{ color: '#64748B' }}>Camera Off</span>
            ) : (
              <span>You ({patient.name || 'Patient'})</span>
            )}
          </div>
        </div>

        {/* Live Clinical Chat Box */}
        <div style={{ maxHeight: '130px', overflowY: 'auto', background: '#070D18', padding: '0.65rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {chatMessages.map((m, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.78125rem',
                alignSelf: m.sender === 'doctor' ? 'flex-start' : 'flex-end',
                background: m.sender === 'doctor' ? 'rgba(255,255,255,0.1)' : '#0284C7',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                maxWidth: '85%'
              }}
            >
              <strong>{m.sender === 'doctor' ? doctor.name.split(',')[0] : 'You'}:</strong> {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendChat} style={{ display: 'flex', padding: '0.45rem 1rem', background: '#070D18', gap: '0.45rem' }}>
          <input
            type="text"
            placeholder="Type a message to the doctor..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '0.35rem 0.85rem', color: '#FFFFFF', fontSize: '0.78125rem', outline: 'none' }}
          />
          <button type="submit" style={{ color: '#38BDF8' }} aria-label="Send message">
            <Send size={15} />
          </button>
        </form>

        {/* Controls Bar */}
        <div className="call-control-bar">
          <button
            className="call-control-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={18} color="#F87171" /> : <Mic size={18} />}
          </button>

          <button
            className="call-control-btn"
            onClick={() => setIsVideoOff(!isVideoOff)}
            title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
          >
            {isVideoOff ? <VideoOff size={18} color="#F87171" /> : <Video size={18} />}
          </button>

          <button
            className="call-control-btn end-call"
            onClick={onEndCall}
            title="End Call"
          >
            <PhoneCall size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
