import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphNode, GraphEdge } from '../../../types/graph';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import {
  X,
  FileCode,
  Bot,
  Zap,
} from 'lucide-react';

interface NodeDetailPanelProps {
  node: GraphNode;
  allNodes: GraphNode[];
  edges: GraphEdge[];
  onClose: () => void;
  onSelectNode: (node: GraphNode) => void;
  projectId: string;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  node,
  allNodes,
  edges,
  onClose,
  onSelectNode,
  projectId,
}) => {
  const navigate = useNavigate();

  // Find incoming and outgoing edges
  const incomingEdges = edges.filter((e) => e.target === node.id);
  const outgoingEdges = edges.filter((e) => e.source === node.id);

  const incomingNodes = incomingEdges
    .map((e) => allNodes.find((n) => n.id === e.source))
    .filter(Boolean) as GraphNode[];

  const outgoingNodes = outgoingEdges
    .map((e) => allNodes.find((n) => n.id === e.target))
    .filter(Boolean) as GraphNode[];

  const complexityColors = {
    low: 'emerald',
    medium: 'amber',
    high: 'rose',
  } as const;

  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col justify-between overflow-y-auto shadow-dropdown">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="blue" size="sm">
                {node.layer.toUpperCase()}
              </Badge>
              <Badge variant={complexityColors[node.complexity]} size="sm">
                {node.complexity} complexity
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2 font-mono break-all">
              {node.name}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">{node.path}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Summary
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {node.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Architecture Metrics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lines of Code</span>
              <span className="font-bold text-slate-800">{node.linesOfCode} LOC</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Test Coverage</span>
              <span className="font-bold text-emerald-600">{node.testCoverage}%</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fan-In (Callers)</span>
              <span className="font-bold text-blue-600">{node.fanIn} incoming</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fan-Out (Dependencies)</span>
              <span className="font-bold text-slate-800">{node.fanOut} outgoing</span>
            </div>
          </div>
        </div>

        {/* Incoming Callers */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Incoming Callers ({incomingNodes.length})</span>
          </h4>
          {incomingNodes.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">No incoming callers (top-level entrypoint)</p>
          ) : (
            <div className="space-y-1">
              {incomingNodes.map((inNode) => (
                <button
                  key={inNode.id}
                  onClick={() => onSelectNode(inNode)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <span className="font-mono text-slate-800 truncate">{inNode.name}</span>
                  <span className="text-[10px] text-blue-600 shrink-0 font-medium">Focus</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Outgoing Dependencies */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Dependencies ({outgoingNodes.length})
          </h4>
          {outgoingNodes.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">No outgoing dependencies (leaf node)</p>
          ) : (
            <div className="space-y-1">
              {outgoingNodes.map((outNode) => (
                <button
                  key={outNode.id}
                  onClick={() => onSelectNode(outNode)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <span className="font-mono text-slate-800 truncate">{outNode.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{outNode.layer}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/projects/${projectId}/explorer`)}
          leftIcon={<FileCode className="w-3.5 h-3.5" />}
        >
          Inspect in Explorer
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/ai`)}
            leftIcon={<Bot className="w-3.5 h-3.5" />}
          >
            Ask AI
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}/impact`)}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Impact
          </Button>
        </div>
      </div>
    </div>
  );
};
