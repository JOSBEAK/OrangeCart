import { STEPS } from "@/config/constants";

export function handleStepTransition(currentStep, highestAllowedStep, router) {
  const currentIndex = STEPS.indexOf(currentStep);
  const highestAllowedIndex = STEPS.indexOf(highestAllowedStep);

  if (currentIndex < highestAllowedIndex) {
    const nextStep = STEPS[currentIndex + 1];
    router.push(`/checkout?current=${nextStep}`);
  }
}
