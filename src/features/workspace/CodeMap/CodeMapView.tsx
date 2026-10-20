import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from '../../../data/mockData';
import { GraphNode } from '../../../types/graph';
import { GraphToolbar } from './GraphToolbar';
import { GraphCanvas } from './GraphCanvas';
import { NodeDetailPanel } from './NodeDetailPanel';

export const CodeMapView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { selectedProject } = useProject();

  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [complexityFilter, setComplexityFilter] = useState('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(MOCK_GRAPH_NODES[3]); // default to CheckoutService

  const filteredNodes = useMemo(() => {
    return MOCK_GRAPH_NODES.filter((node) => {
      const matchesSearch =
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLayer = selectedLayer === 'all' || node.layer === selectedLayer;
      const matchesComplexity =
        complexityFilter === 'all' || node.complexity === complexityFilter;

      return matchesSearch && matchesLayer && matchesComplexity;
    });
  }, [searchQuery, selectedLayer, complexityFilter]);

  const activeNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return MOCK_GRAPH_EDGES.filter(
      (edge) => activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target)
    );
  }, [activeNodeIds]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-white">
      {/* Top Controls Toolbar */}
      <GraphToolbar
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(2, z + 0.15))}
        onZoomOut={() => setZoom((z) => Math.max(0.4, z - 0.15))}
        onResetZoom={() => setZoom(1)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLayer={selectedLayer}
        onSelectLayer={setSelectedLayer}
        complexityFilter={complexityFilter}
        onSelectComplexity={setComplexityFilter}
        nodesCount={filteredNodes.length}
        edgesCount={filteredEdges.length}
      />

      {/* Main Canvas & Details Panel Viewport */}
      <div className="relative flex-1 flex overflow-hidden">
        <GraphCanvas
          nodes={filteredNodes}
          edges={filteredEdges}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          zoom={zoom}
        />

        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            allNodes={MOCK_GRAPH_NODES}
            edges={MOCK_GRAPH_EDGES}
            onClose={() => setSelectedNode(null)}
            onSelectNode={setSelectedNode}
            projectId={projectId || selectedProject.id}
          />
        )}
      </div>
    </div>
  );
};
