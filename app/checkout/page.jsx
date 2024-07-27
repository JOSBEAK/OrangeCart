"use client";

import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import OrderSummary from "@/components/OrderSummary";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

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
  const { active, completed, className, icon } = props;

  return (
    <OrangeStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icon}
    </OrangeStepIconRoot>
  );
}
const TransitionWrapper = styled("div")`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const CartPage = dynamic(() => import("@/components/CartPage"), {
  loading: () => <LoadingFallback />,
});

const Confirmation = dynamic(() => import("@/components/Confirmation"), {
  loading: () => <LoadingFallback />,
});

const AddressForm = dynamic(() => import("@/components/AddressForm"), {
  loading: () => <LoadingFallback />,
});

const PaymentForm = dynamic(() => import("@/components/PaymentForm"), {
  loading: () => <LoadingFallback />,
});

const ErrorFallback = dynamic(() => import("@/components/ErrorFallback"), {
  loading: () => <LoadingFallback />,
});

function LoadingFallback() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <LoadingSpinner />
    </Box>
  );
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const { items } = useSelector((state) => state.cart);
  const [isVisible, setIsVisible] = useState(true);
  const [disableButtonOnEachPage, setDisableButtonOnEachPage] = useState(false);

  const handleNext = () => {
    if (activeStep === steps.length - 1) setActiveStep(0);
    else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const disableAccordingToStep = () => {
    console.log(activeStep, disableButtonOnEachPage);

    if (items.length === 0) return true;
    else {
      return disableButtonOnEachPage;
    }
  };

  useEffect(() => {
    disableAccordingToStep();
  }, []);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    { label: "Bag", icon: ShoppingBagIcon },
    { label: "Delivery", icon: LocalShippingIcon },
    { label: "Payment", icon: PaymentIcon },
    { label: "Confirmation", icon: CheckCircleIcon },
  ];

  const returnButtonText = () => {
    return `Proceed to ${steps[activeStep + 1].label}`;
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CartPage />;
      case 1:
        return (
          <AddressForm
            setDisableButtonOnEachPage={setDisableButtonOnEachPage}
          />
        );
      case 2:
        return <PaymentForm />;
      case 3:
        return <Confirmation />;
      default:
        return <CartPage />;
    }
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Container>
        <TransitionWrapper visible={isVisible}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
              position: "relative",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}>
              <Box sx={{ width: "100%", mb: 4 }}>
                <Stepper
                  activeStep={activeStep}
                  connector={<OrangeConnector />}
                  alternativeLabel
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={OrangeStepIcon}
                        icon={<step.icon />}
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>
          </Box>
        </TransitionWrapper>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ flex: 1, marginRight: { md: 2 } }}>
            {activeStep === steps.length ? (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  {activeStep === 0 || activeStep === steps.length - 1 ? (
                    <></>
                  ) : (
                    <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                  )}
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={handleNext}
                    disabled={() => disableAccordingToStep()}
                  >
                    {activeStep === steps.length - 1
                      ? "Reset"
                      : returnButtonText()}
                  </Button>
                </Box>
                {renderStep()}
              </>
            )}
          </Box>
          {items.length !== 0 && (
            <Box sx={{ flex: 1, mt: { xs: 4, md: 0 } }}>
              <OrderSummary />
            </Box>
          )}
        </Box>
      </Container>
    </ErrorBoundary>
  );
}
