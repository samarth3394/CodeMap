import React, { useRef, useState } from 'react';
import { GraphNode, GraphEdge } from '../../../types/graph';
import {
  Layers,
  Cpu,
  Database,
  Globe,
  Code2,
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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag when clicking background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  return (
    <div
      ref={containerRef}
      id="canvas-bg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex-1 h-full w-full overflow-hidden bg-slate-50/70 select-none cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: `radial-gradient(#E2E8F0 1.2px, transparent 1.2px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Canvas container with pan and zoom transform */}
      <div
        className="absolute top-0 left-0 w-[1200px] h-[900px] transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Layer horizontal guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[60px] left-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Presentation & API Routing
          </div>
          <div className="absolute top-[280px] left-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Service Orchestration Layer
          </div>
          <div className="absolute top-[440px] left-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Domain Rules & Entities
          </div>
          <div className="absolute top-[570px] left-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Infrastructure & Persistence
          </div>
        </div>

        {/* SVG Edges Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
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
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#2563EB" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const src = nodes.find((n) => n.id === edge.source);
            const tgt = nodes.find((n) => n.id === edge.target);
            if (!src || !tgt) return null;

            const isHighlighted =
              selectedNode?.id === edge.source ||
              selectedNode?.id === edge.target ||
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target;

            // Compute smooth cubic bezier path
            const srcX = src.x + 95;
            const srcY = src.y + 40;
            const tgtX = tgt.x + 95;
            const tgtY = tgt.y;

            const deltaY = tgtY - srcY;
            const cp1X = srcX;
            const cp1Y = srcY + deltaY * 0.5;
            const cp2X = tgtX;
            const cp2Y = tgtY - deltaY * 0.5;

            const pathD = `M ${srcX} ${srcY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${tgtX} ${tgtY}`;

            return (
              <g key={edge.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHighlighted ? '#2563EB' : '#CBD5E1'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={edge.type === 'data_flow' ? '4 3' : undefined}
                  markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                  className="transition-colors duration-150"
                />
                {edge.label && (
                  <text
                    x={(srcX + tgtX) / 2}
                    y={(srcY + tgtY) / 2 - 4}
                    fill={isHighlighted ? '#1D4ED8' : '#64748B'}
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="bg-white px-1 select-none pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNodeId === node.id;

          const complexityBadge = {
            low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            medium: 'bg-amber-50 text-amber-700 border-amber-200',
            high: 'bg-rose-50 text-rose-700 border-rose-200',
          }[node.complexity];

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className={`absolute w-52 bg-white rounded-xl border p-3 cursor-pointer shadow-sm transition-all duration-150 ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-dropdown z-30'
                  : isHovered
                  ? 'border-slate-400 shadow-md z-20 -translate-y-0.5'
                  : 'border-slate-200/90 hover:border-slate-300 z-10'
              }`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                    {getNodeIcon(node.type)}
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-900 truncate">
                    {node.name.split(':')[0]}
                  </span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border font-medium shrink-0 ${complexityBadge}`}>
                  {node.complexity}
                </span>
              </div>

              {node.name.includes(':') && (
                <div className="mt-1 text-[11px] font-mono text-blue-600 truncate">
                  :{node.name.split(':')[1]}
                </div>
              )}

              <div className="mt-2 text-[10px] text-slate-500 truncate">{node.path}</div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{node.linesOfCode} LOC</span>
                <span>{node.testCoverage}% test</span>
                <span className="text-blue-600 font-medium">{node.fanOut} out</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
