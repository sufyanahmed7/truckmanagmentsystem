"use client";
import Navbar from "./components/Navbar";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function Home() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/api/auth/login";
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <div>{error.message}</div>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="80vh"
          textAlign="center"
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome back, {user.name || user.email}!
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Use the navbar to manage your entities.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
