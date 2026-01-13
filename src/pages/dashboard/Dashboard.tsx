// File Path: src/pages/dashboard/Dashboard.tsx
// File Name: Dashboard.tsx
// Overview: The main dashboard page where users can view and manage their worlds.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigateのインポート
import {
  Box,
  Stack,
  Typography,
  Button,
  useTheme,
  Paper,
  alpha,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateWorldForm } from '@/components/world';
import { useWorlds } from '@/hooks/useWorlds';
import type { World } from '@/types/world';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // 2. useNavigateフックを使用
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [worldToDelete, setWorldToDelete] = useState<World | null>(null);

  const {
    worlds,
    fetchAllWorlds,
    createWorld,
    deleteWorld,
    isLoading,
    error,
  } = useWorlds();

  useEffect(() => {
    fetchAllWorlds();
  }, [fetchAllWorlds]);

  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);

  // 3. ワールドカードクリック時の遷移ハンドラ
  const handleWorldClick = (worldId: string) => {
    navigate(`/world/${worldId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, world: World) => {
    e.stopPropagation(); // 親要素へのクリックイベント伝播を停止
    setWorldToDelete(world);
  };

  const handleDeleteConfirm = async () => {
    if (worldToDelete) {
      await deleteWorld(worldToDelete.id);
      setWorldToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setWorldToDelete(null);
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

  const renderContent = () => {
    if (isLoading && worlds.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (worlds.length === 0) {
      return (
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
            <Button variant="contained" size="large" onClick={handleCreateOpen}>
              ＋ ワールド新規作成
            </Button>
          </Stack>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {worlds.map((world) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={world.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer', // 4. カーソルをポインターに
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
              onClick={() => handleWorldClick(world.id)} // 5. クリックイベントを追加
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {world.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {world.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                  作成日: {new Date(world.created_at).toLocaleDateString()}
                </Typography>
                <IconButton
                  aria-label="delete"
                  onClick={(e) => handleDeleteClick(e, world)} // 6. 削除ボタンのイベントハンドラを修正
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };


  return (
    <>
      <Box
        sx={{
          minHeight: '100%',
          bgcolor: 'background.default',
          py: { xs: 6, md: 10 },
          px: { xs: 3, md: 6 },
          backgroundImage: backgroundGlow,
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
          {renderContent()}
        </Stack>
      </Box>

      <CreateWorldForm
        open={isCreateOpen}
        onClose={handleCreateClose}
        onCreate={async (data) => {
          const newWorld = await createWorld(data);
          if (newWorld) {
            handleCreateClose();
          }
        }}
      />

      <Dialog
        open={!!worldToDelete}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ワールドの削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            本当に「{worldToDelete?.title}」を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;