"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  Grid,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DiscountIcon from "@mui/icons-material/Discount";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useSearchParams } from "next/navigation";
import OrderSummarySkeleton from "./OrderSummarySkeleton";
import dynamic from "next/dynamic";
import LoadingSpinner from "./LoadingSpinner";

const ItemCard = dynamic(() => import("./ItemCard"), {
  loading: () => <LoadingSpinner />,
});

const OrderSummary = () => {
  const { items, total, discountedTotal, status, error } = useSelector(
    (state) => state.cart
  );
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("current");
  const [showItems, setShowItems] = useState(false);
  const [loadItems, setLoadItems] = useState(false);

  useEffect(() => {
    if (currentPage !== "bag" && items.length > 0) {
      console.log("Setting showItems and loadItems to true");
      setShowItems(true);
      setLoadItems(true);
    }
    if (currentPage === "bag") {
      setShowItems(false);
    }
  }, [currentPage, items]);

  if (status === "loading") {
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
            value={deliveryFee}
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
        label="10% Discount Applied for New Users"
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

      {showItems && (
        <Suspense fallback={<LoadingSpinner />}>
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Items in Your Cart
          </Typography>
          <Grid container spacing={2}>
            {loadItems &&
              items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard item={item} minimal={true} />
                </Grid>
              ))}
          </Grid>
        </Suspense>
      )}
    </Box>
  );
};
export default OrderSummary;
