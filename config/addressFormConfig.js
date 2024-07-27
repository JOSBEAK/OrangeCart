import * as Yup from "yup";

export const initialValues = {
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

export const validationSchema = Yup.object().shape({
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
