"use client";

import React from "react";
import { Box, Typography, Divider, useTheme } from "@mui/material";

interface FieldSchema {
  name: string;
  label: string;
  type: string;
}

interface DisplayDetailsProps<T> {
  schema: FieldSchema[];
  formData: T;
  entityType: String;
}

function DisplayDetails<T extends Record<string, any>>({
  schema,
  formData,
  entityType,
}: DisplayDetailsProps<T>) {
  const theme = useTheme();
  
  const hasValues = schema.some(
    (field) => formData[field.name] !== undefined && formData[field.name] !== ""
  );

  if (!hasValues) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80%"
        minHeight="300px"
      >
        <Typography variant="body1" color="text.secondary">
          Please select {entityType} to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth="400px" mx="auto">
      {schema.map((field) => (
        <Box key={field.name}>
          <Typography 
            variant="subtitle2" 
            color="text.primary" 
            fontWeight="bold"
            sx={{ mb: 0.5 }}
          >
            {field.label}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {formData[field.name] !== undefined && formData[field.name] !== ""
              ? String(formData[field.name])
              : "-"}
          </Typography>
          <Divider />
        </Box>
      ))}
    </Box>
  );
}

export default DisplayDetails;