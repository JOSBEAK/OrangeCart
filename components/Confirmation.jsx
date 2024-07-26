"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  Button,
  Container,
  Fade,
  Divider,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { motion } from "framer-motion";
import Link from "next/link";
// import { useRouteProtection } from "@/hooks/useRouteProtection";

const ConfirmationContent = () => {
  const { discountedTotal, address, paymentMethod } = useSelector(
    (state) => state.cart
  );
  const router = useRouter();

  const dispatch = useDispatch();
  // const { resetProgress } = useRouteProtection();
  const theme = useTheme();

  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    return () => {
      window.onpopstate = null;
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        margin: "auto",
        backgroundColor: "background.default",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4,
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 4, overflow: "hidden" }}
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
                    Payment Successful! Payment Method : {paymentMethod}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h4" gutterBottom align="center">
                      Order Confirmed!
                    </Typography>
                    <Typography variant="h7" gutterBottom align="center">
                      Payment Method : {paymentMethod}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item>
                {paymentMethod === "UPI" || paymentMethod === "Card" ? (
                  <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                  >
                    Your payment of{" "}
                    <Box component="span" fontWeight="bold">
                      ${discountedTotal}
                    </Box>{" "}
                    has been processed successfully.
                  </Typography>
                ) : (
                  <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                  >
                    Please pay{" "}
                    <Box component="span" fontWeight="bold">
                      ${discountedTotal}
                    </Box>{" "}
                    to the delivery agent for Order.
                  </Typography>
                )}
              </Grid>
              <Grid item sx={{ width: "100%" }}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <LocalShippingIcon color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="h6" fontWeight={700}>
                      Delivery Address
                    </Typography>
                  </Box>
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
                </Grid>
                <Grid item>
                  <Box
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "primary.dark"
                          : "primary.light",
                      p: 2,
                      borderRadius: 2,
                      maxWidth: "400px",
                      margin: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="primary.contrastText"
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
                  component={Link}
                  href="/"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 50,
                    boxShadow: 3,
                    backgroundColor: "#FF8C00", // darker orange color on hover
                    color: "#fff", // white text color
                    "&:hover": {
                      transform: "translateY(-2px)",
                      backgroundColor: "#FFA500", // mid orange color
                      boxShadow: 5,
                    },
                    transition: "all 0.3s",
                  }}
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

// Wrapper component to provide theme
const DarkModeConfirmation = () => {
  const theme = useTheme();

  const darkModeTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: theme.palette.mode,
          primary: {
            main: theme.palette.mode === "dark" ? "#81C784" : "#4CAF50",
          },
          background: {
            default: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
            paper: theme.palette.mode === "dark" ? "#1E1E1E" : "#ffffff",
          },
          text: {
            primary: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            secondary: theme.palette.mode === "dark" ? "#B0BEC5" : "#757575",
          },
        },
      }),
    [theme]
  );

  return (
    <ThemeProvider theme={darkModeTheme}>
      <ConfirmationContent />
    </ThemeProvider>
  );
};

export default DarkModeConfirmation;
