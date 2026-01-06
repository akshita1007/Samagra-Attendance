// ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ToastContext = createContext();

const theme = createTheme({
  palette: {
    primary: { main: '#023e8a' }, // French Blue
  }
});

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => {
      const toastToRemove = prev.find(toast => toast.id === id);
      if (toastToRemove?.onClose) {
        toastToRemove.onClose();
      }
      return prev.filter(toast => toast.id !== id);
    });
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 4000,
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
      onClose,
      startTime: Date.now()
    };

    setToasts(prev => [...prev, newToast]);

    if (duration !== null) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Fixed container styles for different positions
  const getContainerStyle = (position) => {
    const base = {
      position: 'fixed',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none', // Allow clicking through container
    };

    switch (position) {
      case 'top-left': return { ...base, top: 20, left: 20, alignItems: 'flex-start' };
      case 'top-center': return { ...base, top: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
      case 'bottom-left': return { ...base, bottom: 20, left: 20, alignItems: 'flex-start' };
      case 'bottom-center': return { ...base, bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
      case 'bottom-right': return { ...base, bottom: 20, right: 20, alignItems: 'flex-end' };
      case 'top-right':
      default: return { ...base, top: 20, right: 20, alignItems: 'flex-end' };
    }
  };

  // Group toasts by position to render them in correct containers
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position || 'top-right';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {});

  // Animation Keyframes
  const animationStyles = `
    @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideInLeft { from { transform: translateX(-120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideInUp { from { transform: translateY(120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInDown { from { transform: translateY(-120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes progress { from { width: 100%; } to { width: 0%; } }
  `;

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      <ThemeProvider theme={theme}>
        <style>{animationStyles}</style>
        {children}

        {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
          <Box key={position} sx={getContainerStyle(position)}>
            {positionToasts.map((toast) => {
              // Determine animation based on position
              let animation = 'slideInRight';
              if (position.includes('left')) animation = 'slideInLeft';
              if (position === 'top-center') animation = 'slideInDown';
              if (position.includes('bottom')) animation = 'slideInUp';

              const bgColors = {
                success: 'linear-gradient(135deg, #0077b6 0%, #0096c7 100%)',   // Bright Teal -> Blue Green
                error: 'linear-gradient(135deg, #d90429 0%, #ef233c 100%)',     // Vivid Red
                warning: 'linear-gradient(135deg, #ff9f1c 0%, #ffbf69 100%)',   // Orange
                info: 'linear-gradient(135deg, #023e8a 0%, #0077b6 100%)',      // French Blue -> Bright Teal
              };

              const iconBg = {
                success: 'rgba(255, 255, 255, 0.2)',
                error: 'rgba(255, 255, 255, 0.2)',
                warning: 'rgba(255, 255, 255, 0.2)',
                info: 'rgba(255, 255, 255, 0.2)',
              };

              return (
                <Box
                  key={toast.id}
                  sx={{
                    width: '340px',
                    maxWidth: '90vw',
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    color: '#03045e', // Deep Twilight
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(2, 62, 138, 0.15), 0 2px 6px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    animation: `${animation} 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) forwards`,
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    position: 'relative',
                    pointerEvents: 'auto', // Re-enable pointer events for the toast itself
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(2, 62, 138, 0.25)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', p: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      {/* Icon */}
                      <Box sx={{
                        p: 1.2,
                        borderRadius: '12px',
                        background: bgColors[toast.type] || bgColors.info,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        {toast.type === 'success' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        {toast.type === 'error' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
                        {toast.type === 'info' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
                        {toast.type === 'warning' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
                      </Box>

                      {/* Content */}
                      <Box>
                        {toast.title && <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}>{toast.title}</Typography>}
                        <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.4, fontSize: '0.92rem' }}>{toast.message}</Typography>
                      </Box>
                    </Box>

                    {/* Close Button */}
                    <IconButton
                      size="small"
                      onClick={() => removeToast(toast.id)}
                      sx={{
                        color: '#023e8a',
                        opacity: 0.5,
                        p: 0.5,
                        '&:hover': { opacity: 1, bgcolor: 'rgba(2, 62, 138, 0.08)' }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Actions */}
                  {toast.action && (
                    <Box sx={{ px: 2, pb: 2, mt: -1 }}>
                      {toast.action}
                    </Box>
                  )}

                  {/* Progress Bar */}
                  {toast.duration && (
                    <Box sx={{
                      height: '3px',
                      background: 'rgba(0,0,0,0.04)',
                      width: '100%',
                      position: 'absolute',
                      bottom: 0,
                      left: 0
                    }}>
                      <Box sx={{
                        height: '100%',
                        background: bgColors[toast.type] || bgColors.info,
                        width: '100%',
                        animation: `progress ${toast.duration}ms linear forwards`
                      }} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
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
  const { showToast } = context;

  const helpers = React.useMemo(() => ({
    success: (message, options = {}) => showToast(message, { ...options, type: 'success' }),
    error: (message, options = {}) => showToast(message, { ...options, type: 'error' }),
    warning: (message, options = {}) => showToast(message, { ...options, type: 'warning' }),
    info: (message, options = {}) => showToast(message, { ...options, type: 'info' }),
  }), [showToast]);

  return { ...context, ...helpers };
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