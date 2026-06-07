/**
 * Hebrew Input Support
 *
 * Handles Hebrew-language user input while keeping the PRD output in English.
 * All logic is rule-based and structured so any function can be replaced
 * with a real translation/AI API call later — just swap the function body.
 *
 * To upgrade to real AI: replace the return values in `paraphraseHebrewAnswer()`
 * with an async API call to your translation or LLM endpoint.
 */

// ── Detection ──────────────────────────────────────────────────────────────

/** Returns true if the string contains any Hebrew characters */
export function containsHebrew(text: string): boolean {
  return /[֐-׿יִ-ﭏ]/.test(text);
}

/** Returns the proportion of Hebrew characters in the string (0–1) */
export function hebrewRatio(text: string): number {
  if (!text.trim()) return 0;
  const hebrewChars = (text.match(/[֐-׿יִ-ﭏ]/g) ?? []).length;
  const totalChars = text.replace(/\s/g, "").length;
  return totalChars > 0 ? hebrewChars / totalChars : 0;
}

/** Returns true if the text is predominantly Hebrew (>40% Hebrew characters) */
export function isPredominantlyHebrew(text: string): boolean {
  return hebrewRatio(text) > 0.4;
}

// ── Initial input handling ─────────────────────────────────────────────────

/**
 * Processes initial product idea input that may contain Hebrew.
 * Returns an English-safe version for PRD generation.
 *
 * For the rule-based version: extracts context signals that survive language barriers
 * (numbers, product names, technical terms) and returns a generic English wrapper.
 *
 * To upgrade: replace this function body with an API call to translate/interpret.
 */
export function processHebrewInitialInput(hebrewInput: string): {
  englishContext: string;
  detectedDomain: string;
  note: string;
} {
  // Extract anything that looks like a number, percentage, or technical term
  const numbers = hebrewInput.match(/\d+[%kmKM]?/g) ?? [];
  const techTerms = hebrewInput.match(/[A-Za-z]{3,}/g) ?? [];

  // Detect domain from Hebrew common terms
  const lower = hebrewInput;
  const domainHints: { pattern: RegExp; domain: string; englishContext: string }[] = [
    { pattern: /מחיר|תמחור|עלות|תשלום|חשבונית/, domain: "pricing", englishContext: "pricing or payment configuration workflow" },
    { pattern: /הטמעה|סיפוח|לקוח חדש|רישום|הצטרפות/, domain: "onboarding", englishContext: "user onboarding or activation flow" },
    { pattern: /חיפוש|מציאה|ניווט|גלישה|גישה/, domain: "discovery", englishContext: "search, navigation, or feature discovery" },
    { pattern: /שותף|סוחר|ספק|מפיץ/, domain: "b2b-ops", englishContext: "partner or merchant operational workflow" },
    { pattern: /נייד|טלפון|אפליקציה|מובייל/, domain: "mobile", englishContext: "mobile experience or responsive design" },
    { pattern: /הרשאה|תפקיד|גישה|מנהל|אדמין/, domain: "permissions", englishContext: "permissions, roles, or access control" },
    { pattern: /API|ממשק|אינטגרציה|webhook|נתונים/, domain: "technical", englishContext: "API, integration, or data workflow" },
    { pattern: /ציות|תאימות|בקרה|אבטחה|דיווח/, domain: "compliance", englishContext: "compliance, audit, or regulatory workflow" },
    { pattern: /בינה מלאכותית|AI|מודל|אוטומט/, domain: "ai-product", englishContext: "AI feature or automation" },
    { pattern: /UX|עיצוב|מסך|ממשק משתמש|כפתור/, domain: "ux-design", englishContext: "UX design or user interface" },
  ];

  let detectedDomain = "general";
  let englishContext = "product improvement in an unspecified domain";

  for (const { pattern, domain, englishContext: ctx } of domainHints) {
    if (pattern.test(lower)) {
      detectedDomain = domain;
      englishContext = ctx;
      break;
    }
  }

  const quantifiers = numbers.length > 0 ? ` Specific quantities mentioned: ${numbers.join(", ")}.` : "";
  const technical = techTerms.length > 0 ? ` Technical terms referenced: ${techTerms.join(", ")}.` : "";

  return {
    englishContext,
    detectedDomain,
    note: `Input provided in Hebrew — PRD generated in English based on detected context: ${englishContext}.${quantifiers}${technical}`,
  };
}

// ── Enrichment answer handling ─────────────────────────────────────────────

/**
 * Context-specific English paraphrases for Hebrew enrichment answers.
 * Keyed by enrichment card ID from pm-enrichment.ts.
 *
 * To upgrade: pass the Hebrew text + card context to a translation/LLM API
 * and return the translated string directly.
 */
const CARD_PARAPHRASES: Record<string, string> = {
  "user-pain": "The user indicated there is significant operational pain in this workflow that creates friction, delays, and additional support burden. This pain is experienced regularly and is preventing the team from scaling efficiently.",
  "target-user-detail": "The user identified a specific primary user group with defined operational responsibilities in this workflow. This user type operates under time constraints and needs to act independently without AM or support intervention.",
  "business-impact": "The user described expected business impact including measurable improvements to key operational and efficiency metrics. The expected outcome reduces manual effort and improves the experience for the affected user group.",
  "success-metric-number": "The user specified measurable success criteria with a quantifiable target and timeframe. The metric directly tracks the outcome of the described problem being solved.",
  "rollout-pilot": "The user described a phased rollout approach beginning with a controlled pilot group before broader deployment. The pilot includes a defined success gate before expanding access.",
  "open-question-blocker": "The user identified a critical unresolved dependency that must be answered before engineering can proceed. This question affects the core architecture or permission model of the feature.",
  "role-hierarchy": "The user described the role and permission structure for this feature, including which roles have read, write, and administrative access at each level of the product hierarchy.",
  "visibility-scope": "The user described the data visibility scope for different user types, including what each role can see and what is hidden. Least-privilege principle applies.",
  "audit-compliance": "The user specified audit trail and compliance requirements for actions in this feature. All relevant changes must be logged with user attribution and timestamps.",
  "api-dependencies": "The user identified technical dependencies including APIs, databases, or external systems that this feature relies on. Ownership and availability of these dependencies must be confirmed before sprint planning.",
  "failure-handling": "The user described how the system should behave when things go wrong — including API failures, invalid inputs, and service unavailability. Clear user-facing messages and recovery paths are required.",
  "data-model": "The user specified data storage and ownership requirements for this feature, including where data lives, who owns it, and how it relates to existing records.",
  "financial-edge-cases": "The user identified financial edge cases that require explicit handling — including concurrent edits, in-flight transactions, and reconciliation requirements.",
  "compliance-controls": "The user identified compliance requirements and approval workflows for this financial feature. Specific teams or roles must review before launch.",
  "reporting-needs": "The user described reporting and reconciliation requirements for finance and operations teams. All financial changes must be exportable and auditable.",
  "sla-definition": "The user defined the SLA and response time expectations for this workflow, including who is accountable and what triggers an SLA breach notification.",
  "exception-handling": "The user described exception scenarios where the standard workflow does not apply and manual intervention is required. Exception queues and escalation paths are needed.",
  "human-override": "The user defined the human review path for AI-generated outputs, including the confidence threshold that triggers manual review and what information the reviewer needs to see.",
  "fallback-behavior": "The user described the fallback behavior when the AI is unavailable or produces low-confidence results. Graceful degradation to manual workflow is required.",
  "data-quality": "The user specified data quality requirements for the AI model, including minimum data volume, required fields, freshness requirements, and cold-start handling.",
  "empty-loading-error-states": "The user defined the four required UI states: empty state with CTA, skeleton loading, specific error messages with retry, and success confirmation.",
  "mobile-behavior": "The user confirmed mobile requirements including minimum viewport, touch optimization, and layout adaptations for narrow screens.",
  "feature-discovery": "The user described how users will discover this new feature through navigation, in-product nudges, email announcement, and team training.",
  "channel-model": "The user described the three-tier permission model for this feature: platform controls, partner controls, and merchant controls, including conflict resolution rules.",
  "operational-scale": "The user confirmed operational scale requirements including maximum record volume, performance targets, and bulk operation capabilities.",
  "minimum-viable-onboarding": "The user identified the minimum information required at activation, with all other data deferred to post-activation flows to maximize completion rates.",
  "first-value-moment": "The user defined the first value moment — the specific action that proves the product works for the user. Everything before it is friction to minimize.",
};

/**
 * Generates an English paraphrase for a Hebrew enrichment answer.
 * Uses the card ID to provide contextually appropriate language.
 *
 * Replace this function body with an API call to upgrade to real translation.
 */
export function paraphraseHebrewAnswer(cardId: string): string {
  return (
    CARD_PARAPHRASES[cardId] ??
    "The user provided additional context for this section in Hebrew. The intent indicates this area requires specific attention. Confirm and expand in English for the final spec."
  );
}

/**
 * Processes an enrichment answer that may contain Hebrew.
 * Returns the answer to use in the PRD.
 *
 * - If English: use as-is
 * - If Hebrew: generate English paraphrase
 * - If mixed: use English parts, note the Hebrew context
 *
 * To upgrade: pass text + cardId to a translation API and return the result.
 */
export function processEnrichmentAnswer(
  answer: string,
  cardId: string
): {
  processedAnswer: string;
  wasHebrew: boolean;
  userNote?: string;
} {
  if (!containsHebrew(answer)) {
    return { processedAnswer: answer, wasHebrew: false };
  }

  if (isPredominantlyHebrew(answer)) {
    // Primarily Hebrew — use contextual paraphrase
    return {
      processedAnswer: paraphraseHebrewAnswer(cardId),
      wasHebrew: true,
      userNote: "Hebrew input detected. English interpretation used in the PRD. To add your exact wording, type in English.",
    };
  }

  // Mixed: extract English parts + note Hebrew context
  const englishParts = answer
    .split(/\s+/)
    .filter((word) => !/[֐-׿יִ-ﭏ]/.test(word))
    .join(" ")
    .trim();

  const baseParaphrase = paraphraseHebrewAnswer(cardId);
  const combined = englishParts
    ? `${englishParts} — ${baseParaphrase}`
    : baseParaphrase;

  return {
    processedAnswer: combined,
    wasHebrew: true,
    userNote: "Hebrew content detected. English parts preserved, Hebrew context interpreted.",
  };
}
