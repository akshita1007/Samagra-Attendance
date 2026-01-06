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
  CircularProgress,
  Alert,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Layout Components
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const PendingLists = () => {
  const theme = useTheme();

  // ---------------- Layout State ----------------
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const drawerWidth = isSidebarOpen ? 240 : 64;
  const menuOpen = Boolean(anchorEl);

  // ---------------- Data State ----------------
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- Token Helper ----------------
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // ---------------- Layout Handlers ----------------
  const toggleDrawer = () => setIsSidebarOpen((p) => !p);
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Required by Header
  const handleRefresh = () => {};
  const handleExport = () => {};

  // ---------------- Fetch Pending Employees ----------------
  const fetchPendingEmployees = async () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    setError("Session expired. Please login again.");
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/departments/list/pending`
,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch pending list");

    const result = await res.json();
    console.log("API RESPONSE:", result);

    // ✅ THIS IS THE KEY LINE
    setEmployees(
      (result.employees || []).map(emp => ({
        ...emp,
        status: emp.status || "pending"
      }))
    );

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPendingEmployees();
  }, []);

  // ---------------- Approve / Reject ----------------
 const handleAction = async (status) => {
  if (!selectedEmployee) return;

  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/departments/approve/employee/${selectedEmployee.id}`
,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) throw new Error("Action failed");

    // ✅ Update status dynamically in UI
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, status }
          : emp
      )
    );

    setSelectedEmployee(null);

  } catch (err) {
    alert(err.message);
  }
};


  // ---------------- Status Color ----------------
  const getStatusColor = (status) => {
    if (status === "approved") return "success";
    if (status === "rejected") return "error";
    return "warning";
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
          width: { md: `calc(100% - ${drawerWidth}px)` },
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

        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            ⏳ Pending Employee Approvals
          </Typography>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && employees.length > 0 && (
            <Paper sx={{ borderRadius: 3 }}>
              <Typography sx={{ p: 2 }} fontWeight="bold">
                Pending Employees
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>ID</b></TableCell>
                      <TableCell><b>Employee Code</b></TableCell>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell><b>Designation</b></TableCell>
                      <TableCell><b>Date of Joining</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow
                        key={emp.id}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        <TableCell>{emp.id}</TableCell>
                        <TableCell>{emp.employee_code}</TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.designation}</TableCell>
                        <TableCell>
                          {emp.doj
                            ? new Date(emp.doj).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={emp.status}
                            color={getStatusColor(emp.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {!loading && !error && employees.length === 0 && (
            <Typography color="text.secondary">
              No pending employee approvals found.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Approval Modal */}
      <Dialog
        open={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
      >
        <DialogTitle>Approve Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Take action for:
          </Typography>
          <Typography fontWeight="bold" mt={1}>
            {selectedEmployee?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => handleAction("rejected")}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAction("approved")}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingLists;
