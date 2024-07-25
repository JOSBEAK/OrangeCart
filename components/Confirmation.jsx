"use client";
import React, { useEffect } from "react";
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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { motion } from "framer-motion";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

function Confirmation() {
  const { discountedTotal, address } = useSelector((state) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    return () => {
      window.onpopstate = null;
    };
  }, [dispatch]);

  const handleBackToShopping = () => {
    router.push("/checkout?current=bag");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,

          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={3}
              sx={{ p: 4, borderRadius: 4, overflow: "hidden" }}
            >
              <Grid
                container
                spacing={4}
                direction="column"
                alignItems="center"
              >
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
                  <Typography variant="h4" gutterBottom align="center">
                    Payment Successful!
                  </Typography>
                </Grid>
                <Grid item>
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
                        bgcolor: "primary.light",
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
                        Your order will be delivered within 3-5 business days.
                        You will receive a tracking number once your package
                        ships.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleBackToShopping}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 50,
                      boxShadow: 3,
                      "&:hover": {
                        transform: "translateY(-2px)",
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
    </ThemeProvider>
  );
}

export default Confirmation;
