import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "About — Liran Ben Ishay",
  description:
    "Product Manager with 6+ years building fintech, platform, and operational products. I turn ambiguous operational pain into clear product strategy, scalable workflows, and measurable outcomes.",
};

const aiCapabilities = [
  "Build product concepts from zero — idea to structured spec to working prototype",
  "Shape UX flows and information architecture before any engineering begins",
  "Use AI-assisted coding to ship real product experiences, not just wireframes",
  "Define QA checklists and acceptance criteria for every feature before release",
  "Create validation systems that test assumptions before engineering commits",
  "Translate product thinking into working demos that hiring managers can actually use",
];

const fintechExpertise = [
  "Payment processing APIs",
  "ISO partner portals",
  "KYB / KYC flows",
  "Settlement & reconciliation",
  "Card issuing",
  "Virtual accounts",
  "Financial crime case management",
  "Pricing frameworks (MCC, pre-auth, MOTO)",
  "3DS authentication",
  "Webhook configuration systems",
];

const skills = [
  "Product Discovery",
  "PRD Authorship",
  "Roadmap Planning",
  "Permission Architecture",
  "Compliance Products",
  "Feature Flag Strategy",
  "Analytics (Amplitude, Fullstory, GA4)",
  "SQL",
  "Figma",
  "Jira / Confluence",
  "Cross-functional Alignment",
  "QA Frameworks",
];

const philosophy = [
  {
    title: "Operational pain before features.",
    body: "If you cannot name the broken workflow in one sentence, you do not have a product problem — you have a feature request.",
  },
  {
    title: "Tradeoffs are first-class objects.",
    body: "Every real decision has a viable rejected option. Naming what each gives up is what makes a decision defensible when circumstances change.",
  },
  {
    title: "Ship the 80% case. Name the 20%.",
    body: "Deferred scope is sequenced, not abandoned. The Phase 2 ticket is created at Phase 1 scoping time — not afterward.",
  },
  {
    title: "Compliance and audit trail beat UX flexibility.",
    body: "They shape data architecture before UX decisions. Soft deletes. Case IDs on communications. Control authority resolved before shipping.",
  },
  {
    title: "Self-service over operational dependency.",
    body: "Every shipped feature is one step closer to the architecture where users do not need to call support.",
  },
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
            <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Liran Ben Ishay
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-xl">
              Product Manager · Fintech · B2B Platform Products · AI
            </p>
          </div>

          {/* Bio */}
          <div className="mb-14">
            <SectionHeader label="Background" />
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              <p>
                I am a Product Manager with 6+ years of experience building fintech, platform, and
                internal operational products. I focus on turning ambiguous operational pain into clear
                product strategy, scalable workflows, and measurable outcomes.
              </p>
              <p>
                My work spans partner portals, payment platforms, compliance systems, case management,
                and AI product strategy. I have shipped products used by ISO partners to manage
                merchant portfolios, by merchants to manage payment operations, and by compliance teams
                to investigate financial crime cases at scale.
              </p>
              <p>
                I think in systems. Every feature I scope is evaluated against a permission model,
                a compliance constraint, and a north star of reducing operational dependency — so
                users can do things themselves without calling support.
              </p>
            </div>
          </div>

          {/* AI-Native PM — the key differentiator */}
          <div className="mb-14">
            <SectionHeader label="AI-Native Product Building" />
            <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-6 sm:p-8">
              <p className="mb-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
                I use AI tools not only to write documents, but to build product experiences from
                zero: shaping UX flows, creating working prototypes, adjusting code with AI support,
                and building QA systems for each feature before release.
              </p>
              <p className="mb-6 text-sm font-semibold text-white sm:text-base">
                I do not just define products. I build, test, validate, and iterate on them.
              </p>
              <ul className="space-y-3">
                {aiCapabilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 font-mono text-xs text-zinc-600">→</span>
                    <span className="text-sm leading-relaxed text-zinc-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fintech domain */}
          <div className="mb-14">
            <SectionHeader label="Fintech & Platform Domain" />
            <p className="mb-5 text-sm text-zinc-500">
              Deep domain knowledge built from years of product ownership across the payment
              infrastructure stack — not surface familiarity.
            </p>
            <div className="flex flex-wrap gap-2">
              {fintechExpertise.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600"
                >
                  {item}
                </span>
              ))}
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

          {/* How I work */}
          <div className="mb-14">
            <SectionHeader label="How I Work" />
            <div className="divide-y divide-zinc-100">
              {philosophy.map((item) => (
                <div key={item.title} className="py-5">
                  <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 sm:text-base">
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
              <ContactLink label="LinkedIn" href="#" value="linkedin.com/in/liran" note="placeholder" />
              <ContactLink label="GitHub" href="#" value="github.com/liran" note="placeholder" />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 border-t border-zinc-100 pt-10 sm:flex-row sm:flex-wrap">
            <Link
              href="/products/pm-operating-system"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 sm:w-auto"
            >
              Try the Framework →
            </Link>
            <Link
              href="/resume"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 sm:w-auto"
            >
              View Resume
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 sm:w-auto"
            >
              See all products
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
      <p className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
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
  note,
}: {
  label: string;
  href: string;
  value: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex flex-col rounded-lg border border-zinc-200 px-4 py-3 text-xs transition-colors hover:border-zinc-400"
    >
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <span className="mt-0.5 text-zinc-600">
        {value}
        {note && <span className="ml-1 text-zinc-400 italic">({note})</span>}
      </span>
    </a>
  );
}
