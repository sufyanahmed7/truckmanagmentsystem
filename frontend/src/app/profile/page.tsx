// app/profile/page.tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  Container,
  Paper,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Verified, Mail, Person, Key, Shield } from "@mui/icons-material";

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <Skeleton variant="circular" width={140} height={140} />
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 4 }} />
          </Box>
        </Container>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Shield sx={{ fontSize: 64, color: "#667eea", mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Authentication Required
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please login to view your profile
            </Typography>
          </Paper>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          {/* Profile Header Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "visible",
              position: "relative",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              mb: 3,
            }}
          >
            {/* Decorative Background */}
            <Box
              sx={{
                height: 120,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px 16px 0 0",
              }}
            />

            {/* Avatar Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: -8,
                px: 3,
                pb: 3,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mb: 2,
                }}
              >
                <Avatar
                  src={user.picture || ""}
                  alt={user.name || ""}
                  sx={{
                    width: 140,
                    height: 140,
                    border: "6px solid white",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  }}
                />
                {user.email_verified && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "#4caf50",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Verified sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                )}
              </Box>

              <Typography variant="h4" fontWeight={700} gutterBottom>
                {user.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Mail sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>

              {user.email_verified && (
                <Chip
                  label="Verified Account"
                  color="success"
                  size="small"
                  icon={<Verified />}
                  sx={{
                    fontWeight: 600,
                    px: 1,
                  }}
                />
              )}
            </Box>
          </Card>

          {/* Info Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {/* Nickname Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Person sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      NICKNAME
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {user.nickname || "Not set"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Email Verified Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: user.email_verified
                        ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
                        : "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Verified sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      EMAIL STATUS
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {user.email_verified ? "Verified" : "Not Verified"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* User ID Card - Full Width */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              mt: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Key sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom>
                    USER ID
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                      backgroundColor: "#f5f5f5",
                      p: 1.5,
                      borderRadius: 1,
                      mt: 1,
                    }}
                  >
                    {user.sub}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}