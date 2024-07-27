import { Box, Button } from "@mui/material";
import buttonStyle from "@/styles/buttonStyle";

export default function CheckoutButtons({
  activeStep,
  handleBack,
  handleNext,
  isButtonDisabled,
}) {
  const steps = ["Bag", "Delivery", "Payment", "Confirmation"];

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
      {activeStep > 0 && activeStep < steps.length - 1 && (
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
      )}
      {activeStep === 1 && (
        <Button
          sx={buttonStyle(isButtonDisabled())}
          onClick={handleNext}
          disabled={isButtonDisabled()}
        >
          {`Proceed to ${steps[activeStep + 1]}`}
        </Button>
      )}
    </Box>
  );
}
