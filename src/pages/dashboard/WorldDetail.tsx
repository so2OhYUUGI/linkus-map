
// File Path: src/pages/dashboard/WorldDetail.tsx
// Overview: ワールド詳細ページ
// Architecture:
//  - useParams: URLからworldIdを取得
//  - Typography: ワールドIDを画面に表示
//  - Box: レイアウト調整
// Usage Guidelines:
//  - このコンポーネントは/dashboard/worlds/:worldIdのパスで使用されます。

import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Typography variant="h2">World: {worldId}</Typography>
    </Box>
  );
};

export default WorldDetail;
