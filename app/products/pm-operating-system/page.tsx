import PMCopilot from "@/components/tool/pm-copilot";

export const metadata = {
  title: "Clearspec — PM Copilot",
  description:
    "Describe what you are trying to build. Get a complete draft PRD in seconds, then enrich it with focused PM questions.",
};

export default function PMOperatingSystemPage() {
  // PMCopilot manages its own layout:
  //   - Input/Generating states: centered, padded, normal page scroll
  //   - Draft state: full-height application workspace, internal scroll
  return (
    <main className="flex flex-col flex-1 min-h-0">
      <PMCopilot />
    </main>
  );
}
