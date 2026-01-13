// File Path: src/pages/test/TestDashboard.tsx
// File Name: TestDashboard.tsx
// Overview: A test dashboard page that displays a welcome message and a button to create a new world.

import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  useTheme,
  Paper,
  alpha,
} from '@mui/material';
import { CreateWorldForm } from '@/components/world';

const TestDashboard: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const backgroundGlow = `radial-gradient(circle at 20% 20%, ${alpha(
    theme.palette.primary.main,
    0.12,
  )}, transparent 40%), radial-gradient(circle at 80% 30%, ${alpha(
    theme.palette.secondary.main,
    0.12,
  )}, transparent 45%), radial-gradient(circle at 40% 80%, ${alpha(
    theme.palette.primary.main,
    0.08,
  )}, transparent 50%)`;

  return (
    <>
      <Box
        sx={{
          height: '100%', // 親要素の高さいっぱいに広がるように変更
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: theme.spacing(3), md: theme.spacing(6) },
          py: { xs: theme.spacing(6), md: theme.spacing(10) },
          backgroundImage: backgroundGlow,
        }}
      >
        <Paper elevation={0} sx={{ width: '100%', maxWidth: theme.spacing(80), p: { xs: 4, md: 6 } }}>
          <Stack spacing={3} alignItems="flex-start">
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                空のワールド
              </Typography>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                新しい世界を創造しましょう
              </Typography>
              <Typography variant="body1" color="text.secondary">
                まだワールドがありません。最初の世界を生み出して、物語のつながりを描き始めましょう。
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="large"
              onClick={handleOpen}
            >
              ＋ ワールド新規作成
            </Button>
          </Stack>
        </Paper>
      </Box>

      <CreateWorldForm open={open} onClose={handleClose} />
    </>
  );
};

export default TestDashboard;
