"use client";

import { useState, useRef } from "react";

type AuditState = "idle" | "loading" | "results";
type SiteType = "saas" | "ecommerce" | "devtool" | "portfolio" | "enterprise" | "marketplace" | "landing";
type Priority = "urgent" | "important" | "later";
type Category = "Clarity" | "UX friction" | "Mobile" | "Trust" | "Conversion" | "Accessibility" | "QA risk" | "Performance";
type Effort = "Low" | "Medium" | "High";
type Impact = "Low" | "Medium" | "High";

interface AuditFinding {
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
  overallScore: number;
  topUrgentIssue: string;
  bestQuickWin: string;
  mainProductRisk: string;
  findings: AuditFinding[];
}

const LOADING_STAGES = [
  "Resolving domain...",
  "Analysing URL structure...",
  "Applying UX heuristics...",
  "Running QA checks...",
];

// ── URL classifier ────────────────────────────────────────────────────────────

function classifySite(url: string): SiteType {
  const u = url.toLowerCase();
  if (/shop|store|buy|cart|checkout|woocommerce|shopify|product\//.test(u)) return "ecommerce";
  if (/github|gitlab|docs\.|developer\.|api\.|npm|pypi|crate|pkg\./.test(u)) return "devtool";
  if (/portfolio|cv\.|resume\.|\.me\/|about\.me|behance|dribbble/.test(u)) return "portfolio";
  if (/enterprise|b2b|platform|saas|crm|erp|hris/.test(u)) return "enterprise";
  if (/marketplace|appstore|directory|listing/.test(u)) return "marketplace";
  if (/landing|waitlist|coming-soon|launch/.test(u)) return "landing";
  return "saas"; // Default
}

function siteTypeLabel(type: SiteType): string {
  const labels: Record<SiteType, string> = {
    saas: "B2B SaaS",
    ecommerce: "E-commerce",
    devtool: "Developer tool / docs",
    portfolio: "Portfolio / personal",
    enterprise: "Enterprise platform",
    marketplace: "Marketplace",
    landing: "Landing page",
  };
  return labels[type];
}

// ── Finding generators per site type ─────────────────────────────────────────

function getFindings(url: string, type: SiteType): AuditFinding[] {
  const u = url.toLowerCase();

  // Shared findings across all types
  const shared: AuditFinding[] = [
    {
      priority: "urgent",
      category: "Mobile",
      issue: "Primary CTA not accessible on narrow viewports",
      whyItMatters: "Mobile traffic typically exceeds 50% for most sites. If the primary CTA is buried in a hamburger menu, conversion drops significantly.",
      suggestedFix: "Ensure the primary CTA is visible and tappable above the fold on 375px–390px viewports without scrolling.",
      effort: "Medium",
      impact: "High",
    },
    {
      priority: "important",
      category: "Accessibility",
      issue: "Likely contrast ratio issues on dark text over image backgrounds",
      whyItMatters: "WCAG AA requires 4.5:1 for normal text. Sites with hero images and text overlaid often fail this without deliberate testing.",
      suggestedFix: "Run a Lighthouse accessibility audit. Apply a dark overlay to hero images before adding white text.",
      effort: "Low",
      impact: "Medium",
    },
  ];

  // Findings by URL signal
  const urlSignalFindings: AuditFinding[] = [];

  if (u.includes("pricing")) {
    urlSignalFindings.push({
      priority: "urgent",
      category: "Conversion",
      issue: "Pricing page detected — check for self-service evaluation path",
      whyItMatters: "Pricing pages that require a sales call before any self-service trial experience gate out up to 60% of developer and SMB buyers who self-qualify.",
      suggestedFix: 'Add a free tier, sandbox, or interactive demo. Remove "Contact sales" as the only CTA on pricing.',
      effort: "High",
      impact: "High",
    });
  }

  if (u.includes("dashboard") || u.includes("app.")) {
    urlSignalFindings.push({
      priority: "urgent",
      category: "QA risk",
      issue: "App or dashboard URL — authentication and empty states need testing",
      whyItMatters: "Dashboard flows are the highest-risk area for broken states: loading errors, empty data, permission errors, and session expiry all affect retention.",
      suggestedFix: "Test all dashboard states: empty, loading, error, partial data. Verify session timeout behaviour and recovery flow.",
      effort: "Medium",
      impact: "High",
    });
  }

  if (u.includes("docs") || u.includes("developer")) {
    urlSignalFindings.push({
      priority: "important",
      category: "Clarity",
      issue: "Developer docs — quickstart visibility is critical",
      whyItMatters: "Developers decide within 60 seconds whether to evaluate a tool. If the quickstart is not immediately visible, they leave.",
      suggestedFix: "Place a 'Get started in 5 minutes' quickstart link at the top of the docs homepage, above any navigation.",
      effort: "Low",
      impact: "High",
    });
  }

  if (u.includes("checkout") || u.includes("cart")) {
    urlSignalFindings.push({
      priority: "urgent",
      category: "QA risk",
      issue: "Checkout or cart page detected — payment flow needs thorough QA",
      whyItMatters: "A broken checkout flow is the highest-cost bug in any product. A 1% increase in checkout abandonment at scale has direct revenue impact.",
      suggestedFix: "Test checkout end-to-end on mobile, on all supported browsers, and with all payment methods. Test error recovery for failed payments.",
      effort: "High",
      impact: "High",
    });
  }

  if (u.includes("careers") || u.includes("jobs")) {
    urlSignalFindings.push({
      priority: "later",
      category: "UX friction",
      issue: "Careers page — application flow likely has unnecessary friction",
      whyItMatters: "Most careers pages require manual form input that duplicates a resume. Top candidates apply to fewer roles when the form is burdensome.",
      suggestedFix: "Allow resume upload as the primary input. Auto-populate fields from the resume. Reduce form fields to the minimum required.",
      effort: "Medium",
      impact: "Medium",
    });
  }

  // Type-specific findings
  const typeFindings: Record<SiteType, AuditFinding[]> = {
    saas: [
      {
        priority: "urgent",
        category: "Clarity",
        issue: "Hero headline likely describes a feature, not a user outcome",
        whyItMatters: "A new visitor must understand what changes for them within 5 seconds. Feature-led headlines do not communicate value — outcome-led headlines do.",
        suggestedFix: 'Rewrite the headline to complete the sentence: "After using this, you can finally..." or "This replaces the pain of..."',
        effort: "Low",
        impact: "High",
      },
      {
        priority: "important",
        category: "Trust",
        issue: "Social proof likely not visible above the fold",
        whyItMatters: "B2B buyers look for proof of existing customers before engaging. If logos or testimonials appear only after significant scrolling, they may never be seen.",
        suggestedFix: "Move at least 3 recognisable customer logos or a key testimonial to the hero section, below the headline.",
        effort: "Low",
        impact: "Medium",
      },
      {
        priority: "important",
        category: "Conversion",
        issue: "Sign-up likely requires account creation before showing product value",
        whyItMatters: "Gated product experiences cause 40–70% drop-off before a user sees value. Best-in-class SaaS shows the product before asking for email.",
        suggestedFix: "Add an interactive demo, a sandbox, or a product tour that requires no sign-up.",
        effort: "High",
        impact: "High",
      },
      {
        priority: "later",
        category: "Performance",
        issue: "Hero images or background videos likely increase load time",
        whyItMatters: "A 3-second mobile load time causes 53% of users to abandon. Large assets in the hero are the most common cause.",
        suggestedFix: "Run Lighthouse on mobile. Replace video with a static image on slow connections. Lazy-load everything below the fold.",
        effort: "Medium",
        impact: "Medium",
      },
    ],
    ecommerce: [
      {
        priority: "urgent",
        category: "Conversion",
        issue: "Add-to-cart flow likely lacks persistent cart visibility",
        whyItMatters: "Users need to see cart contents at all times during browsing. Hidden or delayed cart feedback increases abandonment.",
        suggestedFix: "Add a sticky cart icon with item count in the nav. Show a slide-out cart on add-to-cart rather than redirecting to a cart page.",
        effort: "Medium",
        impact: "High",
      },
      {
        priority: "urgent",
        category: "Trust",
        issue: "Payment security signals may not be visible at checkout",
        whyItMatters: "65% of shoppers have abandoned checkout due to trust concerns. Security badges and accepted payment logos must appear near the checkout CTA.",
        suggestedFix: "Place SSL badge, accepted payment icons, and a returns policy summary above the 'Place order' button.",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "important",
        category: "Mobile",
        issue: "Product image gallery likely has touch interaction issues",
        whyItMatters: "Mobile shoppers rely on swiping through product images. Pinch-to-zoom and swipe gestures must work correctly on all mobile browsers.",
        suggestedFix: "Test product gallery with touch gestures on iOS Safari and Android Chrome. Ensure pinch-to-zoom is not disabled.",
        effort: "Medium",
        impact: "High",
      },
      {
        priority: "later",
        category: "UX friction",
        issue: "Guest checkout likely not prominently offered",
        whyItMatters: "Forced account creation before purchase causes 35% checkout abandonment. Guest checkout should be the default or equally prominent path.",
        suggestedFix: "Place guest checkout as the first option on the checkout page. Move account creation to post-purchase.",
        effort: "Low",
        impact: "High",
      },
    ],
    devtool: [
      {
        priority: "urgent",
        category: "Clarity",
        issue: "Time-to-first-API-call likely too long",
        whyItMatters: "Developer tools are evaluated by how quickly a developer can see a working result. If the path from docs homepage to first successful API call is more than 10 minutes, developers churn.",
        suggestedFix: "Create a quickstart that reaches a working result in under 3 steps. Measure and optimise time-to-first-success.",
        effort: "High",
        impact: "High",
      },
      {
        priority: "important",
        category: "Trust",
        issue: "Status page likely not linked from main navigation",
        whyItMatters: "Developer tool buyers check uptime history before committing. A missing or hard-to-find status page is a trust gap for engineering teams.",
        suggestedFix: "Add a status page link to the main navigation footer and the dashboard. Link to historical uptime data.",
        effort: "Low",
        impact: "Medium",
      },
      {
        priority: "important",
        category: "QA risk",
        issue: "Code examples may not be tested across all supported environments",
        whyItMatters: "Copy-paste code that does not work destroys developer trust faster than anything else. One broken example can cause a developer to abandon evaluation.",
        suggestedFix: "Run CI against all code examples in documentation on every release. Test in all officially supported language versions.",
        effort: "High",
        impact: "High",
      },
      {
        priority: "later",
        category: "UX friction",
        issue: "Search may not be optimised for developer queries",
        whyItMatters: "Developers search docs with specific technical queries: error codes, method names, SDK names. Generic search fails these.",
        suggestedFix: "Implement Algolia DocSearch or equivalent. Index error codes, method names, and common queries explicitly.",
        effort: "Medium",
        impact: "Medium",
      },
    ],
    portfolio: [
      {
        priority: "urgent",
        category: "Clarity",
        issue: "What you do may not be immediately clear",
        whyItMatters: "A hiring manager or potential client makes their first judgment in 3–5 seconds. If your role and specialty are not immediately clear, they move on.",
        suggestedFix: "Make the first sentence of your hero include: your role, your specialty, and who you help. e.g. 'Product Manager specialising in B2B fintech platforms.'",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "important",
        category: "Conversion",
        issue: "Contact path may require too many steps",
        whyItMatters: "A hiring manager who has to hunt for a contact email will not. The path from portfolio to contact should be one click.",
        suggestedFix: "Add a prominent contact CTA in the navigation and at the bottom of every page. Link directly to email, LinkedIn, or a contact form.",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "important",
        category: "Trust",
        issue: "Case studies may lack specific outcomes",
        whyItMatters: "Portfolios that describe what was built without describing what changed in measurable terms are unconvincing. Outcomes are more credible than descriptions.",
        suggestedFix: "For each case study, add: the specific metric that moved, by how much, and over what timeframe.",
        effort: "Medium",
        impact: "High",
      },
      {
        priority: "later",
        category: "Mobile",
        issue: "Portfolio layout may not adapt well to mobile viewports",
        whyItMatters: "Hiring managers often review portfolios on phones during commutes or between meetings. A broken mobile layout signals poor attention to detail.",
        suggestedFix: "Test the portfolio on iPhone SE (375px) and a mid-range Android device. Ensure all case studies, images, and contact paths work.",
        effort: "Medium",
        impact: "Medium",
      },
    ],
    enterprise: [
      {
        priority: "urgent",
        category: "Trust",
        issue: "Security certifications not visible on evaluation path",
        whyItMatters: "Enterprise buyers require SOC 2, ISO 27001, or equivalent before shortlisting. If these are not visible on the website, procurement processes stall.",
        suggestedFix: "Add security certifications to the homepage, pricing page, and dedicated security page. Link to audit reports or summary documents.",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "urgent",
        category: "Clarity",
        issue: "ROI or business case not clearly communicated",
        whyItMatters: "Enterprise buyers must justify purchase to procurement and finance. If the ROI is not clearly stated, internal champions cannot build the business case.",
        suggestedFix: "Add a ROI calculator, customer case study with business metrics, or a clear value statement in dollar or efficiency terms.",
        effort: "High",
        impact: "High",
      },
      {
        priority: "important",
        category: "Conversion",
        issue: "Demo request flow likely has too many fields",
        whyItMatters: "Enterprise demo forms with 8+ fields have significantly lower completion rates. The minimum required is: name, email, company, role.",
        suggestedFix: "Reduce demo request form to 4–5 fields maximum. Collect additional information in the discovery call.",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "later",
        category: "UX friction",
        issue: "Documentation and support resources hard to find pre-sale",
        whyItMatters: "Technical buyers evaluate documentation quality as a proxy for product quality. Hidden docs signal a less mature product.",
        suggestedFix: "Link public documentation from the main navigation. Make API docs, integration guides, and support resources findable before sign-up.",
        effort: "Low",
        impact: "Medium",
      },
    ],
    marketplace: [
      {
        priority: "urgent",
        category: "Trust",
        issue: "Review and rating authenticity signals may be weak",
        whyItMatters: "Marketplace trust depends entirely on review credibility. Generic or unverified reviews reduce trust rather than build it.",
        suggestedFix: "Add verified purchase badges, response rates, and review dates. Show how reviews are collected and moderated.",
        effort: "Medium",
        impact: "High",
      },
      {
        priority: "important",
        category: "Clarity",
        issue: "Search and filtering may not match user mental model",
        whyItMatters: "Marketplace abandonment is highest when users cannot find what they are looking for within 2–3 searches. Filter design is the primary cause.",
        suggestedFix: "Conduct a search query analysis. Align filter labels with the language users use, not internal taxonomy.",
        effort: "High",
        impact: "High",
      },
      {
        priority: "important",
        category: "Conversion",
        issue: "Onboarding for new sellers or listers likely has high drop-off",
        whyItMatters: "Marketplace supply quality depends on seller onboarding completion. Drop-off in listing creation directly reduces inventory.",
        suggestedFix: "Add progress indicators to the listing creation flow. Save partial progress automatically. Reduce required fields for initial publish.",
        effort: "Medium",
        impact: "High",
      },
      {
        priority: "later",
        category: "Performance",
        issue: "Image loading performance for listings may degrade on slow connections",
        whyItMatters: "Marketplace product pages are image-heavy. Slow image loading increases bounce rate on mobile.",
        suggestedFix: "Implement lazy loading for listing images. Serve WebP format. Use a CDN for all user-uploaded images.",
        effort: "Medium",
        impact: "Medium",
      },
    ],
    landing: [
      {
        priority: "urgent",
        category: "Clarity",
        issue: "Value proposition may not be communicated in 5 seconds",
        whyItMatters: "Landing pages have one job: convert a visitor into a lead or sign-up. If the value proposition requires reading, most visitors will not see it.",
        suggestedFix: "Reduce the hero to: a single outcome-focused headline, a two-sentence supporting statement, and one CTA. Remove everything else above the fold.",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "urgent",
        category: "Conversion",
        issue: "CTA likely competes with secondary actions",
        whyItMatters: "Every additional CTA reduces the conversion rate of the primary one. A landing page with one CTA converts 3× better than one with multiple.",
        suggestedFix: "Remove or de-emphasise all CTAs except the primary action. If navigation is present, consider removing it entirely.",
        effort: "Low",
        impact: "High",
      },
      {
        priority: "important",
        category: "Trust",
        issue: "Social proof or early user signals likely missing",
        whyItMatters: "Pre-launch landing pages need trust signals even without a customer base. Waitlist count, press mentions, or founder credibility fill this gap.",
        suggestedFix: "Add a waitlist counter, a press mention, a recognisable logo, or a founder credential to build early trust.",
        effort: "Low",
        impact: "Medium",
      },
      {
        priority: "later",
        category: "QA risk",
        issue: "Form submission and email capture may not be tested end-to-end",
        whyItMatters: "A broken sign-up form on a landing page loses leads silently. Most teams test the form design but not the full submission → confirmation email flow.",
        suggestedFix: "Test the full flow: submit → confirmation page → confirmation email delivery → unsubscribe path. Test on mobile.",
        effort: "Low",
        impact: "High",
      },
    ],
  };

  const all = [...shared, ...urlSignalFindings, ...(typeFindings[type] || [])];

  // Sort: urgent → important → later
  const order: Record<Priority, number> = { urgent: 0, important: 1, later: 2 };
  return all.sort((a, b) => order[a.priority] - order[b.priority]);
}

function buildScore(type: SiteType): number {
  const baseScores: Record<SiteType, number> = {
    saas: 58, ecommerce: 62, devtool: 55, portfolio: 64, enterprise: 52, marketplace: 60, landing: 50,
  };
  return baseScores[type];
}

function buildAuditResult(url: string): AuditResult {
  let domain = url;
  try {
    domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch { /* use raw url */ }

  const type = classifySite(url);
  const findings = getFindings(url, type);
  const score = buildScore(type);
  const urgentFindings = findings.filter((f) => f.priority === "urgent");

  return {
    domain,
    siteType: siteTypeLabel(type),
    overallScore: score,
    topUrgentIssue: urgentFindings[0]?.issue ?? findings[0]?.issue ?? "No critical issues detected",
    bestQuickWin: findings.find((f) => f.effort === "Low" && f.impact === "High")?.issue ?? findings.find((f) => f.effort === "Low")?.issue ?? "See findings below",
    mainProductRisk: urgentFindings.find((f) => f.category === "Conversion" || f.category === "Trust")?.issue ?? urgentFindings[0]?.issue ?? "Review full findings",
    findings,
  };
}

// ── Priority config ───────────────────────────────────────────────────────────

const P = {
  urgent: {
    label: "Urgent",
    row: "bg-red-50 border-red-100",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  important: {
    label: "Important",
    row: "bg-amber-50 border-amber-100",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  later: {
    label: "Later",
    row: "bg-white border-zinc-100",
    badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
    dot: "bg-zinc-400",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AuditTool() {
  const [auditState, setAuditState] = useState<AuditState>("idle");
  const [url, setUrl] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function normalise(raw: string) {
    const t = raw.trim();
    if (!t) return "";
    return t.startsWith("http") ? t : `https://${t}`;
  }

  async function runAudit() {
    const norm = normalise(url);
    if (!norm) { setError("Enter a URL to audit."); return; }
    setError("");
    setAuditState("loading");
    setStageIndex(0);

    for (let i = 1; i < LOADING_STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setStageIndex(i);
    }
    await new Promise((r) => setTimeout(r, 400));
    setResult(buildAuditResult(norm));
    setAuditState("results");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function reset() {
    setAuditState("idle");
    setUrl("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  function copyReport() {
    if (!result) return;
    const text = [
      `PRODUCT QA AUDIT REPORT`,
      `Target: ${result.domain} (${result.siteType})`,
      `Overall Score: ${result.overallScore}/100`,
      ``,
      ...result.findings.map((f) =>
        `[${f.priority.toUpperCase()}] ${f.category} — ${f.issue}\nWhy: ${f.whyItMatters}\nFix: ${f.suggestedFix}\nEffort: ${f.effort} · Impact: ${f.impact}`
      ),
      ``,
      `Generated by AI Product QA Auditor · Clearspec PM Tools`,
      `Demo audit based on URL pattern and product heuristics`,
    ].join("\n\n");
    navigator.clipboard.writeText(text).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (auditState === "idle") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">Run an audit</p>
        <p className="mb-5 text-sm text-zinc-500">Enter any product URL. The auditor classifies the site type and returns tailored findings across 8 categories.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") runAudit(); }}
              placeholder="https://yourproduct.com"
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
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (auditState === "loading") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex gap-1">{[0, 1, 2].map((i) => <div key={i} className="h-2 w-2 rounded-full bg-zinc-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}</div>
          <span className="font-mono text-xs text-zinc-500">Auditing {normalise(url).replace(/https?:\/\//, "").split("/")[0]}</span>
        </div>
        <div className="mb-5 space-y-2">
          {LOADING_STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center gap-3">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${i < stageIndex ? "border-green-300 bg-green-50 text-green-600" : i === stageIndex ? "border-zinc-300 bg-zinc-50 text-zinc-400" : "border-zinc-200 bg-white text-zinc-200"}`}>
                {i < stageIndex ? "✓" : i === stageIndex ? "→" : "·"}
              </div>
              <span className={`text-sm ${i < stageIndex ? "text-zinc-400 line-through" : i === stageIndex ? "text-zinc-700 font-medium" : "text-zinc-300"}`}>{stage}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div className="h-full rounded-full bg-zinc-900 transition-all duration-500" style={{ width: `${((stageIndex + 1) / LOADING_STAGES.length) * 100}%` }} />
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (auditState === "results" && result) {
    const urgentCount = result.findings.filter((f) => f.priority === "urgent").length;
    const importantCount = result.findings.filter((f) => f.priority === "important").length;

    return (
      <div ref={resultRef} className="space-y-6">

        {/* Actions */}
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
            <button onClick={copyReport} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400">
              {copied ? (<><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>) : "Copy report"}
            </button>
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400">
              New audit
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard
            label="Overall score"
            value={`${result.overallScore}/100`}
            sub={`${urgentCount} urgent · ${importantCount} important`}
            accent="zinc"
          />
          <SummaryCard label="Top urgent issue" value={urgentCount > 0 ? `${urgentCount} found` : "None"} sub={result.topUrgentIssue} accent="red" />
          <SummaryCard label="Best quick win" value="Low effort" sub={result.bestQuickWin} accent="green" />
          <SummaryCard label="Main product risk" value="Review" sub={result.mainProductRisk} accent="amber" />
        </div>

        {/* Findings — mobile: cards, desktop: table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          {/* Table header — desktop only */}
          <div className="hidden sm:grid sm:grid-cols-[100px_110px_1fr_1fr_1fr_80px_80px] gap-0 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
            {["Priority", "Category", "Issue", "Why it matters", "Suggested fix", "Effort", "Impact"].map((h) => (
              <div key={h} className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{h}</div>
            ))}
          </div>

          {/* Findings */}
          <div className="divide-y divide-zinc-100">
            {result.findings.map((f, i) => {
              const cfg = P[f.priority];
              return (
                <div key={i} className={`${cfg.row} border-l-4`}>
                  {/* Mobile card */}
                  <div className="block p-4 sm:hidden">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${cfg.badge}`}>
                        <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      <span className="rounded bg-white/60 border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-500">{f.category}</span>
                    </div>
                    <p className="mb-2 text-sm font-semibold text-zinc-900">{f.issue}</p>
                    <p className="mb-2 text-xs text-zinc-600">{f.whyItMatters}</p>
                    <div className="rounded bg-white/80 border border-zinc-200 p-2.5">
                      <p className="mb-1 font-mono text-[10px] font-semibold uppercase text-zinc-400">Fix</p>
                      <p className="text-xs text-zinc-700">{f.suggestedFix}</p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <span className="font-mono text-[10px] text-zinc-400">Effort: {f.effort}</span>
                      <span className="font-mono text-[10px] text-zinc-400">Impact: {f.impact}</span>
                    </div>
                  </div>

                  {/* Desktop table row */}
                  <div className="hidden sm:grid sm:grid-cols-[100px_110px_1fr_1fr_1fr_80px_80px] gap-0 px-4 py-4 items-start">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] font-semibold uppercase ${cfg.badge}`}>
                        <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-zinc-600 pr-3">{f.category}</div>
                    <div className="pr-3">
                      <p className="text-xs font-semibold text-zinc-900">{f.issue}</p>
                    </div>
                    <div className="pr-3 text-xs leading-relaxed text-zinc-500">{f.whyItMatters}</div>
                    <div className="pr-3 text-xs leading-relaxed text-zinc-600">{f.suggestedFix}</div>
                    <div>
                      <EffortBadge value={f.effort} />
                    </div>
                    <div>
                      <ImpactBadge value={f.impact} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400">
          Demo audit based on URL pattern and product heuristics · Not a real crawl
        </p>
      </div>
    );
  }

  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  const accents: Record<string, string> = {
    zinc: "border-zinc-200",
    red: "border-red-200",
    green: "border-green-200",
    amber: "border-amber-200",
  };
  return (
    <div className={`rounded-xl border bg-white p-4 ${accents[accent] || accents.zinc}`}>
      <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <p className="mb-1 text-base font-semibold text-zinc-900">{value}</p>
      <p className="text-[11px] leading-relaxed text-zinc-500 line-clamp-2">{sub}</p>
    </div>
  );
}

function EffortBadge({ value }: { value: Effort }) {
  const s = { Low: "text-green-700 bg-green-50 border-green-200", Medium: "text-amber-700 bg-amber-50 border-amber-200", High: "text-red-700 bg-red-50 border-red-200" }[value];
  return <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] ${s}`}>{value}</span>;
}

function ImpactBadge({ value }: { value: Impact }) {
  const s = { High: "text-blue-700 bg-blue-50 border-blue-200", Medium: "text-zinc-700 bg-zinc-50 border-zinc-200", Low: "text-zinc-500 bg-white border-zinc-200" }[value];
  return <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] ${s}`}>{value}</span>;
}
