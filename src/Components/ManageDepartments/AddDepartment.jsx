import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    IconButton,
    Toolbar,
    Card,
    CardContent,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";

// Existing components
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const drawerWidth = 240;

const AddDepartment = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        email: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Layout handlers
    const toggleDrawer = () => setIsSidebarOpen((p) => !p);
    const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };
    const handleRefresh = () => { };
    const handleExport = () => { };

    // Input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    // Validation
    const validateForm = () => {
        const e = {};

        // Name validation
        if (!formData.name.trim()) {
            e.name = "Department name is required";
        } else if (formData.name.trim().length < 2) {
            e.name = "Department name must be at least 2 characters";
        } else if (formData.name.trim().length > 100) {
            e.name = "Department name cannot exceed 100 characters";
        }

        // Code validation
        if (!formData.code.trim()) {
            e.code = "Department code is required";
        } else if (!/^[A-Z0-9]{2,10}$/.test(formData.code)) {
            e.code = "2–10 uppercase alphanumeric only";
        }

        // Email validation
        if (!formData.email.trim()) {
            e.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            e.email = "Please enter a valid email address";
        } else if (formData.email.length > 100) {
            e.email = "Email cannot exceed 100 characters";
        }

        // Description validation
        if (!formData.description.trim()) {
            e.description = "Description is required";
        } else if (formData.description.trim().length < 10) {
            e.description = "Description must be at least 10 characters";
        } else if (formData.description.trim().length > 500) {
            e.description = "Description cannot exceed 500 characters";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Submit department form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix all validation errors");
            return;
        }

        // Get token from localStorage or sessionStorage
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

            // Prepare the request body
            const requestBody = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                code: formData.code.trim(),
                description: formData.description.trim(),
            };

            console.log("Submitting department data:", requestBody);

            // API Call to create department
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/departments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            // Check if response is OK
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle specific HTTP status codes
                if (response.status === 401) {
                    toast.error("Session expired. Please login again.");
                    handleLogout();
                    return;
                } else if (response.status === 403) {
                    toast.error("You don't have permission to create departments.");
                    return;
                } else if (response.status === 409) {
                    toast.error("Department code or name already exists.");
                    return;
                }

                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Department created successfully:", data);

            // Show success message
            toast.success("🎉 Department created successfully!");

            // Navigate back to department list after a short delay
            setTimeout(() => {
                navigate("/department");
            }, 1500);

        } catch (err) {
            console.error("Error creating department:", err);

            // Handle network errors
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error(err.message || "Failed to create department. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => navigate("/department");

    // Handle form submission on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit(e);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: "#f8fafc",
                    minHeight: "100vh",
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }}
            >
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

                <Box sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
                    {/* Page Header */}
                    {/* Page Header */}
                    <Box
                        sx={{
                            position: "relative",
                            mb: 4,
                            textAlign: "center",
                        }}
                    >
                        {/* Back Button */}
                        <IconButton
                            onClick={handleBack}
                            disabled={loading}
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                "&:hover": {
                                    bgcolor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        {/* Centered Title */}
                        <Typography variant="h4" fontWeight={700}>
                            Create New Department
                        </Typography>
                    </Box>


                    {/* Form */}
                    <Card sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
                                <Grid container spacing={3} direction="column">
                                    {/* Department Name Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Department Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            required
                                            placeholder="Enter department name"
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BusinessIcon color={errors.name ? "error" : "action"} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Department Code Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Department Code"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            error={!!errors.code}
                                            helperText={errors.code || "2-10 uppercase letters/numbers only"}
                                            required
                                            placeholder="e.g., IT001"
                                            disabled={loading}
                                            inputProps={{
                                                style: { textTransform: 'uppercase' },
                                                maxLength: 10
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CodeIcon color={errors.code ? "error" : "action"} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Department Email Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Department Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            required
                                            placeholder="department@example.com"
                                            disabled={loading}
                                            inputProps={{
                                                maxLength: 100
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon color={errors.email ? "error" : "action"} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Description Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            error={!!errors.description}
                                            helperText={`${formData.description.length}/500 ${errors.description || "Brief description of the department"}`}
                                            multiline
                                            rows={4}
                                            required
                                            placeholder="Describe the department's purpose, functions, etc."
                                            disabled={loading}
                                            inputProps={{
                                                maxLength: 500
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DescriptionIcon color={errors.description ? "error" : "action"} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Actions Card */}
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                {/* Cancel Button */}
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={loading}
                                    sx={{ py: 1.5 }}
                                >
                                    Cancel
                                </Button>

                                {/* Submit Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        background: loading
                                            ? theme.palette.grey[400]
                                            : theme.palette.primary.main,
                                        '&:hover': {
                                            background: loading
                                                ? theme.palette.grey[400]
                                                : theme.palette.primary.dark,
                                        }
                                    }}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            <CheckCircleIcon />
                                        )
                                    }
                                >
                                    {loading ? "Creating Department..." : "Create Department"}
                                </Button>
                            </Box>

                            {/* Form Note */}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: 'block',
                                    mt: 2,
                                    textAlign: 'center',
                                    fontStyle: 'italic'
                                }}
                            >
                                All fields marked with * are required
                            </Typography>

                            {/* Authentication Note */}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: 'block',
                                    mt: 1,
                                    textAlign: 'center',
                                    fontSize: '0.75rem'
                                }}
                            >
                                Authentication token will be automatically included in the request
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default AddDepartment;

