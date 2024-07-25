import React from "react";
import { Typography, Button } from "@mui/material";

const CashOnDeliveryForm = () => {
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
          "&:hover": { backgroundColor: "grey.800" },
        }}
      >
        Place Order
      </Button>
    </>
  );
};

export default CashOnDeliveryForm;
