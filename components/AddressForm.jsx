"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAddress } from "@/lib/slices/cartSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorBoundary";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
    },
    secondary: {
      main: "#ff6f00",
    },
    error: {
      main: "#d32f2f",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

const initialAddress = {
  firstName: "",
  lastName: "",
  streetAddress: "",
  landmark: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  mobileNumber: "",
};

const fieldValidators = {
  firstName: (value) =>
    /^[a-zA-Z\s]*$/.test(value) ? "" : "Only letters and spaces allowed",
  lastName: (value) =>
    /^[a-zA-Z\s]*$/.test(value) ? "" : "Only letters and spaces allowed",
  pincode: (value) => (/^\d{6}$/.test(value) ? "" : "Must be exactly 6 digits"),
  mobileNumber: (value) =>
    /^\d{10}$/.test(value) ? "" : "Must be exactly 10 digits",
  landmark: () => "", // Optional field
  default: (value) => (value.trim() ? "" : "This field is required"),
};

export default function AddressForm() {
  const [address, setAddressState] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const validateField = useCallback((name, value) => {
    const validator = fieldValidators[name] || fieldValidators.default;
    return validator(value);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let newValue = value;

      if (name === "pincode" || name === "mobileNumber") {
        newValue = value
          .replace(/\D/g, "")
          .slice(0, name === "pincode" ? 6 : 10);
      } else if (name === "firstName" || name === "lastName") {
        newValue = value.replace(/[^a-zA-Z\s]/g, "");
        if (newValue !== value) {
          setFeedback((prev) => ({
            ...prev,
            [name]: "Only letters and spaces are allowed in names.",
          }));
          setTimeout(
            () => setFeedback((prev) => ({ ...prev, [name]: "" })),
            1000
          );
        }
      }

      setAddressState((prev) => ({ ...prev, [name]: newValue }));

      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const newErrors = {};

      Object.entries(address).forEach(([key, value]) => {
        if (key !== "landmark") {
          // Skip validation for landmark
          const error = validateField(key, value);
          if (error) newErrors[key] = error;
        }
      });

      if (Object.keys(newErrors).length === 0) {
        setLoading(true);
        try {
          dispatch(setAddress(address));
          router.push("checkout?current=payment");
        } catch (error) {
          console.error("Error saving address:", error);
          setErrors({ form: "Failed to save address. Please try again." });
        } finally {
          setLoading(false);
        }
      } else {
        setErrors(newErrors);
      }
    },
    [address, validateField, dispatch, router]
  );

  const isFormValid = useMemo(() => {
    return Object.entries(address).every(
      ([key, value]) => key === "landmark" || (value.trim() && !errors[key])
    );
  }, [address, errors]);

  if (loading) return <LoadingSpinner />;

  return (
    <ThemeProvider theme={theme}>
      <Box maxWidth="md" sx={{ margin: "auto", py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <LocationOnIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1">
              Shipping Address
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {errors.form && <ErrorMessage message={errors.form} />}
            <Grid container spacing={3}>
              {Object.entries(address).map(([field, value]) => (
                <Grid
                  item
                  xs={12}
                  sm={
                    field === "streetAddress" || field === "landmark" ? 12 : 6
                  }
                  key={field}
                >
                  <TextField
                    fullWidth
                    label={
                      field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")
                    }
                    name={field}
                    value={value}
                    onChange={handleChange}
                    error={!!errors[field] || !!feedback[field]}
                    helperText={errors[field] || feedback[field]}
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                    required={field !== "landmark"}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              We will only contact you if there are questions about your order.
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid}
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: "secondary.main",
                "&:hover": { bgcolor: "secondary.dark" },
              }}
            >
              Proceed to Payment
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
