"use client";

import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import Form from "./Form";
import Listing from "./Listing";
import DisplayDetails from "./DisplayDetails";
import HeaderButtons from "./HeaderButtons";
import { useState, useEffect } from "react";
import { dataSchema } from "../validation/dataSchema";
import { itemValidationSchema } from "../validation/itemValidation";

type FieldSchema = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "enum" | "date";
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
};

export default function Main({
  schema,
  hookName,
  initialState,
  entityType,
}: {
  schema: FieldSchema[];
  hookName: () => any;
  initialState: any;
  entityType: "company" | "item";
}) {
  const {
    formList,
    saveEntry,
    deleteEntry,
    error,
    setError,
    selectedIndex,
    setSelectedIndex,
    loading,
  } = hookName();

  const [formData, setFormData] = useState<any>({ ...initialState });
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validationSchema =
    entityType === "company" ? dataSchema : itemValidationSchema;

  useEffect(() => {
    if (selectedIndex !== null && formList[selectedIndex]) {
      setFormData({ ...formList[selectedIndex] });
    }
  }, [selectedIndex, formList]);

  const handleSelect = (i: number) => {
    setSelectedIndex(i);
    setMode("view");
  };

  const handleAdd = () => {
    setFormData({ ...initialState });
    setSelectedIndex(null);
    setMode("edit");
  };

  const handleEdit = () => setMode("edit");

  const handleDelete = async () => {
    if (selectedIndex !== null) {
      const entity = formList[selectedIndex];
      if (entity._id) await deleteEntry(entity._id);
      setFormData({ ...initialState });
      setSelectedIndex(null);
      setMode("view");
    }
  };

  const handleCancel = () => {
    setMode("view");
    setError({});
  };

  const handleSave = async () => {
    if (!validationSchema)
      return console.error("Validation schema not found!");
    try {
      await validationSchema.validate(formData, {
        abortEarly: false,
        context: { formList, selectedCompany: selectedIndex },
      });
      const success = await saveEntry(formData);
      if (success) {
        setMode("view");
        setError({});
      }
    } catch (err: any) {
      if (err.inner) {
        const formattedErrors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          if (e.path) formattedErrors[e.path] = e.message;
        });
        setError(formattedErrors);
      } else {
        setError({ general: err.message || "Validation failed" });
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Box 
      display="flex" 
      bgcolor={theme.palette.background.default}
      minHeight="100vh" 
      width="100%"
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        width="100%"
        bgcolor={theme.palette.background.paper}
        borderRadius={1}
        boxShadow={theme.palette.mode === 'dark' ? 4 : 1}
        overflow="hidden"
      >
        {/* Sidebar Listing */}
        <Box
          width={isMobile ? "100%" : "30%"}
          minWidth={isMobile ? "100%" : 250}
          borderBottom={isMobile ? `1px solid ${theme.palette.divider}` : "none"}
          sx={{ 
            overflowY: "auto", 
            maxHeight: "100vh",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Listing
            entities={formList}
            schema={schema}
            selectedEntity={selectedIndex}
            setSelectedEntity={setSelectedIndex}
            onSelect={handleSelect}
            search={search}
            setSearch={setSearch}
            handleAddBtn={handleAdd}
          />
        </Box>

        {!isMobile && <Divider orientation="vertical" flexItem />}

        {/* Details / Form */}
        <Box
          width={isMobile ? "100%" : "70%"}
          minWidth={0}
          p={2}
          sx={{ 
            overflowY: "auto", 
            maxHeight: "100vh",
            bgcolor: theme.palette.background.paper,
          }}
        >
          {mode === "edit" ? (
            <Form
              schema={schema}
              formData={formData}
              setFormData={setFormData}
              handleSave={handleSave}
              handleCancel={handleCancel}
              error={error}
              formList={formList}
              selectedIndex={selectedIndex}
              setError={setError}
            />
          ) : (
            <HeaderButtons
              handleEditBtn={handleEdit}
              handleDeleteBtn={handleDelete}
              selectedEntity={selectedIndex}
            />
          )}
          {mode !== "edit" && (
            <DisplayDetails
              schema={schema}
              entityType={entityType}
              formData={formData ?? {}}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}