"use client";
import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
  ColDef,
  GetContextMenuItemsParams,
} from "ag-grid-community";
import { ContextMenuModule } from "ag-grid-enterprise";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule, ContextMenuModule]);

interface JobItem {
  itemId?: { name?: string; price?: number };
  price?: number;
  quantity?: number;
}

interface Job {
  _id: string;
  reference?: string;
  date?: string | Date;
  supplier?: { _id?: string; account?: string; firstName?: string; lastName?: string };
  customer?: { _id?: string; account?: string; firstName?: string; lastName?: string };
  items?: JobItem[];
}

interface FormattedJob {
  jobId: string;
  reference?: string;
  jobDate: string;
  supplierName: string;
  customerName: string;
  itemsCount: number;
  totalPrice: number;
  processedItems: { name: string; price: number; quantity: number }[];
}

interface JobListProps {
  jobs: Job[];
  onDelete: (jobId: string) => Promise<void>;
  onEdit: (job: FormattedJob) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onDelete, onEdit }) => {
  const theme = useTheme();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const thinnerRowsTheme = {
    "--ag-row-height": "32px",
  };

  // format incoming jobs
  const formattedJobs: FormattedJob[] = useMemo(() => {
    return jobs.map((job) => {
      const processedItems =
        job.items?.map((item) => ({
          name: item.itemId?.name || "Unknown",
          price: item.price ?? item.itemId?.price ?? 0,
          quantity: item.quantity ?? 1,
        })) || [];

      const totalPrice = processedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      let jobDateStr = "";
      if (job.date) {
        try {
          const dateObj = new Date(job.date);
          if (!isNaN(dateObj.getTime())) {
            jobDateStr = dateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          }
        } catch {
          jobDateStr = "Invalid Date";
        }
      }

      return {
        jobId: job._id,
        reference: job.reference ?? "",
        jobDate: jobDateStr,
        supplierName:
          job.supplier?.account ||
          `${job.supplier?.firstName ?? ""} ${job.supplier?.lastName ?? ""}`.trim() ||
          "Unknown",
        customerName:
          job.customer?.account ||
          `${job.customer?.firstName ?? ""} ${job.customer?.lastName ?? ""}`.trim() ||
          "Unknown",
        itemsCount: processedItems.length,
        totalPrice,
        processedItems,
      };
    });
  }, [jobs]);

  // custom cell renderer for items
  const ItemsDetailCellRenderer: React.FC<ICellRendererParams<FormattedJob>> = (params) => {
    const items = params.data?.processedItems || [];
    if (items.length === 0) return <span>No items</span>;
    
    const isDark = theme.palette.mode === 'dark';
    
    return (
      <div style={{ 
        padding: 5, 
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9f9f9', 
        borderRadius: 4 
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 4 }}>Name</th>
              <th style={{ textAlign: "center", padding: 4 }}>Qty</th>
              <th style={{ textAlign: "right", padding: 4 }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: 4 }}>{item.name}</td>
                <td style={{ textAlign: "center", padding: 4 }}>{item.quantity}</td>
                <td style={{ textAlign: "right", padding: 4 }}>${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // delete handling
  const openDeleteDialog = (jobId: string) => {
    setJobIdToDelete(jobId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    if (!deleting) {
      setOpenConfirmDialog(false);
      setJobIdToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!jobIdToDelete) return;
    setDeleting(true);
    try {
      await onDelete(jobIdToDelete);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
      handleCloseConfirmDialog();
    }
  };

  // right-click menu
  const getContextMenuItems = (params: GetContextMenuItemsParams) => {
    const data = params.node?.data as FormattedJob;
    if (!data) return [];
    return [
      {
        name: "Edit",
        action: () => onEdit(data),
      },
      {
        name: "Delete",
        action: () => openDeleteDialog(data.jobId),
      },
      "separator",
      "copy",
    ];
  };

  const columns: ColDef<FormattedJob>[] = [
    { headerName: "Job ID", field: "jobId", flex: 0.8, filter: true },
    { headerName: "Reference", field: "reference", flex: 1, filter: true },
    { headerName: "Supplier", field: "supplierName", flex: 1.2, filter: true },
    { headerName: "Customer", field: "customerName", flex: 1.2, filter: true },
    {
      headerName: "Date",
      field: "jobDate",
      flex: 1,
      filter: true,
      sort: "desc",
      minWidth: 120,
    },
    {
      headerName: "Items Details",
      field: "processedItems",
      flex: 2.5,
      cellRenderer: ItemsDetailCellRenderer,
      autoHeight: true,
      wrapText: true,
    },
    {
      headerName: "Items Count",
      field: "itemsCount",
      flex: 0.8,
      filter: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Total Price",
      field: "totalPrice",
      flex: 1,
      filter: true,
      valueFormatter: (params) => `$${(params.value ?? 0).toFixed(2)}`,
      cellStyle: { textAlign: "right", fontWeight: "bold" },
    },
  ];

  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ px: 6, pt: 2 }}>
      <div
        className={isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz"}
        style={{ ...thinnerRowsTheme, height: 600, width: "100%" }}
      >
        <AgGridReact<FormattedJob>
          rowData={formattedJobs}
          columnDefs={columns}
          defaultColDef={{ sortable: true, resizable: true, minWidth: 100 }}
          pagination
          paginationPageSize={20}
          animateRows
          enableCellTextSelection
          getContextMenuItems={getContextMenuItems}
        />
      </div>

      {/* Delete confirmation dialog */}
      <Dialog 
        open={openConfirmDialog} 
        onClose={handleCloseConfirmDialog}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle>
          <span style={{ color: theme.palette.text.primary }}>Confirm Deletion</span>
        </DialogTitle>
        <DialogContent>
          {deleting ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DialogContentText sx={{ color: theme.palette.text.secondary }}>
              Are you sure you want to delete this job? This action cannot be undone.
            </DialogContentText>
          )}
        </DialogContent>
        {!deleting && (
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete} autoFocus color="error">
              Delete
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default JobList;