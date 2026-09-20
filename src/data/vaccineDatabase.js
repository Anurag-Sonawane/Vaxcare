// Comprehensive, evidence-based vaccine safety database
// Sources: CDC Advisory Committee on Immunization Practices (ACIP), WHO Vaccine Safety Guidelines, FDA Package Inserts

export const VACCINE_DATABASE = [
  {
    id: "covid-mrna",
    name: "COVID-19 mRNA (Spikevax / Comirnaty)",
    shortName: "COVID-19 mRNA",
    category: "Viral Respiratory",
    manufacturer: "Moderna / Pfizer-BioNTech",
    targetDiseases: "SARS-CoV-2 Coronavirus Disease",
    standardSchedule: "Primary series + Seasonal updated booster",
    injectionRoute: "Intramuscular (Deltoid)",
    expectedOnset: "12 to 48 hours post-dose",
    typicalDuration: "1 to 3 days",
    description: "mRNA vaccines instruct cells to create a harmless spike protein that triggers a protective immune response against SARS-CoV-2.",
    commonReactions: [
      { name: "Injection Site Pain / Tenderness", frequency: "Very Common (>80%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Fatigue & Malaise", frequency: "Very Common (>65%)", severity: "Mild to Moderate", resolution: "24-48 hrs" },
      { name: "Headache", frequency: "Very Common (>55%)", severity: "Mild to Moderate", resolution: "1-2 days" },
      { name: "Muscle Aches (Myalgia)", frequency: "Common (>50%)", severity: "Mild to Moderate", resolution: "24-48 hrs" },
      { name: "Chills & Low-Grade Fever (<101°F / 38.3°C)", frequency: "Common (30-40%)", severity: "Mild", resolution: "24-36 hrs" },
      { name: "Joint Pain (Arthralgia)", frequency: "Moderate (20-30%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Axillary Lymphadenopathy (Swollen underarm lymph nodes)", frequency: "Moderate (10-15%)", severity: "Mild", resolution: "2-7 days" },
      { name: "Delayed local reaction ('COVID arm' redness/itching at site)", frequency: "Uncommon (1-3%)", severity: "Mild", resolution: "3-5 days" }
    ],
    redFlags: [
      "Difficulty breathing, shortness of breath, or wheezing",
      "Swelling of the lips, tongue, face, or throat (Anaphylaxis warning)",
      "Severe chest pain, palpitations, or feeling of a racing/skipping heart (Myocarditis/Pericarditis check)",
      "Persistent dizziness, lightheadedness, or sudden fainting",
      "High fever exceeding 104°F (40°C) not responding to antipyretics",
      "Severe or persistent headache with blurred vision, neurological weakness, or petechial rash"
    ],
    selfCareAdvice: [
      "Apply a clean, cool, damp washcloth over the injection area to ease soreness.",
      "Stay well hydrated with water and electrolyte fluids.",
      "Light movement of the vaccinated arm helps disperse local inflammation.",
      "Over-the-counter pain relievers (acetaminophen or ibuprofen) may be taken after onset if comfortable and advised by your clinician.",
      "Get plenty of rest; immune activation requires metabolic energy."
    ],
    contraindications: "Severe allergic reaction (anaphylaxis) to any mRNA vaccine component or polyethylene glycol (PEG).",
    safetyFact: "Over 5 billion doses administered globally with extensive continuous safety surveillance by CDC VAERS, V-safe, and WHO GACVS."
  },
  {
    id: "influenza-quadrivalent",
    name: "Influenza Quadrivalent (Flu Vaccine)",
    shortName: "Seasonal Flu",
    category: "Viral Respiratory",
    manufacturer: "Sanofi Pasteur (Fluzone) / Seqirus (Fluarix) / GSK",
    targetDiseases: "Influenza Type A (H1N1, H3N2) & Type B viruses",
    standardSchedule: "Annual single dose in autumn/winter",
    injectionRoute: "Intramuscular (Deltoid)",
    expectedOnset: "6 to 24 hours post-dose",
    typicalDuration: "1 to 2 days",
    description: "Inactivated or recombinant vaccine protecting against four influenza viral strains predicted to circulate during the flu season.",
    commonReactions: [
      { name: "Injection Site Soreness / Redness", frequency: "Very Common (>60%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Low-Grade Fever", frequency: "Common (10-20%)", severity: "Mild", resolution: "24 hrs" },
      { name: "Mild Muscle Aches", frequency: "Common (15-25%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Headache", frequency: "Common (15-20%)", severity: "Mild", resolution: "24 hrs" },
      { name: "Mild Fatigue", frequency: "Common (10-20%)", severity: "Mild", resolution: "24 hrs" }
    ],
    redFlags: [
      "Hives or widespread allergic rash within minutes to hours",
      "Hoarseness, throat tightness, or breathing distress",
      "Rapid heart rate, severe weakness, or paleness",
      "Ascending bilateral numbness or weakness starting in feet/legs (extremely rare Guillain-Barré Syndrome check)",
      "High fever >103°F (39.4°C)"
    ],
    selfCareAdvice: [
      "Keep the injection arm gently active to promote circulation.",
      "Cool compresses reduce localized swelling.",
      "Flu vaccines cannot cause flu illness because the viral antigens are inactivated or recombinant.",
      "Rest and adequate fluid intake."
    ],
    contraindications: "Severe, life-threatening allergy to any flu vaccine ingredient. Note: Most egg-allergic individuals can now safely receive egg-based flu vaccines under updated CDC guidelines.",
    safetyFact: "Flu vaccines have an established 70+ year safety track record and significantly prevent influenza-related hospitalization and heart complications."
  },
  {
    id: "tdap",
    name: "Tdap (Tetanus, Diphtheria, Pertussis)",
    shortName: "Tdap / Whooping Cough",
    category: "Bacterial Toxoid",
    manufacturer: "GSK (Boostrix) / Sanofi Pasteur (Adacel)",
    targetDiseases: "Clostridium tetani, Corynebacterium diphtheriae, Bordetella pertussis",
    standardSchedule: "Booster every 10 years; each pregnancy (27-36 weeks); wound prophylaxis",
    injectionRoute: "Intramuscular (Deltoid)",
    expectedOnset: "12 to 72 hours post-dose",
    typicalDuration: "2 to 4 days",
    description: "Combination booster protecting against tetanus ('lockjaw'), diphtheria, and whooping cough (pertussis).",
    commonReactions: [
      { name: "Localized Arm Pain / Firm Lump", frequency: "Very Common (>75%)", severity: "Mild to Moderate", resolution: "2-5 days" },
      { name: "Injection Site Redness or Swelling", frequency: "Common (20-30%)", severity: "Mild", resolution: "2-3 days" },
      { name: "Fatigue or Feeling Tired", frequency: "Common (30%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Body Aches", frequency: "Common (20%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Mild Gastrointestinal Upset (Nausea/Diarrhea)", frequency: "Uncommon (5-10%)", severity: "Mild", resolution: "24-48 hrs" }
    ],
    redFlags: [
      "Severe pain in shoulder area starting within 48 hours that restricts arm mobility (SIRVA check)",
      "Extensive limb swelling extending beyond elbow or shoulder joint",
      "Severe allergic reaction (hives, tongue/lip swelling, wheezing)",
      "High fever over 102°F (38.9°C)",
      "Seizure or neurological episode"
    ],
    selfCareAdvice: [
      "A small firm nodule at the injection site is common with aluminum-adjuvanted tetanus vaccines and normally resolves over several weeks without treatment.",
      "Cold compress for the first 24 hours, followed by warm compress if tightness persists.",
      "Gently exercise the arm."
    ],
    contraindications: "History of encephalopathy within 7 days of a previous pertussis-containing vaccine.",
    safetyFact: "Tdap protects vulnerable newborn infants from fatal pertussis through maternal transplacental antibody transfer."
  },
  {
    id: "shingles-shingrix",
    name: "Shingles Recombinant (Shingrix)",
    shortName: "Shingrix (Herpes Zoster)",
    category: "Recombinant Subunit",
    manufacturer: "GlaxoSmithKline (GSK)",
    targetDiseases: "Herpes Zoster (Shingles) & Postherpetic Neuralgia",
    standardSchedule: "2-dose series separated by 2 to 6 months (age 50+ or immunocompromised 19+)",
    injectionRoute: "Intramuscular (Deltoid)",
    expectedOnset: "12 to 48 hours post-dose",
    typicalDuration: "2 to 3 days",
    description: "Highly immunogenic recombinant adjuvanted vaccine preventing reactivation of the varicella-zoster virus and chronic nerve pain.",
    commonReactions: [
      { name: "Significant Arm Soreness / Local Swelling", frequency: "Very Common (>78%)", severity: "Moderate", resolution: "2-4 days" },
      { name: "Myalgia (Muscle aches throughout body)", frequency: "Very Common (>45%)", severity: "Moderate", resolution: "2-3 days" },
      { name: "Fatigue", frequency: "Very Common (>45%)", severity: "Moderate", resolution: "2-3 days" },
      { name: "Headache", frequency: "Common (38%)", severity: "Mild to Moderate", resolution: "24-48 hrs" },
      { name: "Shivering / Chills & Fever", frequency: "Common (20-25%)", severity: "Mild to Moderate", resolution: "24-48 hrs" },
      { name: "Stomach upset", frequency: "Moderate (15-20%)", severity: "Mild", resolution: "24-48 hrs" }
    ],
    redFlags: [
      "Severe allergic reaction (facial swelling, respiratory distress)",
      "Severe progressive weakness or tingling in lower extremities",
      "Persistent fever higher than 102.5°F (39.2°C) lasting past 72 hours",
      "Inability to lift or move arm after 4 days"
    ],
    selfCareAdvice: [
      "Shingrix is known to produce a robust immune reaction ('reactogenicity'). This is expected and signals strong immune priming.",
      "Plan the second dose on a day preceding rest (e.g. before a weekend).",
      "Cool compress and OTC pain relievers (acetaminophen/ibuprofen) can substantially alleviate discomfort.",
      "Hydrate well and rest."
    ],
    contraindications: "Severe allergic reaction to any component of Shingrix; current active shingles rash episode.",
    safetyFact: "Provides over 90% efficacy in preventing shingles and disabling postherpetic neuralgia in adults aged 50 and older."
  },
  {
    id: "hpv-gardasil9",
    name: "HPV 9-Valent (Gardasil 9)",
    shortName: "HPV (Gardasil 9)",
    category: "Recombinant VLP",
    manufacturer: "Merck & Co.",
    targetDiseases: "Human Papillomavirus types 6, 11, 16, 18, 31, 33, 45, 52, 58 (Cervical, anogenital, oropharyngeal cancers & warts)",
    standardSchedule: "2-dose series (ages 9-14) or 3-dose series (ages 15-45)",
    injectionRoute: "Intramuscular (Deltoid)",
    expectedOnset: "Immediate to 24 hours",
    typicalDuration: "1 to 2 days",
    description: "Recombinant virus-like particle (VLP) vaccine protecting against nine oncogenic and wart-causing HPV strains.",
    commonReactions: [
      { name: "Injection Site Pain, Redness, Swelling", frequency: "Very Common (>80%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Headache", frequency: "Common (28%)", severity: "Mild", resolution: "24 hrs" },
      { name: "Dizziness / Post-vaccination Syncope (Fainting)", frequency: "Moderate (5-10%)", severity: "Mild/Transient", resolution: "15-30 mins" },
      { name: "Low-grade fever", frequency: "Common (10-13%)", severity: "Mild", resolution: "24 hrs" },
      { name: "Nausea", frequency: "Moderate (5-7%)", severity: "Mild", resolution: "24 hrs" }
    ],
    redFlags: [
      "Immediate wheezing, hives, or breathing constriction",
      "Syncope with head impact or prolonged loss of consciousness (>1 min)",
      "Unrelenting severe limb pain or numbness",
      "High fever exceeding 103°F (39.4°C)"
    ],
    selfCareAdvice: [
      "Recipients (especially adolescents) should remain seated or lying down for 15 minutes after injection to prevent vasovagal fainting (syncope).",
      "Drink a cold beverage or eat a light snack beforehand.",
      "Cold compress for arm soreness."
    ],
    contraindications: "Severe allergic reaction to yeast or any component of Gardasil 9.",
    safetyFact: "Clinical trials and global follow-up across 15+ years show virtually 100% protection against targeted pre-cancerous cervical lesions."
  },
  {
    id: "mmr",
    name: "MMR (Measles, Mumps, Rubella)",
    shortName: "MMR Live Attenuated",
    category: "Live Attenuated Viral",
    manufacturer: "Merck (M-M-R II) / GSK (Priorix)",
    targetDiseases: "Measles (Rubeola), Mumps, Rubella (German Measles)",
    standardSchedule: "Dose 1 at 12-15 months; Dose 2 at 4-6 years (or adult catch-up)",
    injectionRoute: "Subcutaneous (Fatty tissue over triceps/thigh)",
    expectedOnset: "Delayed onset: 5 to 12 days post-vaccination",
    typicalDuration: "2 to 5 days",
    description: "Live-attenuated viral vaccine conferring long-lasting cellular and humoral immunity against three viral diseases.",
    commonReactions: [
      { name: "Injection Site Burning or Stinging", frequency: "Common (20-30%)", severity: "Mild", resolution: "Immediate-24 hrs" },
      { name: "Delayed Fever (101-103°F)", frequency: "Common (5-15%, days 7-12)", severity: "Moderate", resolution: "1-3 days" },
      { name: "Mild Non-Contagious Measles-like Rash", frequency: "Moderate (5%, days 7-10)", severity: "Mild", resolution: "2-4 days" },
      { name: "Temporary Joint Pain/Stiffness", frequency: "Uncommon in kids, Common in adult women (15-25%)", severity: "Mild to Moderate", resolution: "1-3 weeks" },
      { name: "Transient Swollen Cheek/Neck Glands", frequency: "Rare (1%)", severity: "Mild", resolution: "few days" }
    ],
    redFlags: [
      "Febrile seizure (high rapid fever leading to twitching or unresponsiveness)",
      "Unexplained bruising, petechiae, or spontaneous bleeding (rare ITP thrombocytopenia check)",
      "Severe allergic reaction (urticaria, respiratory distress)",
      "High persistent fever >104°F (40°C)",
      "Lethargy, extreme drowsiness, or neck stiffness"
    ],
    selfCareAdvice: [
      "Note that MMR fever and rash typically occur 7-12 days AFTER the shot, not the next day. This delayed timing is completely normal for live viral replication.",
      "Manage fever with hydration and appropriate fever-reducing medications.",
      "The faint rash is not contagious and will fade spontaneously."
    ],
    contraindications: "Pregnancy (avoid conception for 1 month post-dose); severe immunocompromise; history of anaphylaxis to neomycin or gelatin.",
    safetyFact: "Dozens of rigorous worldwide studies involving millions of children have repeatedly demonstrated that MMR is not associated with autism or inflammatory bowel disease."
  },
  {
    id: "hepatitis-b",
    name: "Hepatitis B (Recombivax HB / Engerix-B)",
    shortName: "Hepatitis B",
    category: "Recombinant Subunit",
    manufacturer: "Merck / GSK / Dynavax (Heplisav-B)",
    targetDiseases: "Hepatitis B Virus (HBV) chronic liver infection & cirrhosis",
    standardSchedule: "Birth, 1-2 months, 6-18 months (or 2-dose Heplisav-B for adults)",
    injectionRoute: "Intramuscular (Deltoid or Anterolateral Thigh)",
    expectedOnset: "12 to 24 hours",
    typicalDuration: "1 to 2 days",
    description: "Recombinant hepatitis B surface antigen (HBsAg) vaccine providing durable defense against liver infection and liver cancer.",
    commonReactions: [
      { name: "Injection Site Soreness", frequency: "Common (20-30%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Mild Headache", frequency: "Uncommon (5-10%)", severity: "Mild", resolution: "24 hrs" },
      { name: "Low-Grade Fever", frequency: "Uncommon (1-6%)", severity: "Mild", resolution: "24 hrs" },
      { name: "Mild Fatigue", frequency: "Uncommon (5%)", severity: "Mild", resolution: "24 hrs" }
    ],
    redFlags: [
      "Signs of anaphylaxis (hives, facial swelling, breathing trouble)",
      "Persistent fever or extreme dizziness"
    ],
    selfCareAdvice: [
      "Cool compress on injection site.",
      "Routine gentle daily activity."
    ],
    contraindications: "Severe hypersensitivity to baker's yeast (Saccharomyces cerevisiae).",
    safetyFact: "Considered the world's first anti-cancer vaccine because preventing chronic hepatitis B prevents primary hepatocellular carcinoma."
  },
  {
    id: "pneumococcal",
    name: "Pneumococcal Conjugate (PCV15 / PCV20 - Prevnar)",
    shortName: "Pneumococcal (Prevnar)",
    category: "Bacterial Conjugate",
    manufacturer: "Pfizer / Merck (Vaxneuvance)",
    targetDiseases: "Streptococcus pneumoniae (Pneumonia, meningitis, bacteremia)",
    standardSchedule: "Infant 4-dose series; or single adult dose at age 65+ / chronic condition",
    injectionRoute: "Intramuscular (Deltoid)",
    expectedOnset: "12 to 48 hours",
    typicalDuration: "1 to 3 days",
    description: "Conjugate vaccine protecting against 15 to 20 invasive pneumococcal bacterial serotypes.",
    commonReactions: [
      { name: "Arm Pain, Redness, and Hard Swelling", frequency: "Very Common (>60%)", severity: "Mild to Moderate", resolution: "2-3 days" },
      { name: "Muscle aches", frequency: "Common (30-40%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Fatigue", frequency: "Common (35-40%)", severity: "Mild", resolution: "24-48 hrs" },
      { name: "Low-grade fever", frequency: "Common (10-20%)", severity: "Mild", resolution: "24 hrs" }
    ],
    redFlags: [
      "Breathing constriction or throat swelling",
      "Spreading redness with hot skin expanding beyond 4 inches after 48 hours (Cellulitis check)",
      "Fever over 103°F"
    ],
    selfCareAdvice: [
      "Firm, tender swelling at the injection site is common due to immune conjugate reaction.",
      "Apply cool packs for 15-minute intervals.",
      "Arm mobility exercises."
    ],
    contraindications: "Severe allergy to diphtheria toxoid (used as conjugate carrier protein).",
    safetyFact: "Widespread conjugate pneumococcal vaccination has reduced invasive pneumococcal disease in elderly and pediatric populations by over 90%."
  }
];

export const GENERAL_SAFETY_TIPS = [
  {
    title: "Understanding Reactogenicity",
    summary: "Mild fever, fatigue, and muscle aches are positive signs that your immune system is synthesizing antibodies and memory cells.",
    icon: "ShieldCheck"
  },
  {
    title: "Cold Compress for Local Pain",
    summary: "Apply a cool, clean damp cloth to the injection site for 10-15 minutes at a time to reduce tenderness and swelling without suppressing immune buildup.",
    icon: "IceCream"
  },
  {
    title: "Avoid Prophylactic Antipyretics",
    summary: "Do not take pain medicines *before* vaccination as prevention. If symptoms develop and cause discomfort, acetaminophen or ibuprofen may be taken as directed.",
    icon: "Pill"
  },
  {
    title: "When to Contact a Doctor",
    summary: "If injection site redness expands after 24-48 hours, fever exceeds 102°F and lasts >3 days, or you develop severe unexpected symptoms, contact your healthcare provider.",
    icon: "PhoneCall"
  },
  {
    title: "Emergency Warning Protocol",
    summary: "Call 911 / 112 immediately for signs of anaphylaxis (facial/tongue swelling, throat tightness, wheezing, fainting) or acute chest tightness.",
    icon: "AlertTriangle"
  }
];
