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

interface CreateWorldFormProps {
  open: boolean;
  onClose: () => void;
}

export const CreateWorldForm: React.FC<CreateWorldFormProps> = ({ open, onClose }) => {
  const [worldName, setWorldName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Just close the dialog on submission
    onClose();
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
          <Button onClick={onClose} variant="text">
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
