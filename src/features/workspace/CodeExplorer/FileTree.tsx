import React, { useState } from 'react';
import { FileTreeNode } from '../../../types/explorer';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  Terminal,
} from 'lucide-react';

interface FileTreeProps {
  tree: FileTreeNode;
  selectedFilePath: string;
  onSelectFile: (path: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  tree,
  selectedFilePath,
  onSelectFile,
}) => {
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    '': true,
    app: true,
    'app/services': true,
    'app/api': true,
    tests: false,
  });

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderNode = (node: FileTreeNode, depth = 0) => {
    if (node.type === 'directory') {
      const isExpanded = expandedDirs[node.path] ?? true;

      return (
        <div key={node.id} className="select-none">
          {node.path !== '' && (
            <button
              onClick={() => toggleDir(node.path)}
              className="w-full flex items-center gap-1.5 py-1 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left"
              style={{ paddingLeft: `${depth * 14 + 8}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-600 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500 shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </button>
          )}

          {(isExpanded || node.path === '') && node.children && (
            <div className="space-y-0.5">
              {node.children.map((child) => renderNode(child, node.path === '' ? depth : depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File Node
    const isSelected = selectedFilePath === node.path;

    const getFileIcon = (ext?: string) => {
      switch (ext) {
        case 'py':
          return <FileCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
        case 'toml':
        case 'yaml':
        case 'json':
          return <Terminal className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
        default:
          return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      }
    };

    return (
      <button
        key={node.id}
        onClick={() => onSelectFile(node.path)}
        className={`w-full flex items-center justify-between py-1 px-2 text-xs rounded-md transition-colors text-left group ${
          isSelected
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        style={{ paddingLeft: `${depth * 14 + 18}px` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {getFileIcon(node.extension)}
          <span className="truncate font-mono text-[11px]">{node.name}</span>
        </div>
        {node.symbolsCount !== undefined && node.symbolsCount > 0 && (
          <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-mono">
            {node.symbolsCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-64 border-r border-slate-200 bg-white h-full flex flex-col">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          File Tree
        </span>
        <span className="text-[10px] text-slate-400 font-mono">AST Parsed</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">{renderNode(tree)}</div>
    </div>
  );
};
