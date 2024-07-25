"use client";

import { useSearchParams } from "next/navigation";
import CartPage from "@/components/CartPage";
import Confirmation from "@/components/Confirmation";
import AddressForm from "@/components/AddressForm";
import PaymentForm from "@/components/PaymentForm";
import ErrorFallback from "@/components/ErrorFallback";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("current") || "bag";

  try {
    switch (currentStep) {
      case "bag":
        return <CartPage />;
      case "confirmation":
        return <Confirmation />;
      case "delivery":
        return <AddressForm />;
      case "payment":
        return <PaymentForm />;
      default:
        return <ErrorFallback />; // Default to bag/cart page
    }
  } catch (error) {
    console.error("Error in CheckoutPage:", error);
    return <ErrorFallback error={error} />;
  }
}
