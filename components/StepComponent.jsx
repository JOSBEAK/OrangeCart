import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";

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

export function renderStep({
  activeStep,
  setIsFormValid,
  formRef,
  handleNext,
  isButtonDisabled,
  onPaymentSuccess,
}) {
  switch (activeStep) {
    case 0:
      return (
        <CartPage handleNext={handleNext} isButtonDisabled={isButtonDisabled} />
      );
    case 1:
      return <AddressForm setIsFormValid={setIsFormValid} formRef={formRef} />;
    case 2:
      return <PaymentForm onPaymentSuccess={onPaymentSuccess} />;
    case 3:
      return <Confirmation />;
    default:
      return <CartPage />;
  }
}
