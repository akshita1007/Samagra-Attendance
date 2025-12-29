// import React, { useState } from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Tooltip,
//   Divider,
//   Box,
//   Typography,
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   Business as BusinessIcon,
//   Assignment as AssignmentIcon,
//   Event as EventIcon,
//   Assessment as AssessmentIcon,
//   Settings as SettingsIcon,
//   Menu as MenuIcon,
//   ChevronLeft as ChevronLeftIcon,
// } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// const menuItems = [
//   { text: 'Dashboard', icon: <DashboardIcon />, path:'/admin', active: true },
//   { text: 'Approval Requests', icon: <PeopleIcon />, active: false },
//   { text: 'Manage Departments', icon: <BusinessIcon />, active: false },
//   { text: 'Manage Employees', icon: <EventIcon />, path: '/employee', active: false },
//   { text: 'Leave Requests', icon: <AssignmentIcon />, active: false },
//   { text: 'On Duty Requests', icon: <AssessmentIcon />, active: false },
//   { text: 'Settings', icon: <SettingsIcon />, active: false },
// ];

// const Sidebar = ({ isOpen, toggleDrawer }) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [activeItem, setActiveItem] = useState(0);

//   const handleItemClick = (index, path) => {
//     setActiveItem(index);

//     if (path) {
//       navigate(path);
//     }
//   };

//   const drawerWidth = isOpen ? 240 : 64;

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           transition: theme.transitions.create('width', {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//           overflowX: 'hidden',
//           borderRight: `1px solid ${theme.palette.divider}`,
//           backgroundColor: '#052b69ff',
//         },
//       }}
//       open={isOpen}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: isOpen ? 'space-between' : 'center',
//           padding: theme.spacing(2),
//           height: 64,
//           borderBottom: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         {isOpen && (
//           <Typography variant="h6" color="white" fontWeight="bold">
//             Admin Panel
//           </Typography>
//         )}
//         <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
//           {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
//         </IconButton>
//       </Box>

//       <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

//       <List sx={{ pt: 2 }}>
//         {menuItems.map((item, index) => (
//           <Tooltip
//             key={index}
//             title={!isOpen ? item.text : ''}
//             placement="right"
//             arrow
//           >
//             <ListItem
//               button
//               selected={activeItem === index}
//               onClick={() => handleItemClick(index, item.path)}
//               sx={{
//                 mx: 1,
//                 borderRadius: 1,
//                 color: 'white',
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: 'rgba(255, 255, 255, 0.08)',
//                 },
//                 '&.Mui-selected': {
//                   backgroundColor: theme.palette.primary.main + '40',
//                   color: 'white',
//                   '&:hover': {
//                     backgroundColor: theme.palette.primary.main + '60',
//                   },
//                 },
//               }}
//             >
//               <ListItemIcon
//                 sx={{
//                   minWidth: 0,
//                   justifyContent: 'center',
//                   mr: isOpen ? 2 : 0,
//                   color: 'white',
//                 }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               {isOpen && <ListItemText primary={item.text} />}
//             </ListItem>
//           </Tooltip>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Approval Requests', icon: <PeopleIcon /> },
  { text: 'Manage Departments', icon: <BusinessIcon /> },
  { text: 'Manage Employees', icon: <EventIcon />, path: '/employee' },
  { text: 'Leave Requests', icon: <AssignmentIcon /> },
  { text: 'On Duty Requests', icon: <AssessmentIcon /> },
  { text: 'Settings', icon: <SettingsIcon /> },
];

const Sidebar = ({ isOpen, toggleDrawer }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const drawerWidth = isOpen ? 240 : 64;

  const handleNavigate = (path) => {
    if (path) navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: '#052b69ff',
        },
      }}
      open={isOpen}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          padding: theme.spacing(2),
          height: 64,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {isOpen && (
          <Typography variant="h6" color="white" fontWeight="bold">
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
          {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Menu */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Tooltip
              key={index}
              title={!isOpen ? item.text : ''}
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ mx: 1 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 1,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '40',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '60',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      mr: isOpen ? 2 : 0,
                      color: 'white',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
