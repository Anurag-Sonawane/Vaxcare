// Clinical Triage Rules and AI Medical Analysis Engine
// Compliant with CDC, WHO AEFI, and ACIP clinical guidelines

export const SYMPTOM_OPTIONS = [
  { id: "arm_pain", label: "Injection Site Pain / Tenderness", category: "local", expected: true },
  { id: "arm_swelling", label: "Injection Site Swelling or Redness", category: "local", expected: true },
  { id: "arm_lump", label: "Firm Knot or Nodule at Injection Site", category: "local", expected: true },
  { id: "fatigue", label: "Fatigue or General Tiredness", category: "systemic", expected: true },
  { id: "headache_mild", label: "Mild to Moderate Headache", category: "systemic", expected: true },
  { id: "muscle_aches", label: "Muscle or Body Aches (Myalgia)", category: "systemic", expected: true },
  { id: "chills", label: "Chills or Shivering", category: "systemic", expected: true },
  { id: "low_fever", label: "Low-Grade Fever (<101°F / 38.3°C)", category: "fever", expected: true },
  { id: "high_fever", label: "High Fever (>102.5°F / 39.2°C)", category: "fever", redFlag: true },
  { id: "fever_extreme", label: "Severe Spike Fever (>104°F / 40°C)", category: "fever", emergency: true },
  { id: "facial_swelling", label: "Swelling of Face, Lips, Tongue, or Throat", category: "allergic", emergency: true },
  { id: "breathing_difficulty", label: "Difficulty Breathing, Stridor, or Wheezing", category: "respiratory", emergency: true },
  { id: "chest_pain", label: "Chest Pain, Pressure, or Rapid Palpitations", category: "cardiac", emergency: true },
  { id: "hives_widespread", label: "Widespread Hives or Itchy Allergic Rash", category: "allergic", urgent: true },
  { id: "severe_headache_vision", label: "Severe Intractable Headache with Vision Changes", category: "neurological", urgent: true },
  { id: "unusual_bruising", label: "Unexplained Pinpoint Bruising (Petechiae) or Bleeding", category: "hematologic", urgent: true },
  { id: "limb_weakness", label: "Ascending Numbness or Weakness in Legs/Arms", category: "neurological", urgent: true },
  { id: "joint_pain", label: "Joint Pain or Stiffness", category: "systemic", expected: true },
  { id: "nausea", label: "Mild Nausea or Stomach Upset", category: "gi", expected: true },
  { id: "swollen_lymph", label: "Swollen Lymph Nodes (Armpit or Neck)", category: "lymphatic", expected: true },
  { id: "shoulder_restricted", label: "Severe Shoulder Pain with Inability to Move Arm (SIRVA)", category: "musculoskeletal", urgent: true },
  { id: "fainting_syncope", label: "Dizziness, Lightheadedness, or Fainting Episode", category: "vasovagal", urgent: true }
];

export const ONSET_TIMELINES = [
  { value: "immediate", label: "Within 15 - 30 minutes" },
  { value: "few_hours", label: "2 to 6 hours after" },
  { value: "next_day", label: "12 to 24 hours after (Next day)" },
  { value: "2_to_3_days", label: "2 to 3 days after" },
  { value: "1_to_2_weeks", label: "1 to 2 weeks after" },
  { value: "more_than_2_weeks", label: "Over 2 weeks after" }
];

export function evaluateSymptoms({ vaccineId, onset, selectedSymptoms, severity, temperature, additionalNotes = "" }) {
  const notesLower = additionalNotes.toLowerCase();
  
  // Emergency indicators
  const hasEmergencySymptom = selectedSymptoms.some(s => s.emergency);
  const emergencyKeywords = ["can't breathe", "cannot breathe", "swollen tongue", "throat closing", "passed out", "chest pain", "blue lips", "anaphylaxis"];
  const notesEmergency = emergencyKeywords.some(kw => notesLower.includes(kw));
  const isExtremeFever = Number(temperature) >= 104.0;

  if (hasEmergencySymptom || notesEmergency || isExtremeFever) {
    return {
      level: "EMERGENCY",
      badgeColor: "rose",
      title: "Immediate Medical Emergency Attention Required",
      summary: "You have reported symptoms that may indicate a severe allergic reaction (anaphylaxis), cardiovascular reaction, or acute medical urgency.",
      action: "Call 911, 112, or your local emergency response immediately, or proceed to the nearest Emergency Room. Do not drive yourself.",
      actionIcon: "AlertOctagon",
      isEmergency: true,
      recommendations: [
        "Call emergency services (911 / 112) without delay.",
        "If you have a prescribed epinephrine auto-injector (EpiPen) and are experiencing throat swelling or breathing distress, administer it immediately.",
        "Lie flat with your legs elevated unless breathing is difficult (in which case sit upright).",
        "Have someone stay with you until emergency medical responders arrive."
      ],
      disclaimer: "CRITICAL: This assessment has identified potential life-safety red flags. The AI is an informational tool and cannot replace emergency medical evaluation."
    };
  }

  // Urgent Doctor Review indicators
  const hasUrgentSymptom = selectedSymptoms.some(s => s.urgent);
  const isHighSeverity = severity >= 8;
  const isPersistentHighFever = Number(temperature) >= 102.5 && (onset === "2_to_3_days" || onset === "1_to_2_weeks");
  const delayedUnusualOnset = onset === "more_than_2_weeks" && selectedSymptoms.length > 0;

  if (hasUrgentSymptom || isHighSeverity || isPersistentHighFever || delayedUnusualOnset) {
    return {
      level: "URGENT",
      badgeColor: "amber",
      title: "Physician Evaluation Strongly Recommended",
      summary: "Your symptoms or severity warrant timely clinical evaluation by a healthcare professional within 6 to 12 hours.",
      action: "Contact your primary care doctor, visit an Urgent Care clinic, or request a Telehealth Consultation.",
      actionIcon: "AlertTriangle",
      isEmergency: false,
      recommendations: [
        "Reach out to your doctor or call our on-demand consultation service.",
        "Document your temperature and symptom progression using our Symptom Tracker.",
        "Prepare an Adverse Event Report (AEFI) to share directly with your clinician.",
        "If your breathing becomes labored or facial swelling develops, escalate immediately to emergency care."
      ],
      disclaimer: "This guidance is educational. A licensed physician should evaluate acute, severe, or progressive symptoms."
    };
  }

  // Moderate / Monitor at Home
  const hasModerateSymptoms = severity >= 5 || selectedSymptoms.length >= 3 || Number(temperature) >= 101.0;
  if (hasModerateSymptoms) {
    return {
      level: "MONITOR",
      badgeColor: "blue",
      title: "Moderate Reactogenicity — Active Home Monitoring",
      summary: "Your symptoms represent a moderate immune response. While uncomfortable, these are frequently observed and typically resolve within 48 to 72 hours.",
      action: "Practice supportive home care and log your symptoms twice daily. Contact a doctor if symptoms persist beyond 3 days.",
      actionIcon: "Clock",
      isEmergency: false,
      recommendations: [
        "Apply a cool, damp cloth to the injection site for 15-minute intervals.",
        "Ensure plentiful hydration and allow your body ample rest.",
        "Over-the-counter acetaminophen or ibuprofen can help relieve soreness and fever if medically appropriate for you.",
        "Continue logging in the Symptom Tracker to track your recovery curve."
      ],
      disclaimer: "AI Guidance only. Contact your healthcare provider if symptoms worsen or fail to improve after 72 hours."
    };
  }

  // Mild Expected Reactogenicity
  return {
    level: "EXPECTED_MILD",
    badgeColor: "teal",
    title: "Typical Expected Immune Response",
    summary: "Your reported symptoms match standard, mild reactogenicity. This indicates your immune system is responding actively and developing protective antibodies.",
    action: "Continue mild supportive care. Symptoms should spontaneously diminish over the next 24 to 48 hours.",
    actionIcon: "CheckCircle2",
    isEmergency: false,
    recommendations: [
      "Gentle arm movements help disperse localized swelling and relieve soreness.",
      "Stay hydrated with water and warm soothing liquids.",
      "Avoid strenuous upper-body lifting or vigorous exercise for 24 hours.",
      "No special medication is required unless discomfort prevents rest."
    ],
    disclaimer: "AI Guidance only. This is not medical advice. Re-assess if new symptoms appear."
  };
}

export function generateChatResponse(userMessage, context = {}) {
  const msg = userMessage.toLowerCase();

  // Emergency triggers in text
  if (
    msg.includes("can't breathe") ||
    msg.includes("cannot breathe") ||
    msg.includes("trouble breathing") ||
    msg.includes("swollen tongue") ||
    msg.includes("throat closing") ||
    msg.includes("chest pain") ||
    msg.includes("severe chest") ||
    msg.includes("passed out") ||
    msg.includes("anaphylaxis")
  ) {
    return {
      text: `🚨 **EMERGENCY WARNING**: The symptoms you described (such as breathing difficulty, throat swelling, or severe chest pain) are potential signs of a life-threatening reaction (e.g., anaphylaxis or acute cardiac inflammation).\n\n**Please take immediate action:**\n1. **Call 911, 112, or your local emergency hotline right now.**\n2. If you have an epinephrine auto-injector (EpiPen) and feel throat tightness or wheezing, use it immediately.\n3. Do not attempt to drive yourself to the hospital.\n\n*This AI platform is an informational tool and cannot replace emergency emergency medical services.*`,
      isEmergency: true,
      suggestConsultation: true
    };
  }

  // Pain relievers / Medication questions
  if (msg.includes("pain killer") || msg.includes("tylenol") || msg.includes("ibuprofen") || msg.includes("paracetamol") || msg.includes("acetaminophen") || msg.includes("advil")) {
    return {
      text: `💊 **Medication Advice for Post-Vaccine Discomfort**:\n\n- **After vaccination:** Over-the-counter analgesics such as acetaminophen (Tylenol/Paracetamol) or NSAIDs (like Ibuprofen/Advil) can be taken to relieve headache, fever, or localized pain if you do not have personal medical contraindications.\n- **Before vaccination (Prophylactic):** Routine preventive use *prior* to getting vaccinated is **not recommended** by the CDC, as high doses beforehand may theoretically dampen the initial antibody response.\n- **Children & Teens:** Never give Aspirin to children or adolescents due to the risk of Reye's syndrome.\n\n*Consult your physician or pharmacist for specific dosages suited to your health history.*`,
      isEmergency: false,
      suggestConsultation: false
    };
  }

  // Arm pain / Swelling
  if (msg.includes("arm") || msg.includes("soreness") || msg.includes("swelling") || msg.includes("redness") || msg.includes("lump")) {
    return {
      text: `🩹 **Managing Injection Site Soreness & Swelling**:\n\nLocalized soreness, warmth, and mild redness are the most frequent vaccine reactions (affecting up to 80% of individuals).\n\n**Recommended Care:**\n- **Cool compress:** Apply a clean, cool damp cloth over the area for 10-15 minutes, 3-4 times daily.\n- **Gentle movement:** Exercising your arm gently stimulates lymphatic flow and prevents muscle stiffness.\n- **Firm knot/lump:** A small painless nodule may remain for 1-3 weeks (especially with tetanus/aluminum adjuvants); this is completely normal.\n\n⚠️ **When to call a doctor:** If redness expands outward after 24-48 hours, skin becomes fiery hot and painful (potential cellulitis), or you cannot move your shoulder (SIRVA).`,
      isEmergency: false,
      suggestConsultation: false
    };
  }

  // Fever
  if (msg.includes("fever") || msg.includes("temperature") || msg.includes("hot") || msg.includes("chills")) {
    return {
      text: `🌡️ **Post-Vaccination Fever Guidelines**:\n\n- **Normal Low-Grade Fever (<101°F / 38.3°C):** Typically arises 12-24 hours post-dose and resolves within 24-48 hours. It reflects healthy pyrogenic cytokine signaling during immune response synthesis.\n- **Supportive Care:** Stay well hydrated, wear lightweight clothing, and rest.\n- **When to be concerned:**\n  - Fever higher than **104°F (40°C)** is an emergency.\n  - Fever lasting **longer than 72 hours** warrants contacting a doctor to rule out concurrent infection.\n  - With the MMR vaccine, note that fever is expected on days **7 to 12**, not the first 24 hours.`,
      isEmergency: false,
      suggestConsultation: false
    };
  }

  // Shingles (Shingrix) specific
  if (msg.includes("shingles") || msg.includes("shingrix")) {
    return {
      text: `🛡️ **Shingrix (Shingles) Reactogenicity Insights**:\n\nShingrix contains a specialized adjuvant system designed to awaken deep cell-mediated immunity in older adults. Because of this, it is known for noticeable 'reactogenicity':\n- ~75-80% experience pronounced arm soreness.\n- ~45% experience body aches, fatigue, or mild chills lasting 2 to 3 days.\n- Although unpleasant, this strong reaction correlates with over 90% protection against shingles and chronic postherpetic neuralgia.\n\n*Tip: Plan your 2nd dose when you can rest the next day.*`,
      isEmergency: false,
      suggestConsultation: false
    };
  }

  // Adverse event reporting / VAERS
  if (msg.includes("report") || msg.includes("vaers") || msg.includes("adverse event") || msg.includes("record")) {
    return {
      text: `📋 **Adverse Event Reporting (AEFI)**:\n\nYou can use our structured **'Report Adverse Event'** tool on this platform to record and generate an official AEFI report.\n\n- Reports capture vaccine lot number, onset time, clinical severity, and medical background.\n- You can export a clinical PDF summary to present directly to your doctor or healthcare provider.\n- Health authorities (such as CDC/FDA VAERS in the US or Yellow Card in the UK) rely on these reports to detect rare safety signals.\n\n*Would you like me to take you directly to the AEFI reporting form?*`,
      isEmergency: false,
      suggestConsultation: false
    };
  }

  // General helpful fallback
  return {
    text: `Hello! I'm your **VaxCare AI Health Assistant**. I can help you understand post-vaccination symptoms, evaluate whether your reaction is typical, guide home comfort measures, or identify when clinical review is needed.\n\n**Helpful topics to ask me:**\n- *"Is my fever normal 24 hours after the flu shot?"*\n- *"What should I do for severe arm swelling?"*\n- *"Can I take pain relievers after getting vaccinated?"*\n- *"How do I file an adverse event report?"*\n\n⚠️ *Important Notice: I provide evidence-based health information for educational triage. I am not a doctor and cannot provide formal medical diagnoses. If you have emergency symptoms, please call 911 or 112 immediately.*`,
    isEmergency: false,
    suggestConsultation: false
  };
}
