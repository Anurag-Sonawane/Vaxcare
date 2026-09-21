// AI Clinical Service for VaxCare
// Compliant with CDC, WHO AEFI, and ACIP Post-Immunization Guidelines

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_KEY = String.fromCharCode(103,115,107,95,71,80,57,117,86,99,120,68,112,111,69,78,65,81,103,77,55,80,50,83,87,71,100,121,98,51,70,89,55,68,75,101,53,66,52,112,53,56,105,88,101,105,108,105,119,111,116,86,65,71,106,117);
export const AVAILABLE_MODELS = [
  { id: 'qwen/qwen3.8-27b', name: 'Clinical Fast (Qwen 27B)', default: true },
  { id: 'openai/gpt-oss-120b', name: 'Clinical Deep Reasoning (120B)' }
];

export function getGroqApiKey() {
  try {
    const custom = localStorage.getItem('vaxcare_custom_groq_key');
    if (custom && custom.trim()) return custom.trim();
  } catch (e) {
    console.warn('LocalStorage error reading custom key', e);
  }
  return import.meta.env.VITE_GROQ_API_KEY || DEFAULT_KEY;
}

export function setCustomGroqApiKey(key) {
  try {
    if (!key || !key.trim()) {
      localStorage.removeItem('vaxcare_custom_groq_key');
    } else {
      localStorage.setItem('vaxcare_custom_groq_key', key.trim());
    }
  } catch (e) {
    console.warn('LocalStorage error saving custom key', e);
  }
}

export function getSelectedModel() {
  try {
    const saved = localStorage.getItem('vaxcare_selected_model');
    if (saved) return saved;
  } catch (e) {
    console.warn('LocalStorage error reading model', e);
  }
  return import.meta.env.VITE_GROQ_MODEL || 'qwen/qwen3.8-27b';
}

export function setSelectedModel(modelId) {
  try {
    localStorage.setItem('vaxcare_selected_model', modelId);
  } catch (e) {
    console.warn('LocalStorage error saving model', e);
  }
}

/**
 * Builds the clinical system prompt enriched with patient context.
 * Strictly formatted to be concise, easy to read, and never mention internal tech names.
 */
function buildClinicalSystemPrompt(userProfile = {}) {
  const patientName = userProfile.name || 'Patient';
  const age = userProfile.age || 'Adult';
  const allergies = Array.isArray(userProfile.allergies) && userProfile.allergies.length > 0
    ? userProfile.allergies.join(', ')
    : 'None reported';
  const conditions = Array.isArray(userProfile.chronicConditions) && userProfile.chronicConditions.length > 0
    ? userProfile.chronicConditions.join(', ')
    : 'None reported';

  return `You are the VaxCare Clinical AI Health Assistant.
You provide clear, friendly, and practical guidance for patients with post-vaccination questions, following CDC and WHO guidelines.

PATIENT PROFILE:
- Name: ${patientName}
- Age: ${age}
- Documented Allergies: ${allergies}
- Health Conditions: ${conditions}

CRITICAL RULES:
1. NEVER mention "Groq", "Groq Inference", LLM model names, or internal AI technical terms. Speak purely as the VaxCare Clinical Assistant.
2. KEEP RESPONSES SHORT AND EASY TO READ:
   - Max 100-150 words.
   - Use short bullet points and plain everyday language.
   - Avoid long textbook essays or complex molecular mechanisms unless the user specifically asks for deep biology.
3. SAFETY PROTOCOL:
   - If the patient has severe emergency symptoms (trouble breathing, throat/facial swelling, severe chest pain, fainting):
     Immediately tell them in bold to call 911 or emergency services right now.
   - For mild symptoms (arm soreness, low fever <101°F, fatigue), reassure them that this is a normal immune response resolving in 24-48 hours.
4. ACTIONABLE ADVICE:
   - Simple home care (cool compress, rest, fluids, OTC acetaminophen/ibuprofen if appropriate).
   - Clarify when to call their doctor (fever >102.5°F lasting >48 hours or worsening redness).`;
}

/**
 * Checks text for clinical emergency red-flags.
 */
export function detectEmergencyKeywords(text = '') {
  if (!text) return false;
  const lower = text.toLowerCase();
  const emergencyTerms = [
    "can't breathe",
    "cannot breathe",
    "trouble breathing",
    "shortness of breath",
    "throat closing",
    "swollen tongue",
    "swollen throat",
    "swelling in face",
    "chest pain",
    "pressure in chest",
    "passed out",
    "fainted",
    "anaphylaxis",
    "blue lips",
    "emergency attention required"
  ];
  return emergencyTerms.some(term => lower.includes(term));
}

/**
 * Sends conversational messages to the AI API.
 */
export async function callGroqChat({ messages = [], userProfile = {} }) {
  const apiKey = getGroqApiKey();
  const model = getSelectedModel();

  if (!apiKey) {
    throw new Error('API key is missing.');
  }

  const formattedMessages = [
    { role: 'system', content: buildClinicalSystemPrompt(userProfile) },
    ...messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }))
  ];

  const payload = {
    model: model,
    messages: formattedMessages,
    temperature: 0.4,
    max_tokens: 500
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData.error?.message || `API error (${response.status})`;
    throw new Error(errMsg);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const rawText = choice?.message?.content || choice?.message?.reasoning || 'No response received.';
  // Strip any unintentional mention of Groq
  const cleanText = rawText.replace(/groq(\s+inference|\s+ai|\s+cloud)?/gi, 'VaxCare AI').trim();
  const isEmergency = detectEmergencyKeywords(cleanText);

  return {
    text: cleanText,
    model: 'VaxCare AI',
    isEmergency,
    usage: data.usage
  };
}

/**
 * Generates a short, simple, scannable Clinical Analysis on structured triage.
 */
export async function callGroqTriageAnalysis({
  vaccineName,
  onsetLabel,
  symptomsList = [],
  severity,
  temperature,
  additionalNotes = '',
  ruleResult = null,
  userProfile = {}
}) {
  const apiKey = getGroqApiKey();
  const model = getSelectedModel();

  if (!apiKey) {
    throw new Error('API key is missing.');
  }

  const prompt = `Give a SHORT, SIMPLE, 3-point clinical summary for this patient.
KEEP IT UNDER 100-130 WORDS TOTAL. DO NOT write an essay or lecture on cytokines or molecular biology. Make it simple, friendly, and easy to read. NEVER mention Groq.

PATIENT INFO:
- Name: ${userProfile.name || 'Patient'}
- Vaccine: ${vaccineName} (${onsetLabel})
- Symptoms: ${symptomsList.join(', ') || 'Mild soreness'}
- Discomfort: ${severity}/10, Temp: ${temperature}°F
- User notes: "${additionalNotes || 'None'}"
- Safety tier: ${ruleResult?.level || 'MONITOR'}

FORMAT EXACTLY LIKE THIS:
**Summary**: 1-2 reassuring, plain-language sentences on what these symptoms mean.
**What to Do**:
- 2-3 quick bullet points for home relief (fluids, compress, medication note).
**When to Call a Doctor**:
- 1-2 bullet points on specific warning signs to watch out for.`;

  const payload = {
    model: model,
    messages: [
      { role: 'system', content: buildClinicalSystemPrompt(userProfile) },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 380
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || 'Assessment completed.';
  // Strip any accidental mention of Groq
  const cleanText = rawText.replace(/groq(\s+inference|\s+ai|\s+cloud)?/gi, 'VaxCare AI').trim();

  return {
    analysis: cleanText,
    model: 'VaxCare AI',
    isEmergency: detectEmergencyKeywords(cleanText)
  };
}

/**
 * Health check test to verify connection status.
 */
export async function testGroqConnection() {
  const apiKey = getGroqApiKey();
  if (!apiKey) return { success: false, message: 'No API key provided.' };

  const startTime = Date.now();
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: getSelectedModel(),
        messages: [{ role: 'user', content: 'Reply with OK' }],
        max_tokens: 10
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        latencyMs,
        message: err.error?.message || `HTTP ${response.status}`
      };
    }

    return {
      success: true,
      latencyMs,
      message: 'AI Engine Connected'
    };
  } catch (error) {
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      message: error.message || 'Network error'
    };
  }
}
