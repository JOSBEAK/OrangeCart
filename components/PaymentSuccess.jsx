"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentSuccessModal = ({ open, onClose }) => {
  const [countdown, setCountdown] = useState(5);

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
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            textAlign: "center",
            padding: 4,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
          }}
        >
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
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
                sx={{ mb: 3 }}
              >
                Close
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              This modal will close in {countdown} seconds...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default PaymentSuccessModal;
