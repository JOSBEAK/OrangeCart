import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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

const UPIInputContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],

  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const UPIPayment = ({
  paymentSessionId,
  orderId,
  setError,
  onPaymentSuccess,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [upiComponent, setUpiComponent] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
    if (isExpanded && !upiComponent && isMounted) {
      mountUPIComponent();
    }
  };

  const mountUPIComponent = async () => {
    if (typeof window === "undefined" || !window.cashfree) return;

    try {
      const upiCollect = window.cashfree.create("upiCollect", {
        style: {
          base: {
            fontFamily: theme.typography.fontFamily,
            fontSmoothing: "antialiased",
            fontSize: "16px",
            color: "black",
            "::placeholder": {
              color: "black",
            },
          },
          invalid: {
            color: theme.palette.error.main,
          },
        },
      });
      setUpiComponent(upiCollect);
      await upiCollect.mount("#upi-collect-container");
    } catch (error) {
      console.error("Error mounting UPI component:", error);
      setError(
        "An error occurred while preparing the UPI payment option. Please try again."
      );
    }
  };

  const handleUPIPayment = () =>
    handlePayment(
      upiComponent,
      paymentSessionId,
      "UPI",
      dispatch,
      setError,
      onPaymentSuccess
    );

  if (!isMounted) {
    return null;
  }

  return (
    <StyledAccordion expanded={expanded} onChange={handleChange}>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="upi-payment-content"
        id="upi-payment-header"
      >
        <AccountBalanceIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
        <Typography variant="h6" color="primary">
          Pay with UPI
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Typography variant="body2" color="textSecondary" paragraph>
          Enter your UPI ID to make a quick and secure payment.
        </Typography>
        <UPIInputContainer>
          <div id="upi-collect-container"></div>
        </UPIInputContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUPIPayment}
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
          Pay with UPI
        </Button>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default UPIPayment;
