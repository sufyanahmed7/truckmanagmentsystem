"use client";

import React, { useState, useMemo, useEffect } from "react";
import { IconButton, Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import JobModal from "./JobModal";
import JobList from "./JobList";
import { GET_JOBS_DATA_QUERY } from "../graphql/jobQueries";
import { CREATE_JOB_MUTATION, UPDATE_JOB_MUTATION, DELETE_JOB_MUTATION } from "../graphql/jobMutations";
import { JOB_ADDED_SUBSCRIPTION, JOB_UPDATED_SUBSCRIPTION, JOB_DELETED_SUBSCRIPTION } from "../graphql/jobSubscriptions";

interface JobItem {
  itemId?: { name?: string; price?: number; _id?: string };
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
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  itemsList: string;
}

const JobClient: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const { data, loading, subscribeToMore } = useQuery(GET_JOBS_DATA_QUERY);

  const [createJob] = useMutation(CREATE_JOB_MUTATION);
  const [updateJob] = useMutation(UPDATE_JOB_MUTATION);
  const [deleteJob] = useMutation(DELETE_JOB_MUTATION);

  useEffect(() => {
    if (!subscribeToMore) return;

    const unsubAdded = subscribeToMore({
      document: JOB_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newJob = subscriptionData.data.jobAddedSubscription;
        return { ...prev, jobs: [...prev.jobs, newJob] };
      },
    });

    const unsubUpdated = subscribeToMore({
      document: JOB_UPDATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedJob = subscriptionData.data.jobUpdatedSubscription;
        return {
          ...prev,
          jobs: prev.jobs.map((j: Job) => (j._id === updatedJob._id ? updatedJob : j)),
        };
      },
    });

    const unsubDeleted = subscribeToMore({
      document: JOB_DELETED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const deletedId = subscriptionData.data.jobDeletedSubscription;
        return {
          ...prev,
          jobs: prev.jobs.filter((j: Job) => j._id !== deletedId),
        };
      },
    });

    return () => {
      unsubAdded();
      unsubUpdated();
      unsubDeleted();
    };
  }, [subscribeToMore]);

  const contacts = useMemo(() => data?.contacts || [], [data]);
  const items = useMemo(() => data?.items || [], [data]);
  const jobs = useMemo(() => data?.jobs || [], [data]);

  const suppliers = useMemo(
    () =>
      contacts
        .filter((c: any) => c.type === "supplier")
        .map((s: any) => ({
          _id: s._id,
          account: s.account || s.company || `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
        })),
    [contacts]
  );

  const customers = useMemo(
    () =>
      contacts
        .filter((c: any) => c.type === "customer")
        .map((c: any) => ({
          _id: c._id,
          account: c.account || c.company || `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(),
        })),
    [contacts]
  );

  const handleSave = async (values: any) => {
    try {
      await createJob({
        variables: {
          input: {
            reference: values.reference,
            supplier: values.supplier,
            customer: values.customer,
            date: values.date,
            items: values.items.map((i: any) => ({
              itemId: i.itemId,
              price: Number(i.price),
              quantity: Number(i.quantity),
            })),
          },
        },
      });
      handleCloseModal();
    } catch (err: any) {
      console.error("Error creating job:", err);
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || "An error occurred while creating the job";
      throw new Error(errorMessage);
    }
  };

  const handleUpdate = async (values: any) => {
    if (!jobToEdit?._id) return;
    try {
      await updateJob({
        variables: {
          id: jobToEdit._id,
          input: {
            reference: values.reference,
            supplier: values.supplier,
            customer: values.customer,
            date: values.date,
            items: values.items.map((i: any) => ({
              itemId: i.itemId,
              price: Number(i.price),
              quantity: Number(i.quantity),
            })),
          },
        },
      });
      handleCloseModal();
    } catch (err: any) {
      console.error("Error updating job:", err);
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || "An error occurred while updating the job";
      throw new Error(errorMessage);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob({ variables: { id: jobId } });
    } catch (error: any) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEdit = (job: FormattedJob) => {
    const originalJob = jobs.find((j: Job) => j._id === job.jobId);
    if (!originalJob) return;
    setOpen(false);
    setJobToEdit(null);
    setTimeout(() => {
      setJobToEdit(originalJob);
      setModalKey((prev) => prev + 1);
      setOpen(true);
    }, 100);
  };

  const handleAddNew = () => {
    setJobToEdit(null);
    setModalKey((prev) => prev + 1);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setJobToEdit(null);
    setModalKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 1, 
            pl: 6, 
            pt: 1, 
            pb: 1, 
            pr: 6, 
            backgroundColor: theme.palette.background.paper, 
            borderBottom: "1px solid", 
            borderColor: theme.palette.divider 
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
            Jobs Management
          </Typography>
          <IconButton
            color="primary"
            onClick={handleAddNew}
            sx={{ 
              backgroundColor: theme.palette.primary.main, 
              color: "white", 
              width: 36, 
              height: 36, 
              "&:hover": { 
                backgroundColor: theme.palette.primary.dark 
              } 
            }}
          >
            <Add fontSize="medium" />
          </IconButton>
        </Box>

        <JobList jobs={jobs} onDelete={handleDelete} onEdit={handleEdit} />

        <JobModal
          key={modalKey}
          open={open}
          onClose={handleCloseModal}
          onSave={jobToEdit ? handleUpdate : handleSave}
          initialData={jobToEdit}
          suppliers={suppliers}
          customers={customers}
          items={items}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default JobClient;