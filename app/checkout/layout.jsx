"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OrderSummary from "@/components/OrderSummary";
import { Box, Typography, Container, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const steps = [
  { label: "Bag Selection", value: "bag" },
  { label: "Delivery Details", value: "delivery" },
  { label: "Payment", value: "payment" },
  { label: "Confirmation", value: "confirmation" },
];

export default function CheckoutLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("current") || "bag";
  const { items } = useSelector((state) => state.cart);

  const handleBack = () => {
    const currentIndex = steps.findIndex((step) => step.value === current);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1].value;
      router.push(`?current=${previousStep}`);
    }
  };

  const showBackButton = current === "delivery" || current === "payment";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          position: "relative",
        }}
      >
        {showBackButton && (
          <Box sx={{ alignSelf: "flex-start", marginBottom: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              Back
            </Button>
          </Box>
        )}
        <Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}>
          <CheckoutStepper />
        </Box>
      </Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: 2,
        }}
      >
        <Box sx={{ flex: 1, marginRight: { md: 2 } }}>{children}</Box>
        {items.length !== 0 && (
          <Box sx={{ flex: 1 }}>
            <OrderSummary />
          </Box>
        )}
      </Container>
    </Box>
  );
}
