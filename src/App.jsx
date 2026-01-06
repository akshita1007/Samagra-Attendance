// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./Components/Login/LoginPage";
// import AdminPage from "./Components/AdminDashboard/Admin"; // adjust path if needed
// import "./App.css";

// function App() {
//   return (
    
//     <Router>
//       <Routes>
//         {/* ✅ Login Page at "/" */}
//         <Route path="/" element={<LoginPage />} />

//         {/* ✅ Admin Page after login */}
//         <Route path="/admin" element={<AdminPage />} />

//         {/* ✅ Redirect unknown routes to login */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import AdminPage from "./Components/AdminDashboard/Admin"; // adjust path if needed
import ManageEmployee from "./Components/ManageEmployee/ManageEmployee"; // New import
import AddEmployee from "./Components/ManageEmployee/AddEmployee"; // New import
import "./App.css";

import { ToastProvider } from './Utils/Toast/ToastContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
     <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
    <Router>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />

       
        <Route path="/admin" element={<AdminPage />} />

        
        <Route path="/employee" element={<ManageEmployee />} /> 

        <Route path="/employees/add" element={<AddEmployee />} /> 
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;