import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DiscountIcon from "@mui/icons-material/Discount";
import ReceiptIcon from "@mui/icons-material/Receipt";

import OrderSummarySkeleton from "./OrderSummarySkeleton";

const OrderSummary = ({
  total,
  discountedTotal,

  status,
  error,
}) => {
  if (total === 0) {
    return <OrderSummarySkeleton />;
  }

  if (status === "failed") {
    console.error("Cart fetch error:", error);
    return (
      <Typography color="error" align="center">
        Error loading cart: {error?.message || "Unknown error"}
      </Typography>
    );
  }

  const deliveryFee = 85.5;
  const discount = total - discountedTotal;
  const finalTotal = discountedTotal + deliveryFee;

  const SummaryItem = ({ icon, label, value, color }) => (
    <ListItem disableGutters>
      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>{icon}</Avatar>
      <ListItemText primary={label} />
      <Typography variant="subtitle1" color={color || "text.primary"}>
        ₹{value.toFixed(2)}
      </Typography>
    </ListItem>
  );

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", mb: 3 }}
        >
          <ReceiptIcon sx={{ mr: 1 }} /> Order Summary
        </Typography>
        <List disablePadding>
          <SummaryItem
            icon={<ShoppingCartIcon />}
            label="Order Amount"
            value={total}
          />
          <SummaryItem
            icon={<LocalShippingIcon />}
            label="Delivery Fee"
            value={total === 0 ? 0 : deliveryFee}
          />
          <SummaryItem
            icon={<DiscountIcon />}
            label="Discount"
            value={-discount}
            color="error.main"
          />
          <Divider sx={{ my: 2 }} />
          <ListItem disableGutters>
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Grand total
                </Typography>
              }
              secondary="(Inclusive of all taxes)"
            />
            <Typography variant="h6" color="primary.main">
              ₹{finalTotal.toFixed(2)}
            </Typography>
          </ListItem>
        </List>
      </Paper>

      <Chip
        label={`10% Discount Applied for New Users`}
        color="secondary"
        icon={<DiscountIcon />}
        sx={{
          mb: 3,
          py: 3,
          width: "100%",
          borderRadius: 2,
          fontWeight: "bold",
        }}
      />
    </Box>
  );
};
export default OrderSummary;
