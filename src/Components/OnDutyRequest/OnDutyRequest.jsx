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

// ✅ EXISTING LAYOUT COMPONENTS
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const OnDutyRequest = () => {
  const theme = useTheme();

  // 🔹 Sidebar / Header state (SAME AS OTHER MODULES)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const drawerWidth = isSidebarOpen ? 240 : 64;
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = () => setIsSidebarOpen((prev) => !prev);
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Dummy handlers required by Header
  const handleRefresh = () => {};
  const handleExport = () => {};

  // 🔹 OnDuty State
  const [onDutyList, setOnDutyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 SAME TOKEN LOGIC AS YOUR PROJECT
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // 🔹 Fetch On-Duty Requests
  const fetchOnDuty = async () => {
    const token = getToken();
    if (!token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/on-duty`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch on-duty records");

      const result = await res.json();
      setOnDutyList(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnDuty();
  }, []);

  // 🔹 Approve / Reject Handler
  const handleAction = async (id, action) => {
    const token = getToken();
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/on-duty/${id}/approve`,
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

      // 🔄 Update UI instantly
      setOnDutyList((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: action }
            : item
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

        {/* Spacer */}
        <Toolbar />

        {/* ✅ Page Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            🚗 On-Duty Approval Management
          </Typography>

          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            {/* Loading */}
            {loading && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>
                  Loading on-duty requests...
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
                      <TableCell><b>Date</b></TableCell>
                      <TableCell><b>Purpose</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                      <TableCell align="center"><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {onDutyList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No on-duty requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      onDutyList.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            {item.employee_name || "-"}
                          </TableCell>

                          <TableCell>
                            {item.on_duty_date || "-"}
                          </TableCell>

                          <TableCell>
                            {item.reason || "-"}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={item.status || "pending"}
                              color={
                                item.status === "approve"
                                  ? "success"
                                  : item.status === "reject"
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
                              value={item.status || ""}
                              onChange={(e, value) => {
                                if (value)
                                  handleAction(item.id, value);
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

export default OnDutyRequest;
