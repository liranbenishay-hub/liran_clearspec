import Footer from "@/components/footer";
import ToolFlow from "@/components/tool/tool-flow";
import DemoController from "@/components/tool/demo-controller";

export const metadata = {
  title: "Clearspec — Try the Framework",
  description: "Eight questions. One complete PRD. Apply the PM Operating System to a product problem you are working on.",
};

export default function PMOperatingSystemPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Outer wrapper: wide enough for the split-screen output */}
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8 sm:pt-12">

          {/* Header — constrained to readable width */}
          <div className="mx-auto max-w-3xl mb-10 border-b border-zinc-100 pb-8 sm:mb-12 sm:pb-10">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              Clearspec · PM Operating System
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Try the Framework.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-zinc-500 sm:text-base">
              Eight questions. One complete PRD — with problem statement, user stories, success
              metrics, tradeoffs, QA checklist, and rollout plan. No account required.
            </p>
            <div className="mt-5">
              <DemoController />
            </div>
          </div>

          {/* Tool — uses full container width in output state */}
          <ToolFlow />
        </div>
      </main>
      <Footer />
    </>
  );
}
