"use client";

/**
 * DemoModal — reusable walkthrough component.
 *
 * Drop this into any project. Pass your own `steps` and `storageKey`.
 * The modal auto-shows on first visit (localStorage detection) and can
 * always be re-triggered via the "Watch Demo" button.
 *
 * Props:
 *  steps       — array of DemoStep objects describing each slide
 *  storageKey  — unique localStorage key (e.g. "clearspec_demo_seen")
 *  onClose     — called when the user closes or completes the demo
 *  isOpen      — controlled open state (pass true to force-open)
 */

import { useState, useEffect, useCallback } from "react";

export interface DemoStep {
  stepNumber: number;
  stepLabel: string;
  question: string;
  subtext: string;
  inputType: "textarea" | "input" | "dual" | "list" | "output";
  exampleContent: string | DualContent | ListContent | OutputContent;
}

export interface DualContent {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}

export interface ListContent {
  items: { question: string; owner: string }[];
}

export interface OutputContent {
  sections: { label: string; content: string }[];
}

interface DemoModalProps {
  steps: DemoStep[];
  storageKey: string;
  productName?: string;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function DemoModal({
  steps,
  storageKey,
  productName = "the framework",
  onClose,
  isOpen: controlledOpen,
}: DemoModalProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenDemo, setHasSeenDemo] = useState(false);

  // First-time detection
  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    setHasSeenDemo(!!seen);
    if (!seen) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  // Controlled open prop
  useEffect(() => {
    if (controlledOpen !== undefined) setOpen(controlledOpen);
  }, [controlledOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setCurrentStep(0);
    localStorage.setItem(storageKey, "true");
    setHasSeenDemo(true);
    onClose?.();
  }, [storageKey, onClose]);

  const handleStart = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, currentStep, handleClose]); // eslint-disable-line

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!open) return null;

  return (
    // Overlay — uses a normal-flow wrapper so it contributes layout height
    // (avoids the fixed-position iframe collapse issue)
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(9,9,11,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(2px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="demo-modal-card"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Demo walkthrough"
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid #f4f4f5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "99px",
                padding: "3px 10px",
              }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" fill="#2563eb" stroke="none" />
              </svg>
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#1d4ed8",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Demo Preview
              </span>
            </span>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "11px",
                color: "#a1a1aa",
              }}
            >
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a1a1aa",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Close demo"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Progress bar ────────────────────────────────── */}
        <div style={{ height: "3px", background: "#f4f4f5" }}>
          <div
            style={{
              height: "3px",
              background: "#09090b",
              width: `${progress}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* ── Step dots ───────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
            padding: "12px 20px 0",
          }}
        >
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? "20px" : "6px",
                height: "6px",
                borderRadius: "99px",
                background: i === currentStep ? "#09090b" : i < currentStep ? "#d4d4d8" : "#e4e4e7",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s ease",
              }}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Step content ────────────────────────────────── */}
        <div
          style={{
            padding: "20px 24px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {/* Step label */}
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#a1a1aa",
              marginBottom: "8px",
            }}
          >
            {step.stepLabel}
          </p>

          {/* Question */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#09090b",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              marginBottom: "8px",
            }}
          >
            {step.question}
          </h2>

          {/* Subtext */}
          <p
            style={{
              fontSize: "13px",
              color: "#71717a",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            {step.subtext}
          </p>

          {/* Example input */}
          <ExampleInput step={step} />
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid #f4f4f5",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          {/* Prev */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              background: "none",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 500,
              color: currentStep === 0 ? "#d4d4d8" : "#52525b",
              cursor: currentStep === 0 ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Prev
          </button>

          {/* Skip */}
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "12px",
              color: "#a1a1aa",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Skip demo
          </button>

          {/* Next or Start */}
          {isLast ? (
            <button
              onClick={handleStart}
              style={{
                background: "#09090b",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Start {productName} →
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                background: "#09090b",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Next →
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        <div
          style={{
            padding: "6px 24px 10px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              color: "#d4d4d8",
            }}
          >
            ← → arrow keys to navigate · Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Example input renderer ───────────────────────────────────────────────────

function ExampleInput({ step }: { step: DemoStep }) {
  const baseBoxStyle: React.CSSProperties = {
    background: "#f9fafb",
    border: "1px solid #e4e4e7",
    borderRadius: "8px",
    padding: "12px 14px",
    position: "relative",
  };

  const exampleLabel: React.CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "10px",
    fontFamily: "ui-monospace, monospace",
    fontSize: "9px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#a1a1aa",
    background: "#f4f4f5",
    padding: "2px 6px",
    borderRadius: "4px",
  };

  const contentStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#374151",
    lineHeight: 1.65,
    paddingRight: "56px",
  };

  if (step.inputType === "textarea" || step.inputType === "input") {
    return (
      <div style={baseBoxStyle}>
        <span style={exampleLabel}>Example</span>
        <p style={contentStyle}>{step.exampleContent as string}</p>
      </div>
    );
  }

  if (step.inputType === "dual") {
    const content = step.exampleContent as DualContent;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={baseBoxStyle}>
          <span style={exampleLabel}>Example</span>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#22c55e",
              marginBottom: "6px",
            }}
          >
            ✓ {content.leftLabel}
          </p>
          <p style={{ ...contentStyle, paddingRight: 0, fontSize: "12px" }}>{content.leftValue}</p>
        </div>
        <div style={baseBoxStyle}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#a1a1aa",
              marginBottom: "6px",
            }}
          >
            ○ {content.rightLabel}
          </p>
          <p style={{ ...contentStyle, paddingRight: 0, fontSize: "12px" }}>{content.rightValue}</p>
        </div>
      </div>
    );
  }

  if (step.inputType === "list") {
    const content = step.exampleContent as ListContent;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {content.items.map((item, i) => (
          <div
            key={i}
            style={{
              ...baseBoxStyle,
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#a1a1aa", marginTop: "1px" }}>
              □
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5, marginBottom: "4px" }}>
                {item.question}
              </p>
              <p style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", color: "#a1a1aa" }}>
                Owner: {item.owner}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (step.inputType === "output") {
    const content = step.exampleContent as OutputContent;
    return (
      <div
        style={{
          background: "#09090b",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #27272a",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #27272a",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3f3f46" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3f3f46" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3f3f46" }} />
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              color: "#52525b",
              marginLeft: "6px",
            }}
          >
            decision-record.md
          </span>
        </div>
        <div style={{ padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontSize: "11px", lineHeight: 1.7 }}>
          <div style={{ color: "#27272a", marginBottom: "8px" }}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div style={{ color: "#fafafa", fontWeight: 600, marginBottom: "2px" }}>DECISION RECORD</div>
          <div style={{ color: "#52525b", fontSize: "10px", marginBottom: "10px" }}>Generated by Clearspec</div>
          <div style={{ color: "#27272a", marginBottom: "10px" }}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          {content.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#52525b",
                  marginBottom: "4px",
                }}
              >
                {s.label}
              </div>
              <div style={{ color: "#d4d4d8", fontSize: "11px" }}>{s.content}</div>
            </div>
          ))}
          <div style={{ color: "#27272a", marginTop: "8px" }}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        </div>
      </div>
    );
  }

  return null;
}

// ── Trigger button — export separately so pages can place it anywhere ────────

interface DemoTriggerProps {
  onClick: () => void;
  isFirstTime?: boolean;
}

export function DemoTrigger({ onClick, isFirstTime = false }: DemoTriggerProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: isFirstTime ? "#09090b" : "transparent",
        color: isFirstTime ? "#ffffff" : "#71717a",
        border: isFirstTime ? "none" : "1px solid #e4e4e7",
        borderRadius: "8px",
        padding: isFirstTime ? "10px 18px" : "8px 14px",
        fontSize: "13px",
        fontWeight: isFirstTime ? 600 : 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!isFirstTime) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#a1a1aa";
          (e.currentTarget as HTMLButtonElement).style.color = "#09090b";
        }
      }}
      onMouseLeave={(e) => {
        if (!isFirstTime) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#e4e4e7";
          (e.currentTarget as HTMLButtonElement).style.color = "#71717a";
        }
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isFirstTime ? "#ffffff" : "#71717a"}
        style={{ flexShrink: 0 }}
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      {isFirstTime ? "Watch how it works" : "Watch demo"}
    </button>
  );
}
