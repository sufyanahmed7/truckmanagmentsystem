import * as yup from "yup";

export const itemValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(20, "Name must be at most 20 characters")
    .matches(/^[a-zA-Z0-9 ]+$/, "Name must be alphanumeric"),

  code: yup
    .string()
    .required("Code is required")
    .max(20, "Code must be at most 20 characters")
    .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric"),

  available: yup
    .string()
    .required("Available status is required")
    .oneOf(["yes", "no"], "Available must be either 'yes' or 'no'"),

  weight: yup
    .number()
    .typeError("Weight must be a number")
    .required("Weight is required")
    .min(0.1, "Weight must be at least 0.1 kg")
    .max(5000, "Weight must be at most 5000 kg"),
});
