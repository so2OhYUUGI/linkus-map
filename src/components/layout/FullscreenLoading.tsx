import { Box, CircularProgress } from '@mui/material';

export const FullscreenLoading = () => (
  <Box
    sx={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress />
  </Box>
);
