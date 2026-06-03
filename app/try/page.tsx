import Footer from "@/components/footer";
import ToolFlow from "@/components/tool/tool-flow";
import DemoController from "@/components/tool/demo-controller";

export const metadata = {
  title: "Try the Framework — Clearspec",
  description: "Apply the PM Operating System to a product problem you're working on. Seven questions. One decision record.",
};

export default function TryPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-12">

          {/* Page header */}
          <div className="mb-12 border-b border-zinc-100 pb-10">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              The Framework
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Try Clearspec.
            </h1>
            <p className="mt-3 max-w-lg text-zinc-500">
              Apply the PM Operating System to a product problem you&apos;re actually working on.
              Seven questions. One decision record. No account required.
            </p>

            {/* Demo trigger — auto-opens for first-time visitors, always visible as secondary for returning users */}
            <div className="mt-6">
              <DemoController />
            </div>
          </div>

          {/* Tool */}
          <ToolFlow />
        </div>
      </main>
      <Footer />
    </>
  );
}
