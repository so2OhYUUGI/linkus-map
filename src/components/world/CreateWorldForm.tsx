// File Path: src/components/world/CreateWorldForm.tsx
// File Name: CreateWorldForm.tsx
// Overview: A dialog component for creating a new world.

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import type { NewWorld } from '@/types/world'; // 1. NewWorldをインポート

interface CreateWorldFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewWorld) => Promise<void>; // 2. onCreateの型をNewWorldに修正
}

export const CreateWorldForm: React.FC<CreateWorldFormProps> = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return; // Basic validation
    await onCreate({ title, description });
    // Reset form for next use
    setTitle('');
    setDescription('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>ワールドを創生</DialogTitle>
      <Box component="form" onSubmit={handleCreate}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="ワールド名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
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
          <Button onClick={onClose}>
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
  );
};
