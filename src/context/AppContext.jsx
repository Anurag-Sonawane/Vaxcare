import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_USER = {
  id: "usr_vax_101",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  phone: "+1 (555) 349-2180",
  dob: "1992-04-14",
  age: 34,
  gender: "Female",
  bloodGroup: "A+",
  allergies: ["Penicillin (mild urticaria)", "Tree Nuts"],
  chronicConditions: ["Mild Exercise-Induced Asthma"],
  emergencyContact: {
    name: "Mark Jenkins",
    relationship: "Spouse",
    phone: "+1 (555) 782-9011"
  },
  vaccineHistory: [
    {
      id: "vx_101",
      vaccineId: "covid-mrna",
      vaccineName: "COVID-19 mRNA (Spikevax Updated)",
      manufacturer: "Moderna",
      dose: "Updated Fall Booster",
      date: "2026-09-18",
      lotNumber: "SPK-9042A",
      facility: "Metro Community Health Pavilion",
      injectionSite: "Left Deltoid"
    },
    {
      id: "vx_102",
      vaccineId: "influenza-quadrivalent",
      vaccineName: "Influenza Quadrivalent (Fluarix)",
      manufacturer: "GSK",
      dose: "Seasonal 2026",
      date: "2026-09-18",
      lotNumber: "FLX-8821B",
      facility: "Metro Community Health Pavilion",
      injectionSite: "Right Deltoid"
    },
    {
      id: "vx_103",
      vaccineId: "tdap",
      vaccineName: "Tdap (Boostrix)",
      manufacturer: "GSK",
      dose: "Decennial Booster",
      date: "2024-06-10",
      lotNumber: "BST-4029K",
      facility: "City Health Clinic",
      injectionSite: "Left Deltoid"
    }
  ]
};

const INITIAL_SYMPTOMS = [
  {
    id: "sym_1",
    symptomName: "Injection Site Soreness & Mild Swelling",
    vaccineName: "COVID-19 mRNA (Spikevax Updated)",
    severity: 4,
    temperature: 99.2,
    location: "Left Deltoid",
    onsetTime: "2026-09-19T08:30",
    duration: "30 hours",
    status: "Improving",
    notes: "Applied cold compress. Pain eased significantly by morning."
  },
  {
    id: "sym_2",
    symptomName: "Mild Fatigue & Low Energy",
    vaccineName: "COVID-19 mRNA (Spikevax Updated)",
    severity: 3,
    temperature: 99.6,
    location: "General Systemic",
    onsetTime: "2026-09-19T14:00",
    duration: "22 hours",
    status: "Active",
    notes: "Took extra fluids and rested. Feeling manageable."
  },
  {
    id: "sym_3",
    symptomName: "Mild Headache",
    vaccineName: "Influenza Quadrivalent (Fluarix)",
    severity: 2,
    temperature: 98.6,
    location: "Frontal Head",
    onsetTime: "2026-09-19T19:00",
    duration: "8 hours",
    status: "Resolved",
    notes: "Resolved after good night's sleep and 500mg acetaminophen."
  }
];

const INITIAL_REPORTS = [
  {
    id: "AEFI-2026-8812",
    reportDate: "2026-09-20",
    reporterType: "Patient / Vaccine Recipient",
    patientName: "Sarah Jenkins",
    patientAge: 34,
    patientGender: "Female",
    vaccineName: "COVID-19 mRNA (Spikevax Updated)",
    manufacturer: "Moderna",
    lotNumber: "SPK-9042A",
    vaccinationDate: "2026-09-18",
    injectionSite: "Left Deltoid",
    onsetInterval: "18 to 24 hours",
    primarySymptoms: ["Injection Site Soreness", "Fatigue", "Low Grade Fever (99.6°F)"],
    highestSeverity: "Mild (Expected reactogenicity)",
    hospitalized: "No",
    erVisit: "No",
    lifeThreatening: "No",
    currentStatus: "Improving at home with supportive care",
    medicalNotes: "Known penicillin allergy. No prior adverse reactions to vaccines.",
    sharedWithDoctor: true,
    verificationHash: "VAX-AEFI-SHA256-VALIDATED"
  }
];

const INITIAL_CONSULTATIONS = [
  {
    id: "cons_801",
    doctorName: "Dr. Elena Vance, MD, MPH",
    specialty: "Immunology & Vaccine Pharmacovigilance",
    credentials: "Board Certified Immunologist • Harvard Medical School",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    clinic: "VaxCare Telehealth Specialty Clinic",
    type: "Telehealth Video Consultation",
    dateTime: "Today, 5:30 PM",
    status: "Confirmed",
    concern: "Review post-vaccine reactogenicity and verify booster schedule safety.",
    rating: "4.97 (142 reviews)"
  }
];

export function AppProvider({ children }) {
  // Persistence via localStorage with fallback
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vaxcare_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [symptoms, setSymptoms] = useState(() => {
    try {
      const saved = localStorage.getItem('vaxcare_symptoms');
      return saved ? JSON.parse(saved) : INITIAL_SYMPTOMS;
    } catch {
      return INITIAL_SYMPTOMS;
    }
  });

  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('vaxcare_reports');
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [consultations, setConsultations] = useState(() => {
    try {
      const saved = localStorage.getItem('vaxcare_consultations');
      return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
    } catch {
      return INITIAL_CONSULTATIONS;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('vaxcare_theme');
      return saved ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [currentView, setCurrentView] = useState('home');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCallSession, setActiveCallSession] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Sync theme to document element and localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('vaxcare_theme', theme);
    } catch (e) {
      console.warn("Theme sync failed", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vaxcare_user', JSON.stringify(user));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('vaxcare_symptoms', JSON.stringify(symptoms));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [symptoms]);

  useEffect(() => {
    try {
      localStorage.setItem('vaxcare_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('vaxcare_consultations', JSON.stringify(consultations));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [consultations]);

  const showToast = (message, type = "success") => {
    setToastNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Symptom management
  const addSymptom = (newSymptom) => {
    const entry = {
      id: `sym_${Date.now()}`,
      status: "Active",
      ...newSymptom
    };
    setSymptoms(prev => [entry, ...prev]);
    showToast("Symptom logged successfully to your personal timeline.", "success");
    return entry;
  };

  const updateSymptomStatus = (id, newStatus) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    showToast(`Symptom status marked as ${newStatus}.`, "info");
  };

  const deleteSymptom = (id) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    showToast("Symptom entry removed.", "info");
  };

  // Report management (AEFI)
  const addReport = (reportData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReport = {
      id: `AEFI-2026-${randomSuffix}`,
      reportDate: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      sharedWithDoctor: false,
      verificationHash: `VAX-AEFI-HEX${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
      ...reportData
    };
    setReports(prev => [newReport, ...prev]);
    showToast(`Adverse Event Report #${newReport.id} registered and archived.`, "success");
    return newReport;
  };

  // Consultation management
  const bookConsultation = (booking) => {
    const newBooking = {
      id: `cons_${Date.now()}`,
      status: "Confirmed",
      dateTime: booking.dateTime || "In 15 minutes (Next Available)",
      rating: "5.0 (New request)",
      ...booking
    };
    setConsultations(prev => [newBooking, ...prev]);
    showToast("Doctor consultation successfully requested!", "success");
    return newBooking;
  };

  // User Profile management
  const updateUserProfile = (updatedProfile) => {
    setUser(prev => ({ ...prev, ...updatedProfile }));
    showToast("Health profile and vaccination history updated.", "success");
  };

  const addVaccineDose = (newDose) => {
    const doseEntry = {
      id: `vx_${Date.now()}`,
      ...newDose
    };
    setUser(prev => ({
      ...prev,
      vaccineHistory: [doseEntry, ...prev.vaccineHistory]
    }));
    showToast("New vaccination record added.", "success");
  };

  // Reset demo data
  const resetAllData = () => {
    setUser(INITIAL_USER);
    setSymptoms(INITIAL_SYMPTOMS);
    setReports(INITIAL_REPORTS);
    setConsultations(INITIAL_CONSULTATIONS);
    localStorage.clear();
    showToast("Demo health records reset to baseline.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        symptoms,
        reports,
        consultations,
        currentView,
        setCurrentView,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isConsentModalOpen,
        setIsConsentModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeCallSession,
        setActiveCallSession,
        toastNotification,
        showToast,
        theme,
        setTheme,
        toggleTheme,
        addSymptom,
        updateSymptomStatus,
        deleteSymptom,
        addReport,
        bookConsultation,
        updateUserProfile,
        addVaccineDose,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
