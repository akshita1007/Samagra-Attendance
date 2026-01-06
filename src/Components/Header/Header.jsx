import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";

import {
  Menu as MenuIcon,
  NavigateNext as NavigateNextIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const Header = ({
  drawerWidth,
  toggleDrawer,
  handleRefreshDashboard,
  handleOpenReportDialog,
  anchorEl,
  menuOpen,
  handleProfileMenuOpen,
  handleMenuClose,
  handleLogout,
  theme,
}) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar>
        {/* MOBILE MENU */}
        <IconButton
          color="inherit"
          onClick={toggleDrawer}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* BREADCRUMB */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link underline="hover" color="inherit">
            <HomeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Typography>Dashboard</Typography>
        </Breadcrumbs>

        <Box sx={{ flexGrow: 1 }} />

        {/* ACTION BUTTONS */}
        <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshDashboard}
            sx={{ textTransform: "none" }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleOpenReportDialog}
            sx={{
              textTransform: "none",
              background:
                `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              boxShadow: `0 3px 5px 2px ${theme.palette.primary.light}40`,
            }}
          >
            Generate Report
          </Button>
        </Box>

        {/* PROFILE */}
        <IconButton color="inherit" onClick={handleProfileMenuOpen}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuClose()}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
