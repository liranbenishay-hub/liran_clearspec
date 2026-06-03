import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "About — Liran Ben Ishay",
  description: "Product Manager with 6+ years in fintech, B2B SaaS, and platform products. Based in Israel.",
};

const background = [
  { area: "Role", detail: "Product Manager at Rapyd (CashDash organization)" },
  { area: "Location", detail: "Tel Aviv, Israel (IDT, GMT+3)" },
  { area: "Domain", detail: "B2B fintech · Partner portals · Payment platforms · Compliance systems" },
  { area: "Experience", detail: "6 years · 13+ major initiatives shipped or in-flight" },
  { area: "Emerging", detail: "AI product strategy · Agentic systems · PM workflow automation" },
];

const philosophy = [
  {
    title: "Operational pain before features.",
    body: "Discovery starts from a broken process, not a user wish list. If you cannot name the broken workflow in one sentence, you do not have a product problem yet.",
  },
  {
    title: "Tradeoffs are first-class objects.",
    body: "Every real decision has a viable rejected option. Naming what each approach gives up is what makes a decision defensible when circumstances change.",
  },
  {
    title: "Ship the 80% case. Name the 20%.",
    body: "Deferred scope is sequenced, not abandoned. The Phase 2 ticket is created at the same time as Phase 1 scoping.",
  },
  {
    title: "Compliance and audit trail beat UX flexibility.",
    body: "They shape data architecture before UX decisions. Soft deletes. Case IDs on communications. Control authority resolved before shipping.",
  },
  {
    title: "Self-service over operational dependency.",
    body: "Every shipped feature is one step closer to the architecture where partners and merchants do not need to call support.",
  },
  {
    title: "AI eliminates work, not thinking.",
    body: "Agentic actions first. Revenue alerts second. Contextual hints last. Easier to build is not a prioritization criterion.",
  },
];

const skills = [
  "Product Discovery",
  "PRD Authorship",
  "Platform Architecture",
  "Permission Systems",
  "Compliance Products",
  "B2B Partner Portals",
  "Payment Infrastructure",
  "AI Product Strategy",
  "Roadmap Planning",
  "Cross-functional Alignment",
  "Data-driven Decisions",
  "SQL",
  "Figma",
  "Amplitude · Fullstory · GA4",
];

const fintech = [
  "Payment processing APIs",
  "ISO partner portals",
  "KYB / KYC flows",
  "Settlement & reconciliation",
  "Card issuing",
  "Virtual accounts",
  "AML / financial crime case management",
  "Pricing frameworks (MCC, pre-auth, MOTO)",
];

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-5 pb-24 pt-10 sm:px-8 sm:pt-12">

          {/* Header */}
          <div className="mb-12 border-b border-zinc-100 pb-10">
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              About
            </p>
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Liran Ben Ishay
            </h1>
            <p className="text-base text-zinc-500 sm:text-xl">
              Product Manager · Fintech · B2B Platform Products
            </p>
          </div>

          {/* Bio */}
          <div className="mb-14">
            <div className="space-y-5 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                I am a Product Manager with six years building fintech platforms, payment systems, partner portals,
                and compliance products. My primary ownership at Rapyd covers the Partner Portal (PAPO) and Client
                Portal (CP) — products used by ISO partners to manage merchant portfolios and by merchants to manage
                their payment operations.
              </p>
              <p>
                I think in systems. Every feature I scope is evaluated against a three-tier permission model
                (platform control → partner control → merchant control), a set of compliance constraints that
                shape data architecture before UX decisions, and a north star of reducing operational dependency —
                partners and merchants doing things themselves without calling support.
              </p>
              <p>
                I built Clearspec as the public version of the PM operating system I developed for myself over six
                years. The methodology here was extracted from real decisions, real tradeoffs, and real post-mortems.
                Some of those decisions were right. A few were wrong. All of them are documented.
              </p>
            </div>
          </div>

          {/* Background table */}
          <div className="mb-14">
            <SectionHeader label="Background" />
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100">
              {background.map((item) => (
                <div key={item.area} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-4">
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400 sm:pt-0.5">
                    {item.area}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-600 sm:col-span-3">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fintech expertise */}
          <div className="mb-14">
            <SectionHeader label="Fintech Expertise" />
            <p className="mb-5 text-sm text-zinc-500">
              Deep domain knowledge across the payment infrastructure stack, built from 6 years of product
              ownership in a global fintech platform.
            </p>
            <div className="flex flex-wrap gap-2">
              {fintech.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* AI experience */}
          <div className="mb-14">
            <SectionHeader label="AI & Platform Products" />
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
              <p className="mb-4 text-sm leading-relaxed text-zinc-600">
                I scope and build AI-native product features — not as experiments, but as architectural decisions
                grounded in operational impact. My AI product framework prioritizes capabilities by what operational
                work they eliminate entirely, not by what is technically impressive.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Layer 1 — Agentic Actions",
                    text: "Natural language → bulk operations. Replaces manual processes entirely. Highest priority.",
                  },
                  {
                    label: "Layer 2 — Revenue Alerts",
                    text: "Proactive pushed alerts without user action. Replaces manual monitoring dashboards.",
                  },
                  {
                    label: "Layer 3 — Contextual Hints",
                    text: "Lightweight in-context nudges. Useful but not a priority over Layers 1 and 2.",
                  },
                ].map((layer) => (
                  <div key={layer.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {layer.label}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-500">{layer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-14">
            <SectionHeader label="Skills" />
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Product philosophy */}
          <div className="mb-14">
            <SectionHeader label="Product Philosophy" />
            <p className="mb-6 text-sm text-zinc-500">
              These are not principles adopted from books. They are rules extracted from actual behavior across
              six years of documented product decisions.
            </p>
            <div className="divide-y divide-zinc-100">
              {philosophy.map((item) => (
                <div key={item.title} className="py-6">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="mb-10">
            <SectionHeader label="Contact" />
            <div className="flex flex-wrap gap-3">
              <ContactLink label="Email" href="mailto:liranb@rapyd.net" value="liranb@rapyd.net" />
              <ContactLink label="LinkedIn" href="#" value="linkedin.com/in/liran (placeholder)" />
              <ContactLink label="GitHub" href="#" value="github.com/liran (placeholder)" />
            </div>
            <p className="mt-3 text-xs text-zinc-400 italic">* Replace contact links with actual URLs.</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-10">
            <Link
              href="/products/pm-operating-system"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Try the Framework →
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
            >
              View Resume
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <div className="h-px flex-1 bg-zinc-100" />
    </div>
  );
}

function ContactLink({
  label,
  href,
  value,
}: {
  label: string;
  href: string;
  value: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex flex-col rounded-lg border border-zinc-200 px-4 py-3 text-xs transition-colors hover:border-zinc-400"
    >
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <span className="mt-0.5 text-zinc-600">{value}</span>
    </a>
  );
}
