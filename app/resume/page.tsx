import Footer from "@/components/footer";

export const metadata = {
  title: "Resume — Liran Ben Ishay",
  description: "Product Manager with 6+ years in fintech, B2B SaaS, and platform products.",
};

const experience = [
  {
    role: "Product Manager",
    company: "Rapyd",
    period: "2020 — Present",
    location: "Tel Aviv, Israel",
    highlights: [
      "Primary PM for PAPO (Partner Portal) — ISO/referral partner-facing portal enabling merchant onboarding, pricing management, webhook configuration, and portfolio monitoring.",
      "Owned Client Portal (CP) product — settlements, card issuing, digital wallets, 3DS authentication, virtual accounts, and communication center.",
      "Designed and shipped Financial Crime Center (FCC) — replaced Salesforce as the compliance case management system. CEO-priority, IPO-readiness context.",
      "Authored 13+ major initiative PRDs across fintech platform, compliance, pricing infrastructure, and AI product strategy.",
      "Scoped PAPI — AI assistant for ISO partner portfolio management, defining a three-layer agentic architecture (actions → alerts → hints).",
      "Led cross-functional alignment across Design, R&D, QA, FinOps, CompOPS, and Sales simultaneously.",
    ],
  },
];

const skills = [
  { category: "Product", items: ["Product Discovery", "PRD Authorship", "Roadmap Planning", "Prioritization Frameworks", "Go-to-Market", "Post-Launch Accountability"] },
  { category: "Domain", items: ["Fintech / Payments", "B2B SaaS", "Platform Products", "API Systems", "Compliance & Risk", "Partner Portals"] },
  { category: "Technical", items: ["SQL", "Data Analysis", "Analytics (Amplitude, Fullstory, GA4)", "Figma", "Jira / Confluence", "Feature Flags"] },
  { category: "AI", items: ["AI Product Strategy", "Agentic Systems", "Prompt Engineering", "LLM-based Tools", "AI Workflow Automation"] },
];

const education = [
  {
    degree: "Placeholder — Degree Name",
    institution: "Placeholder — Institution",
    period: "Placeholder — Year",
    note: "Replace with actual education details.",
  },
];

export default function ResumePage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-5 pb-24 pt-10 sm:px-8 sm:pt-12">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-100 pb-8 sm:mb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
                  Resume
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  Liran Ben Ishay
                </h1>
                <p className="mt-2 text-zinc-500">
                  Product Manager · Fintech · B2B Platform Products · AI
                </p>
                <p className="mt-1 text-sm text-zinc-400">Tel Aviv, Israel · liranb@rapyd.net</p>
              </div>
              {/* Download placeholder */}
              <button
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-400 sm:w-auto"
                title="PDF version coming soon"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">soon</span>
              </button>
            </div>
          </div>

          {/* Summary */}
          <Section label="Summary">
            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
              Product Manager with 6+ years building fintech platforms, payment APIs, partner portals,
              and compliance systems. Strong on systems thinking, operational pain-first discovery,
              and explicit tradeoff documentation. Early adopter of AI product workflows — from
              competitive analysis to agentic product features. Operates simultaneously at feature-spec
              depth and business unit strategic level.
            </p>
          </Section>

          {/* Experience */}
          <Section label="Experience">
            <div className="space-y-10">
              {experience.map((job, i) => (
                <div key={i}>
                  <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900">{job.role}</h3>
                      <p className="text-sm text-zinc-500">{job.company} · {job.location}</p>
                    </div>
                    <span className="font-mono text-xs text-zinc-400 sm:text-right">{job.period}</span>
                  </div>
                  <ul className="space-y-2">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed text-zinc-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-300" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section label="Skills">
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((group) => (
                <div key={group.category}>
                  <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Education */}
          <Section label="Education">
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="flex flex-col gap-1 rounded-lg border border-dashed border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-700">{edu.degree}</p>
                    <p className="text-sm text-zinc-500">{edu.institution}</p>
                  </div>
                  <span className="font-mono text-xs text-zinc-400">{edu.period}</span>
                </div>
              ))}
              <p className="text-xs text-zinc-400 italic">* Education section — replace placeholders with actual details.</p>
            </div>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center gap-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <div className="h-px flex-1 bg-zinc-100" />
      </div>
      {children}
    </div>
  );
}
