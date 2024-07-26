"use client";
import React, { useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import CartItems from "../components/CartItems";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCart } from "@/lib/slices/cartSlice";

const CartPage = () => {
  const { items, status } = useSelector((state) => state.cart);
  const isCartEmpty = items.length === 0;
  const dispatch = useDispatch();
  useEffect(() => {
    if (status !== "succeeded") {
      dispatch(fetchCart());
    }
  });
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Your Cart
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={isCartEmpty}
            component={isCartEmpty ? "button" : Link}
            href={isCartEmpty ? undefined : "/checkout?current=delivery"}
            sx={{
              backgroundColor: isCartEmpty ? "#ccc" : "#FF8C00",
              color: isCartEmpty ? "#666" : "#fff",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: isCartEmpty ? "#ccc" : "#FFA500",
              },
            }}
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
