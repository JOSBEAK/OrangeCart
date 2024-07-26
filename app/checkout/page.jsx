"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

const CartPage = dynamic(() => import("@/components/CartPage"), {
  loading: () => <LoadingFallback />,
});

const Confirmation = dynamic(() => import("@/components/Confirmation"), {
  loading: () => <LoadingFallback />,
});

const AddressForm = dynamic(() => import("@/components/AddressForm"), {
  loading: () => <LoadingFallback />,
});

const PaymentForm = dynamic(() => import("@/components/PaymentForm"), {
  loading: () => <LoadingFallback />,
});

const ErrorFallback = dynamic(() => import("@/components/ErrorFallback"), {
  loading: () => <LoadingFallback />,
});

function LoadingFallback() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <LoadingSpinner />
    </Box>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("current") || "bag";

  const renderStep = () => {
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
        return <CartPage />;
    }
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>{renderStep()}</ErrorBoundary>
  );
}
