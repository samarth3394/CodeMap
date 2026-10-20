import React from 'react';
import { CodeSymbol } from '../../../types/explorer';
import { Badge } from '../../../components/common/Badge';
import { Layers, FunctionSquare, Variable, Zap, Code2 } from 'lucide-react';

interface SymbolInspectorProps {
  symbols: CodeSymbol[];
  activeSymbolId: string | null;
  onSelectSymbol: (symbol: CodeSymbol) => void;
  fileName: string;
}

export const SymbolInspector: React.FC<SymbolInspectorProps> = ({
  symbols,
  activeSymbolId,
  onSelectSymbol,
  fileName,
}) => {
  const getKindIcon = (kind: CodeSymbol['kind']) => {
    switch (kind) {
      case 'class':
        return <Layers className="w-3.5 h-3.5 text-indigo-600" />;
      case 'method':
      case 'function':
        return <FunctionSquare className="w-3.5 h-3.5 text-blue-600" />;
      case 'variable':
        return <Variable className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="w-72 lg:w-80 border-l border-slate-200 bg-white h-full flex flex-col">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          AST Symbols ({symbols.length})
        </span>
        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
          {fileName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {symbols.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No exported AST symbols in this file.
          </div>
        ) : (
          symbols.map((sym) => {
            const isSelected = activeSymbolId === sym.id;

            return (
              <div
                key={sym.id}
                onClick={() => onSelectSymbol(sym)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getKindIcon(sym.kind)}
                    <span className="font-mono font-semibold text-slate-900 truncate">
                      {sym.name}
                    </span>
                  </div>
                  <Badge variant="slate" size="sm">
                    L{sym.line}-{sym.endLine}
                  </Badge>
                </div>

                <div className="mt-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200/70 overflow-x-auto">
                  {sym.signature}
                </div>

                {sym.docstring && (
                  <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {sym.docstring}
                  </p>
                )}

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Refs: {sym.referencesCount}</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Complexity: {sym.complexityScore}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
