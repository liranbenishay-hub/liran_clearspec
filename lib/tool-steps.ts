import type { Step } from "./types";

export const STEPS: Step[] = [
  {
    id: "title",
    number: 1,
    heading: "What is this product or feature called?",
    subtext:
      "Give it a name. This becomes the title of your PRD. It can be a working name — you can refine it later.",
    placeholder:
      'e.g. "Smart Merchant Search", "Partner Webhook Configuration", "Card Issuing Onboarding"',
  },
  {
    id: "problem",
    number: 2,
    heading: "Start with the problem, not the solution.",
    subtext:
      "Describe the product problem you're trying to solve. Do not frame a solution. Do not mention scope. Just the problem.",
    placeholder:
      'e.g. "ISO partners managing hundreds of merchants spend significant time on repetitive manual tasks — identifying stalled merchants, configuring webhooks individually, and spotting volume anomalies one merchant at a time."',
  },
  {
    id: "pain",
    number: 3,
    heading: "What broken process does this replace?",
    subtext:
      'Not "users want X." Specifically: who is doing what manually, and what does it cost them? The broken process is the real product problem.',
    placeholder:
      'e.g. "ISO partners had no way to apply bulk operations across their merchant portfolio. Every webhook configuration, every status check required navigating individual merchant records — one at a time."',
    hint: "Partners calling AMs. Merchants opening support tickets. Engineers involved in every transaction. Find that sentence.",
  },
  {
    id: "workaround",
    number: 4,
    heading: "What are they doing instead right now?",
    subtext:
      "The current workaround reveals the real problem size. What is the manual, fragile, or expensive process they are using today?",
    placeholder:
      'e.g. "Partners were navigating to each merchant individually, checking status, then repeating the process across their entire portfolio. For a partner with 200+ merchants, this took hours per week."',
    hint: "If there is no painful workaround, the problem may not be urgent enough to build.",
  },
  {
    id: "metric",
    number: 5,
    heading: "If this works, what single metric moves?",
    subtext:
      "One number. If you cannot name it before scoping starts, the discovery is not done. Do not list five metrics — pick the most important one.",
    placeholder: 'e.g. "Settlement-related support ticket reduction by 40% within 90 days"',
    hint: "Support ticket reduction · Time-to-onboard · Activation rate · Manual hours eliminated",
  },
  {
    id: "scope",
    number: 6,
    heading: "What will you NOT build in version 1?",
    subtext:
      "The deferred scope is as important as the MVP scope. Name both explicitly. The Phase 2 list is a commitment, not an afterthought.",
    placeholder: "",
  },
  {
    id: "tradeoff",
    number: 7,
    heading: "What is the alternative approach you are not taking?",
    subtext:
      "Every real decision has a viable rejected option. Name it. Then name what each approach gives up. The tradeoff is part of the decision record.",
    placeholder: "",
    hint: "If there is only one possible approach, you have not done discovery.",
  },
  {
    id: "questions",
    number: 8,
    heading: "What must be resolved before shipping?",
    subtext:
      "Open questions are first-class objects. Name them. Assign an owner. Do not embed them in prose and hope someone notices.",
    placeholder: "",
    hint: "Architecture risks. Control authority ambiguities. Data availability questions. Compliance decisions. Name them or they become production bugs.",
  },
];

export const TOTAL_STEPS = STEPS.length;
