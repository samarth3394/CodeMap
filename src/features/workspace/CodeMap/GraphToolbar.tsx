import {
  ZoomIn,
  ZoomOut,
  Search,
  RotateCcw,
} from 'lucide-react';

interface GraphToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLayer: string;
  onSelectLayer: (layer: string) => void;
  complexityFilter: string;
  onSelectComplexity: (c: string) => void;
  nodesCount: number;
  edgesCount: number;
}

export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  searchQuery,
  onSearchChange,
  selectedLayer,
  onSelectLayer,
  complexityFilter,
  onSelectComplexity,
  nodesCount,
  edgesCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-white border-b border-slate-200">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter nodes or methods..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus-ring hover:border-slate-300"
          />
        </div>

        {/* Layer Filter */}
        <select
          value={selectedLayer}
          onChange={(e) => onSelectLayer(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-700 focus-ring"
        >
          <option value="all">All Layers (API, Service, Domain, DB)</option>
          <option value="api">API Layer</option>
          <option value="service">Service Layer</option>
          <option value="domain">Domain Rules</option>
          <option value="infrastructure">Infrastructure & DB</option>
          <option value="external">External APIs</option>
        </select>

        {/* Complexity Filter */}
        <select
          value={complexityFilter}
          onChange={(e) => onSelectComplexity(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-700 focus-ring"
        >
          <option value="all">All Complexities</option>
          <option value="low">Low Complexity</option>
          <option value="medium">Medium Complexity</option>
          <option value="high">High Complexity</option>
        </select>
      </div>

      {/* Zoom and Stats */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono pr-2 border-r border-slate-200">
          <span>{nodesCount} nodes</span>
          <span>•</span>
          <span>{edgesCount} edges</span>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={onZoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-2 text-slate-600 select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors ml-0.5"
            title="Reset view"
            aria-label="Reset view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
