// 2. Form.tsx - Fixed for dark mode
"use client";

import React from "react";
import { TextField, Box, Button, Stack, MenuItem, useTheme } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";

interface FieldSchema {
  name: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
}

interface FormProps {
  schema: FieldSchema[];
  formData: Record<string, any> | null;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any> | null>>;
  handleSave: () => void | Promise<void>;
  handleCancel: () => void;
  error?: Record<string, string>;
  formList?: any[];
  selectedIndex?: number | null;
  setError?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Form: React.FC<FormProps> = ({
  schema,
  formData,
  setFormData,
  handleSave,
  handleCancel,
  error = {},
  formList = [],
  selectedIndex,
  setError,
}) => {
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : prevData
    );
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prevData) =>
      prevData ? { ...prevData, phone: value } : prevData
    );
  };

  const validateAccount = (value: string) => {
    if (!value || !setError) return;

    const normalizedValue = value.toLowerCase().trim();

    const isDuplicate = formList.some((item, index) => {
      if (selectedIndex !== null && index === selectedIndex) return false;
      return item.account.toLowerCase().trim() === normalizedValue;
    });

    if (isDuplicate) {
      setError(prev => ({ ...prev, account: "Account must be unique" }));
    } else {
      setError((prev) => {
        const copy = { ...(prev || {}) }; 
        delete copy.account;
        return copy;
      });
    }
  };

  const handleAccountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateAccount(e.target.value);
  };

  if (!formData) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      sx={{
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        height: '100%',
      }}
    >
      <Stack spacing={2.5} sx={{ width: '100%', maxWidth: '400px' }}>
        {schema.map((field) => {
          if (field.type === "phone") {
            return (
              <MuiTelInput
                key={field.name}
                label={field.label + (field.required ? ' *' : '')}
                value={formData[field.name] || ""}
                onChange={handlePhoneChange}
                defaultCountry="PK"
                fullWidth
                size="small"
                error={!!error?.[field.name]}
                helperText={error?.[field.name] ?? ""}
                variant="outlined"
              />
            );
          }
          if (field.type === "enum") {
            return (
              <TextField
                key={field.name}
                label={field.label + (field.required ? ' *' : '')}
                select
                size="small"
                value={formData[field.name] || ""}
                onChange={handleChange}
                name={field.name}
                error={!!error?.[field.name]}
                helperText={error?.[field.name] ?? ""}
                fullWidth
                variant="outlined"
              >
                {field.options?.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          const isAccountField = field.name === 'account';

          return (
            <TextField
              key={field.name}
              label={field.label + (field.required ? ' *' : '')}
              type={field.type}
              size="small"
              value={formData[field.name] || ""}
              onChange={handleChange}
              onBlur={isAccountField ? handleAccountBlur : undefined}
              name={field.name}
              error={!!error?.[field.name]}
              helperText={error?.[field.name] ?? ""}
              fullWidth
              variant="outlined"
            />
          );
        })}
      </Stack>

      <Box display="flex" gap={2} justifyContent="flex-end" mt={4} sx={{ width: '100%', maxWidth: '400px' }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{ 
            borderRadius: "8px", 
            width: '100px', 
            borderColor: '#FF0000',
            color: '#FF0000',
            '&:hover': {
              borderColor: '#CC0000',
              backgroundColor: 'rgba(255, 0, 0, 0.04)',
            }
          }}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ 
            borderRadius: "8px", 
            width: '100px', 
            backgroundColor: '#4285F4', 
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#3367D6',
            }
          }}
        >
          SAVE
        </Button>
      </Box>
    </Box>
  );
};

export default Form;