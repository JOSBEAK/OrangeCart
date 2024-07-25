"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CircularProgress, Box, Typography } from "@mui/material";

// Dynamically import the success and failure pages
const PaymentSuccessPage = dynamic(
  () => import("@/components/PaymentSuccess"),
  {
    loading: () => <LoadingComponent message="Loading success page..." />,
  }
);

const PaymentFailurePage = dynamic(
  () => import("@/components/PaymentFailurePage"),
  {
    loading: () => <LoadingComponent message="Loading failure page..." />,
  }
);

// Loading component
function LoadingComponent({ message }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress />
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        {message}
      </Typography>
    </Box>
  );
}

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <Suspense
      fallback={<LoadingComponent message="Loading payment result..." />}
    >
      {status === "success" ? (
        <PaymentSuccessPage />
      ) : status === "failure" ? (
        <PaymentFailurePage />
      ) : (
        <div>
          <h1>Invalid Payment Status</h1>
          <p>Please return to the checkout page and try again.</p>
        </div>
      )}
    </Suspense>
  );
}
