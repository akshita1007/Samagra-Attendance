import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Fab,
  Zoom,
  Tabs,
  Tab,
  Badge,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  CardActionArea,
  LinearProgress,
  alpha,
  useTheme,
  Toolbar
} from "@mui/material";

import {
  Search,
  FilterList,
  LocationOn,
  Email,
  Phone,
  Work,
  Event,
  CheckCircle,
  Pending,
  Sort,
  Add,
  Edit,
  Visibility,
  Download,
  Print,
  Refresh,
  MoreVert,
  Group,
  VerifiedUser,
  AccessTime,
  Place,
  QrCode,
  TrendingUp,
  PersonAdd,
  Clear,
  Dashboard
} from "@mui/icons-material";

import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";




const EmployeeManagement = () => {
  const theme = useTheme();

  /* ------------------ Layout ------------------ */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const drawerWidth = isSidebarOpen ? 240 : 64;

  const toggleDrawer = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  /* ------------------ Header Menu ------------------ */
  
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  /* ------------------ Data ------------------ */
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState(0);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    locations: 0,
    avgExperience: 0
  });

  /* ------------------ Fetch Employees ------------------ */
  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/getAll`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch employees");

        const data = await res.json();
        setEmployees(data.data);
        setFilteredEmployees(data.data);
        calculateStats(data.data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  /* ------------------ Helpers ------------------ */
  const calculateStats = (data) => {
    const total = data.length;
    const approved = data.filter(e => e.approval_status === "approved").length;
    const pending = data.filter(e => e.approval_status === "pending").length;
    const locations = new Set(
      data.filter(e => e.current_lat && e.current_lng)
        .map(e => `${e.current_lat},${e.current_lng}`)
    ).size;

    const avgExperience =
      data.reduce((acc, emp) => {
        const joinDate = new Date(emp.date_of_joining);
        return acc + ((new Date() - joinDate) / (365 * 24 * 60 * 60 * 1000));
      }, 0) / total || 0;

    setStats({
      total,
      approved,
      pending,
      locations,
      avgExperience: avgExperience.toFixed(1),
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  const uniqueDesignations = [...new Set(employees.map(e => e.designation))];

  /* ------------------ UI States ------------------ */
  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading employees...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        <Typography variant="h6">Error</Typography>
        <Typography>{error}</Typography>
        <Button startIcon={<Refresh />} onClick={handleRefresh}>Retry</Button>
      </Alert>
    );
  }

  /* ------------------ RENDER ------------------ */
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        {/* Header */}
        <Header
          drawerWidth={drawerWidth}
          toggleDrawer={toggleDrawer}
          handleRefreshDashboard={handleRefresh}
          handleOpenReportDialog={handleExport}
          anchorEl={anchorEl}
          menuOpen={menuOpen}
          handleProfileMenuOpen={handleProfileMenuOpen}
          handleMenuClose={handleMenuClose}
          handleLogout={handleLogout}
          theme={theme}
        />

        {/* Spacer for fixed AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {/* Title */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Employee Management
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Manage and monitor your workforce efficiently
          </Typography>

          {/* Floating Add Button */}
          <Zoom in>
            <Fab
              color="primary"
              sx={{
                position: "fixed",
                bottom: 24,
                right: 30,
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0.5,
                textTransform: "none",
              }}
              onClick={() => navigate("/employees/add")}
            >
              <Add sx={{ fontSize: 28 }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                Add Employee
              </Typography>
            </Fab>
          </Zoom>


          {/* Stats */}
          <Grid
            container
            spacing={2}
            wrap="nowrap"
            sx={{ width: "100%", mb: 4 }}
          >
            {[
              {
                title: "Total",
                value: stats.total,
                icon: <Group />,
                color: "primary",
                description: "Employees",
              },
              {
                title: "Approved",
                value: stats.approved,
                icon: <CheckCircle />,
                color: "success",
                description: `${((stats.approved / stats.total) * 100 || 0).toFixed(1)}%`,
              },
              {
                title: "Pending",
                value: stats.pending,
                icon: <Pending />,
                color: "warning",
                description: "Needs review",
              },
              {
                title: "Locations",
                value: stats.locations,
                icon: <Place />,
                color: "info",
                description: "Active",
              },
              {
                title: "Experience",
                value: stats.avgExperience,
                icon: <TrendingUp />,
                color: "secondary",
                description: "Avg years",
              },
            ].map((stat, index) => (
              <Grid
                item
                key={index}
                sx={{
                  flexGrow: 1,       // 🔑 spreads evenly
                  minWidth: 180,     // prevents too small cards
                  display: "flex",   // equal height
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: `linear-gradient(
            145deg,
            ${alpha(theme.palette[stat.color].main, 0.06)},
            ${theme.palette.background.paper}
          )`,
                    border: `1px solid ${alpha(theme.palette[stat.color].main, 0.15)}`,
                    transition: "0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette[stat.color].main,
                      mb: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Typography variant="h5" fontWeight="bold">
                    {stat.value}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {stat.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette[stat.color].main, fontWeight: 600 }}
                  >
                    {stat.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>


          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchTerm("")}>
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    value={designationFilter}
                    label="Designation"
                    onChange={(e) => setDesignationFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {uniqueDesignations.map(d => (
                      <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Table Placeholder (kept concise) */}
          <Paper
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: theme.shadows[2],
            }}
          >
            <TableContainer>
              <Table>
                {/* TABLE HEADER */}
                <TableHead>
                  <TableRow
                    sx={{
                      background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    }}
                  >
                    {[
                      "Employee",
                      "Designation",
                      "Status",
                      "Experience",
                      "Contact",
                      "Location",
                      "Actions",
                    ].map((head) => (
                      <TableCell key={head}>
                        <Typography fontWeight="bold" color="white">
                          {head}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* TABLE BODY */}
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography variant="h6" color="text.secondary">
                          No employees found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting search or filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((emp) => (
                        <TableRow
                          key={emp.id}
                          hover
                          sx={{
                            transition: "0.2s",
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.04
                              ),
                            },
                          }}
                        >
                          {/* EMPLOYEE */}
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2 }}>
                                {emp.first_name?.[0]}
                                {emp.last_name?.[0]}
                              </Avatar>
                              <Box>
                                <Typography fontWeight="medium">
                                  {emp.first_name} {emp.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  ID: {emp.employee_code}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          {/* DESIGNATION */}
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Work sx={{ mr: 1, fontSize: 18, color: "primary.main" }} />
                              {emp.designation}
                            </Box>
                          </TableCell>

                          {/* STATUS */}
                          <TableCell>
                            <Chip
                              label={emp.approval_status}
                              color={
                                emp.approval_status === "approved"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                              icon={
                                emp.approval_status === "approved" ? (
                                  <CheckCircle />
                                ) : (
                                  <Pending />
                                )
                              }
                            />
                          </TableCell>

                          {/* EXPERIENCE */}
                          <TableCell>
                            <Typography>
                              {(
                                (new Date() - new Date(emp.date_of_joining)) /
                                (365 * 24 * 60 * 60 * 1000)
                              ).toFixed(1)}{" "}
                              yrs
                            </Typography>
                          </TableCell>

                          {/* CONTACT */}
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Box display="flex" alignItems="center">
                                <Email sx={{ fontSize: 16, mr: 1 }} />
                                <Typography variant="body2" noWrap>
                                  {emp.email}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center">
                                <Phone sx={{ fontSize: 16, mr: 1 }} />
                                <Typography variant="body2">{emp.mobile}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          {/* LOCATION */}
                          <TableCell>
                            {emp.current_lat && emp.current_lng ? (
                              <Chip
                                label="Active"
                                color="success"
                                size="small"
                                icon={<LocationOn />}
                              />
                            ) : (
                              <Chip label="N/A" size="small" variant="outlined" />
                            )}
                          </TableCell>

                          {/* ACTIONS */}
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedEmployee(emp);
                                    setViewDialogOpen(true);
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Edit">
                                <IconButton size="small" color="secondary">
                                  <Edit />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="QR Code">
                                <IconButton size="small" color="info">
                                  <QrCode />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* PAGINATION */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start", // 👈 shifts to left
                alignItems: "center",
              }}
            >
              <TablePagination
                component="div"
                count={filteredEmployees.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </Box>
          </Paper>

        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeManagement;
