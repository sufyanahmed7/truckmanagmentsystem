
"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Skeleton,
  TextField,
  Box,
  Button,
  useTheme,
} from "@mui/material";

const avatarColors = ["lightblue", "lightgreen", "orange", "red", "brown", "pink"];

interface FieldSchema {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "enum" | "date";
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
}

interface GenericEntity {
  _id: string;
  [key: string]: any;
}

interface ListingProps {
  entities: GenericEntity[];
  schema: FieldSchema[];
  selectedEntity: number | null;
  setSelectedEntity: (index: number | null) => void;
  onSelect: (index: number) => void;
  search: string;
  setSearch: (value: string) => void;
  handleAddBtn: () => void;
}

const Listing: React.FC<ListingProps> = ({
  entities = [],
  schema,
  selectedEntity,
  setSelectedEntity,
  onSelect,
  search,
  setSearch,
  handleAddBtn,
}) => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [entities]);

  const primaryField = schema[0]?.name || "name";
  const secondaryField = schema[1]?.name || null;
  const searchableFields = schema.slice(0, 2).map((field) => field.name);

  const filteredEntities = entities.filter((entity) =>
    searchableFields.some((field) =>
      entity[field]?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{ maxHeight: "100vh", overflow: "hidden" }}
    >
      {/* Add New button */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          size="small"
          sx={{ 
            minWidth: "95%", 
            mb: 1,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            }
          }}
          onClick={handleAddBtn}
        >
          Add New
        </Button>
      </Box>

      {/* Search bar */}
      <Box display="flex" justifyContent="center">
        <TextField
          size="small"
          label={`Search ${schema[0]?.label || "Entities"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: "95%" }}
        />
      </Box>

      {/* Entity list */}
      <Box flex={1} sx={{ overflowY: "auto", mt: 2, px: 1 }}>
        {loading ? (
          <List>
            {[...Array(5)].map((_, i) => (
              <ListItem key={i}>
                <ListItemIcon>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton width="60%" />}
                  secondary={<Skeleton width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : filteredEntities.length === 0 ? (
          <Typography margin={2} textAlign="center" color="text.secondary">
            No {schema[0]?.label || "Entities"} Found
          </Typography>
        ) : (
          <List>
            {filteredEntities.map((entity, filteredIndex) => {
              const originalIndex = entities.findIndex((e) => e === entity);
              const uniqueKey = `item-${originalIndex}-${JSON.stringify(entity)
                .substring(0, 50)
                .replace(/[^a-zA-Z0-9-]/g, "-")}`;

              return (
                <ListItem
                  key={uniqueKey}
                  onClick={() => {
                    setSelectedEntity(originalIndex);
                    onSelect(originalIndex);
                  }}
                  sx={{
                    bgcolor: selectedEntity === originalIndex 
                      ? theme.palette.mode === 'dark' 
                        ? 'rgba(124, 140, 252, 0.15)' 
                        : "#f7f7f7"
                      : "transparent",
                    cursor: "pointer",
                    borderRadius: 1,
                    mb: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(124, 140, 252, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  {/* Avatar */}
                  <ListItemIcon>
                    <Avatar
                      sx={{ bgcolor: avatarColors[originalIndex % avatarColors.length] }}
                    >
                      {entity[primaryField]?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                  </ListItemIcon>

                  {/* Text */}
                  <ListItemText
                    primary={entity[primaryField] || "Unknown"}
                    secondary={secondaryField ? entity[secondaryField] : null}
                    primaryTypographyProps={{
                      color: 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Listing;