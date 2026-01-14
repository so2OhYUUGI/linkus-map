
// File Path: src/pages/dashboard/WorldDetail.tsx
// Overview: ワールド詳細ページ
// Architecture:
//  - useParams: URLからworldIdを取得
//  - ForceGraph2D: 関係性を可視化するキャンバス
// Usage Guidelines:
//  - このコンポーネントは/dashboard/worlds/:worldIdのパスで使用されます。

import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
  LinkObject,
} from 'react-force-graph-2d';
import { useRef, useEffect, useState, useCallback } from 'react';

// カスタムノードの型定義
interface CustomNodeObject extends NodeObject {
  id: string;
  name: string;
  val: number;
}

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverNode, setHoverNode] = useState<CustomNodeObject | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  // ダミーデータに `name` プロパティを追加
  const graphData = {
    nodes: [
      { id: '主人公', name: '主人公', val: 20 },
      { id: '親友', name: '親友', val: 10 },
      { id: 'ライバル', name: 'ライバル', val: 10 },
      { id: '謎の組織', name: '謎の組織', val: 15 },
      { id: 'ヒロイン', name: 'ヒロイン', val: 10 },
    ] as CustomNodeObject[],
    links: [
      { source: '主人公', target: '親友' },
      { source: '主人公', target: 'ライバル' },
      { source: '主人公', target: 'ヒロイン' },
      { source: '謎の組織', target: '主人公' },
      { source: '謎の組織', target: 'ライバル' },
    ],
  };

  const handleNodeClick = useCallback((node: NodeObject) => {
    const customNode = node as CustomNodeObject;
    if (customNode.x !== undefined && customNode.y !== undefined) {
      fgRef.current?.centerAt(customNode.x, customNode.y, 1000);
      fgRef.current?.zoom(2, 1000);
    }
  }, []);

  const handleNodeHover = (node: NodeObject | null) => {
    if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;

    const newHighlightNodes = new Set();
    const newHighlightLinks = new Set();

    if (node) {
      newHighlightNodes.add(node);
      fgRef.current?.graphData().links.forEach((link: LinkObject) => {
        if (link.source === node || link.target === node) {
          newHighlightLinks.add(link);
          newHighlightNodes.add(link.source as CustomNodeObject);
          newHighlightNodes.add(link.target as CustomNodeObject);
        }
      });
    }

    setHoverNode(node as CustomNodeObject | null);
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  };

  const nodeCanvasObject = (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const customNode = node as CustomNodeObject;
    const label = customNode.name;
    const fontSize = 14 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    const radius = Math.sqrt(customNode.val) * 2;

    // 円の描画
    ctx.beginPath();
    ctx.arc(customNode.x!, customNode.y!, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle =
      customNode === hoverNode
        ? 'rgb(255,160,122)'
        : highlightNodes.size > 0 && !highlightNodes.has(customNode)
        ? 'rgba(180, 180, 180, 0.5)'
        : 'rgba(31, 120, 180, 0.8)';
    ctx.fill();

    // テキストの描画（ハロー効果付き）
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4 / globalScale;
    ctx.strokeText(label, customNode.x!, customNode.y!);
    ctx.fillStyle = highlightNodes.size > 0 && !highlightNodes.has(customNode) ? 'rgba(50, 50, 50, 0.6)' : 'black';
    ctx.fillText(label, customNode.x!, customNode.y!);
  };

  return (
    <Box
      ref={containerRef}
      sx={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          nodeCanvasObject={nodeCanvasObject}
          linkWidth={(link) => (highlightLinks.has(link) ? 2.5 : 1)}
          linkColor={() => 'rgba(200, 200, 200, 0.6)'}
          linkDirectionalParticles={1}
          linkDirectionalParticleWidth={(link) =>
            highlightLinks.has(link) ? 4 : 0
          }
          linkDirectionalParticleColor={(link: LinkObject) =>
            highlightNodes.has(link.source as CustomNodeObject) && highlightNodes.has(link.target as CustomNodeObject)
              ? 'rgb(255,160,122)'
              : 'rgba(0,0,0,0)'
          }
        />
      )}
    </Box>
  );
};

export default WorldDetail;
