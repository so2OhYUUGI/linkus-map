import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // 'light' or 'dark'
    primary: {
      main: '#646cff',
    },
    background: {
      default: '#242424',
      paper: '#1a1a1a',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '3.2em',
      lineHeight: 1.1,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        a {
          font-weight: 500;
          color: #646cff;
          text-decoration: inherit;
        }
        a:hover {
          color: #535bf2;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid transparent',
          padding: '0.6em 1.2em',
          fontSize: '1em',
          fontWeight: 500,
          fontFamily: 'inherit',
          backgroundColor: '#1a1a1a',
          cursor: 'pointer',
          transition: 'border-color 0.25s',
          '&:hover': {
            borderColor: '#646cff',
          },
          '&:focus, &:focus-visible': {
            outline: '4px auto -webkit-focus-ring-color',
          },
        },
      },
    },
  },
});

export default theme;
