import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  LinearProgress,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Link,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  Snackbar,
  Alert,
  Slide,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as DepartmentIcon,
  CheckCircle as PresentIcon,
  EventBusy as LeaveIcon,
  Cancel as AbsentIcon,
  Menu as MenuIcon,
  NavigateNext as NavigateNextIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { DataGrid } from "@mui/x-data-grid";
import moment from 'moment';

import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import PdfReportGenerator from "../../Utils/Reports/PdfReportGenerator";
import ExcelReportGenerator from "../../Utils/Reports/ExcelReportGenerator";
import Header from '../Header/Header';


// Toast context and provider
const ToastContext = React.createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, options = {}) => {
    const {
      type = 'info',
      duration = 5000,
      title,
      position = 'top-right'
    } = options;

    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      duration,
      title,
      position
    };

    setToasts(prev => [...prev, newToast]);

    if (duration !== null) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const getPositionStyle = (position) => {
    const positions = {
      'top-right': { top: 20, right: 20 },
      'top-left': { top: 20, left: 20 },
      'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: 20, right: 20 },
      'bottom-left': { bottom: 20, left: 20 },
      'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)' },
    };
    return positions[position] || positions['top-right'];
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}

      {toasts.map((toast) => {
        const positionStyle = getPositionStyle(toast.position);

        return (
          <Box
            key={toast.id}
            sx={{
              position: 'fixed',
              zIndex: 9999,
              ...positionStyle,
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <Snackbar
              open={true}
              anchorOrigin={{
                vertical: toast.position.includes('top') ? 'top' : 'bottom',
                horizontal: toast.position.includes('left')
                  ? 'left'
                  : toast.position.includes('right')
                    ? 'right'
                    : 'center',
              }}
              TransitionComponent={(props) => <Slide {...props} direction="left" />}
            >
              <Alert
                severity={toast.type}
                variant="filled"
                elevation={6}
                action={
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => removeToast(toast.id)}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
                sx={{
                  width: '100%',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  },
                  backgroundColor: (theme) => {
                    const colors = {
                      success: theme.palette.success.dark,
                      error: theme.palette.error.dark,
                      warning: theme.palette.warning.dark,
                      info: theme.palette.info.dark,
                    };
                    return colors[toast.type] || theme.palette.info.dark;
                  },
                }}
              >
                {toast.title && <strong>{toast.title}</strong>}
                {toast.title && <br />}
                {toast.message}
              </Alert>
            </Snackbar>
          </Box>
        );
      })}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { showToast, removeToast, clearAllToasts } = context;

  return {
    showToast,
    removeToast,
    clearAllToasts,
    success: (message, options = {}) =>
      showToast(message, { ...options, type: 'success' }),

    error: (message, options = {}) =>
      showToast(message, { ...options, type: 'error' }),

    warning: (message, options = {}) =>
      showToast(message, { ...options, type: 'warning' }),

    info: (message, options = {}) =>
      showToast(message, { ...options, type: 'info' }),
  };
};

// Main Admin Component
const Admin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const toast = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [dashboardData, setDashboardData] = useState({
    totalDepartment: 0,
    totalEmployees: 0,
    presentTotal: 0,
    leaveTotal: 0,
    absentTotal: 0,
    pendingLeavesCount: 0,
    pendingOnDutyCount: 0,
  });


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [absentData, setAbsentData] = useState([]);
  const [showAbsentTable, setShowAbsentTable] = useState(false);
  const [presentData, setPresentData] = useState([]);
  const [showPresentTable, setShowPresentTable] = useState(false);
  const [onDutyData, setOnDutyData] = useState([]);
  const [showOnDutyTable, setShowOnDutyTable] = useState(false);
  const [attendanceChart, setAttendanceChart] = useState([]);
  const [chartTitle, setChartTitle] = useState("Attendance Trend (Month-wise)");
  const [chartLoading, setChartLoading] = useState(false);
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");






  // Report Dialog States
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [reportFormat, setReportFormat] = useState('excel');
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Logged out successfully', {
      title: 'Logout',
      duration: 3000
    });
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleOpenReportDialog = () => {
    setReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const rawToken =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!rawToken) {
        toast.error('Session expired. Please login again.');
        return;
      }

      const res = await fetch(
        'http://localhost:4040/qr/departments/adminDashboard',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rawToken}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to load dashboard');
        return;
      }

      const api = data.data;

      /* ✅ DASHBOARD COUNTS */
      setDashboardData({
        totalDepartment: api.totalDepartment ?? 0,
        totalEmployees: api.totalEmployees ?? 0,
        presentTotal: api.presentTotal ?? 0,
        leaveTotal: api.leaveTotal ?? 0,
        absentTotal: api.absentTotal ?? 0,
        pendingLeavesCount: api.pendingLeavesCount ?? 0,
        pendingOnDutyCount: api.onDutyTotal ?? 0,
      });

      /* ✅ CHART DATA (FROM SAME API) */
      setAttendanceChart(
        (api.chartSeries || []).map(item => ({
          date: moment(item.date).format("DD MMM"),
          present: item.present ?? 0,
          leave: item.leave ?? 0,
          onduty: item.onduty ?? 0,
          absent: item.absent ?? 0,
        }))
      );

    } catch (err) {
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // FETCH ABSENT
  const fetchAbsentList = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error('Please login again', { title: 'Session Expired' });
        return;
      }

      // Show loading toast
      const loadingToast = toast.info('Loading absent employees...', {
        duration: null,
        position: 'bottom-center'
      });

      setShowPresentTable(false);

      const res = await fetch(
        "http://localhost:4040/qr/employees/today-summary?type=absent",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Remove loading toast
      toast.removeToast(loadingToast);

      if (data.success) {
        setAbsentData(data.data);
        setShowAbsentTable(true);
        toast.success(`Loaded ${data.data.length} absent employees`, {
          title: 'Absent List',
          duration: 3000
        });
      } else {
        toast.error(data.message || 'Failed to load absent employees', {
          title: 'Error'
        });
      }
    } catch (err) {
      console.error("Error fetching absent employees", err);
      toast.error('Network error while fetching absent list', {
        title: 'Network Error'
      });
    }
  };

  // FETCH PRESENT
  const fetchPresentList = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error('Please login again', { title: 'Session Expired' });
        return;
      }

      // Show loading toast
      const loadingToast = toast.info('Loading present employees...', {
        duration: null,
        position: 'bottom-center'
      });

      setShowAbsentTable(false);

      const res = await fetch(
        "http://localhost:4040/qr/employees/today-summary?type=present",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Remove loading toast
      toast.removeToast(loadingToast);

      if (data.success) {
        setPresentData(data.data);
        setShowPresentTable(true);
        toast.success(`Loaded ${data.data.length} present employees`, {
          title: 'Present List',
          duration: 3000
        });
      } else {
        toast.error(data.message || 'Failed to load present employees', {
          title: 'Error'
        });
      }
    } catch (err) {
      console.error("Error fetching present employees", err);
      toast.error('Network error while fetching present list', {
        title: 'Network Error'
      });
    }
  };

  // FETCH ON-DUTY
  const fetchOnDutyList = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error('Please login again', { title: 'Session Expired' });
        return;
      }

      const loadingToast = toast.info('Loading on-duty employees...', {
        duration: null,
        position: 'bottom-center'
      });

      setShowAbsentTable(false);
      setShowPresentTable(false);

      const res = await fetch("http://localhost:4040/qr/on-duty", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      toast.removeToast(loadingToast);

      if (data.success) {
        setOnDutyData(data.data || []);
        setShowOnDutyTable(true);
        toast.success(`Loaded ${data.data.length} on-duty employees`, {
          title: 'On-Duty List'
        });
      } else {
        toast.error(data.message || 'Failed to load on-duty employees');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while fetching on-duty list');
    }
  };
  const fetchWeekAnalysis = async () => {
    try {
      setChartLoading(true);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const res = await fetch(
        "http://localhost:4040/qr/departments/adminDashboard?period=week",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to load weekly analysis");
        return;
      }

      setAttendanceChart(
        (data.data.chartSeries || []).map(item => ({
          date: moment(item.date).format("DD MMM"),
          present: item.present ?? 0,
          leave: item.leave ?? 0,
          onduty: item.onduty ?? 0,
          absent: item.absent ?? 0,
        }))
      );

      setChartTitle("Attendance Trend (This Week)");
      toast.success("Weekly attendance analysis loaded");

    } catch (err) {
      toast.error("Failed to load weekly analysis");
    } finally {
      setChartLoading(false);
    }
  };

  const fetchCustomRangeAnalysis = async () => {
    if (!customStartDate || !customEndDate) {
      toast.warning("Please select both start and end dates");
      return;
    }

    if (moment(customStartDate).isAfter(customEndDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    try {
      setChartLoading(true);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch(
        `http://localhost:4040/qr/departments/adminDashboard?startDate=${customStartDate}&endDate=${customEndDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to load data");
        return;
      }

      setAttendanceChart(
        (data.data.chartSeries || []).map(item => ({
          date: moment(item.date).format("DD MMM"),
          present: item.present ?? 0,
          leave: item.leave ?? 0,
          onduty: item.onduty ?? 0,
          absent: item.absent ?? 0,
        }))
      );

      setChartTitle(
        `Attendance (${moment(customStartDate).format("DD MMM")} – ${moment(customEndDate).format("DD MMM")})`
      );

      toast.success("Attendance data loaded");

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setChartLoading(false);
    }
  };

  const fetchMonthlyAnalysis = async () => {
    try {
      setChartLoading(true);
      setShowCustomFilter(false);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const res = await fetch(
        "http://localhost:4040/qr/departments/adminDashboard?period=month",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to load monthly analysis");
        return;
      }

      setAttendanceChart(
        (data.data.chartSeries || []).map(item => ({
          date: moment(item.date).format("DD MMM"),
          present: item.present ?? 0,
          leave: item.leave ?? 0,
          onduty: item.onduty ?? 0,
          absent: item.absent ?? 0,
        }))
      );

      setChartTitle("Attendance Trend (This Month)");
      toast.success("Monthly attendance loaded");

    } catch (err) {
      toast.error("Failed to load monthly analysis");
    } finally {
      setChartLoading(false);
    }
  };

  const getReportTitle = () => {
    if (reportType === "weekly") return "Weekly Attendance Report";
    if (reportType === "monthly") return "Monthly Attendance Report";
    if (reportType === "custom") return "Custom Attendance Report";
    return "Attendance Report";
  };

  const getReportDateRange = () => {
    return chartTitle
      .replace("Attendance Trend", "")
      .replace("Attendance", "")
      .trim();
  };

  const handleRefreshDashboard = () => {
    toast.info('Refreshing dashboard data...', {
      title: 'Refresh',
      duration: 2000
    });
    fetchDashboardData();
  };

  const generateReport = async () => {
    try {
      setReportLoading(true);

      let chartData = [];

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      // ✅ FETCH DATA BASED ON REPORT TYPE
      if (reportType === "weekly") {
        const res = await fetch(
          "http://localhost:4040/qr/departments/adminDashboard?period=week",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        chartData = data.data.chartSeries;
      }

      else if (reportType === "monthly") {
        const res = await fetch(
          "http://localhost:4040/qr/departments/adminDashboard?period=month",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        chartData = data.data.chartSeries;
      }

      else if (reportType === "custom") {
        if (!startDate || !endDate) {
          toast.warning("Please select start & end date");
          setReportLoading(false);
          return;
        }

        const formattedStart = moment(startDate).format("YYYY-MM-DD");
        const formattedEnd = moment(endDate).format("YYYY-MM-DD");

        const res = await fetch(
          `http://localhost:4040/qr/departments/adminDashboard?startDate=${formattedStart}&endDate=${formattedEnd}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        chartData = data.data.chartSeries;
      }


      else {
        chartData = attendanceChart;
      }

      if (!chartData || !chartData.length) {
        toast.warning("No data available for selected report");
        setReportLoading(false);
        return;
      }

      // ✅ NORMALIZE DATA (same format as graph)
      const formattedData = chartData.map(item => ({
        date: moment(item.date).format("DD MMM"),
        present: item.present ?? 0,
        absent: item.absent ?? 0,
        leave: item.leave ?? 0,
        onduty: item.onduty ?? 0,
      }));

      const payload = {
        title: getReportTitle(),
        dateRange: getReportDateRange(),
        data: formattedData,
      };

      // ✅ EXPORT
      if (reportFormat === "excel") {
        await ExcelReportGenerator(payload);
        toast.success("Excel report downloaded");
      } else {
        await PdfReportGenerator(payload);
        toast.success("PDF report downloaded");
      }

      handleCloseReportDialog();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report");
    } finally {
      setReportLoading(false);
    }
  };



  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard…
        </Typography>
      </Box>
    );
  }

  const totalEmployees = dashboardData.totalEmployees || 1;

  const statsCards = [
    {
      title: 'Total Departments',
      value: dashboardData.totalDepartment,
      icon: <DepartmentIcon fontSize="large" />,
      color: theme.palette.primary.main,
      progress: 100,
      description: 'Active departments',
    },
    {
      title: 'Total Employees',
      value: dashboardData.totalEmployees,
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      progress: 100,
      description: 'Registered employees',
    },
    {
      title: 'Present Today',
      value: dashboardData.presentTotal,
      icon: <PresentIcon fontSize="large" />,
      color: '#4CAF50',
      progress: (dashboardData.presentTotal / totalEmployees) * 100,
      description: 'Employees present',
      onClick: fetchPresentList,
    },
    {
      title: 'Absent Today',
      value: dashboardData.absentTotal,
      icon: <AbsentIcon fontSize="large" />,
      color: '#F44336',
      progress: (dashboardData.absentTotal / totalEmployees) * 100,
      description: 'Employees absent',
      onClick: fetchAbsentList,
    },
    {
      title: 'On Leave Today',
      value: dashboardData.leaveTotal,
      icon: <LeaveIcon fontSize="large" />,
      color: '#FF9800',
      progress: (dashboardData.leaveTotal / totalEmployees) * 100,
      description: 'On leave today',
    },
    {
      title: 'On Duty Today',
      value: dashboardData.pendingOnDutyCount,
      icon: <WorkIcon fontSize="large" />,
      color: '#2196F3',
      progress: (dashboardData.pendingOnDutyCount / totalEmployees) * 100,
      description: 'Employees on duty',
      onClick: fetchOnDutyList, // ✅ ADD THIS
    }

  ];

  const drawerWidth = isDrawerOpen ? 240 : 64;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          transition: 'all 0.3s ease',
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
        }}
      >

        {/* HEADER */}
        <Header
          drawerWidth={drawerWidth}
          toggleDrawer={toggleDrawer}
          handleRefreshDashboard={handleRefreshDashboard}
          handleOpenReportDialog={handleOpenReportDialog}
          anchorEl={anchorEl}
          menuOpen={menuOpen}
          handleProfileMenuOpen={handleProfileMenuOpen}
          handleMenuClose={handleMenuClose}
          handleLogout={handleLogout}
          theme={theme}
        />
           
           <Toolbar />

        {/* PAGE CONTENT */}
        <Box sx={{ p: 3 }}>
          {/* ERROR MESSAGE */}
          {error && (
            <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'error.main' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          {/* WELCOME BANNER */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #052b69 0%, #1e88e5 100%)',
              color: 'white',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Welcome back, Admin!
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Here's your organization overview. Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Paper>



          {/* ALL CARDS IN SAME ROW */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              flexWrap: 'nowrap',
              justifyContent: 'space-between',
              mb: 4
            }}
          >
            {statsCards.map((card, index) => (
              <Card
                key={index}
                onClick={card.onClick}
                elevation={2}
                sx={{
                  cursor: card.onClick ? 'pointer' : 'default',
                  flex: '1',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    transform: card.onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: card.onClick ? 6 : 2,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography color="textSecondary" variant="body2">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {card.value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        color: card.color,
                        backgroundColor: card.color + '20',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color,
                      },
                    }}
                  />

                  <Typography variant="caption" color="textSecondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* TITLE */}
            <Typography variant="h6" fontWeight="bold">
              {chartTitle}
            </Typography>

            {/* ACTIONS */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              {/* WEEK */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setShowCustomFilter(false);
                  fetchWeekAnalysis();
                }}
                disabled={chartLoading}
                startIcon={<DateRangeIcon />}
              >
                This Week
              </Button>

              {/* MONTH */}
              <Button
                variant="outlined"
                size="small"
                onClick={fetchMonthlyAnalysis}
                disabled={chartLoading}
                startIcon={<DateRangeIcon />}
              >
                This Month
              </Button>

              {/* CUSTOM */}
              <Button
                variant={showCustomFilter ? "contained" : "outlined"}
                size="small"
                onClick={() => setShowCustomFilter(prev => !prev)}
                startIcon={<FilterIcon />}
              >
                Custom
              </Button>

              {/* CUSTOM DATE INPUTS */}
              {showCustomFilter && (
                <>
                  <TextField
                    type="date"
                    size="small"
                    label="Start"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    type="date"
                    size="small"
                    label="End"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: customStartDate || undefined,
                    }}
                  />

                  <Button
                    variant="contained"
                    size="small"
                    onClick={fetchCustomRangeAnalysis}
                    disabled={chartLoading}
                  >
                    Apply
                  </Button>
                </>
              )}
            </Box>
          </Box>




          {/* ATTENDANCE TREND GRAPH */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
              Attendance Trend (Month-wise)
            </Typography> */}

            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={attendanceChart}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ReTooltip />
                <Legend />

                <Bar dataKey="present" fill="#4CAF50" name="Present" />
                <Bar dataKey="absent" fill="#F44336" name="Absent" />
                <Bar dataKey="leave" fill="#FF9800" name="On Leave" />
                <Bar dataKey="onduty" fill="#2196F3" name="On Duty" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>


          {/* REPORT GENERATION BOX */}
          {/* <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRangeIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Generate Reports
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleOpenReportDialog}
                sx={{ textTransform: 'none' }}
              >
                Open Report Generator
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Generate daywise, weekwise, and monthwise reports in Excel or PDF format
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'white' }}>
                  <TodayIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">Daily Report</Typography>
                  <Typography variant="body2" color="text.secondary">Today's attendance</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'white' }}>
                  <DateRangeIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">Weekly Report</Typography>
                  <Typography variant="body2" color="text.secondary">This week's summary</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'white' }}>
                  <FilterIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">Monthly Report</Typography>
                  <Typography variant="body2" color="text.secondary">Monthly analytics</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper> */}

          {/* ENHANCED ABSENTEE / PRESENT TABLE */}
          {(showAbsentTable || showPresentTable || showOnDutyTable) && (
            <Paper
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(to bottom, #ffffff, #fafafa)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: (showAbsentTable ? "linear-gradient(90deg, #f44336, #ff9800)" : "linear-gradient(90deg, #4caf50, #81c784)"),
                }
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: showAbsentTable
                      ? "#f44336"
                      : showPresentTable
                        ? "#2e7d32"
                        : "#1565c0",
                  }}
                >
                  {showAbsentTable
                    ? "Absent Employees Today"
                    : showPresentTable
                      ? "Present Employees Today"
                      : "On-Duty Employees Today"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: (showAbsentTable ? '#ffebee' : '#e8f5e9'),
                      border: `1px solid ${showAbsentTable ? '#ffcdd2' : '#c8e6c9'}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: (showAbsentTable ? "#f44336" : "#4caf50")
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: (showAbsentTable ? "#c62828" : "#2e7d32") }}>
                      {(showAbsentTable
                        ? absentData.length
                        : showPresentTable
                          ? presentData.length
                          : onDutyData.length)} {((showAbsentTable
                            ? absentData.length
                            : showPresentTable
                              ? presentData.length
                              : onDutyData.length) === 1 ? 'employee' : 'employees')}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      if (showAbsentTable) {
                        fetchAbsentList();
                        toast.info('Refreshed absent list', { title: 'Refreshed' });
                      } else {
                        fetchPresentList();
                        toast.info('Refreshed present list', { title: 'Refreshed' });
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              <DataGrid
                autoHeight
                rows={(
                  showAbsentTable
                    ? absentData
                    : showPresentTable
                      ? presentData
                      : onDutyData
                ).map((emp, index) => ({
                  id: index + 1,
                  employee_code: emp.employee_code,
                  employee_id: emp.employee_id,
                  name: `${emp.first_name} ${emp.last_name}`,
                  dept_id: emp.dept_id,
                }))}

                columns={[
                  {
                    field: "employee_code",
                    headerName: "Employee Code",
                    width: 200,
                    headerClassName: "super-app-theme--header",
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: showAbsentTable
                              ? "#f44336"
                              : showPresentTable
                                ? "#4caf50"
                                : "#2196f3",
                            fontSize: "0.875rem"
                          }}
                        >
                          {params.row.name?.charAt(0) ?? ""}
                        </Avatar>

                        <Typography variant="body2" fontWeight="medium" sx={{ lineHeight: 1, display: "block" }}>
                          {params.value}
                        </Typography>
                      </Box>
                    )
                  },
                  {
                    field: "employee_id",
                    headerName: "Employee Id",
                    flex: 1,
                    headerClassName: "super-app-theme--header",
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {params.value}
                        </Typography>
                      </Box>
                    )
                  },
                  {
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                    headerClassName: "super-app-theme--header",
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {params.value}
                        </Typography>
                      </Box>
                    )
                  },
                  {
                    field: "dept_id",
                    headerName: "Department",
                    width: 180,
                    headerClassName: "super-app-theme--header",
                    headerAlign: "center",
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <Chip
                          label={`Dept ${params.value}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: "#f5f5f5",
                            color: "#555",
                            fontWeight: 500,
                            "& .MuiChip-label": { px: 1 }
                          }}
                        />
                      </Box>
                    )
                  },
                ]}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #eaeaea",
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center',
                    py: '10px',
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: "#f8f9fa",
                    borderBottom: "2px solid #eaeaea",
                    color: "#555",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-row': {
                    transition: "all 0.2s ease",
                    '&:hover': {
                      bgcolor: "#f5f7ff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    },
                  },
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    bgcolor: "#fafafa",
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: "1px solid #eaeaea",
                    "& .MuiTablePagination-root": {
                      color: "#555",
                    },
                    "& .MuiIconButton-root": {
                      color: "#1976d2",
                    },
                  },
                }}
                density="comfortable"
                disableRowSelectionOnClick
              />

            </Paper>
          )}

          {/* EMPTY STATE WHEN NO TABLE IS VISIBLE */}
          {!showAbsentTable && !showPresentTable && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: '#fafafa',
                border: '2px dashed #e0e0e0',
                mt: 4
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No employee list selected
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click on "Present Today" or "Absent Today" cards to view detailed lists
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  fetchPresentList();
                  toast.info('Loading present employees...', { title: 'Loading' });
                }}
                sx={{ mr: 2 }}
              >
                Load Present List
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  fetchAbsentList();
                  toast.info('Loading absent employees...', { title: 'Loading' });
                }}
              >
                Load Absent List
              </Button>
            </Paper>
          )}

        </Box>
      </Box>



      {/* REPORT GENERATION DIALOG */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DownloadIcon color="primary" />
            <Typography variant="h6">Generate Attendance Report</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Report Type Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="daily">
                  <Box display="flex" alignItems="center" gap={1}>
                    <TodayIcon fontSize="small" />
                    <Typography>Daily Report</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="weekly">
                  <Box display="flex" alignItems="center" gap={1}>
                    <DateRangeIcon fontSize="small" />
                    <Typography>Weekly Report</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="monthly">
                  <Box display="flex" alignItems="center" gap={1}>
                    <FilterIcon fontSize="small" />
                    <Typography>Monthly Report</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="custom">
                  <Box display="flex" alignItems="center" gap={1}>
                    <FilterIcon fontSize="small" />
                    <Typography>Custom Date Range</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Date Selection based on report type */}
            {reportType === 'daily' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Select Date</Typography>
                <TextField
                  type="date"
                  value={moment(selectedDate).format('YYYY-MM-DD')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            )}

            {reportType === 'weekly' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Select Week</Typography>
                <TextField
                  type="date"
                  value={moment(selectedDate).format('YYYY-MM-DD')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Week: {moment(selectedDate).startOf('week').format('MMM DD')} - {moment(selectedDate).endOf('week').format('MMM DD, YYYY')}
                </Typography>
              </Box>
            )}

            {reportType === 'monthly' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Select Month</Typography>
                <TextField
                  type="month"
                  value={moment(selectedDate).format('YYYY-MM')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value + '-01'))}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            )}

            {reportType === 'custom' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Select Date Range</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={moment(startDate).format('YYYY-MM-DD')}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="date"
                      label="End Date"
                      value={moment(endDate).format('YYYY-MM-DD')}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: moment(startDate).format('YYYY-MM-DD')
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Format Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Select Format</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <Tooltip title="Excel Format (XLSX)">
                    <FormControlLabel
                      value="excel"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <ExcelIcon color="success" />
                          <Typography>Excel (.xlsx)</Typography>
                        </Box>
                      }
                    />
                  </Tooltip>
                  <Tooltip title="PDF Format">
                    <FormControlLabel
                      value="pdf"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <PdfIcon color="error" />
                          <Typography>PDF (.pdf)</Typography>
                        </Box>
                      }
                    />
                  </Tooltip>
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Summary Preview */}
            <Paper sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                📋 Report Summary
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">
                  <strong>Type:</strong> {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                </Typography>
                <Typography variant="body2">
                  <strong>Format:</strong> {reportFormat.toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  <strong>Date Range:</strong> {
                    reportType === 'daily'
                      ? moment(selectedDate).format('MMMM DD, YYYY')
                      : reportType === 'weekly'
                        ? `${moment(selectedDate).startOf('week').format('MMM DD')} - ${moment(selectedDate).endOf('week').format('MMM DD, YYYY')}`
                        : reportType === 'monthly'
                          ? moment(selectedDate).format('MMMM YYYY')
                          : `${moment(startDate).format('MMM DD, YYYY')} - ${moment(endDate).format('MMM DD, YYYY')}`
                  }
                </Typography>
              </Box>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseReportDialog}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={generateReport}
            variant="contained"
            color="primary"
            disabled={reportLoading}
            startIcon={reportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
            sx={{ textTransform: 'none' }}
          >
            {reportLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Export with ToastProvider wrapper
const AdminWithToast = () => (
  <ToastProvider>
    <Admin />
  </ToastProvider>
);

export default AdminWithToast;