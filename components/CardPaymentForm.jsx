import React, { useState, useMemo } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Button,
  Typography,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod } from "@/lib/slices/cartSlice";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(setPaymentMethod("Card"));

    if (!stripe || !elements) {
      return;
    }

    if (status === "success") {
      dispatch(setPaymentMethod("UPI"));
    }
    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-result?status=success`,
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          style: {
            base: {
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
          mt: 2,
          backgroundColor: "black",
          color: theme.palette.mode === "dark" ? "grey.100" : "white",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "grey.700" : "grey.800",
          },
          width: "100%",
        }}
      >
        Pay Now
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </form>
  );
};

const CardPaymentForm = ({ clientSecret, stripePromise }) => {
  const theme = useTheme();

  const stripeTheme = useMemo(
    () => ({
      theme: theme.palette.mode === "dark" ? "night" : "stripe",
    }),
    [theme.palette.mode]
  );

  const options = {
    clientSecret,
    appearance: stripeTheme,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

// Wrapper component to provide theme
const DarkModeCardPaymentForm = ({ clientSecret, stripePromise }) => {
  const theme = useTheme();

  const darkModeTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: theme.palette.mode,
        },
      }),
    [theme]
  );

  return (
    <ThemeProvider theme={darkModeTheme}>
      <CardPaymentForm
        clientSecret={clientSecret}
        stripePromise={stripePromise}
      />
    </ThemeProvider>
  );
};

export default DarkModeCardPaymentForm;
