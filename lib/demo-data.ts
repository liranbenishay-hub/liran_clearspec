import type { DemoStep } from "@/components/ui/demo-modal";

/**
 * Clearspec demo steps.
 *
 * Each step mirrors an actual tool step so users understand
 * exactly what to expect before they start their own flow.
 *
 * To reuse for a different project: replace this data and pass
 * the new array to <DemoModal steps={yourSteps} />.
 */
export const CLEARSPEC_DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    stepLabel: "Step 1 — The Problem",
    question: "Start with the problem, not the solution.",
    subtext:
      "You describe the product problem in plain language. No scope, no solution — just what is broken.",
    inputType: "textarea",
    exampleContent:
      "ISO partners managing hundreds of merchants spend significant time on repetitive manual tasks — identifying stalled merchants, configuring webhooks individually, and spotting volume anomalies one merchant at a time.",
  },
  {
    stepNumber: 2,
    stepLabel: "Step 2 — Operational Pain",
    question: "What broken process does this replace?",
    subtext:
      'The framework asks for the specific broken workflow — not "users want X" but who is doing what manually and what it costs them.',
    inputType: "textarea",
    exampleContent:
      "ISO partners had no way to apply bulk operations across their merchant portfolio. Every webhook configuration, every status check, every anomaly investigation required navigating individual merchant records — one at a time. For a portfolio of 200+ merchants this took hours per week.",
  },
  {
    stepNumber: 3,
    stepLabel: "Step 3 — Current Workaround",
    question: "What are they doing instead right now?",
    subtext:
      "The workaround reveals the real problem size. If the workaround is painful enough, the problem is real enough to build.",
    inputType: "textarea",
    exampleContent:
      "Partners navigated to each merchant individually, checked status, then repeated the process across their entire portfolio. Some built personal spreadsheets to track anomalies. There was no systematic way to spot patterns or act at scale.",
  },
  {
    stepNumber: 4,
    stepLabel: "Step 4 — Success Metric",
    question: "If this works, what single metric moves?",
    subtext:
      "One number only. The framework forces you to name it before you scope anything. If you cannot name it, discovery is not done.",
    inputType: "input",
    exampleContent: "Time spent on manual portfolio monitoring per partner per week",
  },
  {
    stepNumber: 5,
    stepLabel: "Step 5 — MVP Scope",
    question: "What will you NOT build in version 1?",
    subtext:
      "You define both columns simultaneously. The Phase 2 list is a commitment — it gets tracked, not abandoned.",
    inputType: "dual",
    exampleContent: {
      leftLabel: "Build now (80% case)",
      leftValue:
        "Natural language commands for bulk portfolio operations: set up webhooks across merchants, find stalled accounts, spot volume drops — without navigating one merchant at a time.",
      rightLabel: "Phase 2 (committed)",
      rightValue:
        "Proactive pushed alerts (volume anomalies, stalled pipelines). Contextual in-product hints. These are Layer 2 and 3 — valuable but not the highest operational impact.",
    },
  },
  {
    stepNumber: 6,
    stepLabel: "Step 6 — Tradeoff",
    question: "What is the alternative approach you are not taking?",
    subtext:
      "Every real decision has a viable rejected option. The framework captures what each approach gives up — making the decision defensible when it is later questioned.",
    inputType: "textarea",
    exampleContent:
      "Rejected: Building all three layers (agentic actions + revenue alerts + contextual hints) simultaneously before shipping.\n\nChosen gives up: Passive alerting in V1.\n\nRejected gives up: Launch timeline — the highest-value layer (agentic actions) would have been delayed waiting for lower-value capabilities that require less user education.",
  },
  {
    stepNumber: 7,
    stepLabel: "Step 7 — Open Questions",
    question: "What must be resolved before shipping?",
    subtext:
      "Open questions are first-class objects. The framework names them, assigns owners, and does not let them hide in prose.",
    inputType: "list",
    exampleContent: {
      items: [
        {
          question:
            "Confirmation and preview UI before agentic actions execute — bulk operations must be reversible or at minimum previewed before affecting live merchant data.",
          owner: "Design + R&D",
        },
        {
          question:
            "Error handling when a bulk operation partially fails — what is the rollback behavior and how is the partner notified?",
          owner: "R&D",
        },
        {
          question:
            "Permission scope for agentic actions — can a PAPO Agent-level user trigger bulk operations or only Owner-level users?",
          owner: "PM (Liran)",
        },
      ],
    },
  },
  {
    stepNumber: 8,
    stepLabel: "Output — Decision Record",
    question: "Your Decision Record is generated.",
    subtext:
      "After step 7, Clearspec produces a structured Decision Record in this format — ready to copy into Notion, Confluence, Linear, or any spec tool.",
    inputType: "output",
    exampleContent: {
      sections: [
        {
          label: "PROBLEM STATEMENT",
          content:
            "ISO partners managing hundreds of merchants spend significant time on repetitive manual tasks with no bulk operation capability.",
        },
        {
          label: "OPERATIONAL PAIN",
          content:
            "Every action required navigating individual merchant records sequentially. 200+ merchant portfolios took hours per week to monitor.",
        },
        {
          label: "SUCCESS METRIC",
          content: "Time spent on manual portfolio monitoring per partner per week",
        },
        {
          label: "TRADEOFFS",
          content:
            "Chosen gives up: Passive alerting in V1.\nRejected gives up: Launch timeline — agentic actions delayed.",
        },
        {
          label: "OPEN QUESTIONS",
          content:
            "□ Confirmation UI before bulk actions — Owner: Design\n□ Partial failure handling — Owner: R&D\n□ Permission scope for agentic actions — Owner: PM",
        },
      ],
    },
  },
];

export const CLEARSPEC_DEMO_STORAGE_KEY = "clearspec_demo_seen_v1";
