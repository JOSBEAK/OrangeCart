import React, { useState } from "react";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

const UPIForm = () => {
  const [upiOption, setUpiOption] = useState("vpa");
  const [vpa, setVpa] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle UPI payment logic here
    console.log("UPI payment initiated");
    router.push("/payment-result?status=failure");
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
        />
      )}
      {upiOption === "qr" && (
        <Box sx={{ mt: 2, mb: 2 }}>QR Code placeholder</Box>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: "black",
          "&:hover": { backgroundColor: "grey.800" },
        }}
      >
        Pay Now
      </Button>
    </form>
  );
};

export default UPIForm;
