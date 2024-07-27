// AddressForm.js
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { setAddress, setIsValidAddres } from "@/lib/slices/cartSlice";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { setAddressValid } from "@/lib/slices/cartSlice";
import { useFormikContext } from "formik";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import headingStyle from "@/styles/headingStyle";

const initialValues = {
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

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "Only letters and spaces allowed")
    .required("Required"),
  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "Only letters and spaces allowed")
    .required("Required"),
  streetAddress: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Must be exactly 6 digits")
    .required("Required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Must be exactly 10 digits")
    .required("Required"),
  landmark: Yup.string(),
});

// const AddressForm = ({ formRef }) => {
//   const dispatch = useDispatch();

//   const { values, errors, touched, isValid, dirty } = useFormikContext();

//   const handleFormChange = (values, { isValid, dirty }) => {
//     if (isValid && dirty) {
//       dispatch(setAddress(values));
//     }
//   };

//   React.useEffect(() => {
//     if (isValid && dirty) {
//       dispatch(setAddressValid(true));
//     } else {
//       dispatch(setAddressValid(false));
//     }
//     dispatch(setAddress(values));
//   }, [values, isValid, dirty, dispatch]);

//   return (
//     <Box maxWidth="md" sx={{ margin: "auto", py: 4 }}>
//       <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//         <Box display="flex" alignItems="center" mb={3}>
//           <LocationOnIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
//           <Typography variant="h4" component="h1">
//             Shipping Address
//           </Typography>
//         </Box>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           // onSubmit={(values, { setSubmitting }) => {
//           //   console.log(values, "onhandlesubmit");
//           //   dispatch(setAddress(values));
//           //   setSubmitting(false);
//           // }}
//           innerRef={formRef}
//         >
//           {({ errors, touched, isValid, dirty, handleSubmit }) => {
//             return (
//               <Form
//                 onChange={() => handleFormChange(values, { isValid, dirty })}
//               >
//                 <Grid container spacing={3}>
//                   {Object.keys(initialValues).map((field) => (
//                     <Grid
//                       item
//                       xs={12}
//                       sm={
//                         field === "streetAddress" || field === "landmark"
//                           ? 12
//                           : 6
//                       }
//                       key={field}
//                     >
//                       <Field
//                         as={TextField}
//                         fullWidth
//                         label={
//                           field.charAt(0).toUpperCase() +
//                           field.slice(1).replace(/([A-Z])/g, " $1")
//                         }
//                         name={field}
//                         error={touched[field] && errors[field]}
//                         helperText={touched[field] && errors[field]}
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                         required={field !== "landmark"}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//                 <Box
//                   sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
//                 >
//                   {/* <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     disabled={!(isValid && dirty)}
//                     onClick={handleSubmit}
//                     startIcon={<SaveIcon />}
//                   >
//                     Save
//                   </Button> */}
//                 </Box>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ mt: 3, mb: 2 }}
//                 >
//                   We will only contact you if there are questions about your
//                   order.
//                 </Typography>
//               </Form>
//             );
//           }}
//         </Formik>
//       </Paper>
//     </Box>
//   );
// };

const FormContent = () => {
  const { values, errors, touched, isValid, dirty } = useFormikContext();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isValid && dirty) {
      dispatch(setAddressValid(true));
      dispatch(setAddress(values));
    } else {
      dispatch(setAddressValid(false));
    }
  }, [values, isValid, dirty, dispatch]);

  return (
    <Form>
      <Grid container spacing={3}>
        {Object.keys(values).map((field) => (
          <Grid
            item
            xs={12}
            sm={field === "streetAddress" || field === "landmark" ? 12 : 6}
            key={field}
          >
            <Field
              as={TextField}
              fullWidth
              label={
                field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")
              }
              name={field}
              error={touched[field] && errors[field]}
              helperText={touched[field] && errors[field]}
              InputProps={{
                sx: { borderRadius: 2 },
              }}
              required={field !== "landmark"}
            />
          </Grid>
        ))}
      </Grid>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 2 }}>
        We will only contact you if there are questions about your order.
      </Typography>
    </Form>
  );
};

const AddressForm = ({ formRef }) => {
  const dispatch = useDispatch();

  return (
    <Box maxWidth="md" sx={{ margin: "auto", py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <LocationOnIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography sx={headingStyle} variant="h4" component="h1">
            Shipping Address
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          innerRef={formRef}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(setAddress(values));
            dispatch(setAddressValid(true));
            setSubmitting(false);
          }}
        >
          <FormContent />
        </Formik>
      </Paper>
    </Box>
  );
};

export default AddressForm;
