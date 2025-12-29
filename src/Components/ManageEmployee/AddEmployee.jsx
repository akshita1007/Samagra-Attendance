
// import React, { useState } from "react";
// import {
//     Box,
//     Paper,
//     Typography,
//     InputBase,
//     Button,
//     FormControl,
//     Select,
//     MenuItem,
//     useTheme,
//     Toolbar,
//     alpha,
// } from "@mui/material";

// import {
//     Apartment,
//     Badge,
//     Person,
//     Email,
//     Phone,
//     Work,
//     CalendarMonth,
//     Save,
// } from "@mui/icons-material";

// import Sidebar from "../Sidebar/Sidebar";
// import Header from "../Header/Header";
// import { toast } from "react-toastify";

// /* ---------------- Glass Input Wrapper ---------------- */
// const GlassInput = ({ icon, children }) => (
//     <Box
//         sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//             px: 2,
//             py: 1.4,
//             mb: 2,
//             borderRadius: 2.5,
//             background: "rgba(255,255,255,0.06)",
//             border: "1px solid rgba(255,255,255,0.18)",
//             color: "white",
//         }}
//     >
//         {icon}
//         {children}
//     </Box>
// );

// const AddEmployee = () => {
//     const theme = useTheme();

//     /* ---------------- Layout ---------------- */
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const drawerWidth = isSidebarOpen ? 240 : 64;

//     const toggleDrawer = () => setIsSidebarOpen((prev) => !prev);

//     /* ---------------- Header Menu ---------------- */
//     const [anchorEl, setAnchorEl] = useState(null);
//     const menuOpen = Boolean(anchorEl);

//     const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
//     const handleMenuClose = () => setAnchorEl(null);

//     const handleLogout = () => {
//         localStorage.clear();
//         sessionStorage.clear();
//         toast.success("Logged out successfully");
//         window.location.href = "/login";
//     };

//     /* ---------------- Form State ---------------- */
//     const [formData, setFormData] = useState({
//         department: "",
//         employee_code: "",
//         first_name: "",
//         last_name: "",
//         email: "",
//         mobile: "",
//         designation: "",
//         date_of_joining: "",
//     });

//     const handleChange = (key, value) => {
//         setFormData((prev) => ({ ...prev, [key]: value }));
//     };

//     const handleSubmit = () => {
//         toast.success("Employee saved successfully (API pending)");
//         console.log("Employee Data:", formData);
//     };

//     /* ---------------- RENDER ---------------- */
//     return (
//         <Box sx={{ display: "flex", minHeight: "100vh" }}>
//             {/* Sidebar */}
//             <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

//             {/* Main */}
//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     minHeight: "100vh",
//                     background: "linear-gradient(135deg, #102fa9ff, #203a43, #2c5364)",
//                     width: { md: `calc(100% - ${drawerWidth}px)` },
//                 }}
//             >
//                 {/* Header */}
//                 <Header
//                     drawerWidth={drawerWidth}
//                     toggleDrawer={toggleDrawer}
//                     handleRefreshDashboard={() => { }}
//                     handleOpenReportDialog={() => { }}
//                     anchorEl={anchorEl}
//                     menuOpen={menuOpen}
//                     handleProfileMenuOpen={handleProfileMenuOpen}
//                     handleMenuClose={handleMenuClose}
//                     handleLogout={handleLogout}
//                     theme={theme}
//                 />

//                 {/* Spacer */}
//                 <Toolbar />

//                 {/* Page Content */}
//                 <Box sx={{ p: { xs: 2, md: 4 } }}>
//                     {/* Glass Card */}
//                     <Paper
//                         sx={{
//                             maxWidth: 480,
//                             mx: "auto",
//                             mt: 4,
//                             p: 3,
//                             borderRadius: 4,
//                             background: "rgba(255,255,255,0.08)",
//                             backdropFilter: "blur(14px)",
//                             border: "1px solid rgba(255,255,255,0.15)",
//                             boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
//                         }}
//                     >
//                         <Typography
//                             variant="h5"
//                             fontWeight="bold"
//                             textAlign="center"
//                             color="white"
//                             gutterBottom
//                         >
//                             Employee Details
//                         </Typography>

//                         <Typography
//                             variant="body2"
//                             textAlign="center"
//                             sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}
//                         >
//                             Fill in the information to add a new employee
//                         </Typography>

//                         {/* Department */}
//                         <GlassInput icon={<Apartment sx={{ color: "white" }} />}>
//                             <FormControl fullWidth>
//                                 <Select
//                                     value={formData.department}
//                                     displayEmpty
//                                     onChange={(e) => handleChange("department", e.target.value)}
//                                     input={<InputBase />}
//                                     sx={{ color: "white" }}
//                                 >
//                                     <MenuItem value="">Select Department</MenuItem>
//                                     <MenuItem value="IT">IT</MenuItem>
//                                     <MenuItem value="HR">HR</MenuItem>
//                                     <MenuItem value="Finance">Finance</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </GlassInput>

//                         {/* Employee Code */}
//                         <GlassInput icon={<Badge sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 placeholder="Employee Code"
//                                 value={formData.employee_code}
//                                 onChange={(e) => handleChange("employee_code", e.target.value)}
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* First Name */}
//                         <GlassInput icon={<Person sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 placeholder="First Name"
//                                 value={formData.first_name}
//                                 onChange={(e) => handleChange("first_name", e.target.value)}
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* Last Name */}
//                         <GlassInput icon={<Person sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 placeholder="Last Name"
//                                 value={formData.last_name}
//                                 onChange={(e) => handleChange("last_name", e.target.value)}
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* Email */}
//                         <GlassInput icon={<Email sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 placeholder="Employee Email"
//                                 value={formData.email}
//                                 onChange={(e) => handleChange("email", e.target.value)}
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* Mobile */}
//                         <GlassInput icon={<Phone sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 placeholder="Mobile"
//                                 value={formData.mobile}
//                                 onChange={(e) => handleChange("mobile", e.target.value)}
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* Designation */}
//                         <GlassInput icon={<Work sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 placeholder="Designation"
//                                 value={formData.designation}
//                                 onChange={(e) => handleChange("designation", e.target.value)}
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* Date of Joining */}
//                         <GlassInput icon={<CalendarMonth sx={{ color: "white" }} />}>
//                             <InputBase
//                                 fullWidth
//                                 type="date"
//                                 value={formData.date_of_joining}
//                                 onChange={(e) =>
//                                     handleChange("date_of_joining", e.target.value)
//                                 }
//                                 sx={{ color: "white" }}
//                             />
//                         </GlassInput>

//                         {/* Save Button */}
//                         <Button
//                             fullWidth
//                             startIcon={<Save />}
//                             onClick={handleSubmit}
//                             sx={{
//                                 mt: 3,
//                                 py: 1.5,
//                                 borderRadius: 3,
//                                 fontWeight: "bold",
//                                 color: "white",
//                                 background: `linear-gradient(
//                   135deg,
//                   ${alpha("#ffffff", 0.35)},
//                   ${alpha("#ffffff", 0.15)}
//                 )`,
//                                 backdropFilter: "blur(8px)",
//                                 border: "1px solid rgba(255,255,255,0.3)",
//                                 "&:hover": {
//                                     background: `linear-gradient(
//                     135deg,
//                     ${alpha("#ffffff", 0.45)},
//                     ${alpha("#ffffff", 0.2)}
//                   )`,
//                                 },
//                             }}
//                         >
//                             Save Employee
//                         </Button>
//                     </Paper>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default AddEmployee;


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
  alpha,
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
      py: 1.4,
      mb: 2,
      borderRadius: 2.5,
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.3)",
      color: "white",
    }}
  >
    {icon}
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

        const res = await fetch("http://localhost:4040/qr/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load departments");

        const data = await res.json();

        // ✅ expected structure: { success: true, data: [...] }
        setDepartments(data.data || []);
      } catch (err) {
        toast.error("Unable to load departments");
      } finally {
        setDeptLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  /* ---------------- Submit ---------------- */
  const handleSubmit = () => {
    console.log("Employee Payload:", formData);
    toast.success("Employee saved successfully (API pending)");
  };

  /* ---------------- RENDER ---------------- */
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#ffffff", // ✅ white page background
        }}
      >
        {/* Header */}
        <Header
          drawerWidth={drawerWidth}
          toggleDrawer={toggleDrawer}
          handleRefreshDashboard={() => {}}
          handleOpenReportDialog={() => {}}
          anchorEl={anchorEl}
          menuOpen={menuOpen}
          handleProfileMenuOpen={handleProfileMenuOpen}
          handleMenuClose={handleMenuClose}
          handleLogout={handleLogout}
          theme={theme}
        />

        {/* Spacer */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {/* Blue Form Card */}
          <Paper
            sx={{
              maxWidth: 720,
              mx: "auto",
              mt: 4,
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #052b69ff 0%, #0d47a1 50%, #1976d2 100%)",
              color: "white",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              Employee Details
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ opacity: 0.85, mb: 3 }}
            >
              Fill in the information to add a new employee
            </Typography>

            {/* Department Dropdown (API) */}
            <GlassInput icon={<Apartment />}>
              <FormControl fullWidth>
                <Select
                  value={formData.department}
                  displayEmpty
                  onChange={(e) => handleChange("department", e.target.value)}
                  input={<InputBase />}
                  sx={{ color: "white" }}
                >
                  <MenuItem value="">
                    {deptLoading
                      ? "Loading departments..."
                      : "Select Department"}
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
                onChange={(e) =>
                  handleChange("employee_code", e.target.value)
                }
                sx={{ color: "white" }}
              />
            </GlassInput>

            <GlassInput icon={<Person />}>
              <InputBase
                fullWidth
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) =>
                  handleChange("first_name", e.target.value)
                }
                sx={{ color: "white" }}
              />
            </GlassInput>

            <GlassInput icon={<Person />}>
              <InputBase
                fullWidth
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) =>
                  handleChange("last_name", e.target.value)
                }
                sx={{ color: "white" }}
              />
            </GlassInput>

            <GlassInput icon={<Email />}>
              <InputBase
                fullWidth
                placeholder="Employee Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                sx={{ color: "white" }}
              />
            </GlassInput>

            <GlassInput icon={<Phone />}>
              <InputBase
                fullWidth
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                sx={{ color: "white" }}
              />
            </GlassInput>

            <GlassInput icon={<Work />}>
              <InputBase
                fullWidth
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) =>
                  handleChange("designation", e.target.value)
                }
                sx={{ color: "white" }}
              />
            </GlassInput>

            <GlassInput icon={<CalendarMonth />}>
              <InputBase
                fullWidth
                type="date"
                value={formData.date_of_joining}
                onChange={(e) =>
                  handleChange("date_of_joining", e.target.value)
                }
                sx={{ color: "white" }}
              />
            </GlassInput>

            {/* Save Button */}
            <Button
              fullWidth
              startIcon={<Save />}
              onClick={handleSubmit}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                color: "#0d47a1",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              Save Employee
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEmployee;
