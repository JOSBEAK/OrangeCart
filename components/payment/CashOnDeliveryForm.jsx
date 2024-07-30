import React from "react";
import { Typography, Button } from "@mui/material";

import { useDispatch } from "react-redux";
import { setPaymentMethod, setPaymentStatus } from "@/lib/slices/cartSlice";

const CashOnDeliveryForm = () => {
  const dispatch = useDispatch();
  const handleCod = () => {
    dispatch(setPaymentMethod("COD"));
    dispatch(setPaymentStatus("SUCCESS"));
  };
  return (
    <>
      <Typography variant="body1">
        Pay directly to the delivery agent.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "grey.800" },
        }}
        onClick={handleCod}
      >
        Place Order
      </Button>
    </>
  );
};

export default CashOnDeliveryForm;
