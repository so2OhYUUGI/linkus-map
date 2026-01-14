
// File Path: src/pages/dashboard/WorldSelector.tsx
// File Name: WorldSelector.tsx
// Overview: 

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardActionArea,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { CreateWorldForm } from '@/components/world';
import { useWorlds } from '@/hooks';
import type { World } from '@/types/world';
import { WorldCard } from '@/components/world/WorldCard';

const WorldSelector: React.FC = () => {
  const theme = useTheme();
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

  const handleDeleteRequest = (world: World) => {
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '70vh', // Ensure vertical centering
            py: { xs: 4, md: 8 },
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}` }}
            >
              新しい世界を創造しましょう
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px' }}>
              まだワールドがありません。最初の世界を生み出して、物語のつながりを描き始めましょう。
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateOpen}
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              ワールド新規作成
            </Button>
          </Stack>
        </Box>
      );
    }

    return (
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              border: `2px dashed ${theme.palette.divider}`,
              transition: 'border-color 0.3s, background-color 0.3s',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <CardActionArea
              onClick={handleCreateOpen}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
              }}
            >
              <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                新規作成
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        {worlds.map((world) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={world.id}>
            <WorldCard world={world} onDelete={handleDeleteRequest} />
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
          py: { xs: 4, md: 8 },
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
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorldSelector;
