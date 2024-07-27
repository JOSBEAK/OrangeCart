"use client";

import React, { useState, useEffect, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import dynamic from "next/dynamic";
import LoadingSpinner from "./LoadingSpinner";
import headingStyle from "@/styles/headingStyle";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Lazy load payment components
const UpiForm = dynamic(() => import("./UpiForm"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
const CardPaymentForm = dynamic(() => import("./CardPaymentForm"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
const CashOnDeliveryForm = dynamic(() => import("./CashOnDeliveryForm"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const PaymentForm = ({ onPaymentSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loadUPI, setLoadUPI] = useState(false);
  const [loadCard, setLoadCard] = useState(false);
  const [loadCOD, setLoadCOD] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // Amount in cents
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (panel === "upi") setLoadUPI(true);
    if (panel === "card") setLoadCard(true);
    if (panel === "cod") setLoadCOD(true);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={headingStyle}>
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
        Payments are SSL encrypted to keep your details secure.
      </Alert>

      <Accordion expanded={expanded === "upi"} onChange={handleChange("upi")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">UPI</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loadUPI && (
            <Suspense fallback={<LoadingSpinner />}>
              <UpiForm onPaymentSuccess={onPaymentSuccess} />
            </Suspense>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "card"} onChange={handleChange("card")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Cards</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loadCard && clientSecret && (
            <Suspense fallback={<LoadingSpinner />}>
              <CardPaymentForm
                clientSecret={clientSecret}
                stripePromise={stripePromise}
                onPaymentSuccess={onPaymentSuccess}
              />
            </Suspense>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "cod"} onChange={handleChange("cod")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Cash On Delivery</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loadCOD && (
            <Suspense fallback={<LoadingSpinner />}>
              <CashOnDeliveryForm />
            </Suspense>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PaymentForm;
