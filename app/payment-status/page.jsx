"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { setPaymentMethod, setPaymentStatus } from "@/lib/slices/cartSlice";
import { useDispatch } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion } from "framer-motion";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  background: "rgba(255, 255, 255, 0.25)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const StatusIcon = styled(motion.div)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 120,
  height: 120,
  borderRadius: "50%",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    width: 80,
    height: 80,
  },
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

export default function PaymentStatus() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (orderId) {
      fetchPaymentDetails(orderId);
    } else {
      setError("Order ID not found in URL");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/fetch-payment-details/${orderId}`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setPaymentDetails(data);
        dispatch(setPaymentMethod(data[0].payment_group));
        dispatch(setPaymentStatus(data[0].payment_status));
      } else {
        throw new Error(data.error || "Failed to fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setError("Failed to fetch payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return theme.palette.success.main;
      case "PENDING":
        return theme.palette.warning.main;
      default:
        return theme.palette.error.main;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return (
          <CheckCircleOutlineIcon
            style={{ fontSize: isSmallScreen ? 60 : 100, color: "white" }}
          />
        );
      case "PENDING":
        return (
          <AccessTimeIcon
            style={{ fontSize: isSmallScreen ? 60 : 100, color: "white" }}
          />
        );
      default:
        return (
          <ErrorOutlineIcon
            style={{ fontSize: isSmallScreen ? 60 : 100, color: "white" }}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
        p={3}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.default,
        p: 3,
      }}
    >
      <Fade in={true} timeout={1000}>
        <StyledPaper elevation={3}>
          <Grid container direction="column" spacing={4} alignItems="center">
            {paymentDetails && (
              <>
                <Grid item>
                  <StatusIcon
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                      backgroundColor: getStatusColor(
                        paymentDetails[0].payment_status
                      ),
                    }}
                  >
                    {getStatusIcon(paymentDetails[0].payment_status)}
                  </StatusIcon>
                </Grid>
                <Grid item>
                  <Typography
                    variant={isSmallScreen ? "h5" : "h4"}
                    align="center"
                    gutterBottom
                  >
                    Payment {paymentDetails[0].payment_status.toLowerCase()}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    color="textSecondary"
                  >
                    Thank you for your purchase!
                  </Typography>
                </Grid>
                <Grid item sx={{ width: "100%" }}>
                  <DetailItem>
                    <Typography variant="body1">Order ID</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {paymentDetails[0].order_id}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <Typography variant="body1">Amount</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{paymentDetails[0].order_amount}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <Typography variant="body1">Transaction ID</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {paymentDetails[0].cf_payment_id}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <Typography variant="body1">Payment Method</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {paymentDetails[0].payment_group}
                    </Typography>
                  </DetailItem>
                </Grid>
              </>
            )}
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/checkout")}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 30,
                  boxShadow:
                    "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow:
                      "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                Back to Checkout
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </Fade>
    </Box>
  );
}
