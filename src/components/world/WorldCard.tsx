
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
  Stack,
  Tooltip,
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
    event.stopPropagation(); // Prevent card's onClick
    setAnchorEl(event.currentTarget);
  };

  // Make event optional, as onClose can be triggered by backdrop click or escape key
  const handleMenuClose = (event?: React.SyntheticEvent | Event) => {
    event?.stopPropagation(); // Prevent card's onClick
    setAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card's onClick
    onDelete(world);
    handleMenuClose(event);
  };

  const handleCardClick = () => {
    navigate(`/dashboard/worlds/${world.id}`);
  };

  // Combine hover and menu open state to keep the card elevated
  const showActions = isHovered || isMenuOpen;

  return (
    // 1. Wrap in Fragment
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          // 2. Use combined state for hover effect
          transform: showActions ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: showActions ? theme.shadows[10] : theme.shadows[3],
        }}
      >
        <IconButton
          aria-label="settings"
          onClick={handleMenuClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            // 2. Use combined state for opacity
            opacity: showActions ? 1 : 0.4,
            transition: 'opacity 0.3s ease-in-out',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
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

        <Box
          sx={{
            p: 2,
            pt: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            作成日: {new Date(world.created_at).toLocaleDateString()}
          </Typography>
          <Tooltip title="情報の規模: 準備中">
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="flex-end"
              sx={{
                '&:hover .indicator-bar': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              <Box
                className="indicator-bar"
                sx={{
                  width: '4px',
                  height: '6px',
                  bgcolor: 'divider',
                  transition: 'background-color 0.2s',
                }}
              />
              <Box
                className="indicator-bar"
                sx={{
                  width: '4px',
                  height: '10px',
                  bgcolor: 'divider',
                  transition: 'background-color 0.2s',
                }}
              />
              <Box
                className="indicator-bar"
                sx={{
                  width: '4px',
                  height: '14px',
                  bgcolor: 'divider',
                  transition: 'background-color 0.2s',
                }}
              />
            </Stack>
          </Tooltip>
        </Box>
      </Card>

      {/* 1. Menu moved outside the Card */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={() => handleMenuClose()}
        // 3. Stop propagation on the menu itself to prevent card click
        onClick={(e) => e.stopPropagation()}
        MenuListProps={{
          'aria-labelledby': 'world-card-menu-button',
        }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          削除
        </MenuItem>
      </Menu>
    </>
  );
};
