"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CheckoutStepper from "@/components/CheckoutStepper";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Badge from "@mui/material/Badge";
import { useState, useMemo, useEffect } from "react";
import OrderSummary from "@/components/OrderSummary";
import { Box, Typography, Container, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";

const steps = [
  { label: "Bag Selection", value: "bag" },
  { label: "Delivery Details", value: "delivery" },
  { label: "Payment", value: "payment" },
  { label: "Confirmation", value: "confirmation" },
];

export default function CheckoutLayout({ children }) {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("current") || "bag";

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((step) => step.value === current);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1].value;
      router.push(`?current=${previousStep}`);
    }
  };

  const showBackButton = current === "delivery" || current === "payment";

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              component="h1"
              onClick={() => router.push("checkout?current=bag")}
              sx={{ cursor: "pointer", fontWeight: "bold", color: "#FE6F00" }}
            >
              ORANGE CART
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={1} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
              position: "relative",
            }}
          >
            {showBackButton && (
              <Box sx={{ alignSelf: "flex-start", marginBottom: 2 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  Back
                </Button>
              </Box>
            )}
            <Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}>
              <CheckoutStepper />
            </Box>
          </Box>
          <Container
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 2,
            }}
          >
            <Box sx={{ flex: 1, marginRight: { md: 2 } }}>{children}</Box>
            <Box sx={{ flex: 1 }}>
              <OrderSummary theme={theme} />
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
