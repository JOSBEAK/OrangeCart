import { setPaymentMethod, setPaymentStatus } from "@/lib/slices/cartSlice";

export const initializeCashfreeSDK = async (setIsSDKReady, setError) => {
  try {
    const { load } = await import("@cashfreepayments/cashfree-js");
    const cashfree = await load({
      mode: "sandbox",
    });
    window.cashfree = cashfree;
    setIsSDKReady(true);
    console.log("Cashfree SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Cashfree SDK:", error);
    setError("Failed to initialize payment system. Please try again later.");
  }
};

export const createPaymentSession = async (
  discountedTotal,
  setPaymentSessionId,
  setOrderId,
  setError
) => {
  try {
    const response = await fetch("/api/create-cashfree-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: (discountedTotal + 85.5) * 100 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);

    if (data.payment_session_id && data.order_id) {
      setPaymentSessionId(data.payment_session_id);
      setOrderId(data.order_id);
      console.log("Payment session ID set:", data.payment_session_id);
      console.log("Order ID set:", data.order_id);
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Error creating session:", error);
    setError(`Failed to create payment session: ${error.message}`);
  }
};

export const handlePayment = async (
  paymentMethod,
  paymentSessionId,
  paymentMode,
  dispatch,
  setError,
  onPaymentSuccess,
  additionalData = {}
) => {
  if (!paymentSessionId) {
    setError("Payment session not created. Please try again.");
    return;
  }

  try {
    const paymentData = {
      paymentSessionId: paymentSessionId,
      paymentMethod: paymentMethod,
      returnUrl: `${window.location.origin}/checkout`,
      ...additionalData,
    };
    const result = await window.cashfree.pay(paymentData);
    handlePaymentResult(
      result,
      paymentMode,
      dispatch,
      setError,
      onPaymentSuccess
    );
  } catch (error) {
    console.error(`Error during payment:`, error);
    console.log(paymentMethod);
    setError(
      `An error occurred during payment. Please try again. (${error.message})`
    );
  }
};

const handlePaymentResult = (
  result,
  paymentMode,
  dispatch,
  setError,
  onPaymentSuccess
) => {
  console.log("RESULT", result);
  if (result.error) {
    console.error("Payment error:", result.error);
    setError(result.error.message || "Payment failed. Please try again.");
    dispatch(setPaymentStatus("FAILURE"));
    dispatch(setPaymentMethod(paymentMode));
    onPaymentSuccess();
  } else if (result.redirect) {
    dispatch(setPaymentStatus("SUCCESS"));
    dispatch(setPaymentMethod(paymentMode));
    onPaymentSuccess();
  } else if (result.paymentDetails) {
    console.log("Payment successful:", result.paymentDetails);
    dispatch(setPaymentStatus("SUCCESS"));
    dispatch(setPaymentMethod(paymentMode));
    onPaymentSuccess();
  } else {
    console.warn("Unexpected payment result:", result);
    setError("Unexpected payment result. Please check your payment status.");
    dispatch(setPaymentStatus("PENDING"));
    dispatch(setPaymentMethod(paymentMode));
    onPaymentSuccess();
  }
};
