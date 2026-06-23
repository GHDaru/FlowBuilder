import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

const getMaterialTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6442D6',
      light: '#8B5CF6',
      dark: '#4A2BAF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: mode === 'dark' ? '#C8B3FD' : '#8B5CF6',
      light: '#E6DBFF',
      dark: '#9B7BF7',
      contrastText: mode === 'dark' ? '#0F172A' : '#FFFFFF',
    },
    background: {
      default: mode === 'dark' ? '#0F172A' : '#F1F5F9',
      paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#F8FAFC' : '#111827',
      secondary: mode === 'dark' ? '#94A3B8' : '#4B5563',
    },
    success: {
      main: '#16A34A',
    },
    warning: {
      main: '#D97706',
    },
    error: {
      main: '#DC2626',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'Roboto', fontWeight: 700 },
    h2: { fontFamily: 'Roboto', fontWeight: 700 },
    h3: { fontFamily: 'Roboto', fontWeight: 700 },
    h4: { fontFamily: 'Roboto', fontWeight: 700 },
    h5: { fontFamily: 'Roboto', fontWeight: 700 },
    h6: { fontFamily: 'Roboto', fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: mode === 'dark' ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
  },
});

export default getMaterialTheme;
