


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import AdminPage from "./Components/AdminDashboard/Admin"; 
import ManageEmployee from "./Components/ManageEmployee/ManageEmployee"; 
import AddEmployee from "./Components/ManageEmployee/AddEmployee"; 
import ManageDepartment from "./Components/ManageDepartments/ManageDepartments"; 
import AddDepartment from "./Components/ManageDepartments/AddDepartment"; 
import PendingLists from "./Components/PendingApproveList/PendingLists"; 
import "./App.css";

import { ToastProvider } from './Utils/Toast/ToastContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
import LeaveRequest from "./Components/LeaveRequest/LeaveRequest";
import OnDutyRequest from "./Components/OnDutyRequest/OnDutyRequest";

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

            <Route path="/department" element={<ManageDepartment />} />

             <Route path="/department/add" element={<AddDepartment />} />

            <Route path="/approval" element={<PendingLists />} />

            <Route path="/leave" element={<LeaveRequest />} />

            <Route path="/onduty" element={<OnDutyRequest />} />
             
             <Route path="*" element={<LoginPage />} />


          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;