// File Path: src/components/world/WorldCard.tsx
// File Name: WorldCard.tsx
// Overview: A card component to display world information and actions.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { World } from '@/types/world';

interface WorldCardProps {
  world: World;
  onDelete: (world: World) => void;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(world);
    handleMenuClose();
  };

  const handleCardClick = () => {
    navigate(`/world/${world.id}`);
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadows[10] : theme.shadows[3],
      }}
    >
      <IconButton
        aria-label="settings"
        onClick={handleMenuClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: isHovered ? 1 : 0.4,
          transition: 'opacity 0.3s ease-in-out',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <CardContent sx={{ pt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom noWrap>
          {world.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            height: '4.5em', // 3 lines of text
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {world.description}
        </Typography>
      </CardContent>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          作成日: {new Date(world.created_at).toLocaleDateString()}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          削除
        </MenuItem>
      </Menu>
    </Card>
  );
};
