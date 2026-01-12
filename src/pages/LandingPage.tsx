import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default', // テーマの背景色を使用
        color: 'text.primary',       // テーマのテキスト色を使用
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '.1rem',
            }}
          >
            links-map
          </Typography>

          <Typography variant="h5" component="p" color="text.secondary">
            思考とアイデアを繋げ、創造性を解き放つマッピングツール
          </Typography>

          <Button
            component={RouterLink}
            to="/auth/signup" // 仮のリンク先
            variant="contained"
            size="large"
            sx={{ mt: 2, textTransform: 'none', fontSize: '1.2rem' }}
          >
            今すぐ利用開始
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;
