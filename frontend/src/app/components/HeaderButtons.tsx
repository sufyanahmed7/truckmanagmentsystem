"use client";

import React, { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

interface HeaderButtonsProps {
  handleEditBtn: () => void;
  handleDeleteBtn: () => void;
  selectedEntity: any;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({
  handleEditBtn,
  handleDeleteBtn,
  selectedEntity,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const confirmDelete = () => {
    handleDeleteBtn();
    handleCloseDialog();
  };

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
      <Box display="flex" gap={1}>
        {selectedEntity !== null && (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{
                px: 3,
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "8px",
                height: "35px",
              }}
              onClick={handleEditBtn}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{
                px: 3,
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "8px",
                height: "35px",
              }}
              onClick={handleOpenDialog}
            >
              Delete
            </Button>
          </>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeaderButtons;
