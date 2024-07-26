"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { useRouteProtection } from "@/hooks/useRouteProtection";

const PaymentSuccessPage = () => {
  // const { completeStep } = useRouteProtection();
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("checkout?current=confirmation");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  const handleContinue = () => {
    // completeStep("payment");
    router.push("checkout?current=confirmation");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #43cea2, #185a9d)",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          textAlign: "center",
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
        }}
      >
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Successful
          </Typography>
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 80,
              color: "#4caf50",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            Thank you! Your payment has been processed successfully.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            sx={{ mb: 3 }}
          >
            Continue to Confirmation
          </Button>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={(countdown / 5) * 100}
              color="success"
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {countdown}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Redirecting to confirmation page...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
export default PaymentSuccessPage;
