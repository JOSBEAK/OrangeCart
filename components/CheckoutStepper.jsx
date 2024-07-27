import { Box, Step, StepLabel, Stepper } from "@mui/material";
import {
  ShoppingBag,
  LocalShipping,
  Payment,
  CheckCircle,
} from "@mui/icons-material";
import { OrangeConnector, OrangeStepIcon } from "@/styles/stepperStyles";

const steps = [
  { label: "Bag", icon: ShoppingBag },
  { label: "Delivery", icon: LocalShipping },
  { label: "Payment", icon: Payment },
  { label: "Confirmation", icon: CheckCircle },
];

export default function CheckoutStepper({ activeStep }) {
  return (
    <Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center", mb: 4 }}>
      <Stepper
        activeStep={activeStep}
        connector={<OrangeConnector />}
        alternativeLabel
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={OrangeStepIcon} icon={<step.icon />}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
