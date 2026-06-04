"use client";

import { useState, useEffect, useRef } from "react";
import { useSidebar } from "@/contexts/sidebar-context";

// ── Types ─────────────────────────────────────────────────────────────────────

type CopilotState = "input" | "generating" | "draft";
type Source = "ai" | "user";

interface PRDData {
  productTitle: string;
  problemStatement: string;
  targetUsers: string;
  goals: string[];
  kpis: string[];
  mvpBuild: string[];
  mvpDefer: string[];
  risks: string[];
  assumptions: string[];
  openQuestions: string[];
  tradeoffs: string;
  rollout: string;
}

type PRDKey = keyof PRDData;

interface SectionSource {
  key: PRDKey;
  source: Source;
  flashKey?: number; // increment to trigger flash animation
}

interface EnrichmentCard {
  id: string;
  title: string;
  icon: string;
  explanation: string;
  question: string;
  placeholder: string;
  answer: string;
  answered: boolean;
  affectsKey: PRDKey;
  updateFn: (answer: string, current: PRDData) => Partial<PRDData>;
}

// ── PRD Generation engine ────────────────────────────────────────────────────

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
    [/partner/i, "ISO partners"],
    [/merchant/i, "merchants"],
    [/developer/i, "developers"],
    [/admin/i, "administrators"],
    [/manager/i, "managers"],
    [/customer/i, "customers"],
    [/team/i, "teams"],
    [/user/i, "users"],
  ];
  for (const [re, label] of checks) if (re.test(input)) return label;
  return "users";
}

function normaliseSentence(s: string): string {
  const t = s.trim().replace(/[.!?]+$/, "");
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function generateTitle(input: string, type: ProblemType): string {
  const cleaned = normaliseSentence(input);
  const typeNames: Record<ProblemType, string> = {
    pricing: "Pricing Configuration",
    onboarding: "Onboarding",
    discovery: "Feature Discovery",
    "b2b-ops": "Operational Workflow",
    mobile: "Mobile Experience",
    retention: "Retention",
    performance: "Performance",
    general: "Product Improvement",
  };
  // Try to extract a noun phrase from the input
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

  const primary = subject.charAt(0).toUpperCase() + subject.slice(1);
  return `Primary: ${primary}\nSecondary: ${secondaryMap[type]}`;
}

function generateGoals(input: string, type: ProblemType): string[] {
  const goalSets: Record<ProblemType, string[]> = {
    pricing: [
      "Reduce average pricing setup time by ≥60% compared to the current workflow",
      "Eliminate pricing configuration errors that require post-creation correction",
      "Enable self-service pricing management without AM or operations team involvement",
    ],
    onboarding: [
      "Increase onboarding completion rate to ≥80% within 30 days of launch",
      "Reduce time-to-first-value (first successful action) by ≥50%",
      "Reduce onboarding-related support contacts to near zero",
    ],
    discovery: [
      "Reduce time-to-task for the three most-used workflows by ≥40%",
      "Increase feature discovery rate — more users reaching key features within first session",
      "Reduce navigation-related support contacts by ≥30%",
    ],
    "b2b-ops": [
      "Reduce manual AM/operations involvement in this workflow by ≥80%",
      "Reduce end-to-end task completion time by ≥60%",
      "Scale the workflow to support 10× the current user base without adding headcount",
    ],
    mobile: [
      "Achieve functional parity between mobile and desktop for the core user journey",
      "Reduce mobile-specific task abandonment rate by ≥50%",
      "Pass Lighthouse mobile accessibility and performance audit with score ≥80",
    ],
    retention: [
      "Reduce drop-off rate at the identified abandonment point by ≥40%",
      "Increase the percentage of users who return within 7 days of first use",
      "Identify and eliminate the top three friction points causing abandonment",
    ],
    performance: [
      "Reduce page or operation response time to below 1 second on median connection",
      "Achieve Lighthouse performance score ≥80 on mobile",
      "Eliminate user-reported 'slow' feedback for the affected workflow",
    ],
    general: [
      "Eliminate the described friction point from the primary user journey",
      "Improve task completion rate for the affected workflow by ≥40%",
      "Reduce support contacts related to this problem by ≥50%",
    ],
  };
  return goalSets[type];
}

function generateKPIs(type: ProblemType): string[] {
  const kpiSets: Record<ProblemType, string[]> = {
    pricing: [
      "Average time to complete a pricing package setup (baseline vs post-launch)",
      "Pricing error rate — packages requiring correction within 48 hours of creation",
      "Support tickets attributed to pricing configuration (weekly volume)",
    ],
    onboarding: [
      "Onboarding completion rate — % of users who complete activation steps",
      "Time to first successful action (T0 to first value event)",
      "Onboarding drop-off step — which step has the highest abandonment",
    ],
    discovery: [
      "Task completion rate for the three most-used workflows",
      "Time-to-task — time from login to completing key actions",
      "Navigation depth — average clicks before task completion",
    ],
    "b2b-ops": [
      "% of this workflow completed without manual AM or operations intervention",
      "Average end-to-end task completion time",
      "Support tickets related to this workflow (weekly volume)",
    ],
    mobile: [
      "Mobile task completion rate vs desktop (parity goal)",
      "Mobile-specific abandonment rate at key interaction points",
      "Lighthouse mobile performance score for the affected pages",
    ],
    retention: [
      "7-day and 30-day return rate",
      "Drop-off rate at the identified abandonment point",
      "Session length for users who experience this friction vs those who do not",
    ],
    performance: [
      "Median and P95 response time for the affected operation",
      "Bounce rate on the affected page (mobile and desktop)",
      "Lighthouse performance score (mobile, target ≥80)",
    ],
    general: [
      "Task completion rate for the affected workflow",
      "Support tickets related to this problem (weekly volume, baseline vs post-launch)",
      "User satisfaction score (CSAT) for the affected interaction",
    ],
  };
  return kpiSets[type];
}

function generateMVP(input: string, type: ProblemType): { build: string[]; defer: string[] } {
  const mvpSets: Record<ProblemType, { build: string[]; defer: string[] }> = {
    pricing: {
      build: [
        "Step-by-step pricing builder with guided fields and inline validation",
        "Real-time error feedback before submission — prevent incorrect configurations from being saved",
        "Preview of final pricing structure before confirmation",
      ],
      defer: [
        "Bulk pricing template duplication and mass-edit (Phase 2)",
        "Partner-level pricing analytics and comparison dashboard (Phase 2)",
      ],
    },
    onboarding: {
      build: [
        "Simplified onboarding flow with step progress indicator",
        "Clear error states and recovery paths at each step",
        "Confirmation and next-step guidance immediately after each action completes",
      ],
      defer: [
        "Personalised onboarding path based on user type or role (Phase 2)",
        "In-app onboarding coach or guided tour overlay (Phase 2)",
      ],
    },
    discovery: {
      build: [
        "Restructured navigation with the top 3 workflows accessible from the primary nav",
        "Search or quick-access shortcut for power users",
        "Visual hierarchy improvements to surface key actions above the fold",
      ],
      defer: [
        "Personalised navigation based on user role and usage history (Phase 2)",
        "Global search across all product areas (Phase 2)",
      ],
    },
    "b2b-ops": {
      build: [
        "Self-service workflow replacing the current manual process — end-to-end flow",
        "Validation at each step to prevent errors that currently require AM correction",
        "Confirmation state and audit trail for completed actions",
      ],
      defer: [
        "Bulk operations for high-volume users managing many records simultaneously (Phase 2)",
        "Workflow analytics and completion monitoring dashboard (Phase 2)",
      ],
    },
    mobile: {
      build: [
        "Responsive layout fixes for the primary user journey at 375px–414px viewports",
        "Touch-optimised interactions — buttons min 44×44px, no hover-only states",
        "Mobile navigation pattern that does not bury the primary CTA",
      ],
      defer: [
        "Native mobile gestures (swipe, pull-to-refresh) for secondary interactions (Phase 2)",
        "Mobile-specific shortcuts and home screen optimisation (Phase 2)",
      ],
    },
    retention: {
      build: [
        "Identify and fix the top friction point causing abandonment (from analytics)",
        "Re-engagement nudge at the drop-off step with clear next-action guidance",
        "Progress indicator so users understand where they are in the flow",
      ],
      defer: [
        "Personalised re-engagement email sequence (Phase 2)",
        "In-app tooltip or coach mark for users who haven't returned in 7+ days (Phase 2)",
      ],
    },
    performance: {
      build: [
        "Optimise the heaviest operation — reduce payload or add client-side caching",
        "Add loading states for all operations taking >300ms",
        "Lazy-load non-critical assets on the affected pages",
      ],
      defer: [
        "CDN implementation for all static assets (Phase 2)",
        "Server-side optimisation and database query review (Phase 2)",
      ],
    },
    general: {
      build: [
        "Direct fix for the described friction point in the primary user flow",
        "Error handling and recovery path for the affected interaction",
        "Validation and feedback to guide users through the corrected flow",
      ],
      defer: [
        "Extended feature improvements building on the MVP fix (Phase 2)",
        "Analytics and monitoring for the corrected workflow (Phase 2)",
      ],
    },
  };
  return mvpSets[type];
}

function generateRisks(type: ProblemType): string[] {
  const riskSets: Record<ProblemType, string[]> = {
    pricing: [
      "Incorrect pricing configurations in the new flow could result in revenue miscalculation if validation is incomplete",
      "Migrating existing pricing setups to the new structure may break current configurations during the transition",
      "Partners may resist adopting the new flow if it changes familiar patterns — change management required",
    ],
    onboarding: [
      "Simplifying the onboarding flow may skip data collection needed for downstream processes — validate with ops teams",
      "A/B testing different onboarding paths may create inconsistent user experiences during the experiment period",
      "Edge cases in the new flow (partial completion, interrupted session) need explicit handling to avoid data loss",
    ],
    discovery: [
      "Restructuring navigation may displace power users who have memorised the current information architecture",
      "Adding a search function without full indexing creates a gap between what users search for and what they find",
      "Surface-level navigation changes may not address the underlying mental model mismatch — user testing required before full rollout",
    ],
    "b2b-ops": [
      "Self-service workflows may introduce configuration errors that previously would have been caught by AM review",
      "Removing the AM from this flow may surface gaps in validation or data quality that the AM currently corrects manually",
      "Permission and access control for the new self-service capability needs careful design — wrong users accessing sensitive operations",
    ],
    mobile: [
      "Mobile-only layout changes may inadvertently affect desktop layout if CSS is not carefully scoped",
      "Changing touch interaction patterns for existing users may cause initial confusion — requires communication",
      "Testing across the full range of device sizes (375px to 430px) is essential — do not test only on one device",
    ],
    retention: [
      "Addressing the symptom (drop-off point) without the root cause may temporarily improve metrics without fixing underlying friction",
      "Nudges and re-engagement prompts can feel intrusive if shown too frequently — frequency capping required",
      "Metrics may show short-term improvement that doesn't translate to long-term retention if the core issue is not resolved",
    ],
    performance: [
      "Performance improvements on the server side may not be reflected in client-perceived performance if the bottleneck is client-side",
      "Caching improvements can create stale-data issues if cache invalidation is not properly implemented",
      "Optimising for median performance may not address P95 cases that affect a small but vocal user segment",
    ],
    general: [
      "Addressing this friction point in isolation may expose adjacent friction points that were previously masked",
      "Changes to this workflow may have downstream effects on other product areas — cross-team impact assessment needed",
      "User behaviour after the fix may differ from expectations — plan a structured post-launch review window",
    ],
  };
  return riskSets[type];
}

function generateAssumptions(type: ProblemType): string[] {
  return [
    "The described problem is experienced consistently across the majority of the affected user group, not by an isolated segment",
    "The proposed MVP scope covers the most impactful part of the problem — the 80% case — without requiring the Phase 2 scope to deliver value",
    "The success metrics defined are measurable from day one using existing analytics infrastructure",
  ];
}

function generateOpenQuestions(input: string, type: ProblemType): string[] {
  const baseQs: Record<ProblemType, string[]> = {
    pricing: [
      "Who has the authority to approve pricing changes — should there be an approval gate before a pricing package is published?",
      "What is the migration path for existing pricing configurations under the new structure?",
    ],
    onboarding: [
      "Which onboarding steps are mandatory vs optional — and can optional steps be deferred post-activation?",
      "What data is required from the user before they can access the core product, and can any of it be collected after first value?",
    ],
    discovery: [
      "What is the source of truth for which features are 'most used' — do we have analytics data to validate assumptions?",
      "Should the navigation restructure affect all user roles equally, or should different roles have different navigation paths?",
    ],
    "b2b-ops": [
      "What permission level is required to perform this self-service action — and should there be a review or approval step for higher-risk actions?",
      "What is the audit trail requirement for actions performed via this new self-service workflow?",
    ],
    mobile: [
      "What is the minimum supported viewport width — are we targeting 320px (iPhone SE) or 375px as the floor?",
      "Are there mobile-specific features (push notifications, native camera, location) that should be added once the baseline is fixed?",
    ],
    retention: [
      "Do we have session recording or analytics data showing exactly where users drop off — or is this based on survey/support feedback?",
      "What is the re-engagement email or notification strategy, and does the PM team own it or is it a separate CRM initiative?",
    ],
    performance: [
      "Is the performance issue client-side (JavaScript, asset loading) or server-side (API response time, database queries)?",
      "What is the performance budget for this workflow — what response time is acceptable as a baseline target?",
    ],
    general: [
      "Has this problem been validated through user research, support tickets, or analytics data — or is it based on internal observation?",
      "Are there adjacent problems in the same workflow that should be addressed in the same release to avoid user confusion from a partial fix?",
    ],
  };
  return baseQs[type];
}

function generateTradeoffs(type: ProblemType): string {
  const tradeoffMap: Record<ProblemType, string> = {
    pricing: "Building a comprehensive guided pricing flow (chosen) gives up simplicity for basic use cases. Building a minimal self-service form (rejected) would have given up error prevention and the ability to handle complex pricing structures.",
    onboarding: "Simplifying the onboarding flow (chosen) gives up some data collection at activation time. Keeping the comprehensive form (rejected) would have given up completion rate and time-to-value.",
    discovery: "Restructuring navigation based on the most-used workflows (chosen) gives up discoverability of less-used features. Keeping the current flat navigation (rejected) would have given up task efficiency for the majority use case.",
    "b2b-ops": "Full self-service capability (chosen) gives up the error-catching role currently played by AM review. Maintaining AM involvement (rejected) would have given up scalability and operational efficiency.",
    mobile: "Mobile-first responsive redesign (chosen) gives up some desktop-optimised layout patterns. Building a separate mobile experience (rejected) would have given up maintenance overhead reduction.",
    retention: "Fixing the identified friction point (chosen) gives up coverage of edge-case drop-off scenarios. A comprehensive retention redesign (rejected) would have given up speed of delivery.",
    performance: "Client-side optimisation (chosen) gives up server-side performance gains that require deeper infrastructure work. Full performance audit (rejected) would have given up a fast ship to production.",
    general: "Targeted fix for the described friction (chosen) gives up coverage of adjacent issues. Broader product redesign (rejected) would have given up delivery timeline.",
  };
  return tradeoffMap[type];
}

function generateRollout(type: ProblemType): string {
  return "Phase 1: Internal testing with a limited pilot group — validate that the fix works as expected without breaking existing behaviour.\nPhase 2: Feature flag rollout to 10–20% of users for 2 weeks — monitor the success metrics and compare to pre-launch baseline.\nPhase 3: Full rollout after Phase 2 metrics confirm improvement — address any edge cases surfaced during the pilot.";
}

function generatePRD(input: string): PRDData {
  const type = detectType(input);
  const subject = extractSubject(input);
  const mvp = generateMVP(input, type);

  return {
    productTitle: generateTitle(input, type),
    problemStatement: generateProblemStatement(input, subject, type),
    targetUsers: generateTargetUsers(subject, type),
    goals: generateGoals(input, type),
    kpis: generateKPIs(type),
    mvpBuild: mvp.build,
    mvpDefer: mvp.defer,
    risks: generateRisks(type),
    assumptions: generateAssumptions(type),
    openQuestions: generateOpenQuestions(input, type),
    tradeoffs: generateTradeoffs(type),
    rollout: generateRollout(type),
  };
}

// ── Enrichment cards ──────────────────────────────────────────────────────────

function buildEnrichmentCards(prd: PRDData): EnrichmentCard[] {
  return [
    {
      id: "user-segments",
      title: "Missing user segments",
      icon: "👤",
      explanation: "The draft identified one primary user type. Real products often have 2–3 distinct user types with different workflows, permissions, and pain levels. Naming them now prevents scope gaps later.",
      question: "Who else is affected by this problem? Name a second user type and describe how they experience it differently.",
      placeholder: "e.g. 'Finance team leads who review configurations set by partners — they see errors after they go live, not during creation'",
      answer: "",
      answered: false,
      affectsKey: "targetUsers",
      updateFn: (answer, current) => ({
        targetUsers: current.targetUsers + `\nAlso affected: ${answer}`,
      }),
    },
    {
      id: "success-metrics",
      title: "Make metrics measurable",
      icon: "📊",
      explanation: "AI-suggested KPIs are directionally correct but need a baseline and target number to be actionable. Without a specific number, you cannot declare success or failure after launch.",
      question: "What number would you track to know this worked? Add a specific target and timeframe.",
      placeholder: "e.g. 'Reduce setup time from 45 min to under 10 min within 60 days of launch. Baseline from current support ticket analysis.'",
      answer: "",
      answered: false,
      affectsKey: "kpis",
      updateFn: (answer, current) => ({
        kpis: [...current.kpis.slice(0, 1), answer, ...current.kpis.slice(2)],
      }),
    },
    {
      id: "rollout-strategy",
      title: "Who gets this first?",
      icon: "🚀",
      explanation: "The draft suggests a phased rollout but does not name who the pilot group is. For B2B and platform products, the first cohort determines what edge cases you discover before full rollout.",
      question: "Name the specific group or cohort who should get this first. What is the trigger for expanding rollout?",
      placeholder: "e.g. 'Start with 3 internal accounts we manage directly. Expand to 10 pilot partners after 2 weeks with no critical bugs.'",
      answer: "",
      answered: false,
      affectsKey: "rollout",
      updateFn: (answer, current) => ({
        rollout: `Pilot group: ${answer}\n\n${current.rollout}`,
      }),
    },
    {
      id: "assumptions",
      title: "Name a risky assumption",
      icon: "⚠️",
      explanation: "Every product decision rests on assumptions. The ones that are wrong become post-launch bugs or adoption gaps. Naming them before build is the highest-leverage risk management you can do.",
      question: "What are you assuming is true that might not be? Name the riskiest assumption in this spec.",
      placeholder: "e.g. 'We assume users will adopt the new flow without training. Risk: power users have memorised the current flow and will resist the change.'",
      answer: "",
      answered: false,
      affectsKey: "assumptions",
      updateFn: (answer, current) => ({
        assumptions: [answer, ...current.assumptions],
      }),
    },
    {
      id: "edge-cases",
      title: "Name an edge case",
      icon: "🧪",
      explanation: "Edge cases that are not named in the spec become QA bugs or production incidents. The best time to catch them is before design starts, not after engineering finishes.",
      question: "What could go wrong that is not the happy path? Describe one scenario that needs an explicit behaviour defined.",
      placeholder: "e.g. 'What happens if the user loses their internet connection mid-flow? The draft does not define the recovery path.'",
      answer: "",
      answered: false,
      affectsKey: "risks",
      updateFn: (answer, current) => ({
        risks: [...current.risks, `Edge case: ${answer}`],
      }),
    },
    {
      id: "stakeholders",
      title: "Who needs to approve this?",
      icon: "🤝",
      explanation: "Product decisions that affect compliance, pricing, or cross-team workflows often require explicit sign-off. Naming stakeholders now prevents late-stage blockers.",
      question: "Who outside your immediate team needs to review, approve, or be informed before this ships?",
      placeholder: "e.g. 'Finance team lead must review pricing change logic. Legal must sign off on any changes to the confirmation screen copy.'",
      answer: "",
      answered: false,
      affectsKey: "openQuestions",
      updateFn: (answer, current) => ({
        openQuestions: [...current.openQuestions, `Stakeholder alignment needed: ${answer}`],
      }),
    },
  ];
}

// ── Source badge component ────────────────────────────────────────────────────

function SourceBadge({ source }: { source: Source }) {
  if (source === "user") return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold text-green-400">
      ✓ confirmed
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber-400">
      ⚡ AI suggested
    </span>
  );
}

// ── PRD display ───────────────────────────────────────────────────────────────

interface PRDDisplayProps {
  prd: PRDData;
  sources: Partial<Record<PRDKey, Source>>;
  flashKeys: Partial<Record<PRDKey, number>>;
  onCopy: () => void;
  copied: boolean;
  completeness: number;
}

function PRDDisplay({ prd, sources, flashKeys, onCopy, copied, completeness }: PRDDisplayProps) {
  const getSource = (key: PRDKey): Source => sources[key] ?? "ai";

  // id for scroll targeting + subtle green flash when updated
  const sectionProps = (key: PRDKey) => ({
    id: `prd-section-${key}`,
    className: `rounded-sm p-1 -m-1 transition-all duration-500 ${(flashKeys[key] ?? 0) > 0 ? "bg-green-900/25 ring-1 ring-green-800/40" : ""}`,
  });

  return (
    <div>
      {/* Actions */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 transition-colors hover:ring-zinc-400"
        >
          {copied ? (
            <><svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>
          ) : (
            <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy PRD</>
          )}
        </button>
        <a
          href="/products/prd-critic"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
        >
          Review with PRD Critic →
        </a>
      </div>

      {/* Completeness score */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
          PRD Completeness
        </span>
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-zinc-800 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <span className={`font-mono text-sm font-semibold tabular-nums whitespace-nowrap ${completeness === 100 ? "text-green-600" : "text-zinc-700"}`}>
          {completeness}%
        </span>
        {completeness === 100 && (
          <span className="font-mono text-[10px] text-green-600">✓ complete</span>
        )}
      </div>

      {/* Document */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl">
        {/* Chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="ml-3 font-mono text-xs text-zinc-500">
            {prd.productTitle.toLowerCase().replace(/\s+/g, "-")}.md
          </span>
        </div>

        {/* Content */}
        <div className="decision-record overflow-x-auto p-5 sm:p-7">
          <div className="min-w-[280px] space-y-6 text-zinc-300">

            {/* Header */}
            <div>
              <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wide text-zinc-100">
                PRODUCT SPEC
                <span className="ml-2 font-normal normal-case text-zinc-500 text-xs">· {prd.productTitle}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-600">
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                {" · Generated with Clearspec"}
              </div>
              <div className="mt-2 text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
            </div>

            {/* Problem Statement */}
            <div {...sectionProps("problemStatement")}>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">PROBLEM STATEMENT</div>
                <SourceBadge source={getSource("problemStatement")} />
              </div>
              <p className="text-xs leading-relaxed sm:text-sm">{prd.problemStatement}</p>
            </div>

            {/* Target Users */}
            <div {...sectionProps("targetUsers")}>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">TARGET USERS</div>
                <SourceBadge source={getSource("targetUsers")} />
              </div>
              <p className="whitespace-pre-line text-xs leading-relaxed sm:text-sm">{prd.targetUsers}</p>
            </div>

            <div className="border-t border-zinc-800" />

            {/* Goals */}
            <div {...sectionProps("goals")}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">GOALS</div>
                <SourceBadge source={getSource("goals")} />
              </div>
              <div className="space-y-1">
                {prd.goals.map((g, i) => (
                  <div key={i} className="flex gap-2 text-xs sm:text-sm">
                    <span className="text-zinc-600 shrink-0">□</span><span>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div {...sectionProps("kpis")}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">SUCCESS METRICS / KPIs</div>
                <SourceBadge source={getSource("kpis")} />
              </div>
              <div className="space-y-1">
                {prd.kpis.map((k, i) => (
                  <div key={i} className="flex gap-2 text-xs sm:text-sm">
                    <span className="text-zinc-600 shrink-0">—</span><span>{k}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800" />

            {/* MVP Scope */}
            <div {...sectionProps("mvpBuild")}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">MVP SCOPE</div>
                <SourceBadge source={getSource("mvpBuild")} />
              </div>
              <div className="mb-3">
                <div className="text-[10px] text-green-400 mb-1">✓ Build now</div>
                <div className="space-y-1">
                  {prd.mvpBuild.map((item, i) => (
                    <div key={i} className="flex gap-2 text-xs sm:text-sm ml-2">
                      <span className="text-zinc-600 shrink-0">—</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 mb-1">○ Phase 2 (committed)</div>
                <div className="space-y-1">
                  {prd.mvpDefer.map((item, i) => (
                    <div key={i} className="flex gap-2 text-xs sm:text-sm ml-2 text-zinc-500">
                      <span className="shrink-0">—</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800" />

            {/* Risks */}
            <div {...sectionProps("risks")}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">RISKS & ASSUMPTIONS</div>
                <SourceBadge source={getSource("risks")} />
              </div>
              <div className="space-y-1 mb-3">
                {prd.risks.map((r, i) => (
                  <div key={i} className="flex gap-2 text-xs sm:text-sm">
                    <span className="text-zinc-600 shrink-0">⚠</span><span>{r}</span>
                  </div>
                ))}
              </div>
              {prd.assumptions.length > 0 && (
                <div className="space-y-1">
                  {prd.assumptions.map((a, i) => (
                    <div key={i} className="flex gap-2 text-xs sm:text-sm text-zinc-500">
                      <span className="shrink-0">~</span><span>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tradeoffs */}
            <div {...sectionProps("tradeoffs")}>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">TRADEOFFS</div>
                <SourceBadge source={getSource("tradeoffs")} />
              </div>
              <p className="text-xs leading-relaxed sm:text-sm">{prd.tradeoffs}</p>
            </div>

            {/* Rollout */}
            <div {...sectionProps("rollout")}>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">ROLLOUT PLAN</div>
                <SourceBadge source={getSource("rollout")} />
              </div>
              <p className="whitespace-pre-line text-xs leading-relaxed sm:text-sm">{prd.rollout}</p>
            </div>

            {/* Open Questions */}
            <div {...sectionProps("openQuestions")}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">OPEN QUESTIONS</div>
                <SourceBadge source={getSource("openQuestions")} />
              </div>
              <div className="space-y-1">
                {prd.openQuestions.map((q, i) => (
                  <div key={i} className="flex gap-2 text-xs sm:text-sm">
                    <span className="text-zinc-600 shrink-0">□</span><span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div>
              <div className="text-zinc-700 text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              <div className="mt-2 text-[10px] text-zinc-600">Generated with Clearspec · clearspec.pm</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Enrichment card component ────────────────────────────────────────────────

interface EnrichmentCardProps {
  card: EnrichmentCard;
  onAnswer: (id: string, answer: string) => void;
}

function EnrichmentCardView({ card, onAnswer }: EnrichmentCardProps) {
  const [draft, setDraft] = useState(card.answer);
  const [focused, setFocused] = useState(false);

  if (card.answered) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-green-600 text-xs">✓</span>
            <p className="text-xs font-semibold text-green-800">{card.title}</p>
          </div>
          <span className="font-mono text-[9px] text-green-500 shrink-0">applied</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-white p-3 transition-colors ${focused ? "border-zinc-400" : "border-zinc-200"}`}>
      {/* Header row */}
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-sm leading-none">{card.icon}</span>
        <p className="text-xs font-semibold text-zinc-900">{card.title}</p>
        <span className="ml-auto font-mono text-[9px] text-zinc-400 shrink-0">
          {card.explanation.split(" ").slice(0, 6).join(" ")}…
        </span>
      </div>

      {/* Question */}
      <p className="mb-2 text-xs font-medium leading-snug text-zinc-700">{card.question}</p>

      {/* Input */}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={card.placeholder}
        rows={2}
        className="w-full resize-none rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-800"
      />

      <button
        onClick={() => { if (draft.trim()) onAnswer(card.id, draft.trim()); }}
        disabled={!draft.trim()}
        className="mt-2 w-full rounded-md bg-zinc-900 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Apply to PRD ↑
      </button>
    </div>
  );
}

// ── Loading stages ────────────────────────────────────────────────────────────

const GEN_STAGES = [
  "Analysing the problem...",
  "Expanding into PM structure...",
  "Building your draft PRD...",
];

// ── Main component ────────────────────────────────────────────────────────────

export default function PMCopilot() {
  const [copilotState, setCopilotState] = useState<CopilotState>("input");
  const [inputText, setInputText] = useState("");
  const [inputError, setInputError] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [prd, setPrd] = useState<PRDData | null>(null);
  const [cards, setCards] = useState<EnrichmentCard[]>([]);
  const [sources, setSources] = useState<Partial<Record<PRDKey, Source>>>({});
  const [flashKeys, setFlashKeys] = useState<Partial<Record<PRDKey, number>>>({});
  const [copied, setCopied] = useState(false);
  const draftRef = useRef<HTMLDivElement>(null);
  const { setCollapsed } = useSidebar();

  // ── Completeness score: 50% base + up to 50% from enrichments
  const answeredCountGlobal = cards.filter((c) => c.answered).length;
  const totalCards = cards.length || 6;
  const completeness = totalCards > 0
    ? Math.round(50 + (answeredCountGlobal / totalCards) * 50)
    : 50;

  // ── Collapse sidebar when PRD draft is active; restore on unmount
  useEffect(() => {
    if (copilotState === "draft") {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
    return () => setCollapsed(false);
  }, [copilotState, setCollapsed]);

  const EXAMPLES = [
    "Partners struggle to create pricing packages — there are too many options with no guidance",
    "Merchants abandon onboarding halfway through and we don't know why",
    "Users cannot find the most important actions — they are buried in the navigation",
  ];

  // ── Scroll to a PRD section by its data-id attribute
  function scrollToSection(key: PRDKey) {
    // Small delay to let React update the DOM first
    setTimeout(() => {
      const el = document.getElementById(`prd-section-${key}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
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
    await new Promise((r) => setTimeout(r, 350));

    const generatedPRD = generatePRD(inputText);
    const enrichCards = buildEnrichmentCards(generatedPRD);

    const initialSources: Partial<Record<PRDKey, Source>> = {};
    (Object.keys(generatedPRD) as PRDKey[]).forEach((k) => { initialSources[k] = "ai"; });
    initialSources.problemStatement = "user";

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
    const updatedPRD = { ...prd, ...updates };
    setPrd(updatedPRD);

    const affectedKey = card.affectsKey;
    setSources((s) => ({ ...s, [affectedKey]: "user" as Source }));

    // Flash + scroll to the updated section
    const flashNum = Date.now();
    setFlashKeys((f) => ({ ...f, [affectedKey]: flashNum }));
    setTimeout(() => setFlashKeys((f) => ({ ...f, [affectedKey]: 0 })), 1200);
    scrollToSection(affectedKey);

    setCards((cs) => cs.map((c) => c.id === cardId ? { ...c, answered: true, answer } : c));
  }

  function buildCopyText(): string {
    if (!prd) return "";
    return [
      `PRODUCT SPEC: ${prd.productTitle}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      ``,
      `PROBLEM STATEMENT`,
      prd.problemStatement,
      ``,
      `TARGET USERS`,
      prd.targetUsers,
      ``,
      `GOALS`,
      prd.goals.map((g) => `□ ${g}`).join("\n"),
      ``,
      `SUCCESS METRICS / KPIs`,
      prd.kpis.map((k) => `— ${k}`).join("\n"),
      ``,
      `MVP SCOPE`,
      `Build now:\n${prd.mvpBuild.map((i) => `  — ${i}`).join("\n")}`,
      `Phase 2:\n${prd.mvpDefer.map((i) => `  — ${i}`).join("\n")}`,
      ``,
      `RISKS & ASSUMPTIONS`,
      prd.risks.map((r) => `⚠ ${r}`).join("\n"),
      prd.assumptions.map((a) => `~ ${a}`).join("\n"),
      ``,
      `TRADEOFFS`,
      prd.tradeoffs,
      ``,
      `ROLLOUT PLAN`,
      prd.rollout,
      ``,
      `OPEN QUESTIONS`,
      prd.openQuestions.map((q) => `□ ${q}`).join("\n"),
      ``,
      `Generated with Clearspec · clearspec.pm`,
    ].join("\n");
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
  if (copilotState === "input") return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
          PM Copilot
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          What are you trying to build?
        </h2>
        <p className="mt-3 text-sm text-zinc-500">
          Describe the problem in plain language. One sentence is enough.
          Clearspec will expand it into a complete draft PRD in seconds.
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
            className={`w-full resize-none rounded-xl border px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors ${inputError ? "border-red-300 bg-red-50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
            autoFocus
          />
          {inputError && <p className="mt-2 text-xs text-red-600">{inputError}</p>}
        </div>

        <button
          onClick={generate}
          className="w-full rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 active:scale-[0.99]"
        >
          Generate Product Direction →
        </button>

        <p className="text-center text-xs text-zinc-400">
          Or press <span className="font-mono">⌘ Enter</span> · No account required
        </p>
      </div>

      {/* Example prompts */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold text-zinc-400">Examples to try:</p>
        <div className="space-y-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setInputText(ex)}
              className="block w-full rounded-lg border border-zinc-200 px-4 py-3 text-left text-xs text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Generating ───────────────────────────────────────────────────────────
  if (copilotState === "generating") return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2.5 w-2.5 rounded-full bg-zinc-300 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-zinc-700">
            {GEN_STAGES[stageIndex]}
          </p>
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
          <div
            className="h-full rounded-full bg-zinc-900 transition-all duration-500"
            style={{ width: `${((stageIndex + 1) / GEN_STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  // ── Draft ────────────────────────────────────────────────────────────────
  if (copilotState === "draft" && prd) {
    const answeredCount = answeredCountGlobal; // from top-level state
    const unansweredCards = cards.filter((c) => !c.answered);
    const answeredCards = cards.filter((c) => c.answered);

    return (
      <div ref={draftRef}>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Draft PRD generated
              </p>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              {prd.productTitle}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {answeredCount > 0
                ? `${answeredCount} of ${cards.length} enrichments applied`
                : `${cards.length} enrichment prompts ready — answer them to strengthen the PRD`}
            </p>
          </div>
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400"
          >
            Start over
          </button>
        </div>

        {/* Legend */}
        <div className="mb-5 flex flex-wrap items-center gap-4 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-amber-500">⚡</span>
            <span className="text-xs text-zinc-500">AI suggested — review and confirm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-green-500">✓</span>
            <span className="text-xs text-zinc-500">User confirmed — based on your input</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="h-2 w-2 rounded-sm bg-green-900/40" />
            <span className="text-xs text-zinc-500">Sections flash green when updated</span>
          </div>
        </div>

        {/* Split layout */}
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">

          {/* Left: PRD */}
          <div>
            <PRDDisplay
              prd={prd}
              sources={sources}
              flashKeys={flashKeys}
              onCopy={handleCopy}
              copied={copied}
              completeness={completeness}
            />
          </div>

          {/* Right: Enrichment */}
          <div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="mb-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                  Enrich Your PRD
                </p>
                <p className="text-sm text-zinc-600">
                  Answer these to strengthen weak areas. Each answer updates the PRD live.
                </p>
              </div>

              <div className="space-y-3">
                {/* Unanswered first */}
                {unansweredCards.map((card) => (
                  <EnrichmentCardView key={card.id} card={card} onAnswer={handleAnswer} />
                ))}
                {/* Answered at bottom */}
                {answeredCards.map((card) => (
                  <EnrichmentCardView key={card.id} card={card} onAnswer={handleAnswer} />
                ))}
              </div>

              {answeredCount === cards.length && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-sm font-semibold text-green-800">All enrichments applied</p>
                  <p className="mt-1 text-xs text-green-600">Your PRD now reflects your full context. Copy it and continue in your spec tool.</p>
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
