"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LoadingSpinner from "../misc/LoadingSpinner";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod } from "@/lib/slices/cartSlice";

const PaymentForm = ({ onPaymentSuccess }) => {
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const { isPaymentDone, discountedTotal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const { load } = await import("@cashfreepayments/cashfree-js");
        const cashfree = await load({
          mode: "sandbox",
        });
        window.cashfree = cashfree;
        setIsSDKReady(true);
        console.log("Cashfree SDK initialized successfully");
      } catch (error) {
        console.error("Error initializing Cashfree SDK:", error);
        setError(
          "Failed to initialize payment system. Please try again later."
        );
      }
    };

    initializeSDK();

    // Payment session
    fetch("/api/create-cashfree-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: (discountedTotal + 85.5) * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.payment_session_id && data.order_id) {
          setPaymentSessionId(data.payment_session_id);
          setOrderId(data.order_id);
          console.log("Payment session ID set:", data.payment_session_id);
          console.log("Order ID set:", data.order_id);
        } else {
          console.error("Invalid response from server:", data);
          setError("Failed to create payment session. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error creating session:", error);
        setError("Failed to create payment session. Please try again.");
      });
  }, []);

  useEffect(() => {
    if (isPaymentDone) {
      onPaymentSuccess();
    }
  }, [isPaymentDone]);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fetchPaymentDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/fetch-payment-details/${orderId}`);
      const data = await response.json();
      if (response.ok) {
        setPaymentDetails(data);
        setShowPaymentDetails(true);
      } else {
        throw new Error(data.error || "Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setError("Failed to fetch payment details. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!isSDKReady || !window.cashfree) {
      setError("Payment system is not ready. Please try again later.");
      return;
    }

    if (!paymentSessionId) {
      setError("Payment session is not available. Please try again.");
      return;
    }

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      returnUrl: `${window.location.origin}/payment-status?order_id=${orderId}`,
    };

    try {
      await window.cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("An error occurred during payment. Please try again.");
    }
  };

  const handleCashOnDelivery = () => {
    dispatch(setPaymentMethod("COD"));
    onPaymentSuccess();
  };

  if (!isSDKReady) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Options
      </Typography>
      <Alert
        icon={<LockIcon fontSize="inherit" />}
        severity="info"
        sx={{
          mb: 2,
          color: "#364AC9",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        Payments are secure and encrypted.
      </Alert>

      <Accordion
        expanded={expanded === "cashfree"}
        onChange={handleChange("cashfree")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            "& .MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            },
          }}
        >
          <Typography>Pay with Cashfree</Typography>
          <Image
            src="/cashfree-icon.png"
            alt="Cashfree"
            width={80}
            height={30}
            style={{
              maxWidth: "100%",

              objectFit: "contain",
            }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "grey.800" },
            }}
          >
            Pay Now
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "cod"} onChange={handleChange("cod")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Cash on Delivery</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" gutterBottom>
            Pay directly to the delivery agent upon receiving your order.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCashOnDelivery}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "grey.800" },
            }}
          >
            Place Order (Cash on Delivery)
          </Button>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />

      <Dialog
        open={showPaymentDetails}
        onClose={() => setShowPaymentDetails(false)}
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {paymentDetails && (
            <Box>
              <Typography>Order ID: {paymentDetails.order_id}</Typography>
              <Typography>Amount: {paymentDetails.order_amount}</Typography>
              <Typography>Status: {paymentDetails.order_status}</Typography>
              {/* Add more details as needed */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentForm;
