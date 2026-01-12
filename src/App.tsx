import React from 'react';
import { Box, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h1">
        Linkus-MAP
      </Typography>
    </Box>
  );
};

export default App;
