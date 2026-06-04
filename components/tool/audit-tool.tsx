"use client";

import { useState, useRef, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type AuditState = "idle" | "loading" | "results";
type SiteType = "saas" | "ecommerce" | "devtool" | "portfolio" | "enterprise" | "marketplace" | "landing" | "ai-builder";
type Priority = "urgent" | "important" | "later";
type Category =
  | "Product clarity"
  | "UX friction"
  | "Mobile responsiveness"
  | "Trust signals"
  | "Conversion"
  | "Accessibility"
  | "QA risk"
  | "AI-builder risk"
  | "Content quality";
type Effort = "Low" | "Medium" | "High";
type Impact = "Low" | "Medium" | "High";
type ToolId = "lovable" | "base44" | "claude" | "generic";

interface AuditFinding {
  id: string;
  priority: Priority;
  category: Category;
  issue: string;
  whyItMatters: string;
  suggestedFix: string;
  effort: Effort;
  impact: Impact;
}

interface AuditResult {
  domain: string;
  siteType: string;
  detectedBuilder: string | null;
  overallScore: number;
  topUrgentIssue: string;
  bestQuickWin: string;
  mainProductRisk: string;
  findings: AuditFinding[];
}

type FixPrompts = Record<ToolId, string>;

const TOOL_LABELS: Record<ToolId, string> = {
  lovable: "Lovable",
  base44: "Base44",
  claude: "Claude",
  generic: "Generic AI Builder",
};

const LOADING_STAGES = [
  "Resolving domain...",
  "Classifying site type...",
  "Applying UX heuristics...",
  "Generating fix prompts...",
];

// ── Fix prompt generator ──────────────────────────────────────────────────────

const CATEGORY_CONTEXT: Record<Category, string> = {
  "Product clarity": "Focus on the hero section, headline, and primary value proposition.",
  "UX friction": "Trace the user flow and fix the interaction causing friction.",
  "Mobile responsiveness": "Work in mobile-first mode. Test at 375px viewport width.",
  "Trust signals": "Add trust elements near the primary CTA or sign-up flow.",
  "Conversion": "Focus on the conversion path — reduce gates and friction before value delivery.",
  "Accessibility": "Check WCAG AA compliance for this element.",
  "QA risk": "Add proper handling for this edge case — loading, error, and empty states.",
  "AI-builder risk": "This is a common gap in AI-built apps. Add explicit handling for this scenario.",
  "Content quality": "Update copy to be specific, outcome-focused, and relevant to the target user.",
};

const TOOL_CONSTRAINTS: Record<ToolId, string> = {
  lovable: "Keep the existing visual style, component structure, and design system. Do not redesign unrelated sections or change the colour palette.",
  base44: "Preserve the existing data model, API connections, and business logic. Only update the UI and UX layer. Do not break existing database schemas.",
  claude: "Do not refactor unrelated components. Ensure all changes are responsive — test at 375px, 768px, and 1280px. Write clean TypeScript. Do not change routing or auth logic.",
  generic: "Maintain consistency with the existing design system. Do not change backend logic, data models, or unrelated functionality. Only fix what is described.",
};

function buildFixPrompts(finding: AuditFinding, detectedBuilder: string | null): FixPrompts {
  const { issue, category, suggestedFix, priority } = finding;
  const urgency = priority === "urgent" ? "This is a critical issue that directly impacts users. " : "";
  const context = CATEGORY_CONTEXT[category];

  const prompts: FixPrompts = {} as FixPrompts;

  (["lovable", "base44", "claude", "generic"] as ToolId[]).forEach((tool) => {
    const toolName = TOOL_LABELS[tool];
    const constraint = TOOL_CONSTRAINTS[tool];

    let prefix = "";
    if (tool === "lovable") {
      prefix = detectedBuilder === "Lovable"
        ? "In this Lovable project, "
        : "Open this project in Lovable. ";
    } else if (tool === "base44") {
      prefix = detectedBuilder === "Base44"
        ? "In this Base44 app, "
        : "In Base44, ";
    } else if (tool === "claude") {
      prefix = "Using Claude with access to the codebase, ";
    } else {
      prefix = "In your AI builder, ";
    }

    prompts[tool] = `${prefix}fix the following issue: "${issue}"

${urgency}${context}

What to fix:
${suggestedFix}

Implementation notes:
- Make this the only change in this session
- Verify the fix works on mobile (375px) and desktop
- ${constraint}

After applying: confirm the issue described above is resolved before closing the session.`;
  });

  return prompts;
}

// ── URL analysis ──────────────────────────────────────────────────────────────

function detectBuilder(url: string): string | null {
  const u = url.toLowerCase();
  if (u.includes("lovable")) return "Lovable";
  if (u.includes("base44")) return "Base44";
  if (u.includes("bolt.new") || u.includes("bolt.")) return "Bolt";
  if (u.includes("v0.dev") || u.includes("v0.")) return "Vercel v0";
  if (u.includes("cursor")) return "Cursor";
  if (u.includes("replit")) return "Replit";
  if (u.includes("stackblitz")) return "StackBlitz";
  if (u.includes("claude.site")) return "Claude";
  return null;
}

function classifySite(url: string): SiteType {
  const u = url.toLowerCase();
  const builder = detectBuilder(url);
  if (builder) return "ai-builder";
  if (/shop|store|buy|cart|checkout|woocommerce|shopify/.test(u)) return "ecommerce";
  if (/github|gitlab|docs\.|developer\.|api\.|npm\./.test(u)) return "devtool";
  if (/portfolio|cv\.|resume\.|\.me\/|behance|dribbble/.test(u)) return "portfolio";
  if (/enterprise|b2b-platform/.test(u)) return "enterprise";
  if (/marketplace|directory|listing/.test(u)) return "marketplace";
  if (/landing|waitlist|coming-soon/.test(u)) return "landing";
  return "saas";
}

function siteTypeLabel(type: SiteType, builder: string | null): string {
  if (type === "ai-builder" && builder) return `AI-built · ${builder}`;
  if (type === "ai-builder") return "AI-built app";
  const labels: Record<string, string> = {
    saas: "B2B SaaS", ecommerce: "E-commerce", devtool: "Developer tool",
    portfolio: "Portfolio", enterprise: "Enterprise platform",
    marketplace: "Marketplace", landing: "Landing page",
  };
  return labels[type] || "Web product";
}

// ── Findings generators ───────────────────────────────────────────────────────

let _idCounter = 0;
function fid(): string { return `f-${++_idCounter}`; }

function getAIBuilderFindings(url: string, builder: string | null): AuditFinding[] {
  const u = url.toLowerCase();
  const b = builder || "the AI builder";

  const base: AuditFinding[] = [
    {
      id: fid(), priority: "urgent", category: "AI-builder risk",
      issue: "Empty states likely not handled — pages may break when data is missing",
      whyItMatters: "AI builders scaffold happy-path flows. Empty states (no data, first-time user, loading error) are rarely generated automatically and will show broken UI in production.",
      suggestedFix: "Add explicit empty state components for every list, table, or data display. Include: a message, an icon, and a suggested next action.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Product clarity",
      issue: "Value proposition may not be clear within 5 seconds",
      whyItMatters: `Products built quickly with ${b} often have placeholder or generic headlines. A new visitor must understand what the product does and who it is for within 5 seconds.`,
      suggestedFix: "Rewrite the hero headline to name: what the product does, who it is for, and the specific outcome they get. Remove generic phrases like 'powerful', 'seamless', or 'next-generation'.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "QA risk",
      issue: "Form validation likely uses builder defaults — may allow invalid submissions",
      whyItMatters: "Default AI-builder form validation is often minimal: missing required field enforcement, no format checking (email, phone), no error messages on submission failure.",
      suggestedFix: "Test every form: empty submission, invalid email format, special characters, very long inputs. Add visible inline error messages for each validation failure.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "AI-builder risk",
      issue: "Authentication UX likely uses default builder patterns — may confuse users",
      whyItMatters: `${b} generates auth flows with default copy and UX patterns. These are often generic and lack branding, onboarding context, or clear next steps after sign-up.`,
      suggestedFix: "Customise the sign-up and login flow: update copy to match product voice, add context about what happens next, and ensure the post-auth redirect lands in a useful state.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Mobile responsiveness",
      issue: "Navigation and layout may not adapt correctly to narrow viewports",
      whyItMatters: "AI builders often generate desktop-first layouts. Mobile navigation, card grids, and data tables frequently overflow or stack incorrectly at 375px.",
      suggestedFix: "Test the full product on iPhone SE (375px). Fix: nav overflow, horizontal scrolling, button tap targets below 44px, and text below 13px.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Content quality",
      issue: "Content likely contains placeholder copy or generic AI-generated text",
      whyItMatters: "AI builders pre-populate placeholder content that is often not updated before launch. Generic copy reduces credibility and fails to communicate real product value.",
      suggestedFix: "Audit every text element: headlines, CTAs, descriptions, error messages, onboarding copy. Replace all placeholder or generic text with product-specific, outcome-focused language.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "important", category: "QA risk",
      issue: "Loading states may not be defined for async operations",
      whyItMatters: "When data is fetching or an action is processing, the UI should show a loading state. Without it, users click twice, assume the product is broken, or lose progress.",
      suggestedFix: "Add loading indicators for: page loads, form submissions, data fetches, and any operation taking more than 300ms. Use skeleton screens for content-heavy areas.",
      effort: "Medium", impact: "Medium",
    },
    {
      id: fid(), priority: "later", category: "Trust signals",
      issue: "No social proof or credibility signals visible on the main page",
      whyItMatters: "AI-built products launched quickly often have no testimonials, usage numbers, or proof of real users. Without these, new visitors have no reason to trust the product.",
      suggestedFix: "Add at least one trust signal: a user count, a testimonial, a recognised logo, or a press mention. Even 'X users signed up this week' adds credibility.",
      effort: "Low", impact: "Medium",
    },
  ];

  // URL-specific additions
  if (u.includes("dashboard") || u.includes("app.")) {
    base.push({
      id: fid(), priority: "urgent", category: "QA risk",
      issue: "Dashboard or app URL — permission and role-based access likely untested",
      whyItMatters: "AI-built dashboards often lack proper permission gates. Users may access data or actions they should not be able to see, or be blocked from actions they should have.",
      suggestedFix: "Test the app as different user types: new user, existing user, admin, free tier, paid tier. Verify that each role sees only what they are supposed to see.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("pricing") || u.includes("checkout")) {
    base.push({
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Pricing or checkout page — payment flow needs full QA before going live",
      whyItMatters: "Payment flows in AI-built products are the highest-risk area. Edge cases: failed payment handling, double-charge prevention, webhook confirmation, and email receipts must all be tested.",
      suggestedFix: "Test the full payment flow end-to-end with a test card: success, decline, card error, 3DS challenge, refund. Verify confirmation email is sent and the user state updates correctly.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("signup") || u.includes("register") || u.includes("onboard")) {
    base.push({
      id: fid(), priority: "important", category: "Conversion",
      issue: "Sign-up page detected — onboarding friction likely too high",
      whyItMatters: "AI-generated sign-up flows often ask for too much information too early. Every extra field before the user sees product value reduces completion by ~10%.",
      suggestedFix: "Reduce sign-up to the minimum required: email + password, or OAuth only. Move company name, role, team size to the onboarding flow after the user sees value.",
      effort: "Low", impact: "High",
    });
  }

  return base;
}

function getSaaSFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Product clarity",
      issue: "Hero headline likely describes a feature, not a user outcome",
      whyItMatters: "A new visitor decides within 5 seconds whether to engage. Feature-led headlines ('Powerful AI platform') do not communicate value. Outcome-led headlines do ('Cut your support tickets in half').",
      suggestedFix: "Rewrite the headline to complete: 'After using this, you can finally...' or 'This replaces the pain of...'. Name a specific, measurable outcome.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Sign-up likely requires account creation before showing product value",
      whyItMatters: "Gated product experiences cause 40–70% drop-off before a user sees value. Best-in-class SaaS shows the product before asking for email.",
      suggestedFix: "Add an interactive demo, sandbox, or product tour that requires no sign-up. Let users experience the core value before committing to account creation.",
      effort: "High", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust signals",
      issue: "Social proof not visible above the fold",
      whyItMatters: "B2B buyers look for proof of existing customers before engaging. Customer logos or testimonials below the fold may never be seen.",
      suggestedFix: "Move at least 3 customer logos or one specific testimonial to the hero section, below the headline and above the first scroll break.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "important", category: "Mobile responsiveness",
      issue: "Primary CTA accessibility on mobile viewports",
      whyItMatters: "If the primary CTA is only visible on desktop or buried in mobile navigation, mobile traffic — often 50%+ of visitors — cannot convert.",
      suggestedFix: "Verify the primary CTA is visible and tappable above the fold on 375px viewport. Ensure tap target is at least 44×44px.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "later", category: "UX friction",
      issue: "Sign-up form likely collects more information than needed",
      whyItMatters: "Each extra field in a sign-up form reduces completion rate by approximately 10%. Most information (company size, role, use case) can be collected post-activation.",
      suggestedFix: "Reduce sign-up to email + password minimum. Move company info and role to post-signup onboarding where intent is already established.",
      effort: "Low", impact: "Medium",
    },
  ];
}

function getPortfolioFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Product clarity",
      issue: "Role and specialty not immediately clear",
      whyItMatters: "A hiring manager or client makes their judgment in 3–5 seconds. If your role and specialty are not clear in the hero, they will not read further.",
      suggestedFix: "First sentence of the hero must include: your role, your specialty, and who you help. e.g. 'Product Manager specialising in B2B fintech platforms.'",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Contact path requires too many steps",
      whyItMatters: "A hiring manager who cannot find contact information in one click will not search for it. The path from portfolio to contact should be one action.",
      suggestedFix: "Add a prominent contact CTA in the navigation and at the bottom of every page. Link directly to email, LinkedIn, or a contact form — not a separate contact page.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust signals",
      issue: "Case studies lack specific, measurable outcomes",
      whyItMatters: "Portfolios that describe what was built without naming what changed in measurable terms are unconvincing. Outcomes are more credible than descriptions.",
      suggestedFix: "For each case study, add: the specific metric that moved, by how much, and over what timeframe. e.g. 'Reduced settlement support tickets by 40% in 90 days.'",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Mobile responsiveness",
      issue: "Portfolio layout may not adapt to mobile viewports",
      whyItMatters: "Hiring managers often review portfolios on phones. A broken mobile layout signals poor attention to detail — exactly the opposite of what a PM or designer wants to communicate.",
      suggestedFix: "Test on iPhone SE (375px). Ensure all case studies, images, and contact paths are readable and accessible. Fix any horizontal overflow.",
      effort: "Medium", impact: "Medium",
    },
    {
      id: fid(), priority: "later", category: "Content quality",
      issue: "Headlines and section titles may be generic",
      whyItMatters: "Generic headers ('About Me', 'My Work') are forgettable. Specific, voice-driven headers make a portfolio memorable.",
      suggestedFix: "Replace generic section titles with specific statements that reflect your PM style. e.g. 'Products I shipped' → 'What I built and what changed because of it.'",
      effort: "Low", impact: "Low",
    },
  ];
}

function getEcommerceFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Trust signals",
      issue: "Payment security signals may not be visible at checkout",
      whyItMatters: "65% of shoppers abandon checkout due to trust concerns. Security badges and accepted payment logos must appear near the checkout CTA.",
      suggestedFix: "Add SSL badge, accepted payment icons, and a returns policy summary above the Place Order button.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Guest checkout likely not prominently offered",
      whyItMatters: "Forced account creation before purchase causes 35% checkout abandonment. Guest checkout should be the default or equally prominent option.",
      suggestedFix: "Place guest checkout as the first option. Move account creation to post-purchase as an optional step.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Mobile responsiveness",
      issue: "Product image gallery touch interactions may not work correctly",
      whyItMatters: "Mobile shoppers rely on swiping through product images. Pinch-to-zoom and swipe gestures must work on iOS Safari and Android Chrome.",
      suggestedFix: "Test product gallery with touch gestures. Ensure pinch-to-zoom is not disabled via CSS. Test horizontal swipe navigation.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "QA risk",
      issue: "Cart state may not persist across page refreshes or navigation",
      whyItMatters: "If cart items disappear when a user navigates away or refreshes, it is one of the most frustrating experiences in e-commerce and directly causes drop-off.",
      suggestedFix: "Test: add items to cart → navigate to another page → return to cart. Items must persist. Also test: close browser tab and reopen.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "later", category: "UX friction",
      issue: "Checkout form collects information in non-optimal order",
      whyItMatters: "The standard checkout order (email → shipping → payment) is optimised for conversion. Non-standard flows create confusion and increase drop-off.",
      suggestedFix: "Follow the standard checkout order: email/contact → shipping address → delivery method → payment. Do not ask for account creation before payment details.",
      effort: "Medium", impact: "Medium",
    },
  ];
}

function getDevToolFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Product clarity",
      issue: "Time-to-first-working-result likely too long",
      whyItMatters: "Developer tools are evaluated by how quickly a developer can see a working result. If the quickstart takes more than 10 minutes, developers move on to alternatives.",
      suggestedFix: "Create a quickstart that reaches a working result in 3 steps or fewer. Measure and optimise time-to-first-success as a product metric.",
      effort: "High", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust signals",
      issue: "Status page not linked from main navigation",
      whyItMatters: "Developer tool buyers check uptime history before committing. A missing status page is a trust gap for engineering teams evaluating reliability.",
      suggestedFix: "Add a status page link to the main navigation footer and the dashboard. Link to historical uptime data.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "important", category: "QA risk",
      issue: "Code examples in documentation may not be tested",
      whyItMatters: "Copy-paste code that does not work destroys developer trust faster than anything else. One broken example can cause a developer to abandon evaluation entirely.",
      suggestedFix: "Run CI against all code examples in documentation on every release. Test in all officially supported language versions and environments.",
      effort: "High", impact: "High",
    },
    {
      id: fid(), priority: "later", category: "UX friction",
      issue: "Search does not support developer-style queries",
      whyItMatters: "Developers search docs with specific technical queries: error codes, method names, SDK names. Generic search fails these.",
      suggestedFix: "Implement Algolia DocSearch or equivalent. Explicitly index error codes, method names, and common technical queries.",
      effort: "Medium", impact: "Medium",
    },
  ];
}

function getLandingFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Product clarity",
      issue: "Value proposition not communicable in 5 seconds",
      whyItMatters: "Landing pages have one job: convert a visitor into a lead. If the value proposition requires reading, most visitors will not see it.",
      suggestedFix: "Reduce the hero to: one outcome-focused headline, two supporting sentences maximum, one CTA. Remove everything else above the fold.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Primary CTA competes with secondary actions",
      whyItMatters: "Every additional CTA reduces the conversion rate of the primary one. A landing page with one CTA converts 3× better than one with multiple.",
      suggestedFix: "Remove or visually eliminate all CTAs except the primary action. If navigation is present, consider removing it from the landing page entirely.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust signals",
      issue: "No early social proof or credibility signals",
      whyItMatters: "Pre-launch and early-stage landing pages need trust signals even without a customer base. Waitlist count, press mention, or founder credibility fill this gap.",
      suggestedFix: "Add at least one trust signal: a waitlist counter, a press mention, a recognisable logo, or a founder credential with relevant context.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "later", category: "QA risk",
      issue: "Form submission flow not tested end-to-end",
      whyItMatters: "A broken sign-up form on a landing page loses leads silently. Most teams test form design but not the full submission → confirmation email → unsubscribe flow.",
      suggestedFix: "Test: submit → confirmation page renders → confirmation email delivered → unsubscribe path works. Test on mobile.",
      effort: "Low", impact: "High",
    },
  ];
}

function getURLSignalFindings(url: string): AuditFinding[] {
  const u = url.toLowerCase();
  const extra: AuditFinding[] = [];

  if (u.includes("pricing")) {
    extra.push({
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Pricing page — self-service evaluation path may be gated",
      whyItMatters: "Pricing pages that require a sales call gate out up to 60% of developer and SMB buyers who self-qualify. This is the single highest-impact conversion issue on pricing pages.",
      suggestedFix: "Add a free tier, sandbox, or interactive demo. Remove 'Contact sales' as the only CTA on the pricing page. Show at least one tier with transparent, immediate access.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("login") || u.includes("signin")) {
    extra.push({
      id: fid(), priority: "important", category: "QA risk",
      issue: "Login page — password reset and error recovery flows need testing",
      whyItMatters: "Login errors are often the first experience a returning user has after a break. Broken password reset or unhelpful error messages cause churn before the user even re-engages.",
      suggestedFix: "Test: wrong password error message, too-many-attempts handling, password reset email delivery, and reset link expiry behaviour.",
      effort: "Low", impact: "Medium",
    });
  }

  if (u.includes("dashboard") || u.includes("/app")) {
    extra.push({
      id: fid(), priority: "urgent", category: "QA risk",
      issue: "Dashboard — empty and loading states need explicit handling",
      whyItMatters: "New users and users with no data will see the dashboard before any content exists. Without explicit empty states, the page looks broken.",
      suggestedFix: "Add empty state components for every list, chart, and data display. Include: an illustration or icon, a message explaining the empty state, and a CTA for the next action.",
      effort: "Medium", impact: "High",
    });
  }

  if (u.includes("checkout") || u.includes("cart")) {
    extra.push({
      id: fid(), priority: "urgent", category: "QA risk",
      issue: "Checkout flow — payment error handling and recovery not tested",
      whyItMatters: "A failed payment with no clear recovery path is the highest-cost bug in a transactional product. Users who cannot retry immediately are lost.",
      suggestedFix: "Test: declined card, network error during payment, session timeout during checkout. Verify each case shows a clear error message and a working retry path.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("docs") || u.includes("/api")) {
    extra.push({
      id: fid(), priority: "important", category: "Product clarity",
      issue: "Documentation — quickstart or getting started may not be immediately visible",
      whyItMatters: "The first question a developer asks is 'how quickly can I see this working?' If the quickstart is not the first thing on the docs homepage, evaluation time increases significantly.",
      suggestedFix: "Place a 'Get started' or quickstart link at the very top of the docs homepage, before any reference documentation or conceptual guides.",
      effort: "Low", impact: "High",
    });
  }

  return extra;
}

function buildAuditResult(url: string): AuditResult {
  _idCounter = 0; // reset for consistent IDs per audit
  let domain = url;
  try {
    domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch { /* keep raw */ }

  const builder = detectBuilder(url);
  const type = classifySite(url);

  let baseFindings: AuditFinding[];
  const baseScores: Record<SiteType, number> = {
    saas: 58, ecommerce: 62, devtool: 55, portfolio: 64,
    enterprise: 52, marketplace: 60, landing: 50, "ai-builder": 48,
  };

  if (type === "ai-builder") baseFindings = getAIBuilderFindings(url, builder);
  else if (type === "ecommerce") baseFindings = getEcommerceFindings();
  else if (type === "devtool") baseFindings = getDevToolFindings();
  else if (type === "portfolio") baseFindings = getPortfolioFindings();
  else if (type === "landing") baseFindings = getLandingFindings();
  else baseFindings = getSaaSFindings();

  const urlFindings = getURLSignalFindings(url);
  const allFindings = [...baseFindings, ...urlFindings];

  const order: Record<Priority, number> = { urgent: 0, important: 1, later: 2 };
  allFindings.sort((a, b) => order[a.priority] - order[b.priority]);

  const urgent = allFindings.filter((f) => f.priority === "urgent");
  const quickWin = allFindings.find((f) => f.effort === "Low" && f.impact === "High");

  return {
    domain,
    siteType: siteTypeLabel(type, builder),
    detectedBuilder: builder,
    overallScore: baseScores[type],
    topUrgentIssue: urgent[0]?.issue ?? "No critical issues detected",
    bestQuickWin: quickWin?.issue ?? allFindings[0]?.issue ?? "See findings below",
    mainProductRisk: urgent.find((f) => f.category === "Conversion" || f.category === "Product clarity")?.issue ?? urgent[0]?.issue ?? "Review full findings",
    findings: allFindings,
  };
}

// ── Priority config ───────────────────────────────────────────────────────────

const P_CONFIG = {
  urgent: { label: "Urgent", dot: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200", rowBg: "bg-red-50", borderL: "border-l-red-400" },
  important: { label: "Important", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200", rowBg: "bg-amber-50/50", borderL: "border-l-amber-400" },
  later: { label: "Later", dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600 border-zinc-200", rowBg: "bg-white", borderL: "border-l-zinc-200" },
};

// ── Main component ────────────────────────────────────────────────────────────

export default function AuditTool() {
  const [auditState, setAuditState] = useState<AuditState>("idle");
  const [url, setUrl] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [activeTab, setActiveTab] = useState<ToolId>("lovable");
  const [copiedPrompt, setCopiedPrompt] = useState<ToolId | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function normalise(raw: string) {
    const t = raw.trim();
    return t && !t.startsWith("http") ? `https://${t}` : t;
  }

  async function runAudit() {
    const norm = normalise(url);
    if (!norm) { setError("Enter a URL to audit."); return; }
    setError("");
    setAuditState("loading");
    setStageIndex(0);
    for (let i = 1; i < LOADING_STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 480));
      setStageIndex(i);
    }
    await new Promise((r) => setTimeout(r, 380));
    setResult(buildAuditResult(norm));
    setAuditState("results");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function reset() {
    setAuditState("idle"); setUrl(""); setResult(null); setError(""); setCopied(false);
    setDrawerOpen(false); setSelectedFinding(null);
  }

  function openDrawer(finding: AuditFinding) {
    setSelectedFinding(finding);
    setActiveTab(result?.detectedBuilder?.toLowerCase() === "lovable" ? "lovable" :
      result?.detectedBuilder?.toLowerCase() === "base44" ? "base44" : "lovable");
    setDrawerOpen(true);
    setCopiedPrompt(null);
  }

  function copyPrompt(tool: ToolId, prompt: string) {
    navigator.clipboard.writeText(prompt).catch(() => null);
    setCopiedPrompt(tool);
    setTimeout(() => setCopiedPrompt(null), 2000);
  }

  function copyFullReport() {
    if (!result) return;
    const text = result.findings.map((f) =>
      `[${f.priority.toUpperCase()}] ${f.category}\n${f.issue}\nWhy: ${f.whyItMatters}\nFix: ${f.suggestedFix}`
    ).join("\n\n");
    navigator.clipboard.writeText(`AI Builder QA Audit — ${result.domain}\n\n${text}\n\nDemo audit based on URL pattern and product heuristics`).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (auditState === "idle") return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
      <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">Run an audit</p>
      <p className="mb-5 text-sm text-zinc-500">
        Enter the URL of your AI-built site. Get a prioritised issue table with ready-to-copy fix prompts for your builder.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1">
          <input
            type="text" value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") runAudit(); }}
            placeholder="https://myapp.lovable.app"
            className={`w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none transition-colors focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${error ? "border-red-300 bg-red-50" : "border-zinc-200 hover:border-zinc-300"}`}
            autoFocus
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <button onClick={runAudit} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 active:scale-[0.98]">
          Run audit →
        </button>
      </div>
      <p className="mt-4 text-xs text-zinc-400">Demo audit based on URL pattern and product heuristics · No page crawling · No data stored</p>
    </div>
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (auditState === "loading") return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex gap-1">{[0,1,2].map((i) => <div key={i} className="h-2 w-2 rounded-full bg-zinc-300 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}</div>
        <span className="font-mono text-xs text-zinc-500">Auditing {normalise(url).replace(/https?:\/\//, "").split("/")[0]}</span>
      </div>
      <div className="mb-5 space-y-2">
        {LOADING_STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-3">
            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${i < stageIndex ? "border-green-300 bg-green-50 text-green-600" : i === stageIndex ? "border-zinc-300 bg-zinc-50 text-zinc-400" : "border-zinc-200 text-zinc-200"}`}>
              {i < stageIndex ? "✓" : i === stageIndex ? "→" : "·"}
            </div>
            <span className={`text-sm ${i < stageIndex ? "text-zinc-400 line-through" : i === stageIndex ? "text-zinc-700 font-medium" : "text-zinc-300"}`}>{stage}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
        <div className="h-full rounded-full bg-zinc-900 transition-all duration-500" style={{ width: `${((stageIndex+1)/LOADING_STAGES.length)*100}%` }} />
      </div>
    </div>
  );

  // ── Results ───────────────────────────────────────────────────────────────
  if (auditState === "results" && result) {
    const urgentCount = result.findings.filter((f) => f.priority === "urgent").length;
    const importantCount = result.findings.filter((f) => f.priority === "important").length;
    const fixPrompts = selectedFinding ? buildFixPrompts(selectedFinding, result.detectedBuilder) : null;

    return (
      <>
        <div ref={resultRef} className="space-y-5">

          {/* Actions bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">Audit complete</span>
              </div>
              <p className="text-sm text-zinc-500">
                <span className="font-medium text-zinc-800">{result.domain}</span>
                <span className="ml-2 rounded border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-500">{result.siteType}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyFullReport} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400">
                {copied ? "✓ Copied" : "Copy report"}
              </button>
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400">
                New audit
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Overall score" value={`${result.overallScore}/100`} sub={`${urgentCount} urgent · ${importantCount} important`} accent="zinc" />
            <SummaryCard label="Top urgent issue" value={urgentCount > 0 ? `${urgentCount} found` : "None"} sub={result.topUrgentIssue} accent="red" />
            <SummaryCard label="Best quick win" value="Low effort" sub={result.bestQuickWin} accent="green" />
            <SummaryCard label="Main product risk" value="Review" sub={result.mainProductRisk} accent="amber" />
          </div>

          {/* Fix prompt hint */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Fix prompts included.</span> Click{" "}
              <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border border-blue-200 text-blue-600">Fix prompt →</span>
              {" "}on any row to get a ready-to-paste prompt for Lovable, Base44, Claude, or any AI builder.
            </p>
          </div>

          {/* Findings table */}
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            {/* Desktop header */}
            <div className="hidden sm:grid sm:grid-cols-[90px_120px_1fr_1fr_1fr_70px_70px_110px] border-b border-zinc-200 bg-zinc-50 px-4 py-3 gap-3">
              {["Priority","Category","Issue","Why it matters","Suggested fix","Effort","Impact",""].map((h) => (
                <div key={h} className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{h}</div>
              ))}
            </div>

            <div className="divide-y divide-zinc-100">
              {result.findings.map((f) => {
                const cfg = P_CONFIG[f.priority];
                return (
                  <div key={f.id} className={`${cfg.rowBg} border-l-4 ${cfg.borderL}`}>

                    {/* Mobile card */}
                    <div className="block p-4 sm:hidden">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${cfg.badge}`}>
                          <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">{f.category}</span>
                      </div>
                      <p className="mb-1.5 text-sm font-semibold text-zinc-900">{f.issue}</p>
                      <p className="mb-3 text-xs text-zinc-500 leading-relaxed">{f.whyItMatters}</p>
                      <div className="mb-3 rounded bg-white/80 border border-zinc-200 p-2.5">
                        <p className="mb-1 font-mono text-[10px] font-semibold uppercase text-zinc-400">Fix</p>
                        <p className="text-xs text-zinc-700">{f.suggestedFix}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          <span className="font-mono text-[10px] text-zinc-400">Effort: {f.effort}</span>
                          <span className="font-mono text-[10px] text-zinc-400">Impact: {f.impact}</span>
                        </div>
                        <button
                          onClick={() => openDrawer(f)}
                          className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 font-mono text-[11px] text-white hover:bg-zinc-700 transition-colors"
                        >
                          Fix prompt →
                        </button>
                      </div>
                    </div>

                    {/* Desktop row */}
                    <div className="hidden sm:grid sm:grid-cols-[90px_120px_1fr_1fr_1fr_70px_70px_110px] items-start gap-3 px-4 py-4">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] font-semibold uppercase ${cfg.badge}`}>
                          <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-zinc-600">{f.category}</div>
                      <div className="text-xs font-semibold text-zinc-900">{f.issue}</div>
                      <div className="text-xs leading-relaxed text-zinc-500">{f.whyItMatters}</div>
                      <div className="text-xs leading-relaxed text-zinc-600">{f.suggestedFix}</div>
                      <div><EffortBadge v={f.effort} /></div>
                      <div><ImpactBadge v={f.impact} /></div>
                      <div>
                        <button
                          onClick={() => openDrawer(f)}
                          className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-2 font-mono text-[11px] text-white hover:bg-zinc-700 transition-colors whitespace-nowrap"
                        >
                          Fix prompt →
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400">
            Demo audit based on URL pattern and product heuristics · Not a real page crawl
          </p>
        </div>

        {/* ── Fix Prompt Drawer ─────────────────────────────────────────────── */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex" onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}>
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Panel — bottom sheet on mobile, right side on lg+ */}
            <div className="
              fixed bottom-0 left-0 right-0 z-50
              flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl
              transition-transform duration-300
              lg:inset-y-0 lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:max-h-none lg:w-[440px] lg:rounded-none lg:rounded-l-xl
            ">

              {/* Drawer header */}
              <div className="flex shrink-0 items-start justify-between border-b border-zinc-100 p-5">
                <div className="min-w-0 mr-3">
                  <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">Fix prompt</p>
                  <p className="text-sm font-semibold leading-snug text-zinc-900 line-clamp-2">
                    {selectedFinding?.issue}
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label="Close"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tool tabs */}
              <div className="flex shrink-0 border-b border-zinc-100 px-5 gap-1">
                {(["lovable", "base44", "claude", "generic"] as ToolId[]).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => setActiveTab(tool)}
                    className={`px-3 py-3 font-mono text-xs font-semibold transition-colors border-b-2 -mb-px ${
                      activeTab === tool
                        ? "border-zinc-900 text-zinc-900"
                        : "border-transparent text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    {TOOL_LABELS[tool].split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Prompt content */}
              <div className="flex-1 overflow-y-auto p-5">
                {fixPrompts && (
                  <>
                    {/* Tool context */}
                    <div className="mb-4 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
                      <p className="text-xs text-zinc-500">
                        <span className="font-medium text-zinc-700">{TOOL_LABELS[activeTab]}</span>
                        {activeTab === "lovable" && " — optimised for visual/design changes"}
                        {activeTab === "base44" && " — optimised for app logic and data model"}
                        {activeTab === "claude" && " — optimised for code-level changes"}
                        {activeTab === "generic" && " — works with any AI builder"}
                      </p>
                    </div>

                    {/* Prompt text */}
                    <div className="rounded-lg border border-zinc-200 bg-white">
                      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                          Prompt
                        </span>
                        <button
                          onClick={() => copyPrompt(activeTab, fixPrompts[activeTab])}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
                            copiedPrompt === activeTab
                              ? "bg-green-100 text-green-700"
                              : "bg-zinc-900 text-white hover:bg-zinc-700"
                          }`}
                        >
                          {copiedPrompt === activeTab ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-700">
                          {fixPrompts[activeTab]}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-zinc-400">
                      Paste this prompt directly into your AI builder. Run it as a focused, single-issue session.
                    </p>
                  </>
                )}
              </div>

            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  const borders: Record<string, string> = { zinc: "border-zinc-200", red: "border-red-200", green: "border-green-200", amber: "border-amber-200" };
  return (
    <div className={`rounded-xl border bg-white p-4 ${borders[accent] ?? borders.zinc}`}>
      <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <p className="mb-1 text-base font-semibold text-zinc-900">{value}</p>
      <p className="text-[11px] leading-relaxed text-zinc-500 line-clamp-2">{sub}</p>
    </div>
  );
}

function EffortBadge({ v }: { v: Effort }) {
  const s = { Low: "text-green-700 bg-green-50 border-green-200", Medium: "text-amber-700 bg-amber-50 border-amber-200", High: "text-red-700 bg-red-50 border-red-200" }[v];
  return <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] ${s}`}>{v}</span>;
}

function ImpactBadge({ v }: { v: Impact }) {
  const s = { High: "text-blue-700 bg-blue-50 border-blue-200", Medium: "text-zinc-700 bg-zinc-50 border-zinc-200", Low: "text-zinc-500 bg-white border-zinc-200" }[v];
  return <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] ${s}`}>{v}</span>;
}
