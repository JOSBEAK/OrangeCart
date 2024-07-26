import React from "react";
import { Typography, Button } from "@mui/material";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "@/lib/slices/cartSlice";

const CashOnDeliveryForm = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Typography variant="body1">
        Pay directly to the delivery agent.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/checkout?current=confirmation"
        sx={{
          mt: 2,
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "grey.800" },
        }}
        onClick={() => dispatch(setPaymentMethod("COD"))}
      >
        Place Order
      </Button>
    </>
  );
};

export default CashOnDeliveryForm;
