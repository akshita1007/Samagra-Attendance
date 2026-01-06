// useToast.js (optional - for easier imports)
import { useToast as useBaseToast } from './ToastContext';

export const useToast = () => {
  const { showToast, removeToast, clearAllToasts } = useBaseToast();
  
  return {
    showToast,
    removeToast,
    clearAllToasts,
    success: (message, options = {}) => 
      showToast(message, { ...options, type: 'success' }),
    
    error: (message, options = {}) => 
      showToast(message, { ...options, type: 'error' }),
    
    warning: (message, options = {}) => 
      showToast(message, { ...options, type: 'warning' }),
    
    info: (message, options = {}) => 
      showToast(message, { ...options, type: 'info' }),
    
    // Quick methods with common configurations
    showSuccess: (message, title = 'Success!') => 
      showToast(message, { type: 'success', title }),
    
    showError: (message, title = 'Error!') => 
      showToast(message, { type: 'error', title }),
    
    showWarning: (message, title = 'Warning!') => 
      showToast(message, { type: 'warning', title }),
    
    showInfo: (message, title = 'Info') => 
      showToast(message, { type: 'info', title }),
  };
};