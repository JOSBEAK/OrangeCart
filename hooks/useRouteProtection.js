// src/hooks/useRouteProtection.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const STEPS = ["bag", "delivery", "payment", "confirmation"];

export function useRouteProtection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [highestAllowedStep, setHighestAllowedStep] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("highestAllowedStep") || "bag";
    }
    return "bag";
  });

  const currentStep = searchParams.get("current") || "bag";

  useEffect(() => {
    const currentStepIndex = STEPS.indexOf(currentStep);
    const highestAllowedIndex = STEPS.indexOf(highestAllowedStep);

    if (currentStepIndex > highestAllowedIndex) {
      router.replace(`/checkout?current=${highestAllowedStep}`);
    }
  }, [currentStep, highestAllowedStep, router]);

  const completeStep = useCallback((step) => {
    const stepIndex = STEPS.indexOf(step);
    if (stepIndex !== -1 && stepIndex < STEPS.length - 1) {
      const nextStep = STEPS[stepIndex + 1];
      setHighestAllowedStep(nextStep);
      localStorage.setItem("highestAllowedStep", nextStep);
    }
  }, []);

  const resetProgress = useCallback(() => {
    setHighestAllowedStep("bag");
    localStorage.setItem("highestAllowedStep", "bag");
    router.push("/checkout?current=bag");
  }, [router]);

  return { completeStep, resetProgress, currentStep, highestAllowedStep };
}
