"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Container,
  Fade,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { motion } from "framer-motion";
import Link from "next/link";
import { resetCart } from "@/lib/slices/cartSlice";
import { useRouter } from "next/navigation";
import buttonStyle from "@/styles/buttonStyle";
import { CheckCircle, ErrorOutline, InfoOutlined } from "@mui/icons-material";

const ConfirmationComponent = () => {
  const { discountedTotal, address, paymentMethod, paymentStatus } =
    useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);

  const handleContinueShopping = () => {
    router.push("/");
    setTimeout(() => {
      dispatch(resetCart());
    }, 100);
  };

  const renderPaymentStatusIcon = () => {
    if (paymentMethod === "COD") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <CheckCircle color="success" sx={{ fontSize: 80 }} />
        </motion.div>
      );
    }

    switch (paymentStatus) {
      case "SUCCESS":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <CheckCircle color="success" sx={{ fontSize: 80 }} />
          </motion.div>
        );
      case "PENDING":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <InfoOutlined color="warning" sx={{ fontSize: 80 }} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ErrorOutline color="error" sx={{ fontSize: 80 }} />
          </motion.div>
        );
    }
  };

  const renderPaymentStatusMessage = () => {
    if (paymentMethod === "COD") {
      return (
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color="success.main"
        >
          Order Confirmed!
        </Typography>
      );
    }

    switch (paymentStatus) {
      case "SUCCESS":
        return (
          <Typography variant="h4" gutterBottom align="center">
            Payment Successful!
          </Typography>
        );
      case "PENDING":
        return (
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            color="warning.main"
          >
            Payment Pending
          </Typography>
        );
      default:
        return (
          <Typography variant="h4" gutterBottom align="center" color="error">
            Payment Failed
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        margin: "auto",
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth={isSmallScreen ? "sm" : "md"}
        sx={{ px: { xs: 0, sm: 1, md: 3 } }}
      >
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Grid container spacing={4} direction="column" alignItems="center">
              <Grid item>{renderPaymentStatusIcon()}</Grid>
              <Grid item>
                {renderPaymentStatusMessage()}
                <Typography variant="subtitle1" gutterBottom align="center">
                  Payment Method: {paymentMethod}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" align="center" color="text.secondary">
                  {paymentMethod === "COD"
                    ? `Your order total is `
                    : paymentStatus === "SUCCESS"
                    ? `Your payment of `
                    : paymentStatus === "PENDING"
                    ? `Your pending payment of `
                    : `The attempted payment of `}
                  <Box component="span" fontWeight="bold">
                    ${discountedTotal + 85.5}
                  </Box>
                  {paymentMethod === "COD"
                    ? `. Please pay upon delivery.`
                    : paymentStatus === "SUCCESS"
                    ? ` has been processed successfully.`
                    : paymentStatus === "PENDING"
                    ? ` is being processed.`
                    : ` was not successful.`}
                </Typography>
              </Grid>
              {paymentStatus === "FAILED" && paymentMethod !== "COD" && (
                <Grid item>
                  <Alert severity="error">
                    Your payment was not successful. Please try again or contact
                    customer support.
                  </Alert>
                </Grid>
              )}
              {paymentStatus === "PENDING" && paymentMethod !== "COD" && (
                <Grid item>
                  <Alert severity="warning">
                    Your payment is being processed. We&apos;ll update you once
                    it&apos;s confirmed.
                  </Alert>
                </Grid>
              )}
              <Grid item sx={{ width: "100%" }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {(paymentStatus === "SUCCESS" || paymentMethod === "COD") && (
                <Grid
                  item
                  container
                  direction="column"
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <Grid item>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        justifyContent: "center",
                      }}
                    >
                      <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={700}>
                        Delivery Address
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[800]
                            : theme.palette.grey[100],
                        p: 3,
                        borderRadius: 2,
                        maxWidth: "100%",
                        margin: "auto",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.6, textAlign: "center" }}
                      >
                        <Box component="span" fontWeight="bold">
                          {address.firstName} {address.lastName}
                        </Box>
                        <br />
                        {address.streetAddress}
                        {address.landmark && (
                          <>
                            <br />
                            {address.landmark}
                          </>
                        )}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                        <br />
                        {address.country}
                        <br />
                        Phone:{" "}
                        <Box component="span" fontWeight="bold">
                          {address.mobileNumber}
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        p: 2,
                        borderRadius: 2,
                        maxWidth: "100%",
                        margin: "auto",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={theme.palette.primary.contrastText}
                        align="center"
                      >
                        Your order will be delivered within 3-5 business days.
                        You will receive a tracking number once your package
                        ships.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
              <Grid item sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={buttonStyle()}
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ConfirmationComponent;
