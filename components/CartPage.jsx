"use client";
import React, { useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import CartItems from "../components/CartItems";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/lib/slices/cartSlice";
import buttonStyle from "@/styles/buttonStyle";
import headingStyle from "@/styles/headingStyle";

const CartPage = ({ handleNext, isButtonDisabled }) => {
  const { items, status } = useSelector((state) => state.cart);
  const isCartEmpty = items.length === 0;
  const dispatch = useDispatch();
  useEffect(() => {
    if (status !== "succeeded") {
      dispatch(fetchCart());
    }
  });
  return (
    <Container maxWidth="md">
      <Box my={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Typography sx={headingStyle} variant="h4" gutterBottom>
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
    </Container>
  );
};
export default CartPage;
