import React from 'react';
import {
  Box,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { Network } from 'lucide-react';
import AuthForm from '../components/auth/AuthForm';
import { createBrandAreaStyles, createTitleGradientStyles } from '../theme/theme';

const LandingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* 左側：ブランドエリア（60%） */}
      <Box
        sx={createBrandAreaStyles(theme)}
      >
        <Stack
          spacing={theme.spacing(3)}
          alignItems="center"
          textAlign="center"
          sx={{
            position: 'relative',
            zIndex: 1,
            px: theme.spacing(4),
          }}
        >
          <Box sx={{ mb: theme.spacing(2) }}>
            <Network
              size={64}
              style={{
                color: theme.palette.primary.main,
              }}
            />
          </Box>

          <Typography
            variant="h1"
            component="h1"
            sx={createTitleGradientStyles(theme)}
          >
            links-map
          </Typography>

          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{
              fontSize: { xs: theme.typography.h6.fontSize, md: theme.typography.h5.fontSize },
              fontWeight: 300,
              letterSpacing: '0.05rem',
            }}
          >
            思考を繋ぎ、可視化する。
          </Typography>
        </Stack>
      </Box>

      {/* 右側：ログインエリア（40%） */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          minHeight: { xs: '50vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          px: { xs: theme.spacing(3), md: theme.spacing(4) },
          py: { xs: theme.spacing(4), md: 0 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: theme.spacing(50),
          }}
        >
          <AuthForm />
        </Box>
      </Box>
    </Stack>
  );
};

export default LandingPage;
