import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
const EmptyCart = ({ handleClose }) => {
  return (
    <Box sx={{ p: 2, maxWidth: 300, textAlign: "center" }}>
      <ShoppingCartIcon sx={{ fontSize: 60, color: "#FF8C00", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Your cart is empty
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add some items to your cart and they will appear here.
      </Typography>

      <Button
        variant="contained"
        component={Link}
        href="/"
        sx={{
          backgroundColor: "#FF8C00",
          "&:hover": {
            backgroundColor: "#FFA500",
          },
        }}
        onClick={handleClose}
      >
        Start Shopping
      </Button>
    </Box>
  );
};

export default EmptyCart;
