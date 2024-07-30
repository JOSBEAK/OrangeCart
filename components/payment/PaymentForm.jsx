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
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LoadingSpinner from "../misc/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod } from "@/lib/slices/cartSlice";

const PaymentForm = ({ onPaymentSuccess }) => {
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const { isPaymentDone, discountedTotal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [upiId, setUpiId] = useState("");
  const [cardComponents, setCardComponents] = useState({});
  const [upiComponent, setUpiComponent] = useState(null);
  const [qrComponent, setQrComponent] = useState(null);

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
        initializeComponents(cashfree);
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

  const initializeComponents = (cashfree) => {
    const cardNumber = cashfree.create("cardNumber", {});
    const cardExpiry = cashfree.create("cardExpiry", {});
    const cardCvv = cashfree.create("cardCvv", {});
    const cardHolder = cashfree.create("cardHolder", {});
    setCardComponents({ cardNumber, cardExpiry, cardCvv, cardHolder });

    const upiCollect = cashfree.create("upiCollect", {});
    setUpiComponent(upiCollect);

    const upiQr = cashfree.create("upiQr", { values: { size: "200px" } });
    setQrComponent(upiQr);
  };

  useEffect(() => {
    if (isPaymentDone) {
      onPaymentSuccess();
    }
  }, [isPaymentDone]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleUPIPayment = async () => {
    if (!isSDKReady || !window.cashfree || !upiComponent) {
      setError("Payment system is not ready. Please try again later.");
      return;
    }

    try {
      await upiComponent.mount("#upi-collect-container");
      const paymentData = {
        paymentSessionId: paymentSessionId,
        paymentMethod: upiComponent,
        returnUrl: `${window.location.origin}/payment-status?orderId=${orderId}`,
      };
      const result = await window.cashfree.pay(paymentData);
      handlePaymentResult(result);
    } catch (error) {
      console.error("Error during UPI payment:", error);
      setError("An error occurred during UPI payment. Please try again.");
    }
  };

  const handleCardPayment = async () => {
    if (!isSDKReady || !window.cashfree || !cardComponents.cardNumber) {
      setError("Payment system is not ready. Please try again later.");
      return;
    }

    try {
      await cardComponents.cardNumber.mount("#card-number-container");
      await cardComponents.cardExpiry.mount("#card-expiry-container");
      await cardComponents.cardCvv.mount("#card-cvv-container");
      await cardComponents.cardHolder.mount("#card-holder-container");

      const paymentData = {
        paymentSessionId: paymentSessionId,
        paymentMethod: cardComponents.cardNumber,
        returnUrl: `${window.location.origin}/payment-status?orderId=${orderId}`,
      };
      const result = await window.cashfree.pay(paymentData);
      handlePaymentResult(result);
    } catch (error) {
      console.error("Error during card payment:", error);
      setError("An error occurred during card payment. Please try again.");
    }
  };

  const handleQRPayment = async () => {
    if (!isSDKReady || !window.cashfree || !qrComponent) {
      setError("Payment system is not ready. Please try again later.");
      return;
    }

    try {
      await qrComponent.mount("#upi-qr-container");
      const paymentData = {
        paymentSessionId: paymentSessionId,
        paymentMethod: qrComponent,
        returnUrl: `${window.location.origin}/payment-status?orderId=${orderId}`,
      };
      const result = await window.cashfree.pay(paymentData);
      handlePaymentResult(result);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError("An error occurred while generating QR code. Please try again.");
    }
  };

  const handlePaymentResult = (result) => {
    if (result.error) {
      setError(result.error.message || "Payment failed. Please try again.");
    } else if (result.redirect) {
      window.location.href = result.redirect;
    } else if (result.paymentDetails) {
      console.log("Payment successful:", result.paymentDetails);
      onPaymentSuccess();
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

      <Accordion expanded={expanded === "upi"} onChange={handleChange("upi")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pay with UPI</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div id="upi-collect-container"></div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUPIPayment}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "grey.800" },
            }}
          >
            Pay with UPI
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "card"} onChange={handleChange("card")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pay with Card</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            id="card-number-container"
            style={{ marginBottom: "10px" }}
          ></div>
          <div
            id="card-expiry-container"
            style={{ marginBottom: "10px" }}
          ></div>
          <div id="card-cvv-container" style={{ marginBottom: "10px" }}></div>
          <div
            id="card-holder-container"
            style={{ marginBottom: "10px" }}
          ></div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCardPayment}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "grey.800" },
            }}
          >
            Pay with Card
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "qr"} onChange={handleChange("qr")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pay with QR Code</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            id="upi-qr-container"
            style={{ width: "200px", height: "200px", margin: "auto" }}
          ></div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleQRPayment}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "grey.800" },
            }}
          >
            Pay with QR Code
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
    </Box>
  );
};

export default PaymentForm;
