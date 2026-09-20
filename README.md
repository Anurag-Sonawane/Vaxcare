# VaxCare Guard 🛡️

**Evidence-Based Vaccine Safety & Post-Vaccination Health Support Platform**

VaxCare Guard is a clinical-grade post-vaccination health guidance web application designed to help individuals monitor their health, evaluate post-immunization reactogenicity with evidence-based AI triage, track recovery trajectories, and connect directly with licensed medical professionals.

---

## 🌟 Core Features

- **Evidence-Based AI Health Assistant & Clinical Triage**:
  - Evaluate symptoms against vaccine reactogenicity models (CDC/ACIP & WHO aligned).
  - Clear multi-level severity classifications: *Expected Mild*, *Monitor*, *Urgent Attention*, and *Immediate Emergency Red Flag*.
  - Conversational Q&A chat assistant for rapid queries.
- **Post-Vaccination Symptom Tracker**:
  - Interactive progression timeline recording symptom duration, severity (1-10), injection site, and body temperature.
  - Distribution breakdown and status tracking (Active, Improving, Resolved).
- **Standardized AEFI Adverse Event Reporting**:
  - 4-step guided wizard for reporting Adverse Events Following Immunization (AEFI).
  - Structured output aligned with FDA/CDC VAERS and international WHO pharmacovigilance standards with instant report generation.
- **On-Call Clinicians & Telehealth Video Consultation**:
  - Board-certified physicians directory with verified credentials, specialty badges, and live wait times.
  - Interactive simulated telehealth video call room with real-time controls.
- **Vaccine Safety & Reactogenicity Directory**:
  - Interactive library covering COVID-19 mRNA, Influenza, Tdap, Shingrix, HPV, MMR, Hepatitis B, and Pneumococcal vaccines.
  - Onset timelines, typical duration, reactogenicity probability meters, and red-flag symptoms.
- **Theme Support**:
  - Includes both **Dark Luxury** and **White (Light)** themes with seamless, persistent switching via top navigation.
- **Emergency Dispatch & Hotlines**:
  - One-click global emergency modal with direct dispatch numbers (911, Poison Control 1-800-222-1222, Emergency 112) and warning criteria.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Tailored Design System with CSS variables and responsive glassmorphism)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Keyframe Animations

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Anurag-Sonawane/Vaxcare.git

# Navigate to project directory
cd Vaxcare

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be running at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```

---

## 📄 License
MIT License. Evidence-based informational platform designed for post-vaccine health vigilance.
