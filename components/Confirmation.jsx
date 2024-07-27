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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { motion } from "framer-motion";
import Link from "next/link";
import { resetCart } from "@/lib/slices/cartSlice";
import { useRouter } from "next/navigation";
import buttonStyle from "@/styles/buttonStyle";

const ConfirmationComponent = () => {
  const { discountedTotal, address, paymentMethod } = useSelector(
    (state) => state.cart
  );
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
        paddingTop: 4,
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
              <Grid item>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <CheckCircleOutlineIcon
                    color="primary"
                    sx={{ fontSize: 80 }}
                  />
                </motion.div>
              </Grid>
              <Grid item>
                {paymentMethod === "UPI" || paymentMethod === "Card" ? (
                  <Typography variant="h4" gutterBottom align="center">
                    Payment Successful! Payment Method: {paymentMethod}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h4" gutterBottom align="center">
                      Order Confirmed!
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom align="center">
                      Payment Method: {paymentMethod}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item>
                <Typography variant="h6" align="center" color="text.secondary">
                  {paymentMethod === "UPI" || paymentMethod === "Card"
                    ? `Your payment of `
                    : `Please pay `}
                  <Box component="span" fontWeight="bold">
                    ${discountedTotal}
                  </Box>
                  {paymentMethod === "UPI" || paymentMethod === "Card"
                    ? ` has been processed successfully.`
                    : ` to the delivery agent for Order.`}
                </Typography>
              </Grid>
              <Grid item sx={{ width: "100%" }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

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
                      Your order will be delivered within 3-5 business days. You
                      will receive a tracking number once your package ships.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
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
