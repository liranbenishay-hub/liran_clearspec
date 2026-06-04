import Footer from "@/components/footer";
import PMCopilot from "@/components/tool/pm-copilot";

export const metadata = {
  title: "Clearspec — PM Copilot",
  description:
    "Describe what you are trying to build. Get a complete draft PRD in seconds, then enrich it with focused PM questions.",
};

export default function PMOperatingSystemPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8 sm:pt-12">

          {/* Header */}
          <div className="mx-auto max-w-3xl mb-10 border-b border-zinc-100 pb-8 sm:mb-12 sm:pb-10">
            <div className="mb-3 flex items-center gap-3">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
                Clearspec · PM Copilot
              </p>
              <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 font-mono text-[10px] text-green-700">
                Live
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Generate. Enrich. Refine.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-500 sm:text-base">
              Describe what you are trying to build. Get a complete draft PRD in seconds.
              Then answer focused questions to close the gaps — live.
            </p>
          </div>

          {/* Copilot */}
          <PMCopilot />

        </div>
      </main>
      <Footer />
    </>
  );
}
