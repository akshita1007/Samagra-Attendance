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
  CircularProgress,
  Alert,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// ✅ IMPORT EXISTING COMPONENTS
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const LeaveRequest = () => {
  const theme = useTheme();

  // Sidebar / Header states (SAME AS ManageDepartments)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const drawerWidth = isSidebarOpen ? 240 : 64;
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = () => setIsSidebarOpen((prev) => !prev);
  const handleProfileMenuOpen = (event) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Dummy handlers (required by Header props)
  const handleRefresh = () => {};
  const handleExport = () => {};

  // Leave states
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 SAME TOKEN LOGIC AS YOUR PROJECT
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // 🔹 Fetch leave records
  const fetchLeaves = async () => {
    const token = getToken();
    if (!token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/leave/leave_records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch leave records");

      const result = await res.json();
      setLeaves(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 🔹 Approve / Reject handler
  const handleAction = async (leaveId, action) => {
    const token = getToken();
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/leave/${leaveId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) throw new Error("Action failed");

      // Update UI instantly
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveId
            ? { ...leave, status: action }
            : leave
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

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

        {/* Spacer for fixed AppBar */}
        <Toolbar />

        {/* ✅ Page Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            📝 Leave Approval Management
          </Typography>

          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            {/* Loading */}
            {loading && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>
                  Loading leave records...
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
                      <TableCell><b>Employee</b></TableCell>
                      <TableCell><b>From</b></TableCell>
                      <TableCell><b>To</b></TableCell>
                      <TableCell><b>Leave Type</b></TableCell>
                      <TableCell><b>Reason</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                      <TableCell align="center"><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {leaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No leave requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaves.map((leave) => (
                        <TableRow key={leave.id} hover>
                          <TableCell>
                            {leave.employee_name || "-"}
                          </TableCell>
                          <TableCell>{leave.start_date}</TableCell>
                          <TableCell>{leave.end_date}</TableCell>
                          <TableCell>{leave.leave_type_name}</TableCell>
                          <TableCell>{leave.reason}</TableCell>

                          <TableCell>
                            <Chip
                              label={leave.status || "pending"}
                              color={
                                leave.status === "approve"
                                  ? "success"
                                  : leave.status === "reject"
                                  ? "error"
                                  : "warning"
                              }
                              size="small"
                            />
                          </TableCell>

                          <TableCell align="center">
                            <ToggleButtonGroup
                              exclusive
                              size="small"
                              value={leave.status || ""}
                              onChange={(e, value) => {
                                if (value)
                                  handleAction(leave.id, value);
                              }}
                            >
                              <ToggleButton
                                value="approve"
                                color="success"
                              >
                                Approve
                              </ToggleButton>
                              <ToggleButton
                                value="reject"
                                color="error"
                              >
                                Reject
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaveRequest;
