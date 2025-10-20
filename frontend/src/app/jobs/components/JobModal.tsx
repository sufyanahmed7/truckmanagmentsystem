"use client";

import React, { useMemo, useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { AddCircle, Delete } from "@mui/icons-material";
import { jobValidationSchema } from "../validation/jobValidation";

interface JobItem {
  itemId?: string;
  price?: number;
  quantity?: number;
}

interface Job {
  _id?: string;
  reference?: string;
  date?: Date | string;
  supplier?: { _id?: string; account?: string };
  customer?: { _id?: string; account?: string };
  items?: JobItem[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Contact {
  _id: string;
  account: string;
}

interface Item {
  _id: string;
  name: string;
  price: number;
}

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => Promise<void>;
  suppliers: Contact[];
  customers: Contact[];
  items: Item[];
  initialData?: Job | null;
}

const JobModal: React.FC<JobModalProps> = ({
  open,
  onClose,
  onSave,
  suppliers,
  customers,
  items,
  initialData,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const initialValues = useMemo(() => {
    if (initialData) {
      let dateValue = new Date();
      if (initialData.date) {
        const parsedDate =
          typeof initialData.date === "string"
            ? new Date(initialData.date)
            : initialData.date;
        if (!isNaN(parsedDate.getTime())) dateValue = parsedDate;
      }

      return {
        reference: initialData.reference || "",
        supplier: initialData.supplier?._id || "",
        customer: initialData.customer?._id || "",
        date: dateValue,
        items:
          initialData.items && initialData.items.length > 0
            ? initialData.items.map((item) => ({
                itemId:
                  typeof item.itemId === "string"
                    ? item.itemId
                    : item.itemId?._id || "",
                price: item.price ?? 1,
                quantity: item.quantity ?? 1,
              }))
            : [{ itemId: "", price: 1, quantity: 1 }],
      };
    }

    return {
      reference: "",
      supplier: "",
      customer: "",
      date: new Date(),
      items: [{ itemId: "", price: 1, quantity: 1 }],
    };
  }, [initialData]);

  const formik = useFormik({
    initialValues,
    validationSchema: jobValidationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        setSubmitting(true);
        await onSave(values);
      } catch (error: any) {
        if (error.message && error.message.includes("already exists")) {
          setFieldError("reference", error.message);
        } else {
          console.error("Job save error:", error);
        }
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleClose = useCallback(() => {
    formik.resetForm();
    onClose();
  }, [onClose, formik]);

  const handleItemChange = useCallback(
    (index: number, itemId: string) => {
      formik.setFieldValue(`items[${index}].itemId`, itemId);

      if (itemId) {
        const selectedItem = items.find((i) => i._id === itemId);
        if (selectedItem) {
          formik.setFieldValue(`items[${index}].price`, selectedItem.price ?? 0);
        }
      }
    },
    [items, formik]
  );

  const calculateTotal = useCallback(() => {
    return formik.values.items.reduce((total, item) => {
      const price = parseFloat(String(item.price ?? 0)) || 0;
      const quantity = parseInt(String(item.quantity ?? 0)) || 0;
      return total + price * quantity;
    }, 0);
  }, [formik.values.items]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {initialData ? "Edit Job" : "Add New Job"}
          </Typography>
          {initialData?.userId && (
            <Typography variant="caption" color="text.secondary">
              Job ID: {initialData._id} | Owner: {initialData.userId}
            </Typography>
          )}
        </DialogTitle>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
              <Stack spacing={3}>
                {/* Reference */}
                <TextField
                  fullWidth
                  label="Reference"
                  name="reference"
                  value={formik.values.reference}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.reference && Boolean(formik.errors.reference)
                  }
                  helperText={formik.touched.reference && formik.errors.reference}
                />

                {/* Date */}
                <DatePicker
                  label="Job Date"
                  value={formik.values.date}
                  onChange={(value) => formik.setFieldValue("date", value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText:
                        formik.touched.date && (formik.errors.date as string),
                    },
                  }}
                />

                {/* Supplier */}
                <TextField
                  select
                  fullWidth
                  label="Supplier"
                  name="supplier"
                  value={formik.values.supplier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.supplier && Boolean(formik.errors.supplier)}
                  helperText={formik.touched.supplier && formik.errors.supplier}
                >
                  <MenuItem value="">
                    <em>Select Supplier</em>
                  </MenuItem>
                  {suppliers.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.account}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Customer */}
                <TextField
                  select
                  fullWidth
                  label="Customer"
                  name="customer"
                  value={formik.values.customer}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.customer && Boolean(formik.errors.customer)}
                  helperText={formik.touched.customer && formik.errors.customer}
                >
                  <MenuItem value="">
                    <em>Select Customer</em>
                  </MenuItem>
                  {customers.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.account}
                    </MenuItem>
                  ))}
                </TextField>

                <Divider sx={{ my: 2 }} />

                {/* Job Items */}
                <Typography variant="h6" fontWeight="bold">
                  Job Items
                </Typography>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <Stack spacing={2}>
                      {formik.values.items.map((item, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          {/* Item */}
                          <TextField
                            select
                            label="Item"
                            name={`items[${index}].itemId`}
                            value={formik.values.items[index].itemId ?? ""}
                            onChange={(e) =>
                              handleItemChange(index, e.target.value)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              !!(
                                formik.touched.items?.[index]?.itemId &&
                                formik.errors.items?.[index]?.itemId
                              )
                            }
                            helperText={
                              formik.touched.items?.[index]?.itemId &&
                              (formik.errors.items?.[index]?.itemId as string)
                            }
                            fullWidth
                          >
                            <MenuItem value="">
                              <em>Select Item</em>
                            </MenuItem>
                            {items.map((i) => (
                              <MenuItem key={i._id} value={i._id}>
                                {i.name}
                              </MenuItem>
                            ))}
                          </TextField>

                          {/* Quantity */}
                          <TextField
                            label="Quantity"
                            name={`items[${index}].quantity`}
                            type="number"
                            value={formik.values.items[index].quantity ?? 1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              !!(
                                formik.touched.items?.[index]?.quantity &&
                                formik.errors.items?.[index]?.quantity
                              )
                            }
                            helperText={
                              formik.touched.items?.[index]?.quantity &&
                              (formik.errors.items?.[index]?.quantity as string)
                            }
                            inputProps={{ min: 1 }}
                            sx={{ width: 100 }}
                          />

                          {/* Price */}
                          <TextField
                            label="Price"
                            name={`items[${index}].price`}
                            type="number"
                            value={formik.values.items[index].price ?? 1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              !!(
                                formik.touched.items?.[index]?.price &&
                                formik.errors.items?.[index]?.price
                              )
                            }
                            helperText={
                              formik.touched.items?.[index]?.price &&
                              (formik.errors.items?.[index]?.price as string)
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            sx={{ width: 120 }}
                          />

                          {/* Delete */}
                          {formik.values.items.length > 1 && (
                            <IconButton
                              onClick={() => remove(index)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Stack>
                      ))}

                      <Button
                        startIcon={<AddCircle />}
                        onClick={() =>
                          push({ itemId: "", price: 1, quantity: 1 })
                        }
                        variant="outlined"
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Add Item
                      </Button>
                    </Stack>
                  )}
                </FieldArray>

                {/* Total */}
                <Typography variant="h6" sx={{ textAlign: "right", mt: 2 }}>
                  Total: ${calculateTotal().toFixed(2)}
                </Typography>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || !formik.isValid || !formik.dirty}
                startIcon={
                  submitting ? <CircularProgress size={18} color="inherit" /> : null
                }
              >
                {initialData ? "Update Job" : "Save Job"}
              </Button>
            </DialogActions>
          </form>
        </FormikProvider>
      </Dialog>
    </LocalizationProvider>
  );
};

export default JobModal;
