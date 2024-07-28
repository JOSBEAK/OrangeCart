"use client";
import React, { useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import CartItems from "./CartItems";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/lib/slices/cartSlice";
import buttonStyle from "@/styles/buttonStyle";
import headingStyle from "@/styles/headingStyle";

const CartPage = ({ handleNext, isButtonDisabled }) => {
  const { items, status } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "failed" || status === "idle") {
      dispatch(fetchCart());
    }
  });
  return (
    <Box maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <Typography sx={headingStyle} variant="h6" gutterBottom>
          Your Cart
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={isButtonDisabled()}
          sx={buttonStyle(items.length > 0 ? false : true)}
        >
          Delivery Address
        </Button>
      </Box>
      <CartItems items={items} isLoading={status === "loading"} />
    </Box>
  );
};
export default CartPage;
