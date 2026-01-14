
// File Path: src/pages/dashboard/WorldDetail.tsx
// Overview: ワールド詳細ページ
// Architecture:
//  - useParams: URLからworldIdを取得
//  - ForceGraph2D: 関係性を可視化するキャンバス
// Usage Guidelines:
//  - このコンポーネントは/dashboard/worlds/:worldIdのパスで使用されます。

import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { useRef, useEffect, useState, useCallback } from 'react';

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const nodes = [
    { id: '主人公', val: 20 },
    { id: '親友', val: 10 },
    { id: 'ライバル', val: 10 },
    { id: '謎の組織', val: 15 },
    { id: 'ヒロイン', val: 10 },
  ];

  const links = [
    { source: '主人公', target: '親友' },
    { source: '主人公', target: 'ライバル' },
    { source: '主人公', target: 'ヒロイン' },
    { source: '謎の組織', target: '主人公' },
    { source: '謎の組織', target: 'ライバル' },
  ];

  const graphData = { nodes, links };

  const handleNodeClick = useCallback((node) => {
    if (node.x !== undefined && node.y !== undefined) {
        fgRef.current?.centerAt(node.x, node.y, 1000); // 1-second animation
        fgRef.current?.zoom(2, 1000); // Zoom in, also over 1 second
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="id"
          nodeVal="val"
          onNodeClick={handleNodeClick}
        />
      )}
    </Box>
  );
};

export default WorldDetail;
