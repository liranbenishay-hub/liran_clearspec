"use client";

import { useState } from "react";
import ProgressBar from "./progress-bar";
import DecisionRecord from "./decision-record";
import type { ToolState, OpenQuestion } from "@/lib/types";
import { EMPTY_TOOL_STATE } from "@/lib/types";
import { STEPS, TOTAL_STEPS } from "@/lib/tool-steps";

export default function ToolFlow() {
  const [step, setStep] = useState(0); // 0-indexed; TOTAL_STEPS = output
  const [state, setState] = useState<ToolState>(EMPTY_TOOL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = STEPS[step];
  const isOutput = step === TOTAL_STEPS;

  // ── Validation ──────────────────────────────────────────────────────────
  function validate(): boolean {
    if (!currentStep) return true;

    const id = currentStep.id;

    if (id === "scope") {
      if (!state.buildNow.trim()) {
        setErrors({ buildNow: "Name it. Even a rough answer is better than skipping this step." });
        return false;
      }
      if (!state.deferToPhase2.trim()) {
        setErrors({ deferToPhase2: "Name it. Even a rough answer is better than skipping this step." });
        return false;
      }
      return true;
    }

    if (id === "tradeoff") {
      const errs: Record<string, string> = {};
      if (!state.rejectedApproach.trim())
        errs.rejectedApproach = "Name it. Even a rough answer is better than skipping this step.";
      if (!state.chosenApproachGivesUp.trim())
        errs.chosenApproachGivesUp = "Name it. Even a rough answer is better than skipping this step.";
      if (!state.rejectedApproachGivesUp.trim())
        errs.rejectedApproachGivesUp = "Name it. Even a rough answer is better than skipping this step.";
      if (Object.keys(errs).length) {
        setErrors(errs);
        return false;
      }
      return true;
    }

    if (id === "questions") {
      const filled = state.openQuestions.filter((q) => q.question.trim());
      if (!filled.length) {
        setErrors({ questions: "Name it. Even a rough answer is better than skipping this step." });
        return false;
      }
      return true;
    }

    // Single textarea steps
    const fieldMap: Record<string, keyof ToolState> = {
      problem: "problemStatement",
      pain: "operationalPain",
      workaround: "currentWorkaround",
      metric: "successMetric",
    };
    const field = fieldMap[id];
    if (field && !String(state[field]).trim()) {
      setErrors({ [field]: "Name it. Even a rough answer is better than skipping this step." });
      return false;
    }

    return true;
  }

  function handleNext() {
    setErrors({});
    if (validate()) {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function handleStartOver() {
    setState(EMPTY_TOOL_STATE);
    setErrors({});
    setStep(0);
  }

  function updateField<K extends keyof ToolState>(key: K, value: ToolState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }

  function updateQuestion(index: number, field: keyof OpenQuestion, value: string) {
    setState((prev) => {
      const questions = [...prev.openQuestions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, openQuestions: questions };
    });
    setErrors({});
  }

  function addQuestion() {
    setState((prev) => ({
      ...prev,
      openQuestions: [...prev.openQuestions, { question: "", owner: "" }],
    }));
  }

  function removeQuestion(index: number) {
    setState((prev) => ({
      ...prev,
      openQuestions: prev.openQuestions.filter((_, i) => i !== index),
    }));
  }

  // ── Output ───────────────────────────────────────────────────────────────
  if (isOutput) {
    return (
      <DecisionRecord state={state} onStartOver={handleStartOver} />
    );
  }

  // ── Steps ────────────────────────────────────────────────────────────────
  return (
    <div className="step-enter">
      {/* Progress */}
      <div className="mb-10">
        <ProgressBar current={step + 1} total={TOTAL_STEPS} />
      </div>

      {/* Back link */}
      {step > 0 && (
        <button
          onClick={handleBack}
          className="mb-8 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-700"
        >
          ← Back
        </button>
      )}

      {/* Step heading */}
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
          Step {currentStep.number} of {TOTAL_STEPS}
        </p>
        <h2 className="text-2xl font-semibold leading-snug tracking-tight text-zinc-900 sm:text-3xl">
          {currentStep.heading}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
          {currentStep.subtext}
        </p>
        {currentStep.hint && (
          <p className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
            <span className="font-medium text-zinc-700">Hint: </span>
            {currentStep.hint}
          </p>
        )}
      </div>

      {/* Step inputs */}
      {renderStepInput(currentStep.id, state, updateField, updateQuestion, addQuestion, removeQuestion, errors, currentStep.placeholder)}

      {/* Continue */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          {step === TOTAL_STEPS - 1 ? "Generate Decision Record →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ── Step input renderer ──────────────────────────────────────────────────

function renderStepInput(
  id: string,
  state: ToolState,
  updateField: <K extends keyof ToolState>(key: K, value: ToolState[K]) => void,
  updateQuestion: (index: number, field: keyof OpenQuestion, value: string) => void,
  addQuestion: () => void,
  removeQuestion: (index: number) => void,
  errors: Record<string, string>,
  placeholder?: string
) {
  const textareaClass = (field: string) =>
    `w-full min-h-[160px] resize-y rounded-lg border px-4 py-3 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-300 transition-colors focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
      errors[field]
        ? "border-red-300 bg-red-50 focus:ring-red-500"
        : "border-zinc-200 bg-white hover:border-zinc-300"
    }`;

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 transition-colors focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
      errors[field]
        ? "border-red-300 bg-red-50 focus:ring-red-500"
        : "border-zinc-200 bg-white hover:border-zinc-300"
    }`;

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="mt-2 text-sm text-red-600">{errors[field]}</p>
    ) : null;

  switch (id) {
    case "problem":
      return (
        <div>
          <textarea
            className={textareaClass("problemStatement")}
            placeholder={placeholder}
            value={state.problemStatement}
            onChange={(e) => updateField("problemStatement", e.target.value)}
            autoFocus
          />
          <ErrorMsg field="problemStatement" />
        </div>
      );

    case "pain":
      return (
        <div>
          <textarea
            className={textareaClass("operationalPain")}
            placeholder={placeholder}
            value={state.operationalPain}
            onChange={(e) => updateField("operationalPain", e.target.value)}
            autoFocus
          />
          <ErrorMsg field="operationalPain" />
        </div>
      );

    case "workaround":
      return (
        <div>
          <textarea
            className={textareaClass("currentWorkaround")}
            placeholder={placeholder}
            value={state.currentWorkaround}
            onChange={(e) => updateField("currentWorkaround", e.target.value)}
            autoFocus
          />
          <ErrorMsg field="currentWorkaround" />
        </div>
      );

    case "metric":
      return (
        <div>
          <input
            type="text"
            className={inputClass("successMetric")}
            placeholder={placeholder}
            value={state.successMetric}
            onChange={(e) => updateField("successMetric", e.target.value)}
            autoFocus
          />
          <ErrorMsg field="successMetric" />
        </div>
      );

    case "scope":
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              <span className="text-green-600">✓</span> Build now{" "}
              <span className="text-zinc-400">(80% case)</span>
            </label>
            <textarea
              className={textareaClass("buildNow")}
              placeholder="The core scenario that covers the vast majority of use cases..."
              value={state.buildNow}
              onChange={(e) => updateField("buildNow", e.target.value)}
              autoFocus
            />
            <ErrorMsg field="buildNow" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              <span className="text-zinc-400">○</span> Phase 2{" "}
              <span className="text-zinc-400">(committed, not abandoned)</span>
            </label>
            <textarea
              className={textareaClass("deferToPhase2")}
              placeholder="The edge cases, complex scenarios, and secondary features that are explicitly deferred..."
              value={state.deferToPhase2}
              onChange={(e) => updateField("deferToPhase2", e.target.value)}
            />
            <ErrorMsg field="deferToPhase2" />
          </div>
        </div>
      );

    case "tradeoff":
      return (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              The alternative approach you are <em>not</em> taking
            </label>
            <textarea
              className={textareaClass("rejectedApproach")}
              placeholder="e.g. Building both phases simultaneously before shipping anything..."
              value={state.rejectedApproach}
              onChange={(e) => updateField("rejectedApproach", e.target.value)}
              autoFocus
            />
            <ErrorMsg field="rejectedApproach" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              What your chosen approach gives up
            </label>
            <textarea
              className={`${textareaClass("chosenApproachGivesUp")} min-h-[100px]`}
              placeholder="e.g. Multi-config scenario in V1. A small percentage of users won't see complete data..."
              value={state.chosenApproachGivesUp}
              onChange={(e) => updateField("chosenApproachGivesUp", e.target.value)}
            />
            <ErrorMsg field="chosenApproachGivesUp" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              What the rejected approach would have given up
            </label>
            <textarea
              className={`${textareaClass("rejectedApproachGivesUp")} min-h-[100px]`}
              placeholder="e.g. Timeline — delaying the majority of users from getting any improvement at all..."
              value={state.rejectedApproachGivesUp}
              onChange={(e) => updateField("rejectedApproachGivesUp", e.target.value)}
            />
            <ErrorMsg field="rejectedApproachGivesUp" />
          </div>
        </div>
      );

    case "questions":
      return (
        <div className="space-y-4">
          {errors.questions && (
            <p className="text-sm text-red-600">{errors.questions}</p>
          )}
          {state.openQuestions.map((q, i) => (
            <div
              key={i}
              className="flex gap-3 items-start rounded-lg border border-zinc-200 bg-white p-4"
            >
              <span className="mt-2.5 font-mono text-xs text-zinc-400 select-none w-5 shrink-0">
                {i + 1}.
              </span>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="What must be resolved before shipping?"
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-300 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none"
                  value={q.question}
                  onChange={(e) => updateQuestion(i, "question", e.target.value)}
                  autoFocus={i === 0}
                />
                <input
                  type="text"
                  placeholder="Owner (optional)"
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-300 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none"
                  value={q.owner}
                  onChange={(e) => updateQuestion(i, "owner", e.target.value)}
                />
              </div>
              {state.openQuestions.length > 1 && (
                <button
                  onClick={() => removeQuestion(i)}
                  className="mt-2 text-zinc-300 hover:text-zinc-600 transition-colors"
                  aria-label="Remove question"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {state.openQuestions.length < 5 && (
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another question
            </button>
          )}
        </div>
      );

    default:
      return null;
  }
}
