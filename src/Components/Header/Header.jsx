// import React from 'react';
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Box,
//   Avatar,
//   Badge,
//   Menu,
//   MenuItem,
//   Tooltip,
//   useTheme,
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Notifications as NotificationsIcon,
//   AccountCircle,
// } from '@mui/icons-material';

// const Header = ({ toggleDrawer, isDrawerOpen }) => {
//   const theme = useTheme();
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleNotificationMenuOpen = (event) => {
//     setNotificationAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setNotificationAnchorEl(null);
//   };

//   const notifications = [
//     { id: 1, text: '1 pending leave request needs approval' },
//     { id: 2, text: '1 on-duty request pending' },
//     { id: 3, text: '1 employee absent today' },
//   ];

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         zIndex: theme.zIndex.drawer + 1,
//         backgroundColor: theme.palette.background.paper,
//         color: theme.palette.text.primary,
//         boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
//         ml: isDrawerOpen ? '240px' : 0,
//         width: isDrawerOpen ? 'calc(100% - 240px)' : '100%',
//         transition: theme.transitions.create(['width', 'margin'], {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//       }}
//     >
//       <Toolbar>
//         <IconButton
//           color="inherit"
//           aria-label="open drawer"
//           onClick={toggleDrawer}
//           edge="start"
//           sx={{ mr: 2 }}
//         >
//           <MenuIcon />
//         </IconButton>

//         <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//           Admin Dashboard
//         </Typography>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Tooltip title="Notifications">
//             <IconButton
//               size="large"
//               aria-label="show notifications"
//               color="inherit"
//               onClick={handleNotificationMenuOpen}
//             >
//               <Badge badgeContent={notifications.length} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//           </Tooltip>

//           <Menu
//             anchorEl={notificationAnchorEl}
//             open={Boolean(notificationAnchorEl)}
//             onClose={handleMenuClose}
//             PaperProps={{
//               sx: {
//                 width: 320,
//                 maxHeight: 400,
//                 mt: 1.5,
//               },
//             }}
//           >
//             <Typography sx={{ p: 2, fontWeight: 600 }}>Notifications</Typography>
//             {notifications.map((notification) => (
//               <MenuItem key={notification.id} onClick={handleMenuClose}>
//                 <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
//                   <NotificationsIcon color="action" fontSize="small" />
//                   <Typography variant="body2">{notification.text}</Typography>
//                 </Box>
//               </MenuItem>
//             ))}
//           </Menu>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Avatar
//               sx={{
//                 width: 40,
//                 height: 40,
//                 bgcolor: theme.palette.primary.main,
//                 cursor: 'pointer',
//               }}
//               onClick={handleProfileMenuOpen}
//             >
//               <AccountCircle />
//             </Avatar>
//             <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
//               Admin User
//             </Typography>
//           </Box>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//             <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
//             <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
//           </Menu>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


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
                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
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
