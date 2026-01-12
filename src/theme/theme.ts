import { createTheme } from '@mui/material/styles';

const primaryColor = '#6366f1';
const secondaryColor = '#f59e0b';
const darkBackgroundColor = '#0f172a';

const theme = createTheme({
  // CSS変数（CSS variables）ベースのテーマを有効化
  cssVariables: true,
  colorSchemes: {
    // ライトモードの設定
    light: {
      palette: {
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: secondaryColor,
        },
      },
    },
    // ダークモードの設定
    dark: {
      palette: {
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: secondaryColor,
        },
        background: {
          default: darkBackgroundColor,
          paper: '#1e293b',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.90)',
          secondary: 'rgba(255, 255, 255, 0.70)',
        },
      },
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

export default theme;