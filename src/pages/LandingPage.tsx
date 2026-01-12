import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          Linkus-MAP
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          あなたの物語を、視覚的につなげよう。キャラクター、設定、プロットの関係性を直感的なマップで描き出し、複雑な世界観をシンプルに管理するための創作支援ツールです。
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Button component={RouterLink} to="/auth/signup" variant="contained">
            無料で始める
          </Button>
          <Button component={RouterLink} to="/auth/login" variant="outlined">
            ログイン
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default LandingPage;
