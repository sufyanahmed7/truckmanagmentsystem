import * as Yup from "yup";

export const jobValidationSchema = Yup.object().shape({
  reference: Yup.string()
    .max(20, "Reference must be at most 20 characters")
    .required("Reference is required"),

  date: Yup.date()
    .typeError("Invalid date")
    .required("Date is required"),

  supplier: Yup.string().required("Supplier is required"),
  customer: Yup.string().required("Customer is required"),

  items: Yup.array()
    .of(
      Yup.object().shape({
        itemId: Yup.string().required("Item is required"),
        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        price: Yup.number()
          .typeError("Price must be a number")
          .min(1, "Price must be at least 1")
          .required("Price is required"),
      })
    )
    .min(1, "At least one item is required"),
});
