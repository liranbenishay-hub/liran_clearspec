"use client";

import { useState, useEffect, useRef } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  buildDynamicEnrichmentCards,
  generateAutoFill,
  detectContexts,
  type DynamicEnrichmentCard,
  type PRDEnrichmentData,
} from "@/lib/pm-enrichment";
import PRDDocument, { getVisiblePRDKeys, PRDCompletenessBar } from "@/components/tool/prd-document";
import { PRDTOCVertical, PRDTOCHorizontal } from "@/components/tool/prd-toc";
import {
  containsHebrew,
  isPredominantlyHebrew,
  processHebrewInitialInput,
  processEnrichmentAnswer,
} from "@/lib/hebrew-support";

// ── Types ─────────────────────────────────────────────────────────────────────

type CopilotState = "input" | "generating" | "draft";
type Source = "ai" | "user";

// Full PRD data structure — all sections
type PRDData = PRDEnrichmentData;
type PRDKey = keyof PRDData;

// ── PRD Generation Engine ─────────────────────────────────────────────────────

type ProblemType =
  | "pricing" | "onboarding" | "discovery" | "b2b-ops"
  | "mobile" | "retention" | "performance" | "general";

function detectType(input: string): ProblemType {
  const s = input.toLowerCase();
  if (/pric|package|offer|tier|plan|billing|payment/i.test(s)) return "pricing";
  if (/onboard|sign.up|signup|register|activ|first.time/i.test(s)) return "onboarding";
  if (/search|find|discover|navigat|can.t find|locate|where/i.test(s)) return "discovery";
  if (/partner|iso|merchant|b2b|manual|support ticket|am |account manager/i.test(s)) return "b2b-ops";
  if (/mobile|phone|responsive|small screen|tablet/i.test(s)) return "mobile";
  if (/abandon|churn|drop|leave|stop using|retention/i.test(s)) return "retention";
  if (/slow|fast|speed|perform|load/i.test(s)) return "performance";
  return "general";
}

function extractSubject(input: string): string {
  const checks: [RegExp, string][] = [
    [/partner/i, "ISO partners"], [/merchant/i, "merchants"],
    [/developer/i, "developers"], [/admin/i, "administrators"],
    [/manager/i, "managers"], [/customer/i, "customers"],
    [/team/i, "teams"], [/user/i, "users"],
  ];
  for (const [re, label] of checks) if (re.test(input)) return label;
  return "users";
}

function normaliseSentence(s: string): string {
  const t = s.trim().replace(/[.!?]+$/, "");
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function generateTitle(input: string, type: ProblemType): string {
  const cleaned = normaliseSentence(input);
  const typeNames: Record<ProblemType, string> = {
    pricing: "Pricing Configuration", onboarding: "Onboarding",
    discovery: "Feature Discovery", "b2b-ops": "Operational Workflow",
    mobile: "Mobile Experience", retention: "Retention",
    performance: "Performance", general: "Product Improvement",
  };
  const match = cleaned.match(/(?:cannot|can't|struggle|fail|hard to|difficulty)\s+(\w+\s?\w*)/i);
  if (match) return titleCase(`${match[1]} ${typeNames[type]} V1`);
  return `${typeNames[type]} Initiative V1`;
}

function generateProblemStatement(input: string, subject: string, type: ProblemType): string {
  const core = normaliseSentence(input);
  const expansions: Record<ProblemType, string> = {
    pricing: `${subject.charAt(0).toUpperCase() + subject.slice(1)} experience significant friction when configuring pricing packages. ${core}. Without structured guidance and validation at each step, pricing configurations contain errors that require manual correction, delay merchant activation, and generate avoidable support tickets for operations teams.`,
    onboarding: `${core}. This creates a critical drop-off point in the activation journey — users who cannot complete onboarding independently do not reach the product's core value, increasing churn risk and inflating support contact volume before any value has been demonstrated.`,
    discovery: `${subject.charAt(0).toUpperCase() + subject.slice(1)} cannot efficiently locate key workflows and features. ${core}. Poor information architecture increases time-on-task, forces users to contact support for navigation guidance, and reduces product engagement for features that already exist.`,
    "b2b-ops": `${subject.charAt(0).toUpperCase() + subject.slice(1)} depend on manual processes or operational team involvement for tasks that should be self-service. ${core}. This creates a scalability bottleneck: as the user base grows, so does the operational load — without a corresponding increase in team capacity.`,
    mobile: `${core}. Mobile users represent a significant and growing share of product traffic. A degraded mobile experience reduces engagement, increases task abandonment rates, and signals poor product quality to users evaluating the product on first visit.`,
    retention: `${core}. User drop-off before re-engagement or value realisation is a direct threat to retention metrics. Without understanding the specific friction causing abandonment, the problem compounds with each release cycle.`,
    performance: `${core}. Perceived performance directly impacts user trust and task completion rates. A 1-second delay in key workflows can reduce task completion by 10–20% and increase bounce rates significantly on mobile.`,
    general: `${core}. This product gap creates friction that reduces user efficiency, increases the likelihood of task abandonment, and creates additional support burden. Left unaddressed, it will compound as the user base and usage volume grow.`,
  };
  return expansions[type];
}

function generateCurrentPain(subject: string, type: ProblemType): string {
  const painMap: Record<ProblemType, string> = {
    pricing: `${subject.charAt(0).toUpperCase() + subject.slice(1)} currently navigate a complex pricing structure without validation feedback. Each configuration requires significant back-and-forth with the AM or operations team to confirm correctness. Errors are discovered post-save and require manual correction, adding hours to the merchant activation timeline.`,
    onboarding: `The current onboarding requires users to complete all steps without guidance or progress context. Users who get stuck cannot self-recover — they either abandon or contact support. There is no partial-save capability, so dropped sessions mean starting over.`,
    discovery: `Users learn about features through word of mouth, support tickets, or accidental discovery. No in-product guidance exists. The most-used features are buried under generic navigation labels that don't match the user's mental model.`,
    "b2b-ops": `Every action in this workflow requires either AM intervention or a support ticket. There is no self-service path. Operations teams spend significant time on tasks that should be automated or user-controlled.`,
    mobile: `The current mobile experience is a scaled-down desktop layout that does not adapt to touch or narrow viewports. Key actions are inaccessible without scrolling, and data tables overflow horizontally.`,
    retention: `Users reach a friction point and stop. Without session recording or structured drop-off analysis, the exact cause is unknown. The pattern repeats across user segments without improvement.`,
    performance: `Slow page loads and response times create visible waiting states. Users interpret lag as instability. Power users have learned to avoid the slow sections, reducing feature adoption.`,
    general: `The current workflow requires manual steps that could be automated or eliminated. Users have developed workarounds that are fragile and do not scale. The friction accumulates invisibly across each interaction.`,
  };
  return painMap[type];
}

function generateTargetUsers(subject: string, type: ProblemType): string {
  const secondaryMap: Record<ProblemType, string> = {
    pricing: "Finance operations teams reviewing and approving partner pricing configurations",
    onboarding: "Support and onboarding teams handling activation-related queries",
    discovery: "Product and design teams responsible for navigation and information architecture",
    "b2b-ops": "Account managers and operations teams currently handling manual escalations",
    mobile: "Mobile users (iOS and Android) accessing the product from non-desktop devices",
    retention: "Product, growth, and customer success teams tracking engagement metrics",
    performance: "Engineering and infrastructure teams responsible for system response times",
    general: "Product and engineering teams responsible for the affected workflow",
  };
  return `Primary: ${subject.charAt(0).toUpperCase() + subject.slice(1)}\nSecondary: ${secondaryMap[type]}`;
}

function generateGoals(type: ProblemType): string[] {
  const goalSets: Record<ProblemType, string[]> = {
    pricing: ["Reduce average pricing setup time by ≥60% vs current workflow", "Eliminate pricing configuration errors that require post-creation correction", "Enable self-service pricing without AM or operations team involvement"],
    onboarding: ["Increase onboarding completion rate to ≥80% within 30 days of launch", "Reduce time-to-first-value (first successful action) by ≥50%", "Reduce onboarding-related support contacts to near zero"],
    discovery: ["Reduce time-to-task for the three most-used workflows by ≥40%", "Increase feature discovery rate — more users reaching key features within first session", "Reduce navigation-related support contacts by ≥30%"],
    "b2b-ops": ["Reduce manual AM/operations involvement in this workflow by ≥80%", "Reduce end-to-end task completion time by ≥60%", "Scale the workflow to 10× the current user base without adding headcount"],
    mobile: ["Achieve functional parity between mobile and desktop for the core user journey", "Reduce mobile-specific task abandonment rate by ≥50%", "Pass Lighthouse mobile audit with score ≥80"],
    retention: ["Reduce drop-off rate at the identified abandonment point by ≥40%", "Increase percentage of users who return within 7 days of first use", "Identify and eliminate the top three friction points causing abandonment"],
    performance: ["Reduce page or operation response time to below 1 second on median connection", "Achieve Lighthouse performance score ≥80 on mobile", "Eliminate user-reported 'slow' feedback for the affected workflow"],
    general: ["Eliminate the described friction point from the primary user journey", "Improve task completion rate for the affected workflow by ≥40%", "Reduce support contacts related to this problem by ≥50%"],
  };
  return goalSets[type];
}

function generateNonGoals(mvpDefer: string[]): string[] {
  return [
    "Redesigning unrelated parts of the product — this is a focused, targeted fix",
    "Building for user types or permissions levels not named in Target Users",
    ...mvpDefer.slice(0, 2).map((d) => `${d.replace(/Phase 2.*$/, "").trim()} — explicitly deferred to Phase 2`),
  ];
}

function generateKPIs(type: ProblemType): string[] {
  const kpiSets: Record<ProblemType, string[]> = {
    pricing: ["Average time to complete a pricing package setup (baseline vs post-launch)", "Pricing error rate — packages requiring correction within 48 hours of creation", "Support tickets attributed to pricing configuration (weekly volume)"],
    onboarding: ["Onboarding completion rate — % of users who complete all activation steps", "Time to first successful action (T0 to first value event)", "Onboarding drop-off step — which step has the highest abandonment"],
    discovery: ["Task completion rate for the three most-used workflows", "Time-to-task — time from login to completing key actions", "Navigation depth — average clicks before task completion"],
    "b2b-ops": ["% of this workflow completed without manual AM or operations intervention", "Average end-to-end task completion time", "Support tickets related to this workflow (weekly volume)"],
    mobile: ["Mobile task completion rate vs desktop (parity goal)", "Mobile-specific abandonment rate at key interaction points", "Lighthouse mobile performance score for the affected pages"],
    retention: ["7-day and 30-day return rate", "Drop-off rate at the identified abandonment point", "Session length for users who experience this friction vs those who do not"],
    performance: ["Median and P95 response time for the affected operation", "Bounce rate on the affected page (mobile and desktop)", "Lighthouse performance score (mobile, target ≥80)"],
    general: ["Task completion rate for the affected workflow", "Support tickets related to this problem (weekly volume, baseline vs post-launch)", "User satisfaction score (CSAT) for the affected interaction"],
  };
  return kpiSets[type];
}

function generateMVP(type: ProblemType): { build: string[]; defer: string[] } {
  const mvpSets: Record<ProblemType, { build: string[]; defer: string[] }> = {
    pricing: { build: ["Step-by-step pricing builder with guided fields and inline validation", "Real-time error feedback before submission", "Preview of final pricing structure before confirmation"], defer: ["Bulk pricing template duplication and mass-edit (Phase 2)", "Partner-level pricing analytics dashboard (Phase 2)"] },
    onboarding: { build: ["Simplified onboarding flow with step progress indicator", "Clear error states and recovery paths at each step", "Confirmation and next-step guidance after each action"], defer: ["Personalised onboarding path based on user type (Phase 2)", "In-app guided tour overlay (Phase 2)"] },
    discovery: { build: ["Top 3 workflows accessible from primary navigation", "Search or quick-access shortcut for power users", "Visual hierarchy improvements to surface key actions above the fold"], defer: ["Personalised navigation based on role and usage history (Phase 2)", "Global search across all product areas (Phase 2)"] },
    "b2b-ops": { build: ["Self-service workflow replacing the manual process — end-to-end", "Validation at each step to prevent errors that currently require AM correction", "Confirmation state and audit trail for completed actions"], defer: ["Bulk operations for high-volume users (Phase 2)", "Workflow analytics dashboard (Phase 2)"] },
    mobile: { build: ["Responsive layout fixes for primary user journey at 375px–414px", "Touch-optimised interactions — buttons ≥44px, no hover-only states", "Mobile navigation that does not bury the primary CTA"], defer: ["Native mobile gestures for secondary interactions (Phase 2)", "Mobile-specific shortcuts and home screen optimisation (Phase 2)"] },
    retention: { build: ["Fix the top friction point causing abandonment (from analytics)", "Re-engagement nudge at the drop-off step with clear next-action", "Progress indicator so users know where they are in the flow"], defer: ["Personalised re-engagement email sequence (Phase 2)", "In-app coach mark for inactive users (Phase 2)"] },
    performance: { build: ["Optimise the heaviest operation — reduce payload or add client-side caching", "Add loading states for all operations taking >300ms", "Lazy-load non-critical assets on the affected pages"], defer: ["CDN implementation for all static assets (Phase 2)", "Server-side optimisation and database query review (Phase 2)"] },
    general: { build: ["Direct fix for the described friction in the primary user flow", "Error handling and recovery path for the affected interaction", "Validation and feedback to guide users through the corrected flow"], defer: ["Extended improvements building on the MVP fix (Phase 2)", "Analytics and monitoring for the corrected workflow (Phase 2)"] },
  };
  return mvpSets[type];
}

function generateUserStories(subject: string, prd: Partial<PRDData>): string[] {
  return [
    `As a ${subject}, I want to complete this workflow without contacting AM or support, so that I can act independently and at my own pace.`,
    `As a ${subject}, I want clear feedback when I make an error, so that I can correct it immediately without losing my progress.`,
    `As a ${subject}, I want this feature to work on mobile, so that I can take action when I'm not at my desk.`,
  ];
}

function generateEdgeCases(type: ProblemType): string[] {
  const base = [
    "User loses internet connection mid-flow — partial progress must be preserved, not lost",
    "User navigates back using the browser — state must be restored, not reset",
    "Zero-data state — what does the UI show when there is no data yet?",
  ];
  const specific: Partial<Record<ProblemType, string>> = {
    pricing: "What happens if a pricing configuration references a product category that has since been deprecated?",
    onboarding: "What happens if the user's email already exists in the system with a different account type?",
    "b2b-ops": "What happens if two users attempt to edit the same record simultaneously?",
    discovery: "What happens when a user searches for a feature that exists but they do not have permission to access?",
    general: "What happens if a financial configuration is changed while a transaction is in flight?",
  };
  return [...base, ...(specific[type] ? [specific[type]!] : [])];
}

function generateRisks(type: ProblemType): string[] {
  const riskSets: Record<ProblemType, string[]> = {
    pricing: ["Incorrect pricing configurations could result in revenue miscalculation if validation is incomplete", "Migrating existing configurations to the new structure may break current setups during transition", "Partners may resist adoption if it changes familiar patterns — change management required"],
    onboarding: ["Simplifying onboarding may skip data collection needed for downstream processes — validate with ops teams", "Edge cases in the new flow (partial completion, interrupted session) need explicit handling to avoid data loss", "A/B testing paths may create inconsistent user experiences during the experiment period"],
    discovery: ["Restructuring navigation may displace power users who have memorised the current information architecture", "Surface-level navigation changes may not address the underlying mental model mismatch — user testing required", "Adding search without full indexing creates a gap between what users search for and what they find"],
    "b2b-ops": ["Self-service workflows may introduce configuration errors previously caught by AM review", "Removing AM from the flow may surface data quality gaps that the AM currently corrects manually", "Permission model for new self-service capability needs careful design — wrong users accessing sensitive operations"],
    mobile: ["Mobile-only layout changes may affect desktop layout if CSS is not carefully scoped", "Testing across the full range of device sizes (375px to 430px) is essential — do not test on one device only", "Changing touch patterns for existing users may cause initial confusion — requires communication"],
    retention: ["Addressing the drop-off symptom without the root cause may show short-term improvement without lasting results", "Nudges and re-engagement prompts can feel intrusive if shown too frequently — frequency capping required", "Short-term metric improvement may not translate to long-term retention if the core issue is not resolved"],
    performance: ["Performance improvements may not be visible to users if the bottleneck is not where we expect", "Caching improvements can create stale-data issues if cache invalidation is not properly implemented", "Optimising for median performance may not address P95 cases that affect a vocal minority"],
    general: ["Addressing this friction in isolation may expose adjacent friction points previously masked", "Changes to this workflow may have downstream effects on other product areas — cross-team impact assessment needed", "User behaviour after the fix may differ from expectations — plan a structured post-launch review window"],
  };
  return riskSets[type];
}

function generateTechnicalConsiderations(input: string): string {
  const contexts = detectContexts(input);
  if (contexts.includes("technical")) {
    return "Requires backend changes — confirm API design before spec is finalised. Review data model impact with engineering. Consider idempotency for all write operations. Confirm event propagation and webhook impact.";
  }
  if (contexts.includes("financial")) {
    return "Confirm with engineering: does this require changes to the financial calculation layer? All financial data changes must be auditable — old value, new value, timestamp, user ID. Validate calculation logic with FinOps before QA starts.";
  }
  if (contexts.includes("permissions")) {
    return "Permission model must be resolved before design starts. Confirm: which tier controls this (platform / partner / merchant), and what the conflict rule is if multiple tiers can set a value. Soft-delete for any compliance-related records.";
  }
  return "Confirm with engineering before sprint planning: (1) backend changes required? (2) new API endpoints or extending existing? (3) database schema impact? (4) third-party dependencies or integrations affected?";
}

function generateBusinessImpact(kpis: string[], type: ProblemType): string {
  return `Directly improves ${kpis[0] ?? "the primary KPI"}. Reduces operational support load by eliminating manual intervention in this workflow. Expected to improve experience scores for the affected user group and reduce time-to-value. Secondary benefit: reduces error-driven escalations that currently block downstream processes.`;
}

function generateGTMEnablement(type: ProblemType): string {
  return "Before launch: (1) Notify affected users or teams via in-product banner or email 1–2 days before go-live. (2) If this affects partner or merchant workflows, deliver a short walkthrough or video before enabling. (3) Update help centre documentation. (4) Brief AM and support teams before the feature is visible to users.";
}

function generateQAChecklist(type: ProblemType): string[] {
  return [
    "Verify end-to-end happy path in staging before release",
    "Test all error states: invalid input, API failure, session timeout",
    "Test on mobile (375px, 390px) and desktop (1280px, 1440px)",
    "Verify that deferred Phase 2 scope does not appear or partially appear",
    "Test with users who do NOT have the expected permission — confirm they are blocked",
    "Confirm all user actions generate correct audit log entries",
    "Verify feature flag is OFF by default and only enabled for intended cohort",
    "Run regression test on adjacent features that share the same component or API",
  ];
}

function generateRollout(type: ProblemType): string {
  return "Phase 1 — Internal pilot: Enable for 2–3 internal or managed accounts. Gate behind a feature flag. Monitor support tickets and error logs for 1–2 weeks.\nPhase 2 — Pilot group: Expand to 10–20 external users after Phase 1 with zero critical bugs. Collect structured feedback.\nPhase 3 — Full rollout: Enable broadly after pilot success gate. Deliver training if required. Open post-launch feedback window for 30 days.";
}

function generateAssumptions(type: ProblemType): string[] {
  return [
    "The described problem is experienced consistently across the majority of the affected user group, not by a single outlier",
    "The MVP scope covers the most impactful part of the problem — the 80% case — without requiring Phase 2 scope to deliver value",
    "The success metrics defined are measurable from day one using existing analytics infrastructure",
  ];
}

function generateOpenQuestions(type: ProblemType): string[] {
  const typeQs: Partial<Record<ProblemType, string[]>> = {
    pricing: ["Who has approval authority for pricing changes — is there a review gate before a configuration goes live?", "What is the migration path for existing pricing setups to the new structure?"],
    onboarding: ["Which onboarding steps are mandatory vs optional — what can be deferred post-activation?", "What data is required before the user can access the core product?"],
    "b2b-ops": ["What permission level is required for this self-service action — and is there an approval step for high-risk actions?", "What is the audit trail requirement for actions in this new workflow?"],
    discovery: ["Do we have analytics data showing which features are most used — or is this based on internal assumption?", "Should navigation restructuring affect all user roles equally?"],
  };
  const base = ["Has this problem been validated through user research, support tickets, or analytics — or is it based on internal observation?"];
  return [...base, ...(typeQs[type] ?? ["Are there adjacent problems in the same workflow that should be addressed in the same release?"])];
}

function generateTradeoffs(type: ProblemType): string {
  const map: Record<ProblemType, string> = {
    pricing: "Guided step-by-step flow (chosen) gives up flexibility for power users who know the pricing logic. A minimal self-service form (rejected) would have given up error prevention and handling of complex pricing structures.",
    onboarding: "Simplified onboarding (chosen) gives up some upfront data collection. A comprehensive sign-up form (rejected) would have given up completion rate and time-to-value.",
    discovery: "Restructuring navigation by most-used workflows (chosen) gives up discoverability of edge-case features. Keeping the current flat navigation (rejected) would have given up task efficiency for the majority.",
    "b2b-ops": "Full self-service capability (chosen) gives up the error-catching role currently played by AM review. Maintaining AM involvement (rejected) would have given up scalability and operational efficiency.",
    mobile: "Responsive redesign (chosen) gives up some desktop-optimised layout patterns. A separate mobile experience (rejected) would have given up maintenance simplicity.",
    retention: "Fixing the identified friction point (chosen) gives up coverage of all edge-case drop-off scenarios. A full retention redesign (rejected) would have given up delivery timeline.",
    performance: "Client-side optimisation first (chosen) gives up server-side gains that require deeper infrastructure work. Full performance audit (rejected) would have given up a fast ship to production.",
    general: "Targeted fix for the described friction (chosen) gives up coverage of adjacent issues. A broader product redesign (rejected) would have given up delivery timeline.",
  };
  return map[type];
}

function generatePRD(input: string): PRDData {
  const type = detectType(input);
  const subject = extractSubject(input);
  const mvp = generateMVP(type);
  const kpis = generateKPIs(type);
  const userStories = generateUserStories(subject, {});
  const edgeCases = generateEdgeCases(type);

  return {
    productTitle: generateTitle(input, type),
    problemStatement: generateProblemStatement(input, subject, type),
    targetUsers: generateTargetUsers(subject, type),
    currentPain: generateCurrentPain(subject, type),
    goals: generateGoals(type),
    nonGoals: generateNonGoals(mvp.defer),
    kpis,
    mvpBuild: mvp.build,
    mvpDefer: mvp.defer,
    userStories,
    edgeCases,
    businessImpact: generateBusinessImpact(kpis, type),
    technicalConsiderations: generateTechnicalConsiderations(input),
    permissionsRoles: "",
    dependencies: "",
    gtmEnablement: generateGTMEnablement(type),
    qaChecklist: generateQAChecklist(type),
    risks: generateRisks(type),
    assumptions: generateAssumptions(type),
    openQuestions: generateOpenQuestions(type),
    tradeoffs: generateTradeoffs(type),
    rollout: generateRollout(type),
  };
}

// ── Loading stages ────────────────────────────────────────────────────────────

const GEN_STAGES = [
  "Analysing the problem context...",
  "Generating PM structure...",
  "Detecting domain signals...",
  "Building your draft PRD...",
];

// ── Enrichment card view (improved: larger, more prominent, Hebrew-aware) ─────

interface EnrichmentCardViewProps {
  card: DynamicEnrichmentCard;
  input: string;
  prd: PRDData;
  onAnswer: (id: string, answer: string) => void;
}

function EnrichmentCardView({ card, input, prd, onAnswer }: EnrichmentCardViewProps) {
  const [draft, setDraft] = useState(card.answer);
  const [focused, setFocused] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [hebrewNote, setHebrewNote] = useState("");

  function handleDraftChange(value: string) {
    setDraft(value);
    if (containsHebrew(value) && value.trim().length > 3) {
      setHebrewNote("Hebrew detected — English interpretation will be used in the PRD.");
    } else {
      setHebrewNote("");
    }
  }

  function handleAutoFill() {
    setAutoFilling(true);
    setTimeout(() => {
      const suggestion = generateAutoFill(card, input, prd);
      setDraft(suggestion);
      setHebrewNote(""); // Auto-fill is always English
      setAutoFilling(false);
    }, 350);
  }

  function handleApply() {
    if (!draft.trim()) return;
    const { processedAnswer, wasHebrew, userNote } = processEnrichmentAnswer(draft.trim(), card.id);
    if (wasHebrew && userNote) setHebrewNote(userNote);
    onAnswer(card.id, processedAnswer);
  }

  // ── Answered state
  if (card.answered) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-green-500">{card.icon}</span>
            <p className="text-sm font-semibold text-green-800">{card.title}</p>
          </div>
          <span className="font-mono text-[10px] font-semibold text-green-500 shrink-0">✓ Applied</span>
        </div>
        <p className="mt-1.5 text-xs text-green-700 line-clamp-2 leading-relaxed">{card.answer}</p>
      </div>
    );
  }

  // ── Unanswered state — larger, more prominent
  return (
    <div
      className={`rounded-xl border bg-white transition-all ${
        focused ? "border-zinc-400 shadow-sm" : "border-zinc-200"
      }`}
    >
      {/* Card header — area name + icon */}
      <div className="flex items-center gap-2.5 border-b border-zinc-100 px-4 py-3">
        <span className="text-lg leading-none">{card.icon}</span>
        <div>
          <p className="text-sm font-semibold text-zinc-900">{card.title}</p>
          <p className="mt-0.5 text-xs leading-snug text-zinc-400">{card.explanation}</p>
        </div>
      </div>

      {/* Question — visually prominent */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold leading-snug text-zinc-800">
          {card.question}
        </p>

        {/* Hint */}
        {card.hint && (
          <p className="mt-2 rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
            💡 {card.hint}
          </p>
        )}

        {/* Input */}
        <textarea
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={card.placeholder}
          rows={3}
          dir={containsHebrew(draft) ? "rtl" : "ltr"}
          className="mt-3 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-1"
        />

        {/* Hebrew indicator */}
        {hebrewNote && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
            <span>🌐</span>
            <span>{hebrewNote}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-zinc-100 px-4 py-3">
        <button
          onClick={handleAutoFill}
          disabled={autoFilling}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-50"
        >
          {autoFilling ? (
            <><span className="animate-spin inline-block">⟳</span> Suggesting...</>
          ) : (
            <>⚡ Auto-fill suggestion</>
          )}
        </button>
        <button
          onClick={handleApply}
          disabled={!draft.trim()}
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply to PRD ↑
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PMCopilot() {
  const [copilotState, setCopilotState] = useState<CopilotState>("input");
  const [inputText, setInputText] = useState("");
  const [inputError, setInputError] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [prd, setPrd] = useState<PRDData | null>(null);
  const [cards, setCards] = useState<DynamicEnrichmentCard[]>([]);
  const [sources, setSources] = useState<Partial<Record<PRDKey, Source>>>({});
  const [flashKeys, setFlashKeys] = useState<Partial<Record<PRDKey, number>>>({});
  const [copied, setCopied] = useState(false);
  const draftRef = useRef<HTMLDivElement>(null);
  const { setCollapsed } = useSidebar();

  const answeredCount = cards.filter((c) => c.answered).length;
  const totalCards = cards.length || 6;
  const completeness = totalCards > 0
    ? Math.round(50 + (answeredCount / totalCards) * 50)
    : 50;

  useEffect(() => {
    if (copilotState === "draft") setCollapsed(true);
    else setCollapsed(false);
    return () => setCollapsed(false);
  }, [copilotState, setCollapsed]);

  const EXAMPLES = [
    "Partners struggle to create pricing packages — too many options, no guidance, frequent errors",
    "Merchants abandon onboarding halfway through and we don't know at which step or why",
    "Users cannot find the most important actions — they're buried and hard to discover",
  ];

  function scrollToSection(key: PRDKey) {
    setTimeout(() => {
      document.getElementById(`prd-section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 80);
  }

  async function generate() {
    if (!inputText.trim()) { setInputError("Describe what you are trying to build — even one sentence is enough."); return; }
    setInputError("");
    setCopilotState("generating");
    setStageIndex(0);

    for (let i = 1; i < GEN_STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setStageIndex(i);
    }
    await new Promise((r) => setTimeout(r, 300));

    const generatedPRD = generatePRD(inputText);
    const enrichCards = buildDynamicEnrichmentCards(inputText, generatedPRD);

    const initialSources: Partial<Record<PRDKey, Source>> = {};
    (Object.keys(generatedPRD) as PRDKey[]).forEach((k) => { initialSources[k] = "ai"; });
    initialSources.problemStatement = "user"; // Based on user input

    setPrd(generatedPRD);
    setCards(enrichCards);
    setSources(initialSources);
    setFlashKeys({});
    setCopilotState("draft");

    setTimeout(() => draftRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleAnswer(cardId: string, answer: string) {
    if (!prd) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const updates = card.updateFn(answer, prd);
    setPrd((prev) => prev ? { ...prev, ...updates } : prev);

    const affectedKey = card.affectsKey as PRDKey;
    setSources((s) => ({ ...s, [affectedKey]: "user" as Source }));

    const flashNum = Date.now();
    setFlashKeys((f) => ({ ...f, [affectedKey]: flashNum }));
    // Clear flash after 10 seconds — matches CSS animation duration in globals.css
    setTimeout(() => setFlashKeys((f) => ({ ...f, [affectedKey]: 0 })), 10000);
    scrollToSection(affectedKey);

    setCards((cs) => cs.map((c) => c.id === cardId ? { ...c, answered: true, answer } : c));
  }

  function buildCopyText(): string {
    if (!prd) return "";
    const sections = [
      { label: "PRODUCT SPEC", value: prd.productTitle },
      { label: "PROBLEM STATEMENT", value: prd.problemStatement },
      { label: "TARGET USERS", value: prd.targetUsers },
      { label: "CURRENT PAIN", value: prd.currentPain },
      { label: "GOALS", value: prd.goals.map((g) => `□ ${g}`).join("\n") },
      { label: "NON-GOALS", value: prd.nonGoals.map((g) => `□ ${g}`).join("\n") },
      { label: "SUCCESS METRICS", value: prd.kpis.map((k) => `— ${k}`).join("\n") },
      { label: "MVP SCOPE (BUILD NOW)", value: prd.mvpBuild.map((i) => `— ${i}`).join("\n") },
      { label: "MVP SCOPE (PHASE 2)", value: prd.mvpDefer.map((i) => `— ${i}`).join("\n") },
      { label: "USER STORIES", value: prd.userStories.map((s, i) => `${i + 1}. ${s}`).join("\n") },
      { label: "EDGE CASES", value: prd.edgeCases.map((e) => `□ ${e}`).join("\n") },
      { label: "BUSINESS IMPACT", value: prd.businessImpact },
      { label: "TECHNICAL CONSIDERATIONS", value: prd.technicalConsiderations },
      ...(prd.permissionsRoles ? [{ label: "PERMISSIONS & ROLES", value: prd.permissionsRoles }] : []),
      ...(prd.dependencies ? [{ label: "DEPENDENCIES", value: prd.dependencies }] : []),
      { label: "GTM & ENABLEMENT", value: prd.gtmEnablement },
      { label: "QA CHECKLIST", value: prd.qaChecklist.map((i) => `□ ${i}`).join("\n") },
      { label: "ROLLOUT PLAN", value: prd.rollout },
      { label: "RISKS", value: prd.risks.map((r) => `⚠ ${r}`).join("\n") },
      { label: "OPEN QUESTIONS", value: prd.openQuestions.map((q) => `□ ${q}`).join("\n") },
    ];
    return sections.filter((s) => s.value?.trim()).map((s) => `${s.label}\n${s.value}`).join("\n\n") + "\n\nGenerated with Clearspec · clearspec.pm";
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText()).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function restart() {
    setCopilotState("input");
    setInputText("");
    setPrd(null);
    setCards([]);
    setSources({});
    setFlashKeys({});
    setCopied(false);
  }

  // ── Input ────────────────────────────────────────────────────────────────
  if (copilotState === "input") {
    const inputIsHebrew = containsHebrew(inputText);
    return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
          PM Copilot
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          What are you trying to build?
        </h2>
        <p className="mt-3 text-sm text-zinc-500">
          Describe the problem in plain language. Clearspec detects the domain, expands your idea,
          and generates a complete draft PRD with context-specific enrichment questions.
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          🌐 You can write in Hebrew — the PRD will be generated in English.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); setInputError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
            placeholder="e.g. Partners struggle to create pricing packages — there are too many options with no guidance"
            rows={4}
            dir={inputIsHebrew ? "rtl" : "ltr"}
            className={`w-full resize-none rounded-xl border px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors ${inputError ? "border-red-300 bg-red-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
            autoFocus
          />
          {inputIsHebrew && (
            <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1.5">
              <span>🌐</span>
              <span>Hebrew input detected — PRD will be generated in English.</span>
            </p>
          )}
          {inputError && <p className="mt-2 text-xs text-red-600">{inputError}</p>}
        </div>

        <button
          onClick={generate}
          className="w-full rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 active:scale-[0.99]"
        >
          Generate Product Direction →
        </button>

        <p className="text-center text-xs text-zinc-400">
          Press <span className="font-mono">⌘ Enter</span> · No account required · Context-aware enrichment
        </p>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold text-zinc-400">Examples to try:</p>
        <div className="space-y-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => setInputText(ex)} className="block w-full rounded-lg border border-zinc-200 px-4 py-3 text-left text-xs text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
    );
  }

  // ── Generating ───────────────────────────────────────────────────────────
  if (copilotState === "generating") return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2.5 w-2.5 rounded-full bg-zinc-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <p className="text-sm font-medium text-zinc-700">{GEN_STAGES[stageIndex]}</p>
        </div>
        <div className="space-y-2">
          {GEN_STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center gap-3">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${i < stageIndex ? "border-green-300 bg-green-50 text-green-600" : i === stageIndex ? "border-zinc-300 bg-zinc-50 text-zinc-400" : "border-zinc-200 text-zinc-200"}`}>
                {i < stageIndex ? "✓" : i === stageIndex ? "→" : "·"}
              </div>
              <span className={`text-sm ${i < stageIndex ? "text-zinc-400 line-through" : i === stageIndex ? "text-zinc-700 font-medium" : "text-zinc-300"}`}>{stage}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-zinc-900 transition-all duration-500" style={{ width: `${((stageIndex + 1) / GEN_STAGES.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );

  // ── Draft ────────────────────────────────────────────────────────────────
  if (copilotState === "draft" && prd) {
    const unansweredCards = cards.filter((c) => !c.answered);
    const answeredCards = cards.filter((c) => c.answered);
    const visibleKeys = getVisiblePRDKeys(prd);

    return (
      <div ref={draftRef}>
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Draft PRD generated
              </p>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{prd.productTitle}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {answeredCount > 0
                ? `${answeredCount} of ${cards.length} enrichments applied — PRD strengthened`
                : `${cards.length} context-specific questions ready on the right`}
            </p>
          </div>
          <button onClick={restart} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400">
            Start over
          </button>
        </div>

        {/* Mobile/tablet: horizontal sticky TOC + completeness strip */}
        <div className="sticky top-0 z-20 -mx-4 px-4 pb-2 pt-1 backdrop-blur-sm bg-white/95 lg:hidden">
          <PRDCompletenessBar completeness={completeness} className="mb-2" />
          <PRDTOCHorizontal visibleKeys={visibleKeys} />
        </div>

        {/* ── 3-column workspace ──────────────────────────────────────────────
            Desktop lg+:
              [TOC 148px sticky] | [PRD — fills all remaining space] | [Enrichment 360px sticky]
            Below lg:
              horizontal TOC strip above (sticky) → PRD → Enrichment stacked
            ──────────────────────────────────────────────────────────────────── */}
        <div className="mt-4 lg:mt-0 lg:grid lg:gap-4 lg:items-start lg:grid-cols-[148px_1fr_360px]">

          {/* Column 1 — Vertical TOC: sticky, desktop only */}
          <div className="hidden lg:block lg:sticky lg:top-4">
            <PRDTOCVertical visibleKeys={visibleKeys} />
          </div>

          {/* Column 2 — PRD Document: takes all available width */}
          <div className="min-w-0">
            {/* Sticky completeness bar — stays visible as user scrolls PRD */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pb-2">
              <PRDCompletenessBar completeness={completeness} />
            </div>

            <PRDDocument
              prd={prd}
              sources={sources}
              flashKeys={flashKeys}
              completeness={completeness}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>

          {/* Column 3 — Enrichment panel: sticky, scrollable if tall */}
          <div className="mt-6 lg:mt-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50">
              {/* Panel header */}
              <div className="border-b border-zinc-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      Enrich Your PRD
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Context-specific questions · Each answer updates the PRD live
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-zinc-700">
                      {answeredCount}/{cards.length}
                    </span>
                    <p className="text-[10px] text-zinc-400">done</p>
                  </div>
                </div>

                {/* Mini progress */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-zinc-800 transition-all duration-500"
                    style={{ width: cards.length > 0 ? `${(answeredCount / cards.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-4 p-5">
                {unansweredCards.map((card) => (
                  <EnrichmentCardView key={card.id} card={card} input={inputText} prd={prd} onAnswer={handleAnswer} />
                ))}
                {answeredCards.map((card) => (
                  <EnrichmentCardView key={card.id} card={card} input={inputText} prd={prd} onAnswer={handleAnswer} />
                ))}
              </div>

              {answeredCount === cards.length && cards.length > 0 && (
                <div className="border-t border-zinc-200 p-5">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                    <p className="text-sm font-semibold text-green-800">All enrichments applied</p>
                    <p className="mt-1 text-xs text-green-600">Copy the PRD and continue in your spec tool.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Clearspec does not save your work. Copy the PRD before leaving this page.
        </p>
      </div>
    );
  }

  return null;
}
