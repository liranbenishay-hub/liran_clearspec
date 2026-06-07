import PMCopilot from "@/components/tool/pm-copilot";

export const metadata = {
  title: "Clearspec — PM Copilot",
  description:
    "Describe what you are trying to build. Get a complete draft PRD in seconds, then enrich it with focused PM questions.",
};

export default function PMOperatingSystemPage() {
  return (
    // bg-white base; PMCopilot controls layout in each state.
    // Draft state uses lg:h-screen (viewport units) for the workspace —
    // it does not depend on parent height, so no special wrapping needed here.
    <div className="bg-white">
      <PMCopilot />
    </div>
  );
}
