"use client";

/**
 * DemoController
 *
 * Handles first-time detection via localStorage and renders both:
 *   1. The "Watch demo" trigger button (context-aware: prominent for first-timers)
 *   2. The DemoModal itself
 *
 * Add this component to any page that needs the demo feature.
 * Pass the correct storageKey and demo steps for each project.
 */

import { useState, useEffect } from "react";
import DemoModal, { DemoTrigger } from "@/components/ui/demo-modal";
import { CLEARSPEC_DEMO_STEPS, CLEARSPEC_DEMO_STORAGE_KEY } from "@/lib/demo-data";

export default function DemoController() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem(CLEARSPEC_DEMO_STORAGE_KEY);
    setIsFirstTime(!seen);
    // Auto-open for first-time visitors after slight delay
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Avoid hydration mismatch — don't render until client-side
  if (!mounted) return null;

  return (
    <>
      {/* Trigger button */}
      <DemoTrigger
        onClick={() => setIsOpen(true)}
        isFirstTime={isFirstTime}
      />

      {/* Modal */}
      <DemoModal
        steps={CLEARSPEC_DEMO_STEPS}
        storageKey={CLEARSPEC_DEMO_STORAGE_KEY}
        productName="the framework"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsFirstTime(false);
        }}
      />
    </>
  );
}
