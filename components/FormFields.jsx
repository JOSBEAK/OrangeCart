import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { Form, Field } from "formik";
import { Grid, TextField, Typography } from "@mui/material";
import { setAddressValid, setAddress } from "@/lib/slices/cartSlice";

const FormFields = () => {
  const { values, errors, touched, isValid, dirty } = useFormikContext();
  const dispatch = useDispatch();

  useEffect(() => {
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
              InputProps={{ sx: { borderRadius: 2 } }}
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

export default FormFields;
