// ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  Slide,
  Box,
  AlertTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ToastContext = createContext();

const theme = createTheme({
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 5000,
      title,
      position = 'top-right',
      action,
      onClose
    } = options;

    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      duration,
      title,
      position,
      action,
      onClose
    };

    setToasts(prev => [...prev, newToast]);

    if (duration !== null) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
        if (onClose) onClose();
      }, duration);
    }

    return id; // Return ID for manual removal
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => {
      const toastToRemove = prev.find(toast => toast.id === id);
      if (toastToRemove?.onClose) {
        toastToRemove.onClose();
      }
      return prev.filter(toast => toast.id !== id);
    });
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getPositionStyle = (position) => {
    const positions = {
      'top-right': { top: 20, right: 20 },
      'top-left': { top: 20, left: 20 },
      'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: 20, right: 20 },
      'bottom-left': { bottom: 20, left: 20 },
      'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)' },
    };
    return positions[position] || positions['top-right'];
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      <ThemeProvider theme={theme}>
        {children}
        
        {/* Render all toasts */}
        {toasts.map((toast) => {
          const positionStyle = getPositionStyle(toast.position);
          
          return (
            <Box
              key={toast.id}
              sx={{
                position: 'fixed',
                zIndex: 9999,
                ...positionStyle,
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <Snackbar
                open={true}
                anchorOrigin={{
                  vertical: toast.position.includes('top') ? 'top' : 'bottom',
                  horizontal: toast.position.includes('left') 
                    ? 'left' 
                    : toast.position.includes('right') 
                    ? 'right' 
                    : 'center',
                }}
                TransitionComponent={(props) => <Slide {...props} direction="left" />}
              >
                <Alert
                  severity={toast.type}
                  variant="filled"
                  elevation={6}
                  action={
                    <Box display="flex" alignItems="center">
                      {toast.action}
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => removeToast(toast.id)}
                        sx={{ ml: 1 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    width: '100%',
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                    backgroundColor: (theme) => {
                      const colors = {
                        success: theme.palette.success.dark,
                        error: theme.palette.error.dark,
                        warning: theme.palette.warning.dark,
                        info: theme.palette.info.dark,
                      };
                      return colors[toast.type] || theme.palette.info.dark;
                    },
                  }}
                >
                  {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
                  {toast.message}
                </Alert>
              </Snackbar>
            </Box>
          );
        })}
      </ThemeProvider>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Helper functions for common toast types
const createToastHelpers = (showToast) => ({
  success: (message, options = {}) => 
    showToast(message, { ...options, type: 'success' }),
  
  error: (message, options = {}) => 
    showToast(message, { ...options, type: 'error' }),
  
  warning: (message, options = {}) => 
    showToast(message, { ...options, type: 'warning' }),
  
  info: (message, options = {}) => 
    showToast(message, { ...options, type: 'info' }),
});

export { ToastProvider, useToast, createToastHelpers };