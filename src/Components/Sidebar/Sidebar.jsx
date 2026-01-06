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
  { text: 'Approval Requests', icon: <PeopleIcon />, path: '/approval' },
  { text: 'Manage Departments', icon: <BusinessIcon />, path: '/department' },
  { text: 'Manage Employees', icon: <EventIcon />, path: '/employee' },
  { text: 'Leave Requests', icon: <AssignmentIcon />, path: '/leave' },
  { text: 'On Duty Requests', icon: <AssessmentIcon />, path: '/onduty' },
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
          backgroundColor: theme.palette.primary.dark,
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
