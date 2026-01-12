import { createTheme } from '@mui/material/styles';

// --- Color Palette ---
const primaryColor = '#6366f1'; // Indigo: 知性と繋がり
const secondaryColor = '#f59e0b'; // Amber: ひらめきとアクセント
const darkBackgroundColor = '#0f172a'; // Deep Navy Blue for Dark Mode

// --- Base Typography ---
const baseTypography = {
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
};

// --- Light Theme ---
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    // MUIのデフォルトのライト背景色を使用
  },
  typography: baseTypography,
});

// --- Dark Theme ---
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: darkBackgroundColor,
      paper: '#1e293b', // カードやモーダル用に少し明るい紺色
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.90)',
      secondary: 'rgba(255, 255, 255, 0.70)',
    }
  },
  typography: baseTypography,
});
