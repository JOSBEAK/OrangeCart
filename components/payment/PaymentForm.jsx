"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Snackbar } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useSelector } from "react-redux";
import LoadingSpinner from "../misc/LoadingSpinner";
import UPIPayment from "./UPIPayment";
import CardPayment from "./CardPayment";
import QRPayment from "./QRPayment";
import CashOnDelivery from "./CashOnDelivery";
import { initializeCashfreeSDK, createPaymentSession } from "./paymentUtils";

const PaymentForm = ({ onPaymentSuccess }) => {
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [error, setError] = useState(null);
  const { isPaymentDone, discountedTotal, paymentMethod } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    initializeCashfreeSDK(setIsSDKReady, setError);
    createPaymentSession(
      discountedTotal,
      setPaymentSessionId,
      setOrderId,
      setError
    );
  }, [discountedTotal]);

  useEffect(() => {
    if (isPaymentDone) {
      onPaymentSuccess();
    }
  }, [isPaymentDone]);

  if (!isSDKReady) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 1 }}>
      <Typography variant="h6" gutterBottom>
        Payment Options {paymentMethod}
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

      <UPIPayment
        paymentSessionId={paymentSessionId}
        orderId={orderId}
        setError={setError}
        onPaymentSuccess={onPaymentSuccess}
      />
      <CardPayment
        paymentSessionId={paymentSessionId}
        orderId={orderId}
        setError={setError}
        onPaymentSuccess={onPaymentSuccess}
      />
      <QRPayment
        paymentSessionId={paymentSessionId}
        orderId={orderId}
        setError={setError}
        onPaymentSuccess={onPaymentSuccess}
      />

      <CashOnDelivery onPaymentSuccess={onPaymentSuccess} />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  );
};

export default PaymentForm;
