import { Suspense } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { redirect } from "next/navigation";

// Import the success and failure pages statically
import PaymentSuccessPage from "@/components/PaymentSuccess";
import PaymentFailurePage from "@/components/PaymentFailurePage";

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

// This becomes a server component
export default async function PaymentResultPage({ searchParams }) {
  const status = searchParams.status;

  if (!status) {
    redirect("/checkout");
  }

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
