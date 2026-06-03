import Footer from "@/components/footer";
import ToolFlow from "@/components/tool/tool-flow";
import DemoController from "@/components/tool/demo-controller";

export const metadata = {
  title: "PM Operating System — Try the Framework",
  description: "Apply the PM Operating System to a product problem you are working on. Seven questions. One decision record.",
};

export default function PMOperatingSystemPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-12">

          {/* Header */}
          <div className="mb-10 border-b border-zinc-100 pb-8 sm:mb-12 sm:pb-10">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              PM Operating System
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Try the Framework.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-zinc-500 sm:text-base">
              Apply it to a product problem you&apos;re actually working on.
              Seven questions. One decision record. No account required.
            </p>
            <div className="mt-5">
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
