
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
  type ForceGraphMethods,
  type NodeObject,
  type LinkObject,
} from 'react-force-graph-2d';
import { useRef, useEffect, useState, useCallback } from 'react';

// カスタムノードとリンクの型定義
interface CustomNodeObject extends NodeObject {
  id: string;
  name: string;
  val: number;
}

interface CustomLinkObject extends LinkObject {
  source: string | CustomNodeObject;
  target: string | CustomNodeObject;
  label: string;
  type: 'positive' | 'negative' | 'neutral';
  strength: number;
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

  // ダミーデータの更新
  const graphData = {
    nodes: [
      { id: '主人公', name: '主人公', val: 20 },
      { id: '親友', name: '親友', val: 10 },
      { id: 'ライバル', name: 'ライバル', val: 10 },
      { id: '謎の組織', name: '謎の組織', val: 15 },
      { id: 'ヒロイン', name: 'ヒロイン', val: 10 },
    ] as CustomNodeObject[],
    links: [
      {
        source: '主人公',
        target: '親友',
        label: '協力者',
        type: 'positive',
        strength: 8,
      },
      {
        source: '主人公',
        target: 'ライバル',
        label: '宿敵',
        type: 'negative',
        strength: 9,
      },
      {
        source: '主人公',
        target: 'ヒロイン',
        label: '恋人',
        type: 'positive',
        strength: 10,
      },
      {
        source: '謎の組織',
        target: '主人公',
        label: '敵対',
        type: 'negative',
        strength: 7,
      },
      {
        source: '謎の組織',
        target: 'ライバル',
        label: '利用',
        type: 'neutral',
        strength: 5,
      },
    ] as CustomLinkObject[],
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
      graphData.links.forEach((link) => {
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

    ctx.beginPath();
    ctx.arc(customNode.x!, customNode.y!, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle =
      customNode === hoverNode
        ? 'rgb(255,160,122)'
        : highlightNodes.size > 0 && !highlightNodes.has(customNode)
        ? 'rgba(180, 180, 180, 0.5)'
        : 'rgba(31, 120, 180, 0.8)';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4 / globalScale;
    ctx.strokeText(label, customNode.x!, customNode.y!);
    ctx.fillStyle = highlightNodes.size > 0 && !highlightNodes.has(customNode) ? 'rgba(50, 50, 50, 0.6)' : 'black';
    ctx.fillText(label, customNode.x!, customNode.y!);
  };

  const linkCanvasObject = (
    link: LinkObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const customLink = link as CustomLinkObject;
    const label = customLink.label;
    const start = customLink.source as CustomNodeObject;
    const end = customLink.target as CustomNodeObject;

    if (!start?.x || !start?.y || !end?.x || !end?.y) return;

    const textPos = {
      x: start.x + (end.x - start.x) / 2,
      y: start.y + (end.y - start.y) / 2,
    };

    const fontSize = 12 / globalScale;
    ctx.font = `italic ${fontSize}px Sans-Serif`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3 / globalScale;
    ctx.strokeText(label, textPos.x, textPos.y);
    ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
    ctx.fillText(label, textPos.x, textPos.y);
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
          linkCanvasObjectMode={() => 'after'}
          linkCanvasObject={linkCanvasObject}
          linkWidth={(link) =>
            (highlightLinks.has(link as CustomLinkObject) ? 2.5 : 1) *
            (link as CustomLinkObject).strength / 5
          }
          linkColor={(link) => {
            const customLink = link as CustomLinkObject;
            if (highlightLinks.has(customLink)) return 'rgb(255,160,122)';
            switch (customLink.type) {
              case 'positive':
                return 'rgba(0, 150, 255, 0.8)';
              case 'negative':
                return 'rgba(255, 50, 50, 0.8)';
              default:
                return 'rgba(200, 200, 200, 0.6)';
            }
          }}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={(link) =>
            highlightLinks.has(link as CustomLinkObject)
              ? (link as CustomLinkObject).strength
              : 0
          }
          linkDirectionalParticleWidth={2}
        />
      )}
    </Box>
  );
};

export default WorldDetail;
