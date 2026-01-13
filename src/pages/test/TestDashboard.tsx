import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Paper,
  alpha,
} from '@mui/material';

const TestDashboard: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [worldName, setWorldName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setWorldName('');
    setGenre('');
    setDescription('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // モック: 送信後はダイアログを閉じるだけ
    handleClose();
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
    <Box
      sx={{
        minHeight: '100vh',
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

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>ワールドを創生</DialogTitle>
        <Box component="form" onSubmit={handleCreate}>
          <DialogContent sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="ワールド名"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="ジャンル（例: ファンタジー、SF など）"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              fullWidth
            />
            <TextField
              label="説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} variant="text">
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              創生
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TestDashboard;
