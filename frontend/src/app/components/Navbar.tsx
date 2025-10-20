// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useThemeMode } from "./ThemeProvider";

export default function Navbar() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  // Mobile nav menu
  const [navAnchorEl, setNavAnchorEl] = useState<null | HTMLElement>(null);
  const navMenuOpen = Boolean(navAnchorEl);

  // Avatar menu
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null);
  const avatarMenuOpen = Boolean(avatarAnchorEl);

  const handleNavMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNavAnchorEl(event.currentTarget);
  };
  const handleNavMenuClose = () => setNavAnchorEl(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => setAvatarAnchorEl(null);

  const navLinks = [
    { name: "Contacts", path: "/contacts" },
    { name: "Items", path: "/items" },
    { name: "Jobs", path: "/jobs" },
  ];

  const getLinkStyle = (path: string) => ({
    textDecoration: "none",
    color: pathname === path 
      ? theme.palette.mode === 'dark' ? "#fff" : "#fff"
      : theme.palette.mode === 'dark' ? "#B0BEC5" : "#B0BEC5",
    fontWeight: pathname === path ? "bold" : "normal",
    borderBottom: pathname === path 
      ? `2px solid ${theme.palette.mode === 'dark' ? '#7c8cfc' : '#fff'}` 
      : "none",
    borderRadius: 0,
    px: 1,
    py: 0.5,
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    "&:hover": {
      color: theme.palette.mode === 'dark' ? '#7c8cfc' : '#fff',
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(124, 140, 252, 0.1)' 
        : 'rgba(255, 255, 255, 0.1)',
    },
  });

  const getMobileLinkStyle = (path: string) => ({
    textDecoration: "none",
    color: pathname === path ? theme.palette.primary.main : "inherit",
    fontWeight: pathname === path ? "bold" : "normal",
    backgroundColor: pathname === path 
      ? theme.palette.mode === 'dark' 
        ? 'rgba(124, 140, 252, 0.1)' 
        : 'rgba(25, 118, 210, 0.1)'
      : 'transparent',
    borderLeft: pathname === path 
      ? `3px solid ${theme.palette.primary.main}` 
      : 'none',
    pl: pathname === path ? 1.5 : 2,
  });

  const navBarBg = theme.palette.mode === 'dark' 
    ? 'rgba(10, 10, 10, 0.95)' 
    : '#00263A';

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: navBarBg,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0, 0, 0, 0.5)'
          : '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" passHref>
            <Box
              component="img"
              src="/logo.avif"
              alt="Logo"
              sx={{ 
                height: { xs: 28, sm: 32, md: 36 }, 
                cursor: "pointer",
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Link>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1.5, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Button
                key={link.name}
                color="inherit"
                component={Link}
                href={link.path}
                sx={getLinkStyle(link.path)}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* User section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton 
                onClick={toggleTheme} 
                color="inherit"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(124, 140, 252, 0.1)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {isLoading ? (
              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                Loading...
              </Typography>
            ) : user ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontWeight: 500, 
                    display: { xs: "none", sm: "block" },
                    color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
                  }}
                >
                  {user.name?.split("@")[0]}
                </Typography>

                {/* Avatar clickable */}
                <Avatar
                  alt={user.name || ""}
                  src={user.picture || ""}
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    cursor: "pointer",
                    border: `2px solid ${theme.palette.mode === 'dark' ? '#7c8cfc' : '#fff'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 0 20px rgba(124, 140, 252, 0.5)'
                        : '0 0 20px rgba(255, 255, 255, 0.5)',
                    },
                  }}
                  onClick={handleAvatarClick}
                />

                {/* Avatar menu */}
                <Menu
                  anchorEl={avatarAnchorEl}
                  open={avatarMenuOpen}
                  onClose={handleAvatarClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                        : '0 8px 32px rgba(0, 0, 0, 0.15)',
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                >
                  <MenuItem 
                    onClick={handleAvatarClose} 
                    component={Link} 
                    href="/profile"
                    sx={{
                      py: 1.5,
                      px: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(124, 140, 252, 0.1)'
                          : 'rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Profile
                    </Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleAvatarClose} 
                    component="a" 
                    href="/api/auth/logout"
                    sx={{
                      py: 1.5,
                      px: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        color: '#f44336',
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.mode === 'dark' ? '#B0BEC5' : '#fff',
                }}
              >
                Guest
              </Typography>
            )}

            {/* Mobile menu */}
            <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
              <IconButton 
                size="large" 
                edge="end" 
                color="inherit" 
                onClick={handleNavMenuClick}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(124, 140, 252, 0.1)' 
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu 
                anchorEl={navAnchorEl} 
                open={navMenuOpen} 
                onClose={handleNavMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                      : '0 8px 32px rgba(0, 0, 0, 0.15)',
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              >
                {navLinks.map((link) => (
                  <MenuItem
                    key={link.name}
                    onClick={handleNavMenuClose}
                    component={Link}
                    href={link.path}
                    sx={getMobileLinkStyle(link.path)}
                  >
                    <Typography variant="body2" fontWeight={pathname === link.path ? 600 : 400}>
                      {link.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}