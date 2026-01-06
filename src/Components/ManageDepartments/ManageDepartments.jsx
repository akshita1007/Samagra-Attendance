import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Toolbar,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ✅ IMPORT EXISTING COMPONENTS
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";



const ManageDepartments = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  

  // Sidebar / Header states (same pattern as Admin)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const drawerWidth = isSidebarOpen ? 240 : 64;
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Dummy handlers (required by Header props)
  const handleRefresh = () => {};
  const handleExport = () => {};

  // Departments state
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handler for the new button
  const handleAddDepartment = () => {
    toast.info("Add Department button clicked!");
     navigate("/department/add");
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/departments`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch departments");

        const result = await res.json();
        setDepartments(result.data || []);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {/* ✅ Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

      {/* ✅ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* ✅ Header */}
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

        {/* ✅ Spacer for fixed AppBar */}
        <Toolbar />

        {/* ✅ Page Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            🏢 Manage Departments
          </Typography>

          {/* Table Container */}
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
            {/* Loading */}
            {loading && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>
                  Loading departments...
                </Typography>
              </Box>
            )}

            {/* Error */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Table */}
            {!loading && !error && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                      <TableCell><b>ID</b></TableCell>
                      <TableCell><b>Department</b></TableCell>
                      <TableCell><b>Code</b></TableCell>
                      <TableCell><b>Email</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {departments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No departments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      departments.map((dept) => (
                        <TableRow key={dept.id} hover>
                          <TableCell>{dept.id}</TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar
                                src={
                                  dept.current_image_path
                                    ? `http://localhost:4040${dept.current_image_path}`
                                    : undefined
                                }
                              >
                                <BusinessIcon />
                              </Avatar>
                              <Typography fontWeight={500}>
                                {dept.name}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Chip label={dept.code} variant="outlined" />
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <EmailIcon fontSize="small" />
                              {dept.dept_email}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Chip
                              icon={<CheckCircleIcon />}
                              label={dept.approval_status}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* ✅ ADD BUTTON BELOW THE TABLE (OUTSIDE PAPER) */}
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center",
              mt: 2
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddDepartment}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
              }}
            >
              Add New Department
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageDepartments;