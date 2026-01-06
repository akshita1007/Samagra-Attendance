import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  InputBase,
  Button,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  Toolbar,
} from "@mui/material";

import {
  Apartment,
  Badge,
  Person,
  Email,
  Phone,
  Work,
  CalendarMonth,
  Save,
} from "@mui/icons-material";

import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { toast } from "react-toastify";

/* ---------------- Reusable Input Wrapper ---------------- */
const GlassInput = ({ icon, children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 2,
      py: 1.5,
      mb: 2.5,
      borderRadius: 3,
      background: "rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(2, 62, 138, 0.2)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "#ffffff",
        border: "1px solid rgba(2, 62, 138, 0.5)",
        boxShadow: "0 4px 15px rgba(2, 62, 138, 0.1)",
        transform: "translateY(-1px)",
      },
      "&:focus-within": {
        background: "#ffffff",
        border: "1px solid var(--turquoise-surf)",
        boxShadow: "0 4px 20px rgba(0, 180, 216, 0.15)",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Box
      sx={{
        color: "var(--french-blue)",
        display: "flex",
        p: 1,
        borderRadius: 2,
        background: "rgba(2, 62, 138, 0.1)",
      }}
    >
      {icon}
    </Box>
    {children}
  </Box>
);

const AddEmployee = () => {
  const theme = useTheme();

  /* ---------------- Layout ---------------- */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const drawerWidth = isSidebarOpen ? 240 : 64;

  const toggleDrawer = () => setIsSidebarOpen((prev) => !prev);

  /* ---------------- Header Menu ---------------- */
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  /* ---------------- Form State ---------------- */
  const [formData, setFormData] = useState({
    department: "",
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    designation: "",
    date_of_joining: "",
  });  

  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- Department API ---------------- */
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      try {
        setDeptLoading(true);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/departments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load departments");

        const data = await res.json();
        setDepartments(data.data || []);
      } catch (err) {
        toast.error("Unable to load departments");
      } finally {
        setDeptLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  /* ---------------- Submit Employee ---------------- */
  const handleSubmit = async () => {
    if (
      !formData.department ||
      !formData.employee_code ||
      !formData.first_name ||
      !formData.mobile
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const payload = {
      dept_id: String(formData.department),
      department_email: "cgvsk@gov.in",
      employee_code: formData.employee_code,
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile: formData.mobile,
      email: formData.email,
      designation: formData.designation,
      date_of_joining: formData.date_of_joining,
    };

    try {
      setSaving(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add employee");
      }

      toast.success("Employee added successfully 🎉");

      setFormData({
        department: "",
        employee_code: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        designation: "",
        date_of_joining: "",
        // department_email: ""
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "var(--bg-color)",
        }}
      >
        <Header
          drawerWidth={drawerWidth}
          toggleDrawer={toggleDrawer}
          anchorEl={anchorEl}
          menuOpen={menuOpen}
          handleProfileMenuOpen={handleProfileMenuOpen}
          handleMenuClose={handleMenuClose}
          handleLogout={handleLogout}
          theme={theme}
        />

        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: 720,
              mx: "auto",
              mt: 4,
              p: 4,
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" fontWeight="800" textAlign="center" mb={1}>
              Add New Employee
            </Typography>

            <Typography textAlign="center" mb={4}>
              Enter the details below to register a new employee
            </Typography>

            <GlassInput icon={<Apartment />}>
              <FormControl fullWidth variant="standard">
                <Select
                  value={formData.department}
                  displayEmpty
                  onChange={(e) => handleChange("department", e.target.value)}
                  disableUnderline
                >
                  <MenuItem value="" disabled>
                    {deptLoading ? "Loading..." : "Select Department"}
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </GlassInput>

            <GlassInput icon={<Badge />}>
              <InputBase
                fullWidth
                placeholder="Employee Code"
                value={formData.employee_code}
                onChange={(e) => handleChange("employee_code", e.target.value)}
              />
            </GlassInput>

            <GlassInput icon={<Person />}>
              <InputBase
                fullWidth
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </GlassInput>

            <GlassInput icon={<Person />}>
              <InputBase
                fullWidth
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
            </GlassInput>

            <GlassInput icon={<Email />}>
              <InputBase
                fullWidth
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </GlassInput>

            <GlassInput icon={<Phone />}>
              <InputBase
                fullWidth
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
              />
            </GlassInput>

            <GlassInput icon={<Work />}>
              <InputBase
                fullWidth
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
              />
            </GlassInput>

            <GlassInput icon={<CalendarMonth />}>
              <InputBase
                fullWidth
                type="date"
                value={formData.date_of_joining}
                onChange={(e) => handleChange("date_of_joining", e.target.value)}
              />
            </GlassInput>

            <Button
              fullWidth
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{ mt: 2 }}
            >
              {saving ? "Saving..." : "Save Employee Details"}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEmployee;
