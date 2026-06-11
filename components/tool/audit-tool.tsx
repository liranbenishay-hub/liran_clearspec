"use client";

import { useState, useRef, useEffect } from "react";
import {
  classifySiteContext,
  SITE_TYPE_LABELS,
  SITE_TYPE_ICONS,
  confidenceLabel,
  type SiteContext,
  type SiteContextType,
} from "@/lib/site-context";

// ── Types ─────────────────────────────────────────────────────────────────────

type AuditState = "idle" | "loading" | "results";
type SiteType = "saas" | "ecommerce" | "devtool" | "portfolio" | "enterprise" | "marketplace" | "landing" | "ai-builder";
type Priority = "urgent" | "important" | "later";
type Category =
  | "Product Clarity"
  | "User Journey"
  | "Conversion"
  | "UX Friction"
  | "Trust Signals"
  | "Accessibility"
  | "Mobile Experience"
  | "Performance Perception";
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
  "Connecting to target site...",
  "Fetching and parsing HTML...",
  "Analysing signals and structure...",
  "Generating audit findings...",
];

// ── Fix prompt generator ──────────────────────────────────────────────────────

const CATEGORY_CONTEXT: Record<Category, string> = {
  "Product Clarity": "Focus on the hero, headline, and value proposition. The user must understand what the product does and who it is for within 5 seconds.",
  "User Journey": "Map the user's path from arrival to activation. Identify where they get stuck, confused, or lose momentum.",
  "Conversion": "Focus on the activation path — reduce gates, remove friction, and make the primary action unavoidable above the fold.",
  "UX Friction": "Identify the specific interaction causing friction. Fix the flow, not the surface. Every extra step reduces completion rate.",
  "Trust Signals": "Add trust elements near the decision point. B2B buyers look for proof before they act. Show it where it matters.",
  "Accessibility": "This feature must work for all users. Check WCAG AA compliance and test with a screen reader before marking this resolved.",
  "Mobile Experience": "Switch to mobile-first. Test at 375px. Primary actions must be reachable without scrolling. Touch targets must be at least 44px.",
  "Performance Perception": "Slow load time is a product experience failure, not just a technical issue. Users form judgments before the page is fully rendered.",
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
      id: fid(), priority: "urgent", category: "User Journey",
      issue: "Empty states likely not handled — pages may break when data is missing",
      whyItMatters: "AI builders scaffold happy-path flows. Empty states (no data, first-time user, loading error) are rarely generated automatically and will show broken UI in production.",
      suggestedFix: "Add explicit empty state components for every list, table, or data display. Include: a message, an icon, and a suggested next action.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "Value proposition may not be clear within 5 seconds",
      whyItMatters: `Products built quickly with ${b} often have placeholder or generic headlines. A new visitor must understand what the product does and who it is for within 5 seconds.`,
      suggestedFix: "Rewrite the hero headline to name: what the product does, who it is for, and the specific outcome they get. Remove generic phrases like 'powerful', 'seamless', or 'next-generation'.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Performance Perception",
      issue: "Users may submit forms with invalid data — causing silent failures or broken flows",
      whyItMatters: "Default AI-builder form validation is often minimal: missing required field enforcement, no format checking (email, phone), no error messages on submission failure.",
      suggestedFix: "Test every form: empty submission, invalid email format, special characters, very long inputs. Add visible inline error messages for each validation failure.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "User Journey",
      issue: "The sign-in experience is using generic defaults that don't match the product voice",
      whyItMatters: `${b} generates auth flows with default copy and UX patterns. These are often generic and lack branding, onboarding context, or clear next steps after sign-up.`,
      suggestedFix: "Customise the sign-up and login flow: update copy to match product voice, add context about what happens next, and ensure the post-auth redirect lands in a useful state.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Mobile Experience",
      issue: "Navigation and layout may not adapt correctly to narrow viewports",
      whyItMatters: "AI builders often generate desktop-first layouts. Mobile navigation, card grids, and data tables frequently overflow or stack incorrectly at 375px.",
      suggestedFix: "Test the full product on iPhone SE (375px). Fix: nav overflow, horizontal scrolling, button tap targets below 44px, and text below 13px.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Product Clarity",
      issue: "Content likely contains placeholder copy or generic AI-generated text",
      whyItMatters: "AI builders pre-populate placeholder content that is often not updated before launch. Generic copy reduces credibility and fails to communicate real product value.",
      suggestedFix: "Audit every text element: headlines, CTAs, descriptions, error messages, onboarding copy. Replace all placeholder or generic text with product-specific, outcome-focused language.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "important", category: "Performance Perception",
      issue: "Users see a blank or frozen screen while data loads — creating a broken product impression",
      whyItMatters: "When data is fetching or an action is processing, the UI should show a loading state. Without it, users click twice, assume the product is broken, or lose progress.",
      suggestedFix: "Add loading indicators for: page loads, form submissions, data fetches, and any operation taking more than 300ms. Use skeleton screens for content-heavy areas.",
      effort: "Medium", impact: "Medium",
    },
    {
      id: fid(), priority: "later", category: "Trust Signals",
      issue: "No social proof or credibility signals visible on the main page",
      whyItMatters: "AI-built products launched quickly often have no testimonials, usage numbers, or proof of real users. Without these, new visitors have no reason to trust the product.",
      suggestedFix: "Add at least one trust signal: a user count, a testimonial, a recognised logo, or a press mention. Even 'X users signed up this week' adds credibility.",
      effort: "Low", impact: "Medium",
    },
  ];

  // URL-specific additions
  if (u.includes("dashboard") || u.includes("app.")) {
    base.push({
      id: fid(), priority: "urgent", category: "Performance Perception",
      issue: "Access controls are untested — users may see data they shouldn't, or be blocked from what they need",
      whyItMatters: "AI-built dashboards often lack proper permission gates. Users may access data or actions they should not be able to see, or be blocked from actions they should have.",
      suggestedFix: "Test the app as different user types: new user, existing user, admin, free tier, paid tier. Verify that each role sees only what they are supposed to see.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("pricing") || u.includes("checkout")) {
    base.push({
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "The payment flow has not been validated — one edge case here is a direct revenue loss",
      whyItMatters: "Payment flows in AI-built products are the highest-risk area. Edge cases: failed payment handling, double-charge prevention, webhook confirmation, and email receipts must all be tested.",
      suggestedFix: "Test the full payment flow end-to-end with a test card: success, decline, card error, 3DS challenge, refund. Verify confirmation email is sent and the user state updates correctly.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("signup") || u.includes("register") || u.includes("onboard")) {
    base.push({
      id: fid(), priority: "important", category: "Conversion",
      issue: "The activation flow likely asks for more than users are willing to give before seeing value",
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
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "The headline describes what the product is, not what changes for the user who buys it",
      whyItMatters: "A new visitor decides within 5 seconds whether to engage. Feature-led headlines ('Powerful AI platform') do not communicate value. Outcome-led headlines do ('Cut your support tickets in half').",
      suggestedFix: "Rewrite the headline to complete: 'After using this, you can finally...' or 'This replaces the pain of...'. Name a specific, measurable outcome.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Users are asked to commit before experiencing the product — most leave without converting",
      whyItMatters: "Gated product experiences cause 40–70% drop-off before a user sees value. Best-in-class SaaS shows the product before asking for email.",
      suggestedFix: "Add an interactive demo, sandbox, or product tour that requires no sign-up. Let users experience the core value before committing to account creation.",
      effort: "High", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust Signals",
      issue: "There is no evidence of existing customers visible without scrolling — a trust gap at the top of the funnel",
      whyItMatters: "B2B buyers look for proof of existing customers before engaging. Customer logos or testimonials below the fold may never be seen.",
      suggestedFix: "Move at least 3 customer logos or one specific testimonial to the hero section, below the headline and above the first scroll break.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "important", category: "Mobile Experience",
      issue: "The primary action may be invisible or unreachable on mobile — half the audience cannot convert",
      whyItMatters: "If the primary CTA is only visible on desktop or buried in mobile navigation, mobile traffic — often 50%+ of visitors — cannot convert.",
      suggestedFix: "Verify the primary CTA is visible and tappable above the fold on 375px viewport. Ensure tap target is at least 44×44px.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "later", category: "UX Friction",
      issue: "The activation form is collecting more than is needed — every extra field reduces completion",
      whyItMatters: "Each extra field in a sign-up form reduces completion rate by approximately 10%. Most information (company size, role, use case) can be collected post-activation.",
      suggestedFix: "Reduce sign-up to email + password minimum. Move company info and role to post-signup onboarding where intent is already established.",
      effort: "Low", impact: "Medium",
    },
  ];
}

function getPortfolioFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Product Clarity",
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
      id: fid(), priority: "important", category: "Trust Signals",
      issue: "Case studies lack specific, measurable outcomes",
      whyItMatters: "Portfolios that describe what was built without naming what changed in measurable terms are unconvincing. Outcomes are more credible than descriptions.",
      suggestedFix: "For each case study, add: the specific metric that moved, by how much, and over what timeframe. e.g. 'Reduced settlement support tickets by 40% in 90 days.'",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Mobile Experience",
      issue: "Portfolio layout may not adapt to mobile viewports",
      whyItMatters: "Hiring managers often review portfolios on phones. A broken mobile layout signals poor attention to detail — exactly the opposite of what a PM or designer wants to communicate.",
      suggestedFix: "Test on iPhone SE (375px). Ensure all case studies, images, and contact paths are readable and accessible. Fix any horizontal overflow.",
      effort: "Medium", impact: "Medium",
    },
    {
      id: fid(), priority: "later", category: "Product Clarity",
      issue: "Section titles are generic — they describe structure, not the work or the person",
      whyItMatters: "Generic headers ('About Me', 'My Work') are forgettable. Specific, voice-driven headers make a portfolio memorable.",
      suggestedFix: "Replace generic section titles with specific statements that reflect your PM style. e.g. 'Products I shipped' → 'What I built and what changed because of it.'",
      effort: "Low", impact: "Low",
    },
  ];
}

function getEcommerceFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Trust Signals",
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
      id: fid(), priority: "important", category: "Mobile Experience",
      issue: "Product image gallery touch interactions may not work correctly",
      whyItMatters: "Mobile shoppers rely on swiping through product images. Pinch-to-zoom and swipe gestures must work on iOS Safari and Android Chrome.",
      suggestedFix: "Test product gallery with touch gestures. Ensure pinch-to-zoom is not disabled via CSS. Test horizontal swipe navigation.",
      effort: "Medium", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Performance Perception",
      issue: "Cart state may not persist across page refreshes or navigation",
      whyItMatters: "If cart items disappear when a user navigates away or refreshes, it is one of the most frustrating experiences in e-commerce and directly causes drop-off.",
      suggestedFix: "Test: add items to cart → navigate to another page → return to cart. Items must persist. Also test: close browser tab and reopen.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "later", category: "UX Friction",
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
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "Developers cannot see a working result quickly — the most common reason developers abandon evaluation",
      whyItMatters: "Developer tools are evaluated by how quickly a developer can see a working result. If the quickstart takes more than 10 minutes, developers move on to alternatives.",
      suggestedFix: "Create a quickstart that reaches a working result in 3 steps or fewer. Measure and optimise time-to-first-success as a product metric.",
      effort: "High", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust Signals",
      issue: "Status page not linked from main navigation",
      whyItMatters: "Developer tool buyers check uptime history before committing. A missing status page is a trust gap for engineering teams evaluating reliability.",
      suggestedFix: "Add a status page link to the main navigation footer and the dashboard. Link to historical uptime data.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "important", category: "Performance Perception",
      issue: "Copy-paste code that breaks on first use destroys developer trust immediately and permanently",
      whyItMatters: "Copy-paste code that does not work destroys developer trust faster than anything else. One broken example can cause a developer to abandon evaluation entirely.",
      suggestedFix: "Run CI against all code examples in documentation on every release. Test in all officially supported language versions and environments.",
      effort: "High", impact: "High",
    },
    {
      id: fid(), priority: "later", category: "UX Friction",
      issue: "Documentation search fails for the exact queries developers need most — error codes, method names, SDK specifics",
      whyItMatters: "Developers search docs with specific technical queries: error codes, method names, SDK names. Generic search fails these.",
      suggestedFix: "Implement Algolia DocSearch or equivalent. Explicitly index error codes, method names, and common technical queries.",
      effort: "Medium", impact: "Medium",
    },
  ];
}

function getLandingFindings(): AuditFinding[] {
  return [
    {
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "The product's core promise requires too much effort to understand — most visitors leave before getting there",
      whyItMatters: "Landing pages have one job: convert a visitor into a lead. If the value proposition requires reading, most visitors will not see it.",
      suggestedFix: "Reduce the hero to: one outcome-focused headline, two supporting sentences maximum, one CTA. Remove everything else above the fold.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "Multiple competing actions are splitting user attention — the primary conversion path is diluted",
      whyItMatters: "Every additional CTA reduces the conversion rate of the primary one. A landing page with one CTA converts 3× better than one with multiple.",
      suggestedFix: "Remove or visually eliminate all CTAs except the primary action. If navigation is present, consider removing it from the landing page entirely.",
      effort: "Low", impact: "High",
    },
    {
      id: fid(), priority: "important", category: "Trust Signals",
      issue: "No early social proof or credibility signals",
      whyItMatters: "Pre-launch and early-stage landing pages need trust signals even without a customer base. Waitlist count, press mention, or founder credibility fill this gap.",
      suggestedFix: "Add at least one trust signal: a waitlist counter, a press mention, a recognisable logo, or a founder credential with relevant context.",
      effort: "Low", impact: "Medium",
    },
    {
      id: fid(), priority: "later", category: "Performance Perception",
      issue: "Leads are likely being lost silently — form submission paths are rarely tested beyond the button click",
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
      issue: "This pricing page may require a sales call to proceed — gating out buyers who prefer to self-evaluate",
      whyItMatters: "Pricing pages that require a sales call gate out up to 60% of developer and SMB buyers who self-qualify. This is the single highest-impact conversion issue on pricing pages.",
      suggestedFix: "Add a free tier, sandbox, or interactive demo. Remove 'Contact sales' as the only CTA on the pricing page. Show at least one tier with transparent, immediate access.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("login") || u.includes("signin")) {
    extra.push({
      id: fid(), priority: "important", category: "Performance Perception",
      issue: "Login page — password reset and error recovery flows need testing",
      whyItMatters: "Login errors are often the first experience a returning user has after a break. Broken password reset or unhelpful error messages cause churn before the user even re-engages.",
      suggestedFix: "Test: wrong password error message, too-many-attempts handling, password reset email delivery, and reset link expiry behaviour.",
      effort: "Low", impact: "Medium",
    });
  }

  if (u.includes("dashboard") || u.includes("/app")) {
    extra.push({
      id: fid(), priority: "urgent", category: "Performance Perception",
      issue: "New users land in an empty dashboard with no guidance — the first impression is a blank screen",
      whyItMatters: "New users and users with no data will see the dashboard before any content exists. Without explicit empty states, the page looks broken.",
      suggestedFix: "Add empty state components for every list, chart, and data display. Include: an illustration or icon, a message explaining the empty state, and a CTA for the next action.",
      effort: "Medium", impact: "High",
    });
  }

  if (u.includes("checkout") || u.includes("cart")) {
    extra.push({
      id: fid(), priority: "urgent", category: "Performance Perception",
      issue: "A failed payment with no recovery path is a direct revenue loss — one of the highest-cost bugs in any product",
      whyItMatters: "A failed payment with no clear recovery path is the highest-cost bug in a transactional product. Users who cannot retry immediately are lost.",
      suggestedFix: "Test: declined card, network error during payment, session timeout during checkout. Verify each case shows a clear error message and a working retry path.",
      effort: "High", impact: "High",
    });
  }

  if (u.includes("docs") || u.includes("/api")) {
    extra.push({
      id: fid(), priority: "important", category: "Product Clarity",
      issue: "The fastest path to a working result is buried — developers leave before finding it",
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
    mainProductRisk: urgent.find((f) => f.category === "Conversion" || f.category === "Product Clarity")?.issue ?? urgent[0]?.issue ?? "Review full findings",
    findings: allFindings,
  };
}

// ── API response type (mirrors /api/audit response) ──────────────────────────

interface APIAuditData {
  url: string;
  fetchedAt: string;
  fetchDuration: number;
  pageSize: number;
  statusCode: number;
  title: string;
  description: string;
  h1Tags: string[];
  h2Tags: string[];
  wordCount: number;
  links: { total: number; internal: number; external: number; samples: string[] };
  buttons: { total: number; samples: string[] };
  forms: { total: number; inputs: number };
  images: { total: number; missingAlt: number; withAlt: number; missingAltSamples: string[] };
  ctaElements: string[];
  signals: {
    hasPricing: boolean; pricingIndicators: string[];
    hasSignup: boolean; signupIndicators: string[];
    hasContact: boolean; contactIndicators: string[];
    hasNewsletter: boolean; hasSearch: boolean;
    hasChatWidget: boolean; hasCookieBanner: boolean;
    hasMobileViewport: boolean; hasCanonical: boolean;
    hasOgTags: boolean; hasSchemaMarkup: boolean;
  };
  scripts: number;
  stylesheets: number;
}

// ── Rule-based findings engine — driven by real API data ─────────────────────

function generateFindingsFromAPIData(data: APIAuditData, url: string, context: SiteContext): AuditFinding[] {
  _idCounter = 0;
  const findings: AuditFinding[] = [];
  const siteType: SiteContextType = context.siteType;

  // Suppress irrelevant checks based on site type
  const skipMarketingChecks = siteType === "internal_tool_or_dashboard" || siteType === "documentation_site";
  const skipConversionChecks = siteType === "internal_tool_or_dashboard" || siteType === "documentation_site" || siteType === "portfolio_site";
  const isOfficialSite = siteType === "official_company_site";
  const isAIBuilt = siteType === "ai_built_site";
  const strictMode = isAIBuilt; // stricter thresholds

  // ── PRODUCT CLARITY ─────────────────────────────────────────────────────────
  // What users see in the first 5 seconds determines whether they stay.

  if (!data.title && !skipMarketingChecks) {
    findings.push({
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "This product has no name on the page",
      whyItMatters: "A missing title tag means the product has no identity in search results, browser tabs, or shared links. The first thing a user sees about your product is blank.",
      suggestedFix: "Add a <title> tag with the product name and a short value statement. e.g. 'ProductName — [what it does in 5 words]'. Keep it under 60 characters.",
      effort: "Low", impact: "High",
    });
  } else if (data.title.length < 20 && !isOfficialSite && !skipMarketingChecks) {
    findings.push({
      id: fid(), priority: isAIBuilt ? "urgent" : "important", category: "Product Clarity",
      issue: `The product name is too vague to communicate value: "${data.title}"`,
      whyItMatters: "A title under 20 characters cannot communicate what the product does or who it is for. Users scanning search results will not know why to click.",
      suggestedFix: `Expand the title: "${data.title} — [what it does] for [who]". Make the value visible before the user even clicks.`,
      effort: "Low", impact: "High",
    });
  } else if (data.title.length > 70) {
    findings.push({
      id: fid(), priority: "later", category: "Product Clarity",
      issue: "The product headline gets cut off in search results",
      whyItMatters: "Titles longer than 60 characters are truncated in Google, Slack, and most social previews. The part that matters most may never be read.",
      suggestedFix: "Trim to under 60 characters. Put the product name and primary value first. Cut anything that appears after the first value statement.",
      effort: "Low", impact: "Low",
    });
  }

  if (!data.description) {
    findings.push({
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "No product description visible to users before they arrive",
      whyItMatters: "Without a meta description, search engines and social platforms auto-generate preview text — usually a random sentence from the page. The first controlled impression of your product is lost.",
      suggestedFix: "Write a 120–155 character meta description that leads with the user outcome: 'Stop doing [painful thing]. [Product] helps [user type] achieve [goal] in [timeframe].'",
      effort: "Low", impact: "High",
    });
  } else if (data.description.length < 50) {
    findings.push({
      id: fid(), priority: "important", category: "Product Clarity",
      issue: "The product description is too brief to drive qualified clicks",
      whyItMatters: "A meta description under 50 characters cannot communicate context or value. Users scanning results cannot tell if this product is relevant to them.",
      suggestedFix: "Expand to 120–155 characters. Describe the user problem, the solution, and the audience. Lead with what changes for the user, not what the product does.",
      effort: "Low", impact: "Medium",
    });
  }

  if (data.h1Tags.length === 0) {
    findings.push({
      id: fid(), priority: "urgent", category: "Product Clarity",
      issue: "There is no clear value statement anchoring the page",
      whyItMatters: "Without an H1, there is no primary message for users or search engines to anchor to. New visitors have no single statement to evaluate whether the product is for them.",
      suggestedFix: "Add one H1 that states the core user outcome — not the product feature. 'Finally, [outcome] without [pain]' is more powerful than '[Product] is the platform for [category]'.",
      effort: "Low", impact: "High",
    });
  } else if (data.h1Tags.length > 3) {
    findings.push({
      id: fid(), priority: "important", category: "Product Clarity",
      issue: `${data.h1Tags.length} competing headlines are diluting the core message`,
      whyItMatters: "Multiple H1s mean the product is trying to say too many things at once. Users cannot identify the single most important reason to keep reading.",
      suggestedFix: "Keep one H1 as the definitive statement of the product's value. Demote the rest to H2 or H3. The primary headline should be the last thing you cut.",
      effort: "Low", impact: "Medium",
    });
  }

  if (data.wordCount < 80 && !skipMarketingChecks && !isOfficialSite) {
    findings.push({
      id: fid(), priority: isAIBuilt ? "urgent" : "important", category: "Product Clarity",
      issue: "Not enough product story on this page to build conviction",
      whyItMatters: "Fewer than 80 words cannot explain what the product does, who it is for, and why it matters. Users leave when they cannot answer these three questions quickly.",
      suggestedFix: "Add a clear product narrative: the problem, who has it, and how the product solves it. 200–300 words of well-structured copy outperforms any visual on a product page.",
      effort: "Medium", impact: "High",
    });
  }

  // ── CONVERSION ───────────────────────────────────────────────────────────────
  // Users who cannot take action are lost.

  if (!skipConversionChecks && data.ctaElements.length === 0 && data.buttons.total === 0) {
    findings.push({
      id: fid(), priority: "urgent", category: "Conversion",
      issue: "There is no activation path on this page",
      whyItMatters: "A product page without a call to action is a dead end. Users arrive with intent, find no way to proceed, and leave. Conversion rate is zero until this is fixed.",
      suggestedFix: "Add one dominant action above the fold. It should describe the outcome, not the mechanic: 'Start building free', not 'Sign up'. Every other action on the page should be secondary to this one.",
      effort: "Low", impact: "High",
    });
  } else if (data.ctaElements.length === 0) {
    findings.push({
      id: fid(), priority: "important", category: "Conversion",
      issue: "Buttons exist but none communicate a reason to click",
      whyItMatters: "Generic button labels like 'Submit', 'Click here', or 'Learn more' don't give users a reason to act. They describe the mechanic, not the outcome.",
      suggestedFix: "Replace all generic button text with outcome-based copy: 'Get started free', 'See how it works', 'Start your first audit'. The user should know exactly what happens next.",
      effort: "Low", impact: "High",
    });
  }

  if (!skipConversionChecks && !isOfficialSite && !data.signals.hasPricing) {
    findings.push({
      id: fid(), priority: isAIBuilt ? "urgent" : "important", category: "Conversion",
      issue: "Users cannot self-qualify without pricing visibility",
      whyItMatters: "B2B and SaaS buyers make purchase decisions on their own before ever talking to sales. Hiding pricing forces a sales call that up to 60% of qualified buyers will not book.",
      suggestedFix: "Add a pricing page or at minimum a starting price. If pricing is variable, show a floor ('Starting at $X') or a ROI statement ('Save 10+ hours per week'). Let buyers disqualify themselves.",
      effort: "Medium", impact: "High",
    });
  }

  if (!skipConversionChecks && !isOfficialSite && !data.signals.hasSignup) {
    findings.push({
      id: fid(), priority: isAIBuilt ? "urgent" : "important", category: "Conversion",
      issue: "There is no self-service path from interest to activation",
      whyItMatters: "Users who are ready to try the product right now have nowhere to go. Requiring contact with sales adds a 24–72 hour delay to the activation moment — most users don't wait.",
      suggestedFix: "Add a self-service activation path: free trial, demo, sandbox, or waitlist. Show this option prominently. Reduce friction between 'I'm interested' and 'I'm using it'.",
      effort: "Medium", impact: "High",
    });
  }

  // ── USER JOURNEY ─────────────────────────────────────────────────────────────
  // Where do users get stuck, confused, or lose momentum?

  if (data.forms.total > 0 && data.ctaElements.length === 0) {
    findings.push({
      id: fid(), priority: "important", category: "User Journey",
      issue: "Users reach a form with no clear reason to complete it",
      whyItMatters: "Forms without directional context have low completion rates. Users don't know why they're filling in fields or what they'll get in return. Ambiguity kills conversions.",
      suggestedFix: "Add a heading above each form that states the value of completing it: 'Get early access to [Product]' or 'Talk to someone in 24 hours'. The form should feel like a step toward something, not a gate.",
      effort: "Low", impact: "Medium",
    });
  }

  if (data.links.total > 60) {
    findings.push({
      id: fid(), priority: "later", category: "User Journey",
      issue: "Navigation overload is fragmenting the user's attention",
      whyItMatters: "More than 60 links on a single page creates decision paralysis. Every extra link competes with the primary user goal. Users who can't decide what to click on, don't click anything.",
      suggestedFix: "Audit every link on the page. Remove or consolidate any link that does not directly serve the user's goal at this stage of their journey. Fewer options means more conversions.",
      effort: "Medium", impact: "Medium",
    });
  }

  // ── TRUST SIGNALS ────────────────────────────────────────────────────────────
  // Users buy from products they trust. Trust must be earned early.

  if (!data.signals.hasContact && !skipMarketingChecks && !isOfficialSite) {
    findings.push({
      id: fid(), priority: "important", category: "Trust Signals",
      issue: "There is no visible way to reach the team behind this product",
      whyItMatters: "B2B buyers and first-time users look for a way to contact the team as a trust signal. Its absence suggests the company is either unreachable or unaccountable — both are conversion killers.",
      suggestedFix: "Add a contact link, support email, or live chat to the navigation or footer. Enterprise buyers specifically look for this before initiating any evaluation.",
      effort: "Low", impact: "Medium",
    });
  }

  if (!data.signals.hasOgTags && !skipMarketingChecks) {
    findings.push({
      id: fid(), priority: "later", category: "Trust Signals",
      issue: "Every share of this product creates a broken first impression",
      whyItMatters: "When users share this page on LinkedIn, Slack, or in email, it renders as a plain URL with no image or description. The product looks unfinished before the recipient even visits.",
      suggestedFix: "Add og:title, og:description, and og:image to the page head. This takes 20 minutes and transforms every shared link into a controlled preview of the product.",
      effort: "Low", impact: "Medium",
    });
  }

  // ── ACCESSIBILITY ────────────────────────────────────────────────────────────

  if (data.images.missingAlt > 5) {
    findings.push({
      id: fid(), priority: "urgent", category: "Accessibility",
      issue: `${data.images.missingAlt} of ${data.images.total} images are invisible to users relying on screen readers`,
      whyItMatters: "Screen readers skip images without alt text entirely. For visually impaired users, these images and any information they carry simply do not exist. This also fails WCAG AA standards.",
      suggestedFix: `Add descriptive alt text to all ${data.images.missingAlt} images. For content images: describe what the image shows in under 15 words. For decorative images: use alt="". Affected sources: ${data.images.missingAltSamples.slice(0, 2).join(", ")}`,
      effort: "Medium", impact: "Medium",
    });
  } else if (data.images.missingAlt > 0) {
    findings.push({
      id: fid(), priority: "important", category: "Accessibility",
      issue: `${data.images.missingAlt} image${data.images.missingAlt > 1 ? "s are" : " is"} inaccessible to screen reader users`,
      whyItMatters: "Every image without alt text is a gap in the product experience for users who rely on assistive technology. It also reduces SEO value.",
      suggestedFix: "Add alt text to each affected image: describe the content or purpose in plain language. For purely decorative images, use alt=\"\".",
      effort: "Low", impact: "Medium",
    });
  }

  // ── MOBILE EXPERIENCE ────────────────────────────────────────────────────────

  if (!data.signals.hasMobileViewport) {
    findings.push({
      id: fid(), priority: "urgent", category: "Mobile Experience",
      issue: "The mobile experience is broken at the foundation",
      whyItMatters: "Without a viewport meta tag, the page renders as a miniaturised desktop layout on mobile. Text is unreadable, navigation is unusable, and CTAs are invisible. Mobile users immediately leave.",
      suggestedFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head>. This single line enables responsive behaviour and is the prerequisite for every other mobile fix.',
      effort: "Low", impact: "High",
    });
  }

  // ── PERFORMANCE PERCEPTION ───────────────────────────────────────────────────
  // Users judge product quality by how fast it loads.

  if (data.pageSize > 800_000) {
    findings.push({
      id: fid(), priority: "urgent", category: "Performance Perception",
      issue: `Page weight is ${(data.pageSize / 1000).toFixed(0)}KB — users are waiting before seeing any value`,
      whyItMatters: "A page over 800KB takes 3–5 seconds to load on a typical mobile connection. 53% of mobile users abandon a page that takes more than 3 seconds. Users are forming a negative product impression before the page is even visible.",
      suggestedFix: "Audit page weight: compress and lazy-load images, remove unused CSS/JS, and defer non-critical scripts. Aim for under 300KB for the initial render. Each second of improvement is a measurable conversion gain.",
      effort: "High", impact: "High",
    });
  } else if (data.pageSize > 400_000) {
    findings.push({
      id: fid(), priority: "important", category: "Performance Perception",
      issue: `Page weight of ${(data.pageSize / 1000).toFixed(0)}KB is creating noticeable load friction`,
      whyItMatters: "Pages over 400KB take 2+ seconds on mobile. This is below the threshold where users consciously notice the wait, but it measurably increases bounce rate and reduces first impressions.",
      suggestedFix: "Review page weight: compress images, minimise CSS/JS bundles, and lazy-load content below the fold. Target under 200KB for the initial viewport render.",
      effort: "Medium", impact: "Medium",
    });
  }

  if (data.scripts > 15) {
    findings.push({
      id: fid(), priority: "important", category: "Performance Perception",
      issue: `${data.scripts} scripts are loading — the page feels heavier than it needs to`,
      whyItMatters: "Each additional script adds a network request and blocks rendering. More than 10 scripts typically means unused analytics, redundant chat widgets, or A/B testing tools that are no longer active. Users experience this as a slow product.",
      suggestedFix: "Audit every script. Remove tracking tools that are not actively used. Defer or lazy-load non-critical scripts. Consider consolidating third-party tools into a single tag manager.",
      effort: "Medium", impact: "Medium",
    });
  }

  // ── QUALITY RISK ─────────────────────────────────────────────────────────────

  if (!data.signals.hasCanonical) {
    findings.push({
      id: fid(), priority: "later", category: "Performance Perception",
      issue: "This page may be diluting its own search ranking",
      whyItMatters: "Without a canonical tag, search engines may index multiple versions of the same URL with different parameters. This splits SEO authority across duplicates rather than concentrating it on one page.",
      suggestedFix: 'Add <link rel="canonical" href="[page URL]"> to the <head> tag. This tells search engines which URL is the authoritative version.',
      effort: "Low", impact: "Low",
    });
  }

  // ── URL-signal findings appended last ─────────────────────────────────────
  const urlBased = getURLSignalFindings(url);
  return [...findings, ...urlBased];
}
// ── Real audit result from API data ──────────────────────────────────────────

function buildRealAuditResult(data: APIAuditData, url: string, context: SiteContext): AuditResult {
  const findings = generateFindingsFromAPIData(data, url, context);
  const domain = (() => {
    try { return new URL(data.url).hostname.replace("www.", ""); }
    catch { return data.url; }
  })();

  const builder = detectBuilder(url);
  const type = classifySite(url);

  const urgentFindings = findings.filter((f) => f.priority === "urgent");
  const quickWin = findings.find((f) => f.effort === "Low" && f.impact === "High");

  // Context-aware base score:
  // Official company sites start higher (fewer marketing gaps expected)
  // AI-built/demo sites start lower (more scrutiny expected)
  const BASE_SCORES: Partial<Record<SiteContextType, number>> = {
    official_company_site: 82,
    ai_built_site: 48,
    startup_landing_page: 68,
    portfolio_site: 72,
    internal_tool_or_dashboard: 70,
    documentation_site: 74,
    ecommerce_or_marketplace: 68,
    unknown: 62,
  };
  const baseScore = BASE_SCORES[context.siteType] ?? 65;

  // Deductions also vary: official sites penalised less per issue
  const urgentDeduction = context.siteType === "official_company_site" ? 4 : context.siteType === "ai_built_site" ? 10 : 7;
  const importantDeduction = context.siteType === "official_company_site" ? 2 : context.siteType === "ai_built_site" ? 5 : 3;

  const score = Math.max(
    8,
    baseScore -
      urgentFindings.length * urgentDeduction -
      findings.filter((f) => f.priority === "important").length * importantDeduction
  );

  return {
    domain,
    siteType: SITE_TYPE_LABELS[context.siteType] ?? siteTypeLabel(type, builder),
    detectedBuilder: builder ?? context.detectedBuilder,
    overallScore: score,
    topUrgentIssue: urgentFindings[0]?.issue ?? "No critical issues detected",
    bestQuickWin: quickWin?.issue ?? "See findings below",
    mainProductRisk:
      urgentFindings.find((f) => f.category === "Conversion" || f.category === "Product Clarity")
        ?.issue ??
      urgentFindings[0]?.issue ??
      "Review full findings",
    findings,
  };
}

// ── Priority config ───────────────────────────────────────────────────────────

const P_CONFIG = {
  urgent: { label: "Urgent", dot: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200", rowBg: "bg-red-50", borderL: "border-l-red-400" },
  important: { label: "Important", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200", rowBg: "bg-amber-50/50", borderL: "border-l-amber-400" },
  later: { label: "Later", dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600 border-zinc-200", rowBg: "bg-white", borderL: "border-l-zinc-200" },
};

// ── Main component ────────────────────────────────────────────────────────────

const DEFAULT_CATEGORY_ORDER: Category[] = [
  "Product Clarity",
  "Conversion",
  "User Journey",
  "UX Friction",
  "Trust Signals",
  "Mobile Experience",
  "Accessibility",
  "Performance Perception",
];

const CAT_DOTS: Partial<Record<Category, string>> = {
  "Product Clarity": "bg-blue-400",
  "Conversion":      "bg-red-400",
  "User Journey":    "bg-violet-400",
  "UX Friction":     "bg-amber-400",
  "Trust Signals":   "bg-green-400",
  "Mobile Experience": "bg-purple-400",
  "Accessibility":   "bg-cyan-400",
  "Performance Perception": "bg-orange-400",
};

export default function AuditTool() {
  const [auditState, setAuditState] = useState<AuditState>("idle");
  const [url, setUrl] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [apiData, setApiData] = useState<APIAuditData | null>(null);
  const [isRealAudit, setIsRealAudit] = useState(false);
  const [siteContext, setSiteContext] = useState<SiteContext | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Category order state
  const [categoryOrder, setCategoryOrder] = useState<Category[]>(DEFAULT_CATEGORY_ORDER);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [activeTab, setActiveTab] = useState<ToolId>("lovable");
  const [copiedPrompt, setCopiedPrompt] = useState<ToolId | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  }
  function handleDrop(e: React.DragEvent, targetIdx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const next = [...categoryOrder];
    const [removed] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, removed);
    setCategoryOrder(next);
    setDragIdx(null);
    setDragOverIdx(null);
  }
  function handleDragEnd() { setDragIdx(null); setDragOverIdx(null); }

  function moveCategory(from: number, to: number) {
    if (to < 0 || to >= categoryOrder.length) return;
    const next = [...categoryOrder];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    setCategoryOrder(next);
  }

  // ── Sort findings by user category priority, then urgency ─────────────────
  function sortFindings(findings: AuditFinding[]): AuditFinding[] {
    const catPriority: Record<string, number> = Object.fromEntries(
      categoryOrder.map((c, i) => [c, i])
    );
    const issuePriority = { urgent: 0, important: 1, later: 2 };
    return [...findings].sort((a, b) => {
      const catDiff = (catPriority[a.category] ?? 999) - (catPriority[b.category] ?? 999);
      if (catDiff !== 0) return catDiff;
      return (issuePriority[a.priority] ?? 3) - (issuePriority[b.priority] ?? 3);
    });
  }

  function normalise(raw: string) {
    const t = raw.trim();
    return t && !t.startsWith("http") ? `https://${t}` : t;
  }

  async function runAudit() {
    const norm = normalise(url);
    if (!norm) { setError("Enter a URL to audit."); return; }
    setError("");
    setAuditState("loading");
    setApiData(null);
    setIsRealAudit(false);
    setSiteContext(null);
    setStageIndex(0);

    // ── Stage 1: fetch via real API ──────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 300));
    setStageIndex(1);

    let fetchedData: APIAuditData | null = null;
    let apiError: string | null = null;

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: norm }),
        signal: AbortSignal.timeout(12000), // 12s client timeout
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string };
        apiError = body.error ?? `Server returned ${response.status}`;
      } else {
        fetchedData = await response.json() as APIAuditData;
      }
    } catch (err) {
      const isTimeout = (err as Error).name === "TimeoutError" || (err as Error).name === "AbortError";
      apiError = isTimeout
        ? "The site took too long to respond. Try a different URL."
        : "Could not reach the target site. It may block automated requests.";
    }

    // ── Stage 2: analyse ─────────────────────────────────────────────────────
    setStageIndex(2);
    await new Promise((r) => setTimeout(r, 400));
    setStageIndex(3);
    await new Promise((r) => setTimeout(r, 300));

    if (fetchedData) {
      // ✅ Real data available — classify context and use it
      setApiData(fetchedData);
      setIsRealAudit(true);

      let parsedHostname = "";
      let parsedPath = "";
      try {
        const u = new URL(fetchedData.url);
        parsedHostname = u.hostname;
        parsedPath = u.pathname;
      } catch { /* leave empty */ }

      const ctx = classifySiteContext({
        hostname: parsedHostname,
        urlPath: parsedPath,
        title: fetchedData.title,
        description: fetchedData.description,
        h1Tags: fetchedData.h1Tags,
        h2Tags: fetchedData.h2Tags,
        wordCount: fetchedData.wordCount,
        buttonCount: fetchedData.buttons.total,
        formCount: fetchedData.forms.total,
        linkCount: fetchedData.links.total,
        hasPricing: fetchedData.signals.hasPricing,
        hasSignup: fetchedData.signals.hasSignup,
        hasContact: fetchedData.signals.hasContact,
        detectedBuilder: detectBuilder(norm),
      });

      setSiteContext(ctx);
      setResult(buildRealAuditResult(fetchedData, norm, ctx));

    } else {
      // ⚠️ API failed — fall back to heuristic mock + URL-based context
      setIsRealAudit(false);

      let parsedHostname = "";
      let parsedPath = "";
      try { const u = new URL(norm); parsedHostname = u.hostname; parsedPath = u.pathname; } catch { /* */ }

      const ctx = classifySiteContext({
        hostname: parsedHostname,
        urlPath: parsedPath,
        title: "", description: "", h1Tags: [], h2Tags: [],
        wordCount: 0, buttonCount: 0, formCount: 0, linkCount: 0,
        hasPricing: false, hasSignup: false, hasContact: false,
        detectedBuilder: detectBuilder(norm),
      });
      setSiteContext(ctx);

      const mockResult = buildAuditResult(norm);
      if (apiError) {
        mockResult.findings.unshift({
          id: "api-error",
          priority: "important",
          category: "Performance Perception",
          issue: `Live scan failed: ${apiError}`,
          whyItMatters: "The auditor could not fetch this URL — it may block bots, require authentication, or use client-side rendering. Findings below are based on URL pattern heuristics only.",
          suggestedFix: "Try a different URL, or verify the site is publicly accessible without login.",
          effort: "Low", impact: "Low",
        });
      }
      setResult(mockResult);
    }

    setAuditState("results");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function reset() {
    setAuditState("idle"); setUrl(""); setResult(null); setApiData(null);
    setIsRealAudit(false); setSiteContext(null); setError(""); setCopied(false);
    setDrawerOpen(false); setSelectedFinding(null);
    setCategoryOrder(DEFAULT_CATEGORY_ORDER);
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
    const sorted = sortFindings(result.findings);
    const text = sorted.map((f) =>
      `[${f.priority.toUpperCase()}] ${f.category}\n${f.issue}\nWhy: ${f.whyItMatters}\nFix: ${f.suggestedFix}`
    ).join("\n\n");
    const auditNote = isRealAudit
      ? `Real audit · page fetched in ${apiData?.fetchDuration ?? "?"}ms · findings from actual HTML`
      : "Heuristic mode · page could not be fetched · findings based on URL patterns";
    navigator.clipboard.writeText(`AI Builder QA Audit — ${result.domain}\nPrioritised by: ${categoryOrder.slice(0, 3).join(", ")}\n${auditNote}\n\n${text}`).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (auditState === "idle") return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
      <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">Run an audit</p>
      <p className="mb-5 text-sm text-zinc-500">
        Enter the URL of your AI-built site. Drag the category pills to prioritise which issues appear first in the audit.
      </p>

      {/* URL input */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
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

      {/* Category priority tags */}
      <div className="border-t border-zinc-100 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Audit priority
          </p>
          <span className="text-xs text-zinc-400">— drag to reorder · leftmost = highest priority</span>
        </div>

        {/* Desktop: draggable */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          {categoryOrder.map((cat, idx) => (
            <div
              key={cat}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`
                flex cursor-grab select-none items-center gap-1.5 rounded-full border px-3 py-1.5
                font-mono text-xs transition-all duration-100 active:cursor-grabbing
                ${dragIdx === idx ? "opacity-40 scale-95" : ""}
                ${dragOverIdx === idx && dragIdx !== idx ? "border-zinc-400 bg-zinc-800 text-zinc-200" : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}
              `}
            >
              {/* Drag handle dots */}
              <span className="text-zinc-700 text-[9px] leading-none">⠿</span>
              {/* Category colour dot */}
              <span className={`h-1.5 w-1.5 rounded-full ${CAT_DOTS[cat] ?? "bg-zinc-600"}`} />
              {/* Position badge for top 3 */}
              {idx < 3 && (
                <span className={`font-mono text-[9px] font-bold ${idx === 0 ? "text-red-400" : idx === 1 ? "text-amber-400" : "text-zinc-500"}`}>
                  {idx + 1}
                </span>
              )}
              {cat}
            </div>
          ))}
        </div>

        {/* Mobile: up/down buttons */}
        <div className="flex flex-col gap-1.5 sm:hidden">
          {categoryOrder.map((cat, idx) => (
            <div key={cat} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className={`h-2 w-2 rounded-full ${CAT_DOTS[cat] ?? "bg-zinc-400"}`} />
              <span className="flex-1 font-mono text-xs text-zinc-700">{cat}</span>
              {idx < 3 && (
                <span className={`font-mono text-[9px] font-bold ${idx === 0 ? "text-red-500" : idx === 1 ? "text-amber-500" : "text-zinc-400"}`}>
                  #{idx + 1}
                </span>
              )}
              <div className="flex gap-0.5">
                <button
                  onClick={() => moveCategory(idx, idx - 1)}
                  disabled={idx === 0}
                  className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-20"
                  aria-label="Move up"
                >
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button
                  onClick={() => moveCategory(idx, idx + 1)}
                  disabled={idx === categoryOrder.length - 1}
                  className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-20"
                  aria-label="Move down"
                >
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-zinc-400">Real audit: fetches the page and analyses actual HTML · If blocked, falls back to URL heuristics · No data stored</p>
      </div>
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
    const sortedFindings = sortFindings(result.findings);
    const urgentCount = sortedFindings.filter((f) => f.priority === "urgent").length;
    const importantCount = sortedFindings.filter((f) => f.priority === "important").length;
    const fixPrompts = selectedFinding ? buildFixPrompts(selectedFinding, result.detectedBuilder) : null;
    const topCats = categoryOrder.slice(0, 3);

    return (
      <>
        <div ref={resultRef} className="space-y-5">

          {/* Actions bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-2 w-2 rounded-full ${isRealAudit ? "bg-green-500" : "bg-amber-500"}`} />
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">Audit complete</span>
                {isRealAudit ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 font-mono text-[9px] font-semibold text-green-700">
                    ✓ Real page data
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-semibold text-amber-700">
                    ⚠ Heuristic mode
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500">
                <span className="font-medium text-zinc-800">{result.domain}</span>
                <span className="ml-2 rounded border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-500">{result.siteType}</span>
              </p>
              {/* Real data metadata */}
              {apiData && (
                <p className="mt-1 font-mono text-[10px] text-zinc-400">
                  {apiData.title ? `Title: "${apiData.title.slice(0, 50)}${apiData.title.length > 50 ? "…" : ""}"` : "No title"} ·
                  {" "}{apiData.wordCount} words ·
                  {" "}{(apiData.pageSize / 1000).toFixed(0)}KB ·
                  {" "}{apiData.fetchDuration}ms
                </p>
              )}
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

          {/* Context banner */}
          {siteContext && <ContextBanner context={siteContext} />}

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Overall score" value={`${result.overallScore}/100`} sub={`${urgentCount} urgent · ${importantCount} important`} accent="zinc" />
            <SummaryCard label="Top urgent issue" value={urgentCount > 0 ? `${urgentCount} found` : "None"} sub={result.topUrgentIssue} accent="red" />
            <SummaryCard label="Best quick win" value="Low effort" sub={result.bestQuickWin} accent="green" />
            <SummaryCard label="Main product risk" value="Review" sub={result.mainProductRisk} accent="amber" />
          </div>

          {/* Priority note */}
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Prioritised by:
            </span>
            {topCats.map((cat, i) => (
              <span key={cat} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 font-mono text-[10px] text-zinc-600">
                <span className={`h-1.5 w-1.5 rounded-full ${CAT_DOTS[cat] ?? "bg-zinc-400"}`} />
                <span className={i === 0 ? "font-semibold text-zinc-800" : ""}>{cat}</span>
              </span>
            ))}
            <span className="ml-auto font-mono text-[10px] text-zinc-400">
              Fix prompt → on any row
            </span>
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
              {sortedFindings.map((f) => {
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
            {isRealAudit
              ? `Real audit · fetched ${apiData?.pageSize ? `${(apiData.pageSize / 1000).toFixed(0)}KB` : "page"} in ${apiData?.fetchDuration ?? "?"}ms · findings from actual HTML`
              : "Heuristic mode · could not fetch page · findings based on URL patterns"
            }
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

// ── Context Banner ────────────────────────────────────────────────────────────

function ContextBanner({ context }: { context: SiteContext }) {
  const [expanded, setExpanded] = useState(false);

  const ACCENT: Partial<Record<SiteContextType, { border: string; bg: string; badge: string; dot: string }>> = {
    official_company_site: { border: "border-blue-200",  bg: "bg-blue-50",  badge: "bg-blue-100 text-blue-700 border-blue-200",  dot: "bg-blue-500"  },
    ai_built_site:         { border: "border-violet-200",bg: "bg-violet-50",badge: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
    startup_landing_page:  { border: "border-amber-200", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700 border-amber-200",  dot: "bg-amber-500"  },
    portfolio_site:        { border: "border-teal-200",  bg: "bg-teal-50",  badge: "bg-teal-100 text-teal-700 border-teal-200",    dot: "bg-teal-500"   },
    documentation_site:    { border: "border-zinc-200",  bg: "bg-zinc-50",  badge: "bg-zinc-100 text-zinc-600 border-zinc-200",     dot: "bg-zinc-500"   },
    internal_tool_or_dashboard: { border: "border-zinc-200", bg: "bg-zinc-50", badge: "bg-zinc-100 text-zinc-600 border-zinc-200", dot: "bg-zinc-500" },
    ecommerce_or_marketplace:   { border: "border-green-200", bg: "bg-green-50", badge: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
    unknown: { border: "border-zinc-200", bg: "bg-zinc-50", badge: "bg-zinc-100 text-zinc-500 border-zinc-200", dot: "bg-zinc-400" },
  };

  const a = ACCENT[context.siteType] ?? ACCENT.unknown!;
  const label = SITE_TYPE_LABELS[context.siteType];
  const icon = SITE_TYPE_ICONS[context.siteType];
  const conf = confidenceLabel(context.confidence);

  return (
    <div className={`overflow-hidden rounded-xl border ${a.border} ${a.bg}`}>
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        aria-expanded={expanded}
      >
        <span className="text-base leading-none">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${a.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
              {label}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              {conf} confidence · {Math.round(context.confidence * 100)}%
            </span>
            {context.detectedBuilder && (
              <span className="font-mono text-[10px] text-zinc-400">
                Builder: {context.detectedBuilder}
              </span>
            )}
          </div>
          {!expanded && (
            <p className="mt-0.5 truncate text-xs text-zinc-500">{context.auditNote}</p>
          )}
        </div>
        <svg
          width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          strokeWidth={2} className={`shrink-0 text-zinc-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-current/10 px-4 pb-4 pt-3">
          <p className="mb-3 text-xs leading-relaxed text-zinc-600">{context.auditNote}</p>
          {context.reasons.length > 0 && (
            <div>
              <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Why this classification
              </p>
              <ul className="space-y-1">
                {context.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                    <span className="mt-1 shrink-0 text-zinc-400">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
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
