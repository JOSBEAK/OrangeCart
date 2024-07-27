"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import {
  Box,
  Container,
  Step,
  StepLabel,
  Stepper,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ShoppingBag,
  LocalShipping,
  Payment,
  CheckCircle,
} from "@mui/icons-material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import OrderSummary from "@/components/OrderSummary";
import PaymentSuccessModal from "@/components/PaymentSuccess";
import { setActiveStep } from "@/lib/slices/cartSlice";
import buttonStyle from "@/styles/buttonStyle";

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

const CartPage = dynamic(() => import("@/components/CartPage"), {
  loading: () => <LoadingSpinner />,
});
const AddressForm = dynamic(() => import("@/components/AddressForm"), {
  loading: () => <LoadingSpinner />,
});
const PaymentForm = dynamic(() => import("@/components/PaymentForm"), {
  loading: () => <LoadingSpinner />,
});
const Confirmation = dynamic(() => import("@/components/Confirmation"), {
  loading: () => <LoadingSpinner />,
});

const steps = [
  { label: "Bag", icon: ShoppingBag },
  { label: "Delivery", icon: LocalShipping },
  { label: "Payment", icon: Payment },
  { label: "Confirmation", icon: CheckCircle },
];

export default function CheckoutPage() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { items, isAddressAdded, isPaymentDone, activeStep } = useSelector(
    (state) => state.cart
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (activeStep === 1 && formRef.current) {
      formRef.current.handleSubmit();
    }
    dispatch(
      setActiveStep(activeStep === steps.length - 1 ? 0 : activeStep + 1)
    );
  };

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const isButtonDisabled = () => {
    if (items.length === 0) return true;
    if (activeStep === 1) return !isAddressAdded;
    if (activeStep === 2) return !isPaymentDone;
    return false;
  };

  useEffect(() => {
    console.log("Form validity changed:", isFormValid);
  }, [isFormValid]);

  useEffect(() => {
    if (activeStep === 2) dispatch(setActiveStep(3));
  }, [isPaymentDone]);

  const handlePaymentSuccess = () => {
    setIsSuccessModalOpen(true);
    dispatch(setActiveStep(3)); // Move to the confirmation step
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <CartPage
            handleNext={handleNext}
            isButtonDisabled={isButtonDisabled}
          />
        );
      case 1:
        return (
          <AddressForm setIsFormValid={setIsFormValid} formRef={formRef} />
        );
      case 2:
        return <PaymentForm onPaymentSuccess={handlePaymentSuccess} />;
      case 3:
        return <Confirmation />;
      default:
        return <CartPage />;
    }
  };

  return (
    <ErrorBoundary>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{ width: "100%", maxWidth: 600, alignSelf: "center", mb: 4 }}
          >
            <Stepper
              activeStep={activeStep}
              connector={<OrangeConnector />}
              alternativeLabel
            >
              {steps.map((step) => (
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
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ flex: 1, marginRight: { md: 2 } }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              {activeStep > 0 && activeStep < steps.length - 1 && (
                <Button variant="contained" onClick={handleBack}>
                  Back
                </Button>
              )}
              {activeStep == 1 && (
                <Button
                  sx={buttonStyle(isButtonDisabled())}
                  onClick={handleNext}
                  disabled={isButtonDisabled()}
                >
                  {`Proceed to ${steps[activeStep + 1]?.label}`}
                </Button>
              )}
            </Box>
            {renderStep()}
          </Box>
          {items.length > 0 && (
            <Box sx={{ flex: 1, mt: { xs: 4, md: 0 } }}>
              <OrderSummary />
            </Box>
          )}
        </Box>
      </Container>
      <PaymentSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </ErrorBoundary>
  );
}
