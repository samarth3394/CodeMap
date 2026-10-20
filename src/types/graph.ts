export type NodeType = 'module' | 'service' | 'class' | 'function' | 'database' | 'external';

export type LayerType = 'presentation' | 'api' | 'service' | 'domain' | 'infrastructure' | 'external';

export interface GraphNode {
  id: string;
  name: string;
  path: string;
  type: NodeType;
  layer: LayerType;
  x: number;
  y: number;
  size: number;
  complexity: 'low' | 'medium' | 'high';
  linesOfCode: number;
  fanIn: number; // incoming references
  fanOut: number; // outgoing dependencies
  testCoverage: number;
  tags: string[];
  description: string;
  symbolsCount: number;
  isEntrypoint?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'imports' | 'calls' | 'inherits' | 'data_flow';
  weight: number;
  label?: string;
  isCircular?: boolean;
}

export interface GraphFilterOptions {
  searchQuery: string;
  selectedLayers: LayerType[];
  complexityFilter: 'all' | 'low' | 'medium' | 'high';
  showExternal: boolean;
  highlightCircular: boolean;
}
