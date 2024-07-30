"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container } from "@mui/material";
import ErrorBoundary from "@/components/misc/ErrorBoundary";
import OrderSummary from "@/components/process/OrderSummary";

import { setActiveStep } from "@/lib/slices/cartSlice";
import CheckoutStepper from "@/components/process/CheckoutStepper";

import { renderStep } from "@/components/process/StepComponent";

import CheckoutButtons from "@/components/process/CheckOutButton";

export default function CheckoutPage() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const {
    items,
    isAddressAdded,
    isPaymentDone,
    activeStep,
    total,
    discountedTotal,

    status,
    error,
  } = useSelector((state) => state.cart);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (activeStep === 1 && formRef.current) {
      formRef.current.handleSubmit();
    }
    dispatch(setActiveStep(activeStep === 3 ? 0 : activeStep + 1));
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
    if (activeStep === 2 && isPaymentDone) dispatch(setActiveStep(3));
  }, [isPaymentDone]);

  const handlePaymentSuccess = () => {
    dispatch(setActiveStep(3));
  };

  return (
    <ErrorBoundary>
      <Container>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <CheckoutStepper activeStep={activeStep} />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ flex: 1, marginRight: { md: 2 } }}>
            <CheckoutButtons
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              isButtonDisabled={isButtonDisabled}
            />
            {renderStep({
              activeStep,
              setIsFormValid,
              formRef,
              handleNext,
              isButtonDisabled,
              onPaymentSuccess: handlePaymentSuccess,
            })}
          </Box>
          {
            <Box sx={{ flex: 1, mt: { xs: 4, md: 0 } }}>
              <OrderSummary
                total={total}
                discountedTotal={discountedTotal}
                status={status}
                error={error}
              />
            </Box>
          }
        </Box>
      </Container>
    </ErrorBoundary>
  );
}
