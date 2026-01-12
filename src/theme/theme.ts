import { createTheme, alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

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

// ブランドエリアのスタイルを生成する関数
export const createBrandAreaStyles = (theme: Theme) => {
  const primaryColor = theme.palette.primary.main;
  const primaryColorAlpha15 = alpha(primaryColor, 0.15);
  const primaryColorAlpha10 = alpha(primaryColor, 0.1);

  return {
    width: { xs: '100%', md: '60%' },
    minHeight: { xs: '50vh', md: '100vh' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'background.default',
    position: 'relative' as const,
    overflow: 'hidden',
    // primary.mainのソフトなグラデーション（ぼんやりした光）
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: '-50%',
      right: '-20%',
      width: theme.spacing(75),
      height: theme.spacing(75),
      background: `radial-gradient(circle, ${primaryColorAlpha15} 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: `blur(${theme.spacing(7.5)})`,
    },
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: '-30%',
      left: '-10%',
      width: theme.spacing(62.5),
      height: theme.spacing(62.5),
      background: `radial-gradient(circle, ${primaryColorAlpha10} 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: `blur(${theme.spacing(6.25)})`,
    },
  };
};

// タイトルのグラデーションスタイルを生成する関数
export const createTitleGradientStyles = (theme: Theme) => {
  const primaryColor = theme.palette.primary.main;
  const primaryColorAlpha90 = alpha(primaryColor, 0.9);
  const primaryColorAlpha70 = alpha(primaryColor, 0.7);

  return {
    fontWeight: 800,
    letterSpacing: '0.15rem',
    fontSize: { xs: theme.typography.h3.fontSize, md: theme.typography.h1.fontSize },
    background: `linear-gradient(135deg, ${primaryColorAlpha90} 0%, ${primaryColorAlpha70} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };
};

export default theme;