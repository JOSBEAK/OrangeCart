"use client";
import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import CartItems from "../components/CartItems";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { items, status } = useSelector((state) => state.cart);

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
            sx={{
              backgroundColor: "#FE6F00",
              color: "#fff",

              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
            }}
          >
            <Link
              href="/checkout?current=delivery"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Delivery Address
            </Link>
          </Button>
        </Box>
        <CartItems items={items} isLoading={status === "loading"} />
      </Box>
    </Container>
  );
}
