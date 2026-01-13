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
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../../lib/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

const TestDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [worldName, setWorldName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const userEmail = user?.email || 'Unknown User';
  const userName = userEmail.split('@')[0];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setWorldName('');
    setGenre('');
    setDescription('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    handleClose();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default', // theme.tsの背景色を適用
      }}
    >
      {/* --- サイドバー --- */}
      <Paper
        elevation={0}
        sx={{
          width: 72,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'transparent', // 背後のテーマグラデーションを活かす
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
          L
        </Typography>
        <Stack spacing={4} sx={{ flexGrow: 1 }}>
          <Tooltip title="ワールド一覧" placement="right">
            <IconButton color="primary"><GridViewIcon /></IconButton>
          </Tooltip>
          <Tooltip title="ライブラリ" placement="right">
            <IconButton><AutoStoriesIcon /></IconButton>
          </Tooltip>
          <Tooltip title="関係図" placement="right">
            <IconButton><AccountTreeIcon /></IconButton>
          </Tooltip>
        </Stack>
        <IconButton sx={{ mb: 2 }}><SettingsIcon /></IconButton>
      </Paper>

      {/* --- メインコンテンツ --- */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* --- トップバー --- */}
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            px: 4,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500, letterSpacing: 1 }}>
            LinkusMap <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>- Workspace</Typography>
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{userName}</Typography>
              <Typography variant="caption" color="text.secondary">{userEmail}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.8rem' }}>
              {userName[0]?.toUpperCase()}
            </Avatar>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <IconButton size="small" onClick={handleLogout} color="inherit">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* --- キャンバスエリア --- */}
        <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 800,
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              borderRadius: theme.shape.borderRadius, // themeの定義を使用
              border: 1,
              borderStyle: 'dashed',
              borderColor: 'divider',
              bgcolor: 'transparent',
              transition: theme.transitions.create(['border-color', 'background-color']),
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover', // themeに基づくホバー色
              },
            }}
          >
            <Stack spacing={4} alignItems="center">
              <Box sx={{
                width: 80, height: 80, borderRadius: '50%',
                bgcolor: 'action.selected',
                display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2
              }}>
                <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -1 }}>
                  物語の種をまく
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
                  ここはあなたの創造の原点です。人物、事件、設定を繋ぎ合わせ、まだ誰も知らない世界を構築しましょう。
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoStoriesIcon />}
                onClick={handleOpen}
                sx={{ py: 1.5, px: 4 }}
              >
                ワールドを新規創生
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* --- ダイアログ --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>ワールドを創生</DialogTitle>
        <Box component="form" onSubmit={handleCreate}>
          <DialogContent sx={{ display: 'grid', gap: 3, pt: 1 }}>
            <TextField
              label="ワールド名"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="ジャンル"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              fullWidth
            />
            <TextField
              label="世界の説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={4}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} color="inherit">キャンセル</Button>
            <Button type="submit" variant="contained">創生</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TestDashboard;