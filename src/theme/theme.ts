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
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    // メイン実行ボタン / サブボタンの共通スタイル
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          borderRadius: theme.shape.borderRadius,
          fontWeight: 600,
        }),
        containedPrimary: ({ theme }) => ({
          paddingInline: theme.spacing(3),
          paddingBlock: theme.spacing(1.5),
        }),
        outlinedPrimary: ({ theme }) => ({
          paddingInline: theme.spacing(3),
          paddingBlock: theme.spacing(1.25),
        }),
      },
    },
    // 入力フィールドの共通スタイル
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
          },
        }),
      },
    },
    // カード / コンテナ風のPaper
    MuiPaper: {
      styleOverrides: {
        elevation0: {
          // elevation={0} のときはカード的な少し大きめの角丸にする
          borderRadius: 18,
        },
      },
    },
    // ダイアログの共通スタイル
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
    // DialogTitle の強調
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
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