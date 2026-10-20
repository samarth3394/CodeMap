import React from 'react';
import { FileContentDetails, CodeSymbol } from '../../../types/explorer';
import { Button } from '../../../components/common/Button';
import { Copy, Check, FileCode } from 'lucide-react';

interface SourceViewerProps {
  fileDetails: FileContentDetails;
  activeSymbol: CodeSymbol | null;
}

export const SourceViewer: React.FC<SourceViewerProps> = ({ fileDetails, activeSymbol }) => {
  const [copied, setCopied] = React.useState(false);
  const codeLines = fileDetails.content.split('\n');
  const highlightedRange = activeSymbol ? { start: activeSymbol.line, end: activeSymbol.endLine } : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fileDetails.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightPythonSyntax = (line: string) => {
    // Quick regex-based syntax tokenizer for clean IDE styling
    if (line.trim().startsWith('#') || line.trim().startsWith('"""')) {
      return <span className="text-slate-400 italic">{line}</span>;
    }

    const keywords = [
      'async', 'def', 'class', 'return', 'import', 'from', 'if', 'else', 'elif',
      'try', 'except', 'raise', 'await', 'for', 'in', 'while', 'with', 'as', 'pass', 'None', 'True', 'False',
    ];

    const tokens = line.split(/(\s+|[(),.:=+\-*/<>[\]{}@'"])/g);

    return tokens.map((token, idx) => {
      if (keywords.includes(token)) {
        return (
          <span key={idx} className="text-blue-600 font-semibold">
            {token}
          </span>
        );
      }
      if (token.startsWith('"') || token.startsWith("'")) {
        return (
          <span key={idx} className="text-emerald-700">
            {token}
          </span>
        );
      }
      if (/^[A-Z][a-zA-Z0-9_]*$/.test(token)) {
        return (
          <span key={idx} className="text-indigo-600 font-medium">
            {token}
          </span>
        );
      }
      return <span key={idx}>{token}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Top File Breadcrumb Bar */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
          <FileCode className="w-4 h-4 text-blue-600" />
          <span>{fileDetails.path}</span>
          {activeSymbol && (
            <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {activeSymbol.name} (L{activeSymbol.line}-{activeSymbol.endLine})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Code Lines Container */}
      <div className="flex-1 overflow-auto font-mono text-xs p-4 leading-relaxed bg-white">
        <table className="w-full border-collapse">
          <tbody>
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted =
                highlightedRange && lineNum >= highlightedRange.start && lineNum <= highlightedRange.end;

              return (
                <tr
                  key={lineNum}
                  id={`L${lineNum}`}
                  className={`${
                    isHighlighted ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  } transition-colors`}
                >
                  <td className="w-12 text-right pr-4 text-slate-400 select-none py-0.5 border-r border-slate-200 font-mono text-[11px]">
                    {lineNum}
                  </td>
                  <td className="pl-4 py-0.5 text-slate-800 whitespace-pre">
                    {highlightPythonSyntax(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <div className="flex items-center gap-4">
          <span>{fileDetails.linesCount} lines</span>
          <span>{fileDetails.sizeFormatted}</span>
          <span className="capitalize">{fileDetails.language}</span>
        </div>
        <div>UTF-8 • LF</div>
      </div>
    </div>
  );
};
