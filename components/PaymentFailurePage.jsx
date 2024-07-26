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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PaymentFailurePage = () => {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("checkout?current=payment");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  const handleTryAgain = () => {
    router.push("checkout?current=payment");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ff9966, #ff5e62)",
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
            Payment Failed
          </Typography>
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: "#f44336",
              animation: "shake 0.5s ease-in-out",
              "@keyframes shake": {
                "0%, 100%": { transform: "translateX(0)" },
                "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
                "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
              },
            }}
          />
          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            We are sorry, but your transaction could not be processed.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTryAgain}
            sx={{ mb: 3 }}
          >
            Try Again
          </Button>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={(countdown / 10) * 100}
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
            Redirecting to payment page...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
export default PaymentFailurePage;
