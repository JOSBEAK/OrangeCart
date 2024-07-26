// "use client";

// import { useRouteProtection } from "@/hooks/useRouteProtection";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export function ProtectedLayout({ children }) {
//   const { currentStep, highestAllowedStep } = useRouteProtection();
//   const router = useRouter();

//   useEffect(() => {
//     const steps = ["bag", "delivery", "payment", "confirmation"];
//     const currentIndex = steps.indexOf(currentStep);
//     const highestAllowedIndex = steps.indexOf(highestAllowedStep);

//     if (currentIndex > highestAllowedIndex) {
//       router.replace(`/checkout?current=${highestAllowedStep}`);
//     }
//   }, [currentStep, highestAllowedStep, router]);

//   return <>{children}</>;
// }
