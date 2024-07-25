import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams } from "next/navigation";

const OrangeConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #FFA500 0%, #FF8C00 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #FFA500 0%, #FF8C00 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const OrangeStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "linear-gradient(136deg, #FFA500 0%, #FF8C00 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: "linear-gradient(136deg, #FFA500 0%, #FF8C00 100%)",
  }),
}));

function OrangeStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <ShoppingBagIcon />,
    2: <LocalShippingIcon />,
    3: <PaymentIcon />,
    4: <CheckCircleIcon />,
  };

  return (
    <OrangeStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </OrangeStepIconRoot>
  );
}

const TransitionWrapper = styled("div")`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const steps = [
  { label: "Bag Selection", value: "bag" },
  { label: "Delivery Details", value: "delivery" },
  { label: "Payment", value: "payment" },
  { label: "Confirmation", value: "confirmation" },
];

export default function OrangeBagDeliveryStepper() {
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const current = searchParams.get("current") || "bag";

  const getActiveStep = () => {
    return steps.findIndex((step) => step.value === current);
  };
  useEffect(() => {
    const newActiveStep = steps.findIndex((step) => step.value === current);
    if (newActiveStep !== activeStep) {
      setIsVisible(false);
      setTimeout(() => {
        setActiveStep(newActiveStep);
        setIsVisible(true);
      }, 300); // Half of the transition time
    }
  }, [current, activeStep]);

  return (
    <TransitionWrapper visible={isVisible}>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={getActiveStep()}
          connector={<OrangeConnector />}
        >
          {steps.map(({ label, value }) => (
            <Step key={value}>
              <StepLabel StepIconComponent={OrangeStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </TransitionWrapper>
  );
}
