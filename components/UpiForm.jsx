import React, { useState } from "react";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { setPaymentMethod } from "@/lib/slices/cartSlice";
import { useDispatch } from "react-redux";

const UpiForm = ({ onPaymentSuccess }) => {
  const [upiOption, setUpiOption] = useState("vpa");
  const [vpa, setVpa] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const upiHandles = [
    "okhdfc",
    "okhdfcbank",
    "oksbi",
    "okicici",
    "okaxis",
    "okbob",
    "okciti",
    "gpay",
    "paytm",
    "upi",
    "ybl",
  ];

  const validateUPI = (input) => {
    return upiHandles.some((handle) => input.toLowerCase().includes(handle));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (upiOption === "vpa") {
      if (!vpa.trim()) {
        setError("Please enter a UPI ID.");
        return;
      }

      if (!validateUPI(vpa)) {
        setError("Invalid UPI ID. Please check and try again.");
        return;
      }
    }

    // Randomly decide success or failure
    const isSuccess = Math.random() < 0.5;
    if (isSuccess) {
      dispatch(setPaymentMethod("UPI"));
      onPaymentSuccess(); // Call the function to open the success modal
    } else {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="subtitle1" gutterBottom>
        Select how you would like to use UPI.
      </Typography>
      <RadioGroup
        row
        value={upiOption}
        onChange={(e) => setUpiOption(e.target.value)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="vpa" control={<Radio />} label="VPA" />
        <FormControlLabel value="qr" control={<Radio />} label="QR Code" />
      </RadioGroup>
      {upiOption === "vpa" && (
        <TextField
          fullWidth
          placeholder="Virtual Payment Address"
          variant="outlined"
          value={vpa}
          onChange={(e) => setVpa(e.target.value)}
          sx={{ mb: 2 }}
          error={!!error}
          helperText={error}
        />
      )}
      {upiOption === "qr" && (
        <Box sx={{ mt: 2, mb: 2 }}>QR Code placeholder</Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "grey.800" },
        }}
      >
        Pay Now
      </Button>
    </form>
  );
};

export default UpiForm;
