import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  useTheme,
  Paper,
  Grid,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { handlePayment } from "./paymentUtils";
import { useDispatch } from "react-redux";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.main, 0.08)
      : theme.palette.primary,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const CardInputContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f4f4f4",
  boxShadow: "none",
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const CardPayment = ({ paymentSessionId, orderId, setError }) => {
  const theme = useTheme();
  const [cardComponents, setCardComponents] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
    if (isExpanded && Object.keys(cardComponents).length === 0 && isMounted) {
      mountCardComponents();
    }
  };

  const mountCardComponents = async () => {
    if (typeof window === "undefined" || !window.cashfree) return;

    try {
      const cashfree = window.cashfree;
      const components = [
        { name: "cardNumber", placeholder: "1234 5678 9012 3456" },
        { name: "cardExpiry", placeholder: "MM / YY" },
        { name: "cardCvv", placeholder: "CVV" },
        { name: "cardHolder", placeholder: "Name on Card" },
      ];

      const mountedComponents = {};

      for (const component of components) {
        const element = cashfree.create(component.name, {
          values: { placeholder: component.placeholder },
          style: {
            base: {
              fontSize: "16px",
              fontFamily: theme.typography.fontFamily,
              fontSmoothing: "antialiased",
              color: "black",
              "::placeholder": {
                color: "F9F9F9",
              },
            },
            invalid: {
              color: theme.palette.error.main,
            },
          },
        });

        await element.mount(`#card-${component.name}-container`);
        mountedComponents[component.name] = element;

        element.on("change", () => checkIfPaymentReady(mountedComponents));
      }

      const saveCard = cashfree.create("savePaymentInstrument", {
        values: { label: "Save Card for later" },
      });
      await saveCard.mount("#save-card-container");
      mountedComponents.saveCard = saveCard;

      setCardComponents(mountedComponents);

      mountedComponents.cardNumber.on("change", (data) => {
        mountedComponents.cardCvv.update({ cvvLength: data.value.cvvLength });
      });
    } catch (error) {
      console.error("Error mounting card components:", error);
      setError(
        "An error occurred while preparing the card payment option. Please try again."
      );
    }
  };

  const checkIfPaymentReady = (components) => {
    const { cardNumber, cardExpiry, cardCvv, cardHolder } = components;
    const isReady =
      cardNumber.isComplete() &&
      cardExpiry.isComplete() &&
      cardCvv.isComplete() &&
      cardHolder.isComplete();
    setIsPaymentReady(isReady);
  };

  const handleCardPayment = () =>
    handlePayment(
      cardComponents.cardNumber,
      paymentSessionId,
      "Card",
      setError,
      {
        savePaymentInstrument: cardComponents.saveCard,
      }
    );

  if (!isMounted) {
    return null; // or a loading placeholder
  }

  return (
    <StyledAccordion expanded={expanded} onChange={handleChange}>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="card-payment-content"
        id="card-payment-header"
      >
        <CreditCardIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
        <Typography variant="h6" color="primary">
          Pay with Card
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Typography variant="body2" color="textSecondary" paragraph>
          Enter your card details to make a secure payment.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CardInputContainer elevation={0}>
              <Box id="card-cardNumber-container" />
            </CardInputContainer>
          </Grid>
          <Grid item xs={12}>
            <CardInputContainer elevation={0}>
              <Box id="card-cardHolder-container" />
            </CardInputContainer>
          </Grid>
          <Grid item xs={6}>
            <CardInputContainer elevation={0}>
              <Box id="card-cardExpiry-container" />
            </CardInputContainer>
          </Grid>
          <Grid item xs={6}>
            <CardInputContainer elevation={0}>
              <Box id="card-cardCvv-container" />
            </CardInputContainer>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCardPayment}
          disabled={!isPaymentReady}
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: theme.shape.borderRadius,
          }}
        >
          Pay with Card
        </Button>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CardPayment;
