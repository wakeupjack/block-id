import { createTheme } from '@mui/material/styles';

// Buat instance tema gelap.
const theme = createTheme({
  palette: {
    mode: 'dark', // Aktifkan mode gelap
    primary: {
      main: '#90caf9', // Biru muda sebagai warna utama
    },
    secondary: {
      main: '#f48fb1', // Pink muda sebagai warna aksen
    },
    background: {
      default: '#121212', // Latar belakang gelap standar
      paper: '#1e1e1e',   // Warna kertas yang sedikit lebih terang
    },
    text: {
        primary: '#ffffff',
        secondary: '#b0bec5',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: {
        fontWeight: 600,
        textTransform: 'none',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
        containedPrimary: {
            color: '#000'
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            }
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }
        }
    }
  },
});

export default theme;