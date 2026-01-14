
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
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// Import sample data and types
import { SAMPLE_WORLD_NOBUNAGA } from '@/constants/sampleDataNobunaga';
import type { Entity, Connection, ConnectionTag } from '@/types/db';

// カスタムノードとリンクの型定義
// Note: These interfaces are adapted for the ForceGraph2D library's needs.
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
  const { worldId } = useParams<{ worldId: string }>(); // worldId is not used for now as we use sample data
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

  // Process sample data for the graph
  const graphData = useMemo(() => {
    const { entities, connections, connectionTags } = SAMPLE_WORLD_NOBUNAGA;

    const nodes: CustomNodeObject[] = entities.map((entity: Entity) => ({
      id: entity.id,
      name: entity.name,
      val: 10, // Default size value
    }));

    const tagMap = new Map<string, ConnectionTag>(
      connectionTags.map((tag) => [tag.id, tag])
    );

    const getLinkType = (tagText: string): 'positive' | 'negative' | 'neutral' => {
      if (['敵対', '裏切り', '被害者'].includes(tagText)) {
        return 'negative';
      }
      if (['家族', '同盟', '主君', '配偶者'].includes(tagText)) {
        return 'positive';
      }
      return 'neutral';
    };

    const links: CustomLinkObject[] = connections.map((conn: Connection) => {
      const tag = tagMap.get(conn.tag_id);
      const label = tag?.text || '関係';
      return {
        source: conn.from_id,
        target: conn.to_id,
        label: label,
        type: getLinkType(label),
        strength: 5, // Default strength
      };
    });

    return { nodes, links };
  }, []);

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

    // Curve control points
    const controlPoints = (link as any).__controlPoints;
    let textPos;
    if (controlPoints) {
      const [cpX, cpY] = controlPoints;
      const t = 0.5; // midpoint
      const invT = 1 - t;
      textPos = {
        x: invT * invT * start.x + 2 * invT * t * cpX + t * t * end.x,
        y: invT * invT * start.y + 2 * invT * t * cpY + t * t * end.y
      };
    } else {
      // Straight line midpoint
      textPos = {
        x: start.x + (end.x - start.x) / 2,
        y: start.y + (end.y - start.y) / 2,
      };
    }

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
          linkCurvature="auto"
          linkWidth={(link) =>
            ((highlightLinks.has(link as CustomLinkObject) ? 2.5 : 1.5) *
              (link as CustomLinkObject).strength) / 5
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
          linkDirectionalArrowLength={8}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={(link) =>
            (link as CustomLinkObject).strength / 2
          }
          linkDirectionalParticleWidth={(link) =>
            highlightLinks.has(link as CustomLinkObject) ? 4 : 2
          }
        />
      )}
    </Box>
  );
};

export default WorldDetail;
