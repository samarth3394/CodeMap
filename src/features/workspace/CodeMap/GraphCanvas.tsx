import React, { useRef, useState, useEffect } from 'react';
import { GraphNode, GraphEdge } from '../../../types/graph';
import {
  Layers,
  Cpu,
  Database,
  Globe,
  Code2,
  Move,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode) => void;
  zoom: number;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  zoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas Pan State
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node Dragging State (User can drag cards to rearrange anytime!)
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number } }>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Sync node positions when nodes prop changes
  useEffect(() => {
    setNodePositions((prev) => {
      const next = { ...prev };
      nodes.forEach((n) => {
        if (!next[n.id]) {
          next[n.id] = { x: n.x, y: n.y };
        }
      });
      return next;
    });
  }, [nodes]);

  // Reset to auto-arranged clean positions
  const handleAutoArrange = () => {
    const clean: { [id: string]: { x: number; y: number } } = {};
    nodes.forEach((n) => {
      clean[n.id] = { x: n.x, y: n.y };
    });
    setNodePositions(clean);
    setPan({ x: 40, y: 30 });
  };

  // MOUSE DOWN: Start Canvas Pan OR Card Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if clicked inside a node card
    const nodeCard = target.closest('[data-node-id]') as HTMLElement | null;
    if (nodeCard) {
      const id = nodeCard.getAttribute('data-node-id');
      if (id) {
        const currentPos = nodePositions[id] || { x: 0, y: 0 };
        setDraggingNodeId(id);
        // Calculate offset in zoom-adjusted coordinates
        setNodeDragOffset({
          x: e.clientX / zoom - currentPos.x,
          y: e.clientY / zoom - currentPos.y,
        });
        return;
      }
    }

    // Otherwise: Pan canvas background
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  // MOUSE MOVE: Update Card position OR Canvas Pan
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = Math.round(e.clientX / zoom - nodeDragOffset.x);
      const newY = Math.round(e.clientY / zoom - nodeDragOffset.y);
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: { x: newX, y: newY },
      }));
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  // MOUSE UP: Finish Dragging / Panning
  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // MOUSE WHEEL: Natural 2D Trackpad & Mousewheel Scrolling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setPan((prev) => ({
      x: prev.x - e.deltaX * 0.9,
      y: prev.y - e.deltaY * 0.9,
    }));
  };

  // Quick Pan Direction Buttons
  const handlePanStep = (dx: number, dy: number) => {
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'database':
        return <Database className="w-3.5 h-3.5 text-purple-600" />;
      case 'external':
        return <Globe className="w-3.5 h-3.5 text-slate-500" />;
      case 'service':
        return <Cpu className="w-3.5 h-3.5 text-blue-600" />;
      case 'class':
        return <Layers className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const CARD_WIDTH = 220;
  const CARD_HEIGHT = 125;

  return (
    <div
      ref={containerRef}
      id="canvas-bg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="relative flex-1 h-full w-full overflow-hidden bg-slate-50/70 select-none cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: `radial-gradient(#E2E8F0 1.2px, transparent 1.2px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Floating Canvas Quick Navigation Pad */}
      <div className="absolute bottom-5 right-5 z-40 bg-white border border-slate-200/90 rounded-2xl shadow-card p-2.5 flex items-center gap-2">
        {/* Directional Pad */}
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onClick={() => handlePanStep(0, 100)}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
            title="Pan Up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <div />
          <button
            onClick={() => handlePanStep(100, 0)}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
            title="Pan Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAutoArrange}
            className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-mono text-[10px] font-bold"
            title="Auto-Arrange Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handlePanStep(-100, 0)}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
            title="Pan Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div />
          <button
            onClick={() => handlePanStep(0, -100)}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900"
            title="Pan Down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div />
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        {/* Tip Badge */}
        <div className="text-[11px] text-slate-500 font-medium pr-1">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Move className="w-3 h-3 text-blue-600" />
            <span>Interactive Canvas</span>
          </div>
          <span className="text-[10px] text-slate-400">Drag cards or scroll to pan</span>
        </div>
      </div>

      {/* Canvas container with pan and zoom transform */}
      <div
        className="absolute top-0 left-0 w-[2400px] h-[1600px] transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Layer horizontal guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[50px] left-8 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              Presentation & API Routing
            </span>
            <div className="w-[1800px] h-px bg-slate-200/80 dashed" />
          </div>

          <div className="absolute top-[350px] left-8 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              Service Orchestration Layer
            </span>
            <div className="w-[1800px] h-px bg-slate-200/80 dashed" />
          </div>

          <div className="absolute top-[520px] left-8 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              Domain Rules & Entities
            </span>
            <div className="w-[1800px] h-px bg-slate-200/80 dashed" />
          </div>

          <div className="absolute top-[700px] left-8 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              Infrastructure & Persistence
            </span>
            <div className="w-[1800px] h-px bg-slate-200/80 dashed" />
          </div>
        </div>

        {/* SVG Edges Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#94A3B8" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#2563EB" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const srcNode = nodes.find((n) => n.id === edge.source);
            const tgtNode = nodes.find((n) => n.id === edge.target);
            if (!srcNode || !tgtNode) return null;

            // Use dynamic positions if dragged, or fallback
            const src = nodePositions[edge.source] || { x: srcNode.x, y: srcNode.y };
            const tgt = nodePositions[edge.target] || { x: tgtNode.x, y: tgtNode.y };

            const isConnectedToSelected =
              selectedNode?.id === edge.source || selectedNode?.id === edge.target;
            const isConnectedToHovered =
              hoveredNodeId === edge.source || hoveredNodeId === edge.target;
            const isHighlighted = isConnectedToSelected || isConnectedToHovered;

            // Calculate anchor points
            let srcX = src.x + CARD_WIDTH / 2;
            let srcY = src.y + CARD_HEIGHT;
            let tgtX = tgt.x + CARD_WIDTH / 2;
            let tgtY = tgt.y;

            // Horizontal / Same-Tier Routing Check
            const dy = tgt.y - src.y;
            const dx = tgt.x - src.x;

            if (Math.abs(dy) < 50) {
              // Side-by-side connection
              if (dx > 0) {
                srcX = src.x + CARD_WIDTH;
                srcY = src.y + CARD_HEIGHT / 2;
                tgtX = tgt.x;
                tgtY = tgt.y + CARD_HEIGHT / 2;
              } else {
                srcX = src.x;
                srcY = src.y + CARD_HEIGHT / 2;
                tgtX = tgt.x + CARD_WIDTH;
                tgtY = tgt.y + CARD_HEIGHT / 2;
              }
            } else if (dy < 0) {
              // Target is above Source
              srcY = src.y;
              tgtY = tgt.y + CARD_HEIGHT;
            }

            // Smooth cubic bezier path
            const deltaY = tgtY - srcY;
            const cp1X = srcX;
            const cp1Y = srcY + deltaY * 0.5;
            const cp2X = tgtX;
            const cp2Y = tgtY - deltaY * 0.5;

            const pathD = `M ${srcX} ${srcY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${tgtX} ${tgtY}`;

            // Midpoint for label badge
            const midX = (srcX + tgtX) / 2;
            const midY = (srcY + tgtY) / 2;

            return (
              <g key={edge.id} className="transition-opacity duration-150">
                {/* Connecting Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHighlighted ? '#2563EB' : '#94A3B8'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeOpacity={
                    hoveredNodeId || selectedNode
                      ? isHighlighted
                        ? 1
                        : 0.25
                      : 0.85
                  }
                  strokeDasharray={edge.type === 'data_flow' ? '4 3' : undefined}
                  markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                />

                {/* Clear White Pill Badge for Edge Label */}
                {edge.label && (
                  <g
                    transform={`translate(${midX}, ${midY})`}
                    opacity={
                      hoveredNodeId || selectedNode
                        ? isHighlighted
                          ? 1
                          : 0.3
                        : 0.95
                    }
                  >
                    <rect
                      x={-((edge.label.length * 6.5) / 2 + 6)}
                      y={-10}
                      width={edge.label.length * 6.5 + 12}
                      height={20}
                      rx={5}
                      fill="#FFFFFF"
                      stroke={isHighlighted ? '#2563EB' : '#CBD5E1'}
                      strokeWidth={isHighlighted ? 1.5 : 1}
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                    />
                    <text
                      x={0}
                      y={4}
                      fill={isHighlighted ? '#1D4ED8' : '#475569'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight={isHighlighted ? '700' : '600'}
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNodeId === node.id;
          const pos = nodePositions[node.id] || { x: node.x, y: node.y };

          const complexityBadge = {
            low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            medium: 'bg-amber-50 text-amber-700 border-amber-200',
            high: 'bg-rose-50 text-rose-700 border-rose-200',
          }[node.complexity];

          return (
            <div
              key={node.id}
              data-node-id={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className={`absolute w-[220px] bg-white rounded-xl border p-3.5 cursor-grab active:cursor-grabbing shadow-sm transition-shadow duration-150 ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/25 shadow-dropdown z-30'
                  : isHovered
                  ? 'border-blue-400 shadow-md z-20 -translate-y-0.5'
                  : 'border-slate-200/90 hover:border-slate-300 z-10'
              }`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                    {getNodeIcon(node.type)}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 truncate">
                    {node.name.split(':')[0]}
                  </span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded border font-medium shrink-0 ${complexityBadge}`}
                >
                  {node.complexity}
                </span>
              </div>

              {/* Symbol / Method name */}
              {node.name.includes(':') && (
                <div className="mt-1 text-[11px] font-mono text-blue-600 font-semibold truncate">
                  :{node.name.split(':')[1]}
                </div>
              )}

              {/* Path */}
              <div className="mt-2 text-[10px] text-slate-500 truncate font-mono">
                {node.path}
              </div>

              {/* Stats Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{node.linesOfCode} LOC</span>
                <span>{node.testCoverage}% test</span>
                <span className="text-blue-600 font-bold">{node.fanOut} out</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
