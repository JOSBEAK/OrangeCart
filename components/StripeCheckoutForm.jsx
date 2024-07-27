import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Button,
  Typography,
  useTheme,
  Box,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "@/lib/slices/cartSlice";
import PaymentSuccessModal from "@/components/PaymentSuccess";

const StripeCheckoutForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-result?status=success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment successful!");
      dispatch(setPaymentMethod("Card"));
      setIsSuccessModalOpen(true);
      onPaymentSuccess();
    } else {
      setError("An unexpected error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <PaymentElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: theme.palette.text.primary,
                "::placeholder": {
                  color: theme.palette.text.secondary,
                },
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!stripe || processing}
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "black",
            color: theme.palette.mode === "dark" ? "grey.100" : "white",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "grey.700" : "grey.800",
            },
            width: "100%",
          }}
        >
          {processing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Pay Now"
          )}
        </Button>
      </form>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <PaymentSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </Box>
  );
};

export default StripeCheckoutForm;
