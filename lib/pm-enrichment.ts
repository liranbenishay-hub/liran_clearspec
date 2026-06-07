/**
 * PM Enrichment Engine
 *
 * Generates context-aware enrichment cards and auto-fill suggestions
 * based on the user's initial product idea and detected domain signals.
 *
 * No paid AI APIs. All logic is rule-based and replaceable with an API call later.
 * To swap in a real LLM: replace generateAutoFill() with an async API call.
 */

// ── Context detection ──────────────────────────────────────────────────────

export type InputContext =
  | "general"
  | "permissions"
  | "technical"
  | "financial"
  | "compliance"
  | "ai-product"
  | "ux-design"
  | "b2b-ops"
  | "onboarding"
  | "short-input";

export function detectContexts(input: string): InputContext[] {
  const s = input.toLowerCase();
  const contexts: InputContext[] = [];

  if (s.split(/\s+/).filter(Boolean).length < 12) contexts.push("short-input");
  if (/portal|dashboard|admin|permission|role\b|access control|visibility|user.manag|scope/.test(s)) contexts.push("permissions");
  if (/\bapi\b|integrat|webhook|backend|endpoint|database|data model|sync|payload|event/.test(s)) contexts.push("technical");
  if (/pric|payment|settl|billing|financ|revenue|invoice|fee|commission|refund|charge/.test(s)) contexts.push("financial");
  if (/onboard|approv|complian|risk|audit|kyb|aml|kyc|due.diligence|screening/.test(s)) contexts.push("compliance");
  if (/\bai\b|ml\b|model|predict|automat|generat|copilot|embed|classify|detect/.test(s)) contexts.push("ai-product");
  if (/\bux\b|\bui\b|\bbutton\b|screen|flow|figma|design|modal|form|navigation|layout/.test(s)) contexts.push("ux-design");
  if (/partner|merchant|iso|b2b|portal|operator|reseller/.test(s)) contexts.push("b2b-ops");
  if (/signup|sign.up|register|activ|first.time|onboard/.test(s)) contexts.push("onboarding");

  return contexts.length > 0 ? contexts : ["general"];
}

// ── PRDData type (forward declaration for typing) ──────────────────────────

export interface PRDEnrichmentData {
  productTitle: string;
  problemStatement: string;
  targetUsers: string;
  currentPain: string;
  goals: string[];
  nonGoals: string[];
  kpis: string[];
  mvpBuild: string[];
  mvpDefer: string[];
  userStories: string[];
  edgeCases: string[];
  technicalConsiderations: string;
  permissionsRoles: string;
  dependencies: string;
  businessImpact: string;
  gtmEnablement: string;
  qaChecklist: string[];
  risks: string[];
  assumptions: string[];
  openQuestions: string[];
  tradeoffs: string;
  rollout: string;
}

// ── Enrichment card interface ──────────────────────────────────────────────

export type PRDEnrichmentKey = keyof PRDEnrichmentData;

export interface DynamicEnrichmentCard {
  id: string;
  title: string;
  icon: string;
  explanation: string; // One sentence, why this matters
  question: string;
  placeholder: string;
  hint?: string;
  answer: string;
  answered: boolean;
  affectsKey: PRDEnrichmentKey;
  updateFn: (answer: string, current: PRDEnrichmentData) => Partial<PRDEnrichmentData>;
  autoFillFn: (input: string, prd: PRDEnrichmentData) => string;
}

// ── Auto-fill suggestion engine ────────────────────────────────────────────
// Replace autoFillFn bodies with async API calls to upgrade to real AI.

function extractSubjectFromPRD(prd: PRDEnrichmentData): string {
  const users = prd.targetUsers.toLowerCase();
  if (users.includes("partner")) return "ISO partners";
  if (users.includes("merchant")) return "merchants";
  if (users.includes("developer")) return "developers";
  if (users.includes("admin")) return "administrators";
  if (users.includes("manager")) return "managers";
  return "users";
}

function extractMetricFromKPIs(prd: PRDEnrichmentData): string {
  return prd.kpis[0]?.split("(")[0]?.trim() ?? "the primary success metric";
}

// ── Card bank per context ──────────────────────────────────────────────────

type CardTemplate = Omit<DynamicEnrichmentCard, "answer" | "answered">;

const GENERAL_CARDS: CardTemplate[] = [
  {
    id: "user-pain",
    title: "Quantify the operational pain",
    icon: "💢",
    explanation: "Vague pain statements don't justify build investment. Quantified pain does.",
    question: "How often does this problem occur and what does it cost — in time, tickets, or manual effort?",
    placeholder: 'e.g. "Partners contact AM support ~3× per week for webhook setup. Each request takes 45 min to resolve and delays merchant activation by 1–2 days."',
    hint: "Support tickets per week, AM hours per month, errors per release, or merchant activation delays all work.",
    affectsKey: "currentPain",
    updateFn: (answer, current) => ({ currentPain: answer }),
    autoFillFn: (input, prd) => {
      const subject = extractSubjectFromPRD(prd);
      return `${subject.charAt(0).toUpperCase() + subject.slice(1)} encounter this problem regularly — likely multiple times per week based on the described workflow. Each occurrence requires manual intervention, creating delays and adding to support load. The current workaround is time-consuming and does not scale as the user base grows.`;
    },
  },
  {
    id: "target-user-detail",
    title: "Define the primary user precisely",
    icon: "👤",
    explanation: "Generic user definitions produce generic specs. Named user types produce testable acceptance criteria.",
    question: "Who specifically is the primary user? Name their role, their day-to-day context, and what they are trying to accomplish.",
    placeholder: 'e.g. "ISO Partner Operations team lead — manages 50–200 merchants, configures pricing and webhooks, monitors portfolio health. Not technical, but operationally fluent."',
    hint: "Name the role, not the persona. What does a typical workday look like for this person?",
    affectsKey: "targetUsers",
    updateFn: (answer, current) => ({ targetUsers: `${current.targetUsers}\n\nUser detail: ${answer}` }),
    autoFillFn: (input, prd) => {
      const subject = extractSubjectFromPRD(prd);
      return `${subject.charAt(0).toUpperCase() + subject.slice(1)} — typically responsible for managing a portfolio of accounts, configuring product settings, and acting as the first point of contact for operational issues. They have process knowledge but are not technical. They need to act quickly without engineering or AM support.`;
    },
  },
  {
    id: "business-impact",
    title: "Tie this to a business outcome",
    icon: "📈",
    explanation: "Every feature should move a business metric. Naming it before build keeps scope honest.",
    question: "Which business metric improves if this ships? Name a specific KPI and an expected direction.",
    placeholder: 'e.g. "Partner support ticket volume drops by 30%. AM time freed up to focus on high-value partner relationships instead of configuration support."',
    hint: "Support ticket reduction, activation rate, time-to-value, retention, AM escalation rate — pick the most direct one.",
    affectsKey: "businessImpact",
    updateFn: (answer, current) => ({ businessImpact: answer }),
    autoFillFn: (input, prd) => {
      const metric = extractMetricFromKPIs(prd);
      return `This directly improves ${metric}. By eliminating the manual intervention currently required, it reduces operational load on support and AM teams, and shortens time-to-value for the affected user group. Secondary benefit: reduces error-driven escalations that currently block downstream workflows.`;
    },
  },
  {
    id: "success-metric-number",
    title: "Make the metric measurable",
    icon: "📊",
    explanation: "A metric without a number and timeframe is a direction, not a success criterion.",
    question: "What specific number and timeframe defines success for this feature?",
    placeholder: 'e.g. "Reduce webhook-related support tickets by 40% within 90 days of launch. Baseline: measure 4 weeks pre-launch."',
    hint: "Include: the metric, the target number, the timeframe, and how you will measure the baseline.",
    affectsKey: "kpis",
    updateFn: (answer, current) => ({ kpis: [answer, ...current.kpis.slice(1)] }),
    autoFillFn: (input, prd) => {
      const metric = extractMetricFromKPIs(prd);
      return `${metric} — target: ≥40% improvement within 60 days of launch. Baseline measurement starts 4 weeks before go-live. Secondary metric: reduction in AM escalations for this specific workflow category.`;
    },
  },
  {
    id: "rollout-pilot",
    title: "Name the pilot group",
    icon: "🚀",
    explanation: "A phased rollout without a named pilot group becomes a full rollout on day one.",
    question: "Who gets this first, and what is the go/no-go signal before broader rollout?",
    placeholder: 'e.g. "Phase 1: 3 internal accounts we manage directly. Phase 2: expand to 10 pilot partners after 2 weeks with zero critical bugs."',
    hint: "Name specific accounts or user types — not just 'a small group'.",
    affectsKey: "rollout",
    updateFn: (answer, current) => ({ rollout: `Pilot: ${answer}\n\n${current.rollout}` }),
    autoFillFn: (input, prd) => {
      return `Phase 1: 2–3 internal or managed accounts with direct feedback loop. Ship behind a feature flag. Monitor support tickets and error logs for 2 weeks. Expand to 10 external pilot users after zero critical bugs in Phase 1. Full rollout after pilot success gate.`;
    },
  },
  {
    id: "open-question-blocker",
    title: "Name the biggest open question",
    icon: "❓",
    explanation: "Open questions without owners become production bugs. Name the riskiest one now.",
    question: "What is the most important unresolved question before engineering can start?",
    placeholder: 'e.g. "Does this require a new database table, or can it extend the existing merchant config model? Owner: Engineering lead. Must resolve before sprint planning."',
    hint: "Technical dependencies, permission authority, compliance requirements, or data availability — which is the riskiest?",
    affectsKey: "openQuestions",
    updateFn: (answer, current) => ({ openQuestions: [answer, ...current.openQuestions] }),
    autoFillFn: (input, prd) => {
      return `Who has the authority to enable this feature per user or account — is it Rapyd-controlled, partner-controlled, or self-service? This must be resolved before the permission model is designed. Owner: PM + Engineering lead. Blocker for spec finalisation.`;
    },
  },
];

const PERMISSIONS_CARDS: CardTemplate[] = [
  {
    id: "role-hierarchy",
    title: "Define the permission tiers",
    icon: "🔐",
    explanation: "In B2B products, who can see vs who can edit vs who can create are often different roles — and getting this wrong creates security or UX bugs post-launch.",
    question: "Which roles should have View, Edit, and Create access to this feature?",
    placeholder: 'e.g. "Owner role: full access. Agent role: view + edit, no create. Viewer role: read-only. RBO admin: enable/disable this feature per account."',
    hint: "Name the specific roles in your system — not generic 'admin' and 'user'.",
    affectsKey: "permissionsRoles",
    updateFn: (answer, current) => ({ permissionsRoles: answer }),
    autoFillFn: (input, prd) => {
      return `Platform admin: full control including enable/disable per account.\nAccount Owner: full access — create, edit, delete.\nAgent/Operator role: edit and view, cannot delete or change configuration.\nViewer role: read-only access.\nThis feature should be off by default, enabled per account by platform admin.`;
    },
  },
  {
    id: "visibility-scope",
    title: "Scope data visibility",
    icon: "👁",
    explanation: "Without explicit visibility scoping, users accidentally see data that belongs to other accounts — a trust-breaking bug.",
    question: "What data scope does each user type see? Can they see all records or only their own?",
    placeholder: 'e.g. "Partners see only merchants they created. Partner Owners see all users under their partner account. Rapyd sees all partners."',
    hint: "Start with the smallest safe default — least privilege — and expand from there.",
    affectsKey: "permissionsRoles",
    updateFn: (answer, current) => ({ permissionsRoles: `${current.permissionsRoles}\n\nVisibility scope: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Each user sees only records within their account scope. Admins at the platform level see all accounts. Sub-users see only records they own or were explicitly shared with them. Cross-account visibility is not permitted without explicit platform-level approval.`;
    },
  },
  {
    id: "audit-compliance",
    title: "Define the audit trail requirement",
    icon: "📋",
    explanation: "For any action that affects financial data, partner configurations, or compliance-sensitive records, an audit log is non-negotiable.",
    question: "What user actions on this feature need to be logged, and who needs to access those logs?",
    placeholder: 'e.g. "Every create, edit, and delete action must be logged with: user ID, timestamp, old value, new value. Accessible by Rapyd compliance team in the back office."',
    hint: "If this touches pricing, billing, permissions, or compliance data — assume full audit logging is required.",
    affectsKey: "permissionsRoles",
    updateFn: (answer, current) => ({ permissionsRoles: `${current.permissionsRoles}\n\nAudit: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `All create, edit, and delete actions must be logged with: user ID, timestamp, IP address, and before/after values for changed fields. Logs must be accessible in the back-office admin panel. Soft-delete only — no physical deletion of records that may be needed for compliance review.`;
    },
  },
];

const TECHNICAL_CARDS: CardTemplate[] = [
  {
    id: "api-dependencies",
    title: "Map the technical dependencies",
    icon: "⚙️",
    explanation: "Unidentified API or database dependencies are the most common cause of scope change after sprint start.",
    question: "Which systems, APIs, or databases does this feature depend on — and which team owns each?",
    placeholder: 'e.g. "Depends on: Merchant Config API (owned by Platform team), Webhook Registry (owned by Infra team). Both teams must confirm read/write access before spec is finalised."',
    hint: "Name the specific APIs and their owning teams. If you don't know, that's an open question for the spec.",
    affectsKey: "dependencies",
    updateFn: (answer, current) => ({ dependencies: answer }),
    autoFillFn: (input, prd) => {
      return `Requires confirmation from engineering on: (1) whether existing APIs support this or new endpoints are needed, (2) any database schema changes, (3) downstream event propagation (webhooks, notifications). Owner: Engineering lead. Must be resolved before sprint planning.`;
    },
  },
  {
    id: "failure-handling",
    title: "Define failure states",
    icon: "⚠️",
    explanation: "Unhandled failures are production incidents. Every integration point needs an explicit failure behavior.",
    question: "What happens when something fails — API timeout, partial write, invalid input, or service unavailability?",
    placeholder: 'e.g. "If the webhook validation fails: show a clear error message with the specific reason. Do not save. Allow retry. If the downstream system is unavailable: queue the request and notify the user when complete."',
    hint: "For each integration point: what does the user see, what gets saved, and what is the recovery path?",
    affectsKey: "edgeCases",
    updateFn: (answer, current) => ({ edgeCases: [...current.edgeCases, `Failure handling: ${answer}`] }),
    autoFillFn: (input, prd) => {
      return `API timeout (>5s): show inline error, do not save partial state, allow retry. Validation failure: show field-level error messages, do not proceed. Service unavailable: show maintenance message, queue request if possible. Network error mid-form: preserve user input in local state, do not lose work.`;
    },
  },
  {
    id: "data-model",
    title: "Clarify data ownership and storage",
    icon: "🗄️",
    explanation: "Where data lives and who owns it determines API design, compliance requirements, and migration complexity.",
    question: "What new data needs to be stored, updated, or displayed? Where does it live and who owns it?",
    placeholder: 'e.g. "New webhook config record per partner account. Stored in the Partner Config table. Owned by the Partner team. Displayed in PAPO, controlled by RBO toggle."',
    hint: "New table vs existing table? UI display only or persisted? Who is the read/write owner?",
    affectsKey: "technicalConsiderations",
    updateFn: (answer, current) => ({ technicalConsiderations: `${current.technicalConsiderations}\n\nData: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Confirm with engineering: (1) does this require a new database entity or extend an existing model? (2) What is the relationship to existing records (1:1, 1:many)? (3) Does this data need to be audited or versioned? (4) Who is the authoritative source for this data if it's shared across systems?`;
    },
  },
];

const FINANCIAL_CARDS: CardTemplate[] = [
  {
    id: "financial-edge-cases",
    title: "Name the financial edge cases",
    icon: "💰",
    explanation: "Financial logic edge cases become support escalations or compliance incidents. Catching them in the spec is 10× cheaper than in production.",
    question: "What financial scenarios could go wrong — rounding errors, currency mismatches, refunds, failed charges, or concurrent edits?",
    placeholder: 'e.g. "What happens if two users edit the same pricing template simultaneously? What if a merchant has transactions in flight when a pricing change is applied?"',
    hint: "Think about: concurrency, partial states, rollback scenarios, and reporting accuracy.",
    affectsKey: "edgeCases",
    updateFn: (answer, current) => ({ edgeCases: [...current.edgeCases, answer] }),
    autoFillFn: (input, prd) => {
      return `Key financial edge cases to define: (1) Concurrent edit conflict — what happens when two users modify the same financial record simultaneously? (2) In-flight transactions — does a pricing change affect transactions already in progress? (3) Audit trail — every change to a financial value must log old and new values with user ID and timestamp. (4) Rollback — can a financial configuration change be reversed, and if so, what is the process?`;
    },
  },
  {
    id: "compliance-controls",
    title: "Define compliance controls",
    icon: "🔒",
    explanation: "Financial features often require compliance sign-off on specific controls — catching this late delays launch.",
    question: "What compliance requirements apply to this feature? Who in operations or legal needs to review?",
    placeholder: 'e.g. "Settlement time changes require CompOPS approval. Pricing changes must be logged for audit. Finance team lead must review before launch."',
    hint: "Who in your organization has approval authority over this financial logic?",
    affectsKey: "openQuestions",
    updateFn: (answer, current) => ({ openQuestions: [...current.openQuestions, `Compliance: ${answer}`] }),
    autoFillFn: (input, prd) => {
      return `CompOPS (Compliance Operations) must review any changes to: fee structures, settlement timing, pricing templates, or financial reporting logic. Legal review required if this affects partner contracts. Finance team must validate calculation logic before QA. Open question: is there a formal approval gate or an informal review?`;
    },
  },
  {
    id: "reporting-needs",
    title: "Define reporting and reconciliation needs",
    icon: "📑",
    explanation: "Finance and operations teams need to reconcile financial data — features that generate financial records without reporting access create invisible problems.",
    question: "What reporting or reconciliation access do Finance, Operations, or Compliance teams need for this feature?",
    placeholder: 'e.g. "Finance needs: daily export of pricing changes with effective dates. CompOPS needs: audit log of all configuration changes with before/after values."',
    hint: "What does the downstream reconciliation workflow look like for this data?",
    affectsKey: "businessImpact",
    updateFn: (answer, current) => ({ businessImpact: `${current.businessImpact}\n\nReporting: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Finance team requires: exportable audit log of all changes with effective dates and user attribution. Operations requires: real-time view of current configurations per account. All financial data changes must be reconcilable — meaning old values, new values, timestamps, and user IDs are logged and queryable.`;
    },
  },
];

const COMPLIANCE_CARDS: CardTemplate[] = [
  {
    id: "sla-definition",
    title: "Define the SLA and response time",
    icon: "⏱️",
    explanation: "Compliance and onboarding workflows without defined SLAs create ambiguity about what 'done' means.",
    question: "What is the expected response time or SLA for this workflow, and how is it tracked?",
    placeholder: 'e.g. "AML review cases must be assigned within 24 hours and resolved within 5 business days. SLA timer starts when case is created. Tracked in the case management dashboard."',
    hint: "Who is accountable for meeting the SLA, and what happens when it is missed?",
    affectsKey: "technicalConsiderations",
    updateFn: (answer, current) => ({ technicalConsiderations: `${current.technicalConsiderations}\n\nSLA: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `SLA requires definition before spec is finalized: (1) What is the maximum acceptable time for this workflow to complete? (2) Who is accountable — which team or role owns the SLA? (3) What triggers an SLA breach notification? (4) Is there an escalation path when the SLA is about to be missed?`;
    },
  },
  {
    id: "exception-handling",
    title: "Define exception handling",
    icon: "🔄",
    explanation: "Compliance workflows always have exceptions — edge cases where the standard flow does not apply. Leaving these undefined creates manual workarounds.",
    question: "What are the exception scenarios — cases where the standard compliance flow does not apply and manual intervention is needed?",
    placeholder: 'e.g. "Exception: merchant from a restricted jurisdiction requires manual review before standard automated approval. Exception: case created during system downtime must be manually triaged."',
    hint: "Who handles exceptions, and what visibility do they have into the exception queue?",
    affectsKey: "edgeCases",
    updateFn: (answer, current) => ({ edgeCases: [...current.edgeCases, `Exception: ${answer}`] }),
    autoFillFn: (input, prd) => {
      return `Exception scenarios to define explicitly: (1) What happens when automated checks fail and manual review is needed? (2) Who is notified and through what channel? (3) Is there a separate queue or dashboard for exceptions? (4) What data does the reviewer need to see to make a decision? (5) What is the SLA for exception resolution vs standard resolution?`;
    },
  },
];

const AI_PRODUCT_CARDS: CardTemplate[] = [
  {
    id: "human-override",
    title: "Define the human review path",
    icon: "🧑‍⚖️",
    explanation: "AI features without a human override path create situations where wrong outputs cannot be corrected — a trust-breaking product gap.",
    question: "When should a human review or override the AI output, and what does that workflow look like?",
    placeholder: 'e.g. "If confidence score is below 70%, flag for manual review. Reviewer sees: AI recommendation, confidence score, source data. Can approve, reject, or edit the output."',
    hint: "What is the confidence threshold that triggers review? Who reviews, and what information do they need?",
    affectsKey: "technicalConsiderations",
    updateFn: (answer, current) => ({ technicalConsiderations: `${current.technicalConsiderations}\n\nHuman review: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Human review is required when: (1) AI confidence score falls below a defined threshold, (2) the AI action affects a high-value record (above a defined threshold), or (3) the action is irreversible. The reviewer must see: the AI recommendation, the confidence score, the source data used, and an explanation of why this was flagged. Approve/reject/edit options must all be available.`;
    },
  },
  {
    id: "fallback-behavior",
    title: "Define the AI fallback",
    icon: "🔁",
    explanation: "When the AI fails, returns low confidence, or is unavailable — the product must not break. Define the fallback before build.",
    question: "What happens when the AI is unavailable, returns an error, or produces a low-confidence result?",
    placeholder: 'e.g. "If AI service is unavailable: fall back to the manual workflow with a clear message. If confidence is low: show result with a warning label, do not auto-apply."',
    hint: "Graceful degradation: what is the product experience when AI assistance is not available?",
    affectsKey: "edgeCases",
    updateFn: (answer, current) => ({ edgeCases: [...current.edgeCases, `AI fallback: ${answer}`] }),
    autoFillFn: (input, prd) => {
      return `Fallback scenarios: (1) AI service unavailable → fall back to manual workflow, surface clear user message, do not block the task. (2) Low confidence output → surface result with a "Review recommended" label, require explicit user confirmation before applying. (3) AI returns error → log the error silently, present manual workflow, alert the engineering on-call if error rate exceeds threshold.`;
    },
  },
  {
    id: "data-quality",
    title: "Define data quality requirements",
    icon: "🧹",
    explanation: "AI model quality is directly limited by training data quality. Defining data requirements early prevents model failures post-launch.",
    question: "What data does the AI depend on, and what are the quality standards for that data?",
    placeholder: 'e.g. "Depends on: merchant transaction history (min 90 days), product category labels (must be >95% accurate), partner configuration data (must be complete, no null required fields)."',
    hint: "What is the minimum data required for the AI to function? What data quality failures cause incorrect outputs?",
    affectsKey: "dependencies",
    updateFn: (answer, current) => ({ dependencies: `${current.dependencies}\n\nAI data: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Data requirements for AI reliability: (1) Minimum data volume per entity before AI activation (e.g., 30 days of data). (2) Required fields that must be non-null for the model to run. (3) Data freshness requirement — how stale can the training data be? (4) What happens for new accounts with no history — is there a cold-start strategy?`;
    },
  },
];

const UX_DESIGN_CARDS: CardTemplate[] = [
  {
    id: "empty-loading-error-states",
    title: "Define all UI states",
    icon: "🎨",
    explanation: "AI builders and rapid prototypes cover the happy path. Empty, loading, and error states are always missed — and always noticed by users.",
    question: "What do the empty state, loading state, error state, and success state look like for this feature?",
    placeholder: 'e.g. "Empty: illustration + message + primary CTA to get started. Loading: skeleton loader, not spinner. Error: inline message with specific reason + retry action. Success: brief confirmation, then auto-dismiss."',
    hint: "Sketch all four states before Figma starts. Each state needs: visual, message copy, and a next action.",
    affectsKey: "edgeCases",
    updateFn: (answer, current) => ({ edgeCases: [...current.edgeCases, `UI states: ${answer}`] }),
    autoFillFn: (input, prd) => {
      return `Four states to define before Figma:\n• Empty: show a message explaining why there's no data + a primary CTA to create or add the first record. Avoid blank screens.\n• Loading: skeleton loader that matches the loaded layout (not a spinner in the middle). Appears after 300ms delay.\n• Error: inline message with the specific reason (not "Something went wrong") + a clear retry or contact option.\n• Success: brief confirmation message, auto-dismiss after 3 seconds, no full-page redirect unless necessary.`;
    },
  },
  {
    id: "mobile-behavior",
    title: "Define mobile behavior",
    icon: "📱",
    explanation: "Desktop-first design consistently produces broken mobile layouts. Defining mobile behavior before design starts prevents rework.",
    question: "Does this feature need to work on mobile? If yes, what is different about the mobile experience?",
    placeholder: 'e.g. "Yes, partners frequently use tablets. The data table collapses to a card list on mobile. The action buttons move to a sticky bottom bar. The form becomes a full-screen modal."',
    hint: "What is the minimum viewport this must work on? What layout patterns change on narrow screens?",
    affectsKey: "technicalConsiderations",
    updateFn: (answer, current) => ({ technicalConsiderations: `${current.technicalConsiderations}\n\nMobile: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Mobile requirements: (1) Minimum viewport: 375px (iPhone SE). (2) Data tables collapse to scrollable card lists below 768px. (3) Primary action buttons must be reachable without scrolling — sticky bottom bar or top-right placement. (4) Form inputs must be tall enough for touch targets (44px minimum). (5) Test on iOS Safari and Android Chrome before release.`;
    },
  },
  {
    id: "feature-discovery",
    title: "Define how users find this feature",
    icon: "🔍",
    explanation: "The Communication Center adoption gap is a real example: merchants didn't know the feature existed. Feature discoverability must be planned, not assumed.",
    question: "How will users discover this new feature? What in-product signal guides them to it?",
    placeholder: 'e.g. "New navigation item in the primary sidebar. One-time in-product tooltip on first login post-launch. Email announcement to all affected users before go-live."',
    hint: "If discovery is not planned, the feature will not be used — regardless of quality.",
    affectsKey: "gtmEnablement",
    updateFn: (answer, current) => ({ gtmEnablement: `${current.gtmEnablement}\n\nDiscovery: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Discovery plan: (1) Navigation: add this feature to the primary navigation or a logical submenu where users would look for it. (2) In-product: one-time contextual tooltip on first interaction post-launch — not an interruptive modal. (3) Email: targeted announcement to the affected user segment 1–2 days before launch. (4) Training: if this affects operations teams, deliver a short walkthrough before enabling for all users.`;
    },
  },
];

const B2B_OPS_CARDS: CardTemplate[] = [
  {
    id: "channel-model",
    title: "Clarify the channel model",
    icon: "🏗️",
    explanation: "In partner/merchant/platform models, the channel hierarchy determines who controls what — and violating it creates routing bugs.",
    question: "In this three-tier model (platform → partner → merchant), which tier controls this feature and what does each tier see or do?",
    placeholder: 'e.g. "Platform (RBO): enables/disables per partner. Partner (PAPO): configures for their merchants. Merchant (CP): read-only view of what the partner has configured."',
    hint: "Start with who has the authority. Then work down: what does each tier below see or control?",
    affectsKey: "permissionsRoles",
    updateFn: (answer, current) => ({ permissionsRoles: `${current.permissionsRoles}\n\nChannel model: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Three-tier permission model:\n• Platform (RBO): controls whether this feature is available per partner account (on/off toggle). Has visibility into all configurations.\n• Partner (PAPO): manages their own configuration within platform-defined limits. Cannot exceed platform-set boundaries.\n• Merchant (CP): receives the result of partner configuration. May have read-only view. Cannot override partner settings.\n\nConflict rule: platform settings always take precedence over partner settings.`;
    },
  },
  {
    id: "operational-scale",
    title: "Define operational scale requirements",
    icon: "📦",
    explanation: "B2B platform features often need to work for power users managing hundreds of accounts — and scale requirements change the design.",
    question: "What is the expected volume this feature needs to handle — accounts, records, operations per day?",
    placeholder: 'e.g. "Partners manage 10 to 500+ merchants. The feature must load in under 2 seconds for a partner with 200 merchants. Bulk operations must handle up to 100 merchants simultaneously."',
    hint: "What does a power user look like? Design for the 90th percentile, not the median.",
    affectsKey: "technicalConsiderations",
    updateFn: (answer, current) => ({ technicalConsiderations: `${current.technicalConsiderations}\n\nScale: ${answer}` }),
    autoFillFn: (input, prd) => {
      return `Scale requirements to confirm with engineering: (1) What is the max number of records this UI needs to display — and at what count does pagination, infinite scroll, or virtual rendering become necessary? (2) What is the SLA for page load time at the 90th percentile volume? (3) If bulk operations are included, what is the max batch size and expected processing time?`;
    },
  },
];

const ONBOARDING_CARDS: CardTemplate[] = [
  {
    id: "minimum-viable-onboarding",
    title: "Define the minimum required information",
    icon: "✂️",
    explanation: "Every extra field before the user sees value increases drop-off. Define what is truly required at activation vs what can be collected later.",
    question: "What is the minimum information needed before a user can access the product's core value? What can be collected after?",
    placeholder: 'e.g. "Required at sign-up: email + company name. Required before first use: payment method. Everything else (role, team size, use case) can be collected in the post-activation onboarding flow."',
    hint: "Default to less. Every field in an onboarding form reduces completion rate by ~10%.",
    affectsKey: "mvpBuild",
    updateFn: (answer, current) => ({ mvpBuild: [...current.mvpBuild, `Minimum viable onboarding: ${answer}`] }),
    autoFillFn: (input, prd) => {
      return `Minimum required at activation: email address, password or SSO, and the one piece of context needed to route the user correctly (e.g., company name or account type). Everything else should be deferred to post-activation:\n• Role and team size → ask after first login\n• Use case and goals → ask during product activation, not sign-up\n• Billing information → require only at the point where it blocks access to a paid feature`;
    },
  },
  {
    id: "first-value-moment",
    title: "Define the first value moment",
    icon: "⚡",
    explanation: "The fastest path from sign-up to first value is a product decision, not a UX decision. Defining it early shapes the entire onboarding flow.",
    question: "What is the first action a new user should complete that proves the product works for them?",
    placeholder: 'e.g. "First merchant onboarded via the partner portal. This is the value moment — everything before it is friction to reduce."',
    hint: "The first value moment is the moment a user thinks 'this actually works'. Everything before it is cost.",
    affectsKey: "goals",
    updateFn: (answer, current) => ({ goals: [`First value moment: ${answer}`, ...current.goals] }),
    autoFillFn: (input, prd) => {
      return `The first value moment should be: the first successful completion of the core workflow this product enables. Everything in the onboarding flow should be optimized to get the user to this moment as quickly as possible. Measure time-from-sign-up to first value moment as a primary activation metric. Any step that does not directly contribute to reaching this moment is a candidate for removal.`;
    },
  },
];

// ── Card selection logic ───────────────────────────────────────────────────

function pickCards(contexts: InputContext[], count = 6): CardTemplate[] {
  const picked: CardTemplate[] = [];
  const used = new Set<string>();

  function addIfNew(card: CardTemplate) {
    if (!used.has(card.id) && picked.length < count) {
      picked.push(card);
      used.add(card.id);
    }
  }

  // Short input: prioritize discovery-type questions
  if (contexts.includes("short-input")) {
    [GENERAL_CARDS[0], GENERAL_CARDS[1], GENERAL_CARDS[3]].forEach(addIfNew);
  }

  // Context-specific cards (first 2 from each detected context)
  if (contexts.includes("permissions")) B2B_OPS_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("technical")) TECHNICAL_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("financial")) FINANCIAL_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("compliance")) COMPLIANCE_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("ai-product")) AI_PRODUCT_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("ux-design")) UX_DESIGN_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("b2b-ops")) B2B_OPS_CARDS.slice(0, 2).forEach(addIfNew);
  if (contexts.includes("onboarding")) ONBOARDING_CARDS.slice(0, 2).forEach(addIfNew);

  // Fill remaining slots with general cards
  GENERAL_CARDS.forEach(addIfNew);

  return picked.slice(0, count);
}

// ── Public API ─────────────────────────────────────────────────────────────

export function buildDynamicEnrichmentCards(
  input: string,
  prd: PRDEnrichmentData
): DynamicEnrichmentCard[] {
  const contexts = detectContexts(input);
  const templates = pickCards(contexts, 6);

  return templates.map((t) => ({
    ...t,
    answer: "",
    answered: false,
  }));
}

export function generateAutoFill(
  card: DynamicEnrichmentCard,
  input: string,
  prd: PRDEnrichmentData
): string {
  return card.autoFillFn(input, prd);
}
