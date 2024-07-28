"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentSuccessModal = ({ open, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const theme = useTheme();

  useEffect(() => {
    let timer;
    if (open) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [open, onClose]);

  const handleContinue = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="payment-success-modal"
      aria-describedby="payment-success-description"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 2, // Add padding for smaller screens
        }}
      >
        <Card
          sx={{
            maxWidth: "100%", // Make the card full width on smaller screens
            textAlign: "center",
            padding: 4,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "grey.800"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(255, 255, 255, 0.1)"
                : "0 8px 32px rgba(31, 38, 135, 0.37)",
            borderRadius: 2, // Add border radius for a smoother look
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontSize: "1.5rem" }} // Reduce font size for smaller screens
            >
              Payment Successful
            </Typography>
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 60, // Reduce icon size for smaller screens
                color: theme.palette.mode === "dark" ? "#66bb6a" : "#4caf50",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
            <Typography
              variant="body1"
              sx={{ mt: 2, mb: 3, fontSize: "0.875rem" }} // Reduce font size for smaller screens
            >
              Thank you! Your payment has been processed successfully.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
                sx={{ mb: 3, fontSize: "0.875rem" }} // Reduce font size for smaller screens
              >
                Close
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: "text.secondary",
                fontSize: "0.75rem", // Reduce font size for smaller screens
              }}
            >
              This modal will close in {countdown} seconds...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default PaymentSuccessModal;
