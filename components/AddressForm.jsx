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
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { useRouteProtection } from "@/hooks/useRouteProtection";

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

const AddressFormContent = ({ setDisableButtonOnEachPage }) => {
  const [address, setAddressState] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  // const { completeStep } = useRouteProtection();
  const theme = useTheme();

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
          const error = validateField(key, value);
          if (error) newErrors[key] = error;
        }
      });

      if (Object.keys(newErrors).length === 0) {
        setLoading(true);
        try {
          dispatch(setAddress(address));
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
    let isValid = Object.entries(address).every(
      ([key, value]) => key === "landmark" || (value.trim() && !errors[key])
    );
    setDisableButtonOnEachPage(isValid);
    return isValid;
  }, [address, errors]);

  if (loading) return <LoadingSpinner />;

  return (
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
                sm={field === "streetAddress" || field === "landmark" ? 12 : 6}
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
              backgroundColor: "#FF8C00",
              color: theme.palette.mode === "dark" ? "grey.100" : "white",
              "&:hover": {
                backgroundColor: "#FFA500",
              },
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// Wrapper component to provide theme
const DarkModeAddressForm = ({ setDisableButtonOnEachPage }) => {
  const theme = useTheme();

  const darkModeTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: theme.palette.mode,
          primary: {
            main: theme.palette.mode === "dark" ? "#5c6bc0" : "#1a237e",
          },
          secondary: {
            main: theme.palette.mode === "dark" ? "#ffa726" : "#ff6f00",
          },
          error: {
            main: theme.palette.mode === "dark" ? "#f44336" : "#d32f2f",
          },
          background: {
            default: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
            paper: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            secondary: theme.palette.mode === "dark" ? "#b0bec5" : "#757575",
          },
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.23)"
                        : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.87)"
                        : "rgba(0, 0, 0, 0.87)",
                  },
                },
              },
            },
          },
        },
      }),
    [theme]
  );

  return (
    <ThemeProvider theme={darkModeTheme}>
      <AddressFormContent
        setDisableButtonOnEachPage={setDisableButtonOnEachPage}
      />
    </ThemeProvider>
  );
};

export default DarkModeAddressForm;
