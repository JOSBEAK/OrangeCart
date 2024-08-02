import React from "react";
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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "@/lib/slices/cartSlice";

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

const CODInfoContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[400],
}));

const CashOnDelivery = ({ onPaymentSuccess }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleCashOnDelivery = () => {
    dispatch(setPaymentMethod("COD"));
    // onPaymentSuccess();
  };

  return (
    <StyledAccordion>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="cod-payment-content"
        id="cod-payment-header"
      >
        <LocalShippingIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
        <Typography variant="h6" color="primary">
          Cash on Delivery
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Typography variant="body2" color="textSecondary" paragraph>
          Choose Cash on Delivery to pay directly to the delivery agent upon
          receiving your order.
        </Typography>
        <CODInfoContainer>
          <Typography variant="body2" gutterBottom color="text.primary">
            Please note:
          </Typography>
          <ul
            style={{ color: theme.palette.text.primary, paddingLeft: "1.5rem" }}
          >
            <li>Have the exact amount ready for a smooth transaction.</li>
            <li>Our delivery agent will provide a receipt upon payment.</li>
            <li>Cash on Delivery may not be available for all pin codes.</li>
          </ul>
        </CODInfoContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCashOnDelivery}
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
          Place Order (Cash on Delivery)
        </Button>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CashOnDelivery;
