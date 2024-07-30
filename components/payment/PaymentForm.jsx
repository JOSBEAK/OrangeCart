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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LoadingSpinner from "../misc/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod, setPaymentStatus } from "@/lib/slices/cartSlice";

const PaymentForm = ({ onPaymentSuccess }) => {
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const { isPaymentDone, discountedTotal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

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
    if (isExpanded) {
      mountComponent(panel);
    }
  };

  const mountComponent = async (panel) => {
    if (!isSDKReady || !window.cashfree) {
      setError("Payment system is not ready. Please try again later.");
      return;
    }

    try {
      switch (panel) {
        case "upi":
          if (!upiComponent) {
            const upiCollect = window.cashfree.create("upiCollect", {});
            setUpiComponent(upiCollect);
            await upiCollect.mount("#upi-collect-container");
          }
          break;
        case "card":
          if (Object.keys(cardComponents).length === 0) {
            const cardNumber = window.cashfree.create("cardNumber", {});
            const cardExpiry = window.cashfree.create("cardExpiry", {});
            const cardCvv = window.cashfree.create("cardCvv", {});
            const cardHolder = window.cashfree.create("cardHolder", {});

            setCardComponents({ cardNumber, cardExpiry, cardCvv, cardHolder });

            await cardNumber.mount("#card-number-container");
            await cardExpiry.mount("#card-expiry-container");
            await cardCvv.mount("#card-cvv-container");
            await cardHolder.mount("#card-holder-container");
          }
          break;
        case "qr":
          if (!qrComponent) {
            const upiQr = window.cashfree.create("upiQr", {
              values: { size: "200px" },
            });
            setQrComponent(upiQr);
            await upiQr.mount("#upi-qr-container");
          }
          break;
      }
    } catch (error) {
      console.error(`Error mounting ${panel} component:`, error);
      setError(
        `An error occurred while preparing the ${panel} payment option. Please try again.`
      );
    }
  };

  const handleUPIPayment = async () => {
    if (!upiComponent) {
      setError("UPI payment option is not ready. Please try again.");
      return;
    }

    try {
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
    if (Object.keys(cardComponents).length === 0) {
      setError("Card payment option is not ready. Please try again.");
      return;
    }

    try {
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
    if (!qrComponent) {
      setError("QR payment option is not ready. Please try again.");
      return;
    }

    try {
      const paymentData = {
        paymentSessionId: paymentSessionId,
        paymentMethod: qrComponent,
        returnUrl: `${window.location.origin}/payment-status?orderId=${orderId}`,
      };
      const result = await window.cashfree.pay(paymentData);
      handlePaymentResult(result);
    } catch (error) {
      console.error("Error during QR payment:", error);
      setError("An error occurred during QR payment. Please try again.");
    }
  };

  const handlePaymentResult = (result) => {
    if (result.error) {
      // dispatch(setPaymentStatus("FAILURE"));
      // window.location.href = "/checkout";
      // onPaymentSuccess();
      setError(result.error.message || "Payment failed. Please try again.");
    } else if (result.redirect) {
      window.location.href = "/checkout";
      dispatch(setPaymentStatus("SUCCESS"));
      onPaymentSuccess();
    } else if (result.paymentDetails) {
      window.location.href = "/checkout";
      dispatch(setPaymentStatus("SUCCESS"));
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
