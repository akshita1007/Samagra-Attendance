import { createTheme } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      main: '#023e8a', // French Blue
      light: '#0096c7', // Blue Green
      dark: '#03045e', // Deep Twilight
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00b4d8', // Turquoise Surf
      light: '#48cae4', // Sky Aqua
      dark: '#0077b6', // Bright Teal Blue
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f8ff', // Alice Blue
      paper: '#ffffff',
    },
    warning: {
      main: '#48cae4', // Sky Aqua (used as highlight/warning)
    },
    success: {
      main: '#2e7d32', // Green for Present/Success
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0096c7', // Blue Green
      light: '#48cae4',
      dark: '#023e8a',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#03045e', // Deep Twilight
      secondary: '#023e8a', // French Blue
      disabled: '#90caf9',
    },
    error: {
      main: '#d32f2f', // Standard Red for errors (keeping distinct for usability)
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

export default theme;