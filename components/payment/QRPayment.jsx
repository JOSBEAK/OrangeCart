import React, { useState, useEffect } from "react";
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
import QrCode2Icon from "@mui/icons-material/QrCode2";
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
  alignItems: "center",
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

const QRPayment = ({
  paymentSessionId,
  orderId,
  setError,
  onPaymentSuccess,
}) => {
  const theme = useTheme();
  const [qrComponent, setQrComponent] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
    if (isExpanded && !qrComponent) {
      mountQRComponent();
    }
  };

  const mountQRComponent = async () => {
    if (typeof window === "undefined" || !window.cashfree) return;

    try {
      const upiQr = window.cashfree.create("upiQr", {
        values: { size: "200px" },
      });
      setQrComponent(upiQr);
      await upiQr.mount("#upi-qr-container");
    } catch (error) {
      console.error("Error mounting QR component:", error);
      setError(
        "An error occurred while preparing the QR payment option. Please try again."
      );
    }
  };

  const handleQRPayment = () =>
    handlePayment(
      qrComponent,
      paymentSessionId,
      "QR",
      dispatch,
      setError,
      onPaymentSuccess
    );

  return (
    <StyledAccordion expanded={expanded} onChange={handleChange}>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="qr-payment-content"
        id="qr-payment-header"
      >
        <QrCode2Icon sx={{ mr: 2, color: theme.palette.primary.main }} />
        <Typography variant="h6" color="primary">
          Pay with QR Code
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Box
          id="upi-qr-container"
          sx={{
            width: "200px",
            height: "200px",
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        ></Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleQRPayment}
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
          Pay with QR Code
        </Button>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default QRPayment;
