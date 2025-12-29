// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Chip,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   Stack,
//   TablePagination,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Tooltip,
//   Fab,
//   Zoom,
//   Tabs,
//   Tab,
//   Badge,
//   Menu,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   CardActionArea,
//   LinearProgress,
//   alpha,
//   useTheme
// } from '@mui/material';
// import {
//   Search,
//   FilterList,
//   LocationOn,
//   Email,
//   Phone,
//   Person,
//   Work,
//   Event,
//   CheckCircle,
//   Pending,
//   Sort,
//   Add,
//   Edit,
//   Delete,
//   Visibility,
//   Download,
//   Print,
//   Refresh,
//   MoreVert,
//   FilterAlt,
//   Group,
//   VerifiedUser,
//   AccessTime,
//   Place,
//   QrCode,
//   TrendingUp,
//   PersonAdd,
//   Share,
//   Info,
//   Star,
//   ArrowUpward,
//   ArrowDownward,
//   Clear,
//   Dashboard
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import Sidebar from "../Sidebar/Sidebar";
// import Header from "../Header/Header";


// const EmployeeManagement = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [designationFilter, setDesignationFilter] = useState('all');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     pending: 0,
//     locations: 0,
//     avgExperience: 0
//   });
//   const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
//   const [quickFilters, setQuickFilters] = useState({
//     newHires: false,
//     recentActivity: false,
//     needsAttention: false
//   });
//   const toggleDrawer = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const theme = useTheme();

//   // Fetch data from API
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const rawToken = localStorage.getItem("token") || sessionStorage.getItem("token");

//       if (!rawToken) {
//         toast.error("Session expired. Please login again.");
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:4040/qr/employees/getAll', {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${rawToken}`,
//           },
//         });
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }
//         const result = await response.json();

//         setEmployees(result.data);
//         setFilteredEmployees(result.data);
//         calculateStats(result.data);
//       } catch (err) {
//         setError(err.message);
//         toast.error('Failed to load employees');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Calculate statistics
//   const calculateStats = (data) => {
//     const total = data.length;
//     const approved = data.filter(e => e.approval_status === 'approved').length;
//     const pending = data.filter(e => e.approval_status === 'pending').length;
//     const locations = new Set(data.filter(e => e.current_lat && e.current_lng).map(e => `${e.current_lat},${e.current_lng}`)).size;
//     const avgExperience = data.reduce((acc, emp) => {
//       const joinDate = new Date(emp.date_of_joining);
//       const experience = (new Date() - joinDate) / (365 * 24 * 60 * 60 * 1000);
//       return acc + experience;
//     }, 0) / total || 0;

//     setStats({ total, approved, pending, locations, avgExperience: avgExperience.toFixed(1) });
//   };

//   // Filter and search functionality
//   useEffect(() => {
//     let result = employees;

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(emp =>
//         emp.first_name.toLowerCase().includes(term) ||
//         emp.last_name.toLowerCase().includes(term) ||
//         emp.email.toLowerCase().includes(term) ||
//         emp.employee_code.includes(term) ||
//         emp.designation.toLowerCase().includes(term)
//       );
//     }

//     // Status filter
//     if (statusFilter !== 'all') {
//       result = result.filter(emp => emp.approval_status === statusFilter);
//     }

//     // Designation filter
//     if (designationFilter !== 'all') {
//       result = result.filter(emp => emp.designation === designationFilter);
//     }

//     // Quick filters
//     if (quickFilters.newHires) {
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//       result = result.filter(emp => new Date(emp.date_of_joining) > thirtyDaysAgo);
//     }

//     if (quickFilters.needsAttention) {
//       result = result.filter(emp => emp.approval_status === 'pending');
//     }

//     setFilteredEmployees(result);
//     setPage(0);
//   }, [searchTerm, statusFilter, designationFilter, employees, quickFilters]);

//   // Sorting function
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });

//     const sorted = [...filteredEmployees].sort((a, b) => {
//       if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
//       if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     setFilteredEmployees(sorted);
//   };

//   // Handle pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get experience in years
//   const getExperience = (dateString) => {
//     const joinDate = new Date(dateString);
//     const experience = (new Date() - joinDate) / (365 * 24 * 60 * 60 * 1000);
//     return experience.toFixed(1);
//   };

//   // Get unique designations for filter
//   const uniqueDesignations = [...new Set(employees.map(emp => emp.designation))];

//   // Calculate paginated data
//   const paginatedEmployees = filteredEmployees.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   // Status chip color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'approved': return 'success';
//       case 'pending': return 'warning';
//       default: return 'default';
//     }
//   };

//   // Get initials for avatar
//   const getInitials = (firstName, lastName) => {
//     return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
//   };

//   // View employee details
//   const handleViewEmployee = (employee) => {
//     setSelectedEmployee(employee);
//     setViewDialogOpen(true);
//   };

//   // Handle menu
//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle quick filter toggle
//   const handleQuickFilterToggle = (filter) => {
//     setQuickFilters(prev => ({
//       ...prev,
//       [filter]: !prev[filter]
//     }));
//   };

//   // Export data
//   const handleExport = () => {
//     toast.info('Export feature coming soon!');
//   };

//   // Refresh data
//   const handleRefresh = () => {
//     window.location.reload();
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column" gap={2}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" color="textSecondary">
//           Loading employee data...
//         </Typography>
//         <LinearProgress sx={{ width: '300px', borderRadius: 1 }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <Alert severity="error" sx={{ m: 2 }}>
//           <Typography variant="h6">Error Loading Data</Typography>
//           <Typography>{error}</Typography>
//           <Button onClick={handleRefresh} sx={{ mt: 1 }} startIcon={<Refresh />}>
//             Retry
//           </Button>
//         </Alert>
//       </motion.div>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />



//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           backgroundColor: "#f4f6f8",
//           minHeight: "100vh",
//         }}
//       >
//         {/* Header */}
//         {/* <Header toggleDrawer={toggleDrawer} /> */}
//         <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
//           {/* Floating Action Button */}
//           <Zoom in={true}>
//             <Fab
//               color="primary"
//               sx={{
//                 position: 'fixed',
//                 bottom: 24,
//                 right: 24,
//                 zIndex: 1000,
//               }}
//               onClick={() => toast.info('Add new employee feature coming soon!')}
//             >
//               <Add />
//             </Fab>
//           </Zoom>

//           {/* Header with Tabs */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <Box sx={{ mb: 4 }}>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Box>
//                   <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
//                     Employee Management
//                   </Typography>
//                   <Typography color="textSecondary" variant="subtitle1">
//                     Manage and monitor your workforce efficiently
//                   </Typography>
//                 </Box>
//                 <Stack direction="row" spacing={1}>
//                   <Tooltip title="Refresh">
//                     <IconButton onClick={handleRefresh} color="primary">
//                       <Refresh />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Export">
//                     <IconButton onClick={handleExport} color="primary">
//                       <Download />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="View Options">
//                     <IconButton onClick={handleMenuOpen} color="primary">
//                       <MoreVert />
//                     </IconButton>
//                   </Tooltip>
//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl)}
//                     onClose={handleMenuClose}
//                   >
//                     <MenuItem onClick={() => setViewMode('table')}>
//                       <ListItemIcon>
//                         <Dashboard />
//                       </ListItemIcon>
//                       <ListItemText>Table View</ListItemText>
//                     </MenuItem>
//                     <MenuItem onClick={() => setViewMode('grid')}>
//                       <ListItemIcon>
//                         <Group />
//                       </ListItemIcon>
//                       <ListItemText>Grid View</ListItemText>
//                     </MenuItem>
//                     <Divider />
//                     <MenuItem onClick={handleExport}>
//                       <ListItemIcon>
//                         <Download />
//                       </ListItemIcon>
//                       <ListItemText>Export Data</ListItemText>
//                     </MenuItem>
//                     <MenuItem onClick={() => window.print()}>
//                       <ListItemIcon>
//                         <Print />
//                       </ListItemIcon>
//                       <ListItemText>Print Report</ListItemText>
//                     </MenuItem>
//                   </Menu>
//                 </Stack>
//               </Box>

//               <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
//                 <Tab icon={<Group />} label="All Employees" />
//                 <Tab icon={<VerifiedUser />} label="Approved" />
//                 <Tab icon={<AccessTime />} label="Pending" />
//                 <Tab icon={<Place />} label="By Location" />
//                 <Tab icon={<TrendingUp />} label="Analytics" />
//               </Tabs>
//             </Box>
//           </motion.div>

//           {/* Stats Cards with Animation */}
//           {/* COMPACT FULL-WIDTH STATS CARDS */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <Box sx={{
//               display: 'grid',
//               gridTemplateColumns: {
//                 xs: 'repeat(2, 1fr)',
//                 sm: 'repeat(3, 1fr)',
//                 md: 'repeat(5, 1fr)',
//               },
//               gap: 1.5,
//               mb: 4
//             }}>
//               {[
//                 {
//                   title: 'Total',
//                   value: stats.total,
//                   icon: <Group />,
//                   color: 'primary',
//                   description: 'Employees'
//                 },
//                 {
//                   title: 'Approved',
//                   value: stats.approved,
//                   icon: <CheckCircle />,
//                   color: 'success',
//                   description: `${((stats.approved / stats.total) * 100 || 0).toFixed(1)}%`
//                 },
//                 {
//                   title: 'Pending',
//                   value: stats.pending,
//                   icon: <Pending />,
//                   color: 'warning',
//                   description: 'Needs review'
//                 },
//                 {
//                   title: 'Locations',
//                   value: stats.locations,
//                   icon: <Place />,
//                   color: 'info',
//                   description: 'Active'
//                 },
//                 {
//                   title: 'Experience',
//                   value: stats.avgExperience,
//                   icon: <TrendingUp />,
//                   color: 'secondary',
//                   description: 'Avg years'
//                 }
//               ].map((stat, index) => (
//                 <Paper
//                   key={index}
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     textAlign: 'center',
//                     borderRadius: 2,
//                     background: `linear-gradient(145deg, ${alpha(theme.palette[stat.color].main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
//                     border: `1px solid ${alpha(theme.palette[stat.color].main, 0.1)}`,
//                     transition: 'all 0.2s ease',
//                     cursor: 'pointer',
//                     minHeight: 110,
//                     '&:hover': {
//                       transform: 'translateY(-2px)',
//                       boxShadow: `0 4px 12px ${alpha(theme.palette[stat.color].main, 0.1)}`,
//                       background: `linear-gradient(145deg, ${alpha(theme.palette[stat.color].main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
//                     }
//                   }}
//                 >
//                   <Box sx={{
//                     color: theme.palette[stat.color].main,
//                     mb: 1.5,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}>
//                     {stat.icon}
//                   </Box>

//                   <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
//                     {stat.value}
//                   </Typography>

//                   <Typography
//                     variant="caption"
//                     sx={{
//                       fontWeight: 600,
//                       textTransform: 'uppercase',
//                       letterSpacing: 0.5,
//                       color: 'text.secondary',
//                       mb: 0.5
//                     }}
//                   >
//                     {stat.title}
//                   </Typography>

//                   <Typography
//                     variant="caption"
//                     sx={{
//                       color: theme.palette[stat.color].main,
//                       fontSize: '0.7rem',
//                       fontWeight: 500
//                     }}
//                   >
//                     {stat.description}
//                   </Typography>
//                 </Paper>
//               ))}
//             </Box>
//           </motion.div>

//           {/* Interactive Filter Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <Paper
//               sx={{
//                 p: 3,
//                 mb: 3,
//                 background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
//                 borderRadius: 2
//               }}
//             >
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={12} md={5}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Search employees by name, email, or code..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Search />
//                         </InputAdornment>
//                       ),
//                       endAdornment: searchTerm && (
//                         <InputAdornment position="end">
//                           <IconButton size="small" onClick={() => setSearchTerm('')}>
//                             <Clear />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       value={statusFilter}
//                       onChange={(e) => setStatusFilter(e.target.value)}
//                       label="Status"
//                     >
//                       <MenuItem value="all">
//                         <Box display="flex" alignItems="center">
//                           <FilterList sx={{ mr: 1, fontSize: 16 }} />
//                           All Status
//                         </Box>
//                       </MenuItem>
//                       <MenuItem value="approved">
//                         <Box display="flex" alignItems="center">
//                           <CheckCircle sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
//                           Approved
//                         </Box>
//                       </MenuItem>
//                       <MenuItem value="pending">
//                         <Box display="flex" alignItems="center">
//                           <Pending sx={{ mr: 1, fontSize: 16, color: 'warning.main' }} />
//                           Pending
//                         </Box>
//                       </MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel>Designation</InputLabel>
//                     <Select
//                       value={designationFilter}
//                       onChange={(e) => setDesignationFilter(e.target.value)}
//                       label="Designation"
//                     >
//                       <MenuItem value="all">All Designations</MenuItem>
//                       {uniqueDesignations.map((designation) => (
//                         <MenuItem key={designation} value={designation}>
//                           <Box display="flex" alignItems="center">
//                             <Work sx={{ mr: 1, fontSize: 16 }} />
//                             {designation}
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <Stack direction="row" spacing={1} justifyContent="flex-end">
//                     <Chip
//                       clickable
//                       icon={<PersonAdd />}
//                       label="New Hires"
//                       variant={quickFilters.newHires ? "filled" : "outlined"}
//                       color={quickFilters.newHires ? "primary" : "default"}
//                       onClick={() => handleQuickFilterToggle('newHires')}
//                       sx={{ transition: 'all 0.2s' }}
//                     />
//                     <Chip
//                       clickable
//                       icon={<AccessTime />}
//                       label="Needs Attention"
//                       variant={quickFilters.needsAttention ? "filled" : "outlined"}
//                       color={quickFilters.needsAttention ? "warning" : "default"}
//                       onClick={() => handleQuickFilterToggle('needsAttention')}
//                       sx={{ transition: 'all 0.2s' }}
//                     />
//                   </Stack>
//                 </Grid>
//               </Grid>

//               {/* Results Summary */}
//               <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body2" color="textSecondary">
//                   Showing {filteredEmployees.length} of {employees.length} employees
//                   {searchTerm && ` • Searching for: "${searchTerm}"`}
//                 </Typography>
//                 <Typography variant="body2">
//                   Page {page + 1} of {Math.ceil(filteredEmployees.length / rowsPerPage)}
//                 </Typography>
//               </Box>
//             </Paper>
//           </motion.div>

//           {/* View Mode Toggle */}
//           <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
//             <ButtonGroup variant="outlined" size="small">
//               <Button
//                 variant={viewMode === 'table' ? 'contained' : 'outlined'}
//                 onClick={() => setViewMode('table')}
//                 startIcon={<Dashboard />}
//               >
//                 Table
//               </Button>
//               <Button
//                 variant={viewMode === 'grid' ? 'contained' : 'outlined'}
//                 onClick={() => setViewMode('grid')}
//                 startIcon={<Group />}
//               >
//                 Grid
//               </Button>
//             </ButtonGroup>
//           </Box>

//           {/* Table View */}
//           {viewMode === 'table' ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   borderRadius: 2,
//                   overflow: 'hidden'
//                 }}
//               >
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{
//                       background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
//                     }}>
//                       <TableCell>
//                         <Typography fontWeight="bold" color="white">Employee</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" alignItems="center">
//                           <Typography fontWeight="bold" color="white">Designation</Typography>
//                           <IconButton size="small" onClick={() => handleSort('designation')} sx={{ color: 'white' }}>
//                             <Sort />
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" alignItems="center">
//                           <Typography fontWeight="bold" color="white">Status</Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" alignItems="center">
//                           <Typography fontWeight="bold" color="white">Experience</Typography>
//                           <IconButton size="small" onClick={() => handleSort('date_of_joining')} sx={{ color: 'white' }}>
//                             <Sort />
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Typography fontWeight="bold" color="white">Contact</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography fontWeight="bold" color="white">Location</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography fontWeight="bold" color="white">Actions</Typography>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {paginatedEmployees.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
//                           <Box sx={{ textAlign: 'center' }}>
//                             <Search sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
//                             <Typography variant="h6" color="textSecondary" gutterBottom>
//                               No employees found
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               Try adjusting your search or filters
//                             </Typography>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       paginatedEmployees.map((employee, index) => (
//                         <TableRow
//                           key={employee.id}
//                           hover
//                           sx={{
//                             transition: 'all 0.2s',
//                             '&:hover': {
//                               backgroundColor: alpha(theme.palette.primary.main, 0.04)
//                             }
//                           }}
//                         >
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               <Badge
//                                 overlap="circular"
//                                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                                 badgeContent={
//                                   <Avatar sx={{
//                                     width: 12,
//                                     height: 12,
//                                     border: `2px solid ${theme.palette.background.paper}`,
//                                     bgcolor: employee.approval_status === 'approved' ? 'success.main' : 'warning.main'
//                                   }} />
//                                 }
//                               >
//                                 <Avatar
//                                   sx={{
//                                     mr: 2,
//                                     bgcolor: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
//                                     width: 40,
//                                     height: 40
//                                   }}
//                                 >
//                                   {getInitials(employee.first_name, employee.last_name)}
//                                 </Avatar>
//                               </Badge>
//                               <Box>
//                                 <Typography fontWeight="medium">
//                                   {employee.first_name} {employee.last_name}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                   ID: {employee.id}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               <Work sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
//                               <Typography>{employee.designation}</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={employee.approval_status}
//                               color={getStatusColor(employee.approval_status)}
//                               size="small"
//                               icon={employee.approval_status === 'approved' ? <CheckCircle /> : <Pending />}
//                               sx={{ fontWeight: 'medium' }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               <Event sx={{ mr: 1, fontSize: 16, color: 'secondary.main' }} />
//                               <Box>
//                                 <Typography>{formatDate(employee.date_of_joining)}</Typography>
//                                 <Typography variant="caption" color="textSecondary">
//                                   {getExperience(employee.date_of_joining)} years
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Stack spacing={0.5}>
//                               <Box display="flex" alignItems="center">
//                                 <Email sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />
//                                 <Tooltip title={employee.email}>
//                                   <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
//                                     {employee.email}
//                                   </Typography>
//                                 </Tooltip>
//                               </Box>
//                               <Box display="flex" alignItems="center">
//                                 <Phone sx={{ mr: 1, fontSize: 14, color: 'text.secondary' }} />
//                                 <Typography variant="body2">{employee.mobile}</Typography>
//                               </Box>
//                             </Stack>
//                           </TableCell>
//                           <TableCell>
//                             {employee.current_lat && employee.current_lng ? (
//                               <Tooltip title="View on map">
//                                 <Chip
//                                   icon={<LocationOn />}
//                                   label="Location Active"
//                                   color="success"
//                                   size="small"
//                                   clickable
//                                   onClick={() => toast.info('Map view coming soon!')}
//                                 />
//                               </Tooltip>
//                             ) : (
//                               <Chip
//                                 label="No location"
//                                 size="small"
//                                 variant="outlined"
//                                 color="default"
//                               />
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <Stack direction="row" spacing={1}>
//                               <Tooltip title="View Details">
//                                 <IconButton
//                                   size="small"
//                                   color="primary"
//                                   onClick={() => handleViewEmployee(employee)}
//                                 >
//                                   <Visibility />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Edit">
//                                 <IconButton size="small" color="secondary">
//                                   <Edit />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="QR Code">
//                                 <IconButton size="small" color="info">
//                                   <QrCode />
//                                 </IconButton>
//                               </Tooltip>
//                             </Stack>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </motion.div>
//           ) : (
//             /* Grid View */
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <Grid container spacing={3}>
//                 {paginatedEmployees.map((employee) => (
//                   <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
//                     <Card
//                       sx={{
//                         height: '100%',
//                         transition: 'all 0.3s',
//                         '&:hover': {
//                           transform: 'translateY(-8px)',
//                           boxShadow: theme.shadows[8]
//                         }
//                       }}
//                     >
//                       <CardActionArea sx={{ height: '100%' }} onClick={() => handleViewEmployee(employee)}>
//                         <CardContent>
//                           <Box sx={{ textAlign: 'center', mb: 2 }}>
//                             <Avatar
//                               sx={{
//                                 width: 80,
//                                 height: 80,
//                                 margin: '0 auto',
//                                 bgcolor: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
//                                 fontSize: '2rem'
//                               }}
//                             >
//                               {getInitials(employee.first_name, employee.last_name)}
//                             </Avatar>
//                             <Typography variant="h6" sx={{ mt: 2 }}>
//                               {employee.first_name} {employee.last_name}
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               {employee.designation}
//                             </Typography>
//                             <Chip
//                               label={employee.approval_status}
//                               color={getStatusColor(employee.approval_status)}
//                               size="small"
//                               sx={{ mt: 1 }}
//                               icon={employee.approval_status === 'approved' ? <CheckCircle /> : <Pending />}
//                             />
//                           </Box>

//                           <Divider sx={{ my: 2 }} />

//                           <Stack spacing={1}>
//                             <Box display="flex" alignItems="center">
//                               <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                               <Typography variant="body2" noWrap>
//                                 {employee.email}
//                               </Typography>
//                             </Box>
//                             <Box display="flex" alignItems="center">
//                               <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                               <Typography variant="body2">{employee.mobile}</Typography>
//                             </Box>
//                             <Box display="flex" alignItems="center">
//                               <Event fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                               <Typography variant="body2">
//                                 {formatDate(employee.date_of_joining)}
//                               </Typography>
//                             </Box>
//                             <Box display="flex" alignItems="center">
//                               <Work fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
//                               <Typography variant="body2" noWrap>
//                                 {employee.employee_code}
//                               </Typography>
//                             </Box>
//                           </Stack>
//                         </CardContent>
//                       </CardActionArea>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </motion.div>
//           )}

//           {/* Pagination */}
//           {filteredEmployees.length > 0 && (
//             <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Typography variant="body2" color="textSecondary">
//                   Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
//                 </Typography>
//                 <TablePagination
//                   component="div"
//                   count={filteredEmployees.length}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   labelRowsPerPage="Rows per page:"
//                 />
//               </Box>
//             </Paper>
//           )}

//           {/* Employee Detail Dialog */}
//           <Dialog
//             open={viewDialogOpen}
//             onClose={() => setViewDialogOpen(false)}
//             maxWidth="md"
//             fullWidth
//           >
//             {selectedEmployee && (
//               <>
//                 <DialogTitle>
//                   <Box display="flex" alignItems="center" justifyContent="space-between">
//                     <Typography variant="h5">Employee Details</Typography>
//                     <Chip
//                       label={selectedEmployee.approval_status}
//                       color={getStatusColor(selectedEmployee.approval_status)}
//                       icon={selectedEmployee.approval_status === 'approved' ? <CheckCircle /> : <Pending />}
//                     />
//                   </Box>
//                 </DialogTitle>
//                 <DialogContent>
//                   <Grid container spacing={3}>
//                     <Grid item xs={12} md={4}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Avatar
//                           sx={{
//                             width: 120,
//                             height: 120,
//                             margin: '0 auto 20px',
//                             bgcolor: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
//                             fontSize: '3rem'
//                           }}
//                         >
//                           {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
//                         </Avatar>
//                         <Typography variant="h5">
//                           {selectedEmployee.first_name} {selectedEmployee.last_name}
//                         </Typography>
//                         <Typography variant="body1" color="textSecondary" gutterBottom>
//                           {selectedEmployee.designation}
//                         </Typography>
//                         <Typography variant="body2" color="primary">
//                           Employee ID: {selectedEmployee.id}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={12} md={8}>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Email</Typography>
//                           <Typography variant="body1">{selectedEmployee.email}</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Mobile</Typography>
//                           <Typography variant="body1">{selectedEmployee.mobile}</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Join Date</Typography>
//                           <Typography variant="body1">{formatDate(selectedEmployee.date_of_joining)}</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
//                           <Typography variant="body1">{getExperience(selectedEmployee.date_of_joining)} years</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Employee Code</Typography>
//                           <Typography variant="body1" fontFamily="monospace">
//                             {selectedEmployee.employee_code}
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="textSecondary">Location</Typography>
//                           {selectedEmployee.current_lat && selectedEmployee.current_lng ? (
//                             <Typography variant="body1">
//                               {selectedEmployee.current_lat.toFixed(6)}, {selectedEmployee.current_lng.toFixed(6)}
//                             </Typography>
//                           ) : (
//                             <Typography variant="body1" color="textSecondary">Not available</Typography>
//                           )}
//                         </Grid>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
//                   <Button variant="contained" startIcon={<Edit />}>Edit</Button>
//                   <Button variant="outlined" startIcon={<QrCode />}>View QR</Button>
//                 </DialogActions>
//               </>
//             )}
//           </Dialog>
//         </Box>
//       </Box>
//     </Box>
//   );


// };

// // Add missing ButtonGroup component
// const ButtonGroup = ({ children, ...props }) => (
//   <Box
//     sx={{
//       display: 'inline-flex',
//       borderRadius: 1,
//       overflow: 'hidden',
//       border: '1px solid',
//       borderColor: 'divider',
//       '& button': {
//         borderRadius: 0,
//         borderRight: '1px solid',
//         borderColor: 'divider',
//         '&:last-child': {
//           borderRight: 'none'
//         }
//       }
//     }}
//     {...props}
//   >
//     {children}
//   </Box>
// );

// export default EmployeeManagement;

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
 import {useNavigate} from "react-router-dom";

           


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
        const res = await fetch("http://localhost:4040/qr/employees/getAll", {
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
              sx={{ position: "fixed", bottom: 24, right: 30 }}
              onClick={() => navigate("/employees/add")}
            >
              <Add />
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
