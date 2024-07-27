"use client";

import React from "react";
import { Formik } from "formik";
import { Box, Paper, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch } from "react-redux";
import { setAddress, setAddressValid } from "@/lib/slices/cartSlice";
import { initialValues, validationSchema } from "../config/addressFormConfig";
import FormFields from "./FormFields.jsx";
import headingStyle from "@/styles/headingStyle";

const AddressForm = ({ formRef }) => {
  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(setAddress(values));
    dispatch(setAddressValid(true));
    setSubmitting(false);
  };

  return (
    <Box maxWidth="md" sx={{ margin: "auto", py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <LocationOnIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography sx={headingStyle} variant="h6" component="h1">
            Shipping Address
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          innerRef={formRef}
          onSubmit={handleSubmit}
        >
          <FormFields />
        </Formik>
      </Paper>
    </Box>
  );
};

export default AddressForm;
