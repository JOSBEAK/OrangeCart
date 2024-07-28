import React, { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useTheme } from "@mui/material";
import StripeCheckoutForm from "./StripeCheckoutForm";

const CardPaymentForm = ({ clientSecret, stripePromise, onPaymentSuccess }) => {
  const theme = useTheme();

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: theme.palette.mode === "dark" ? "night" : "stripe",
      },
    }),
    [clientSecret, theme.palette.mode]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeCheckoutForm onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
};

export default CardPaymentForm;
