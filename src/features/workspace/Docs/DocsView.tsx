import React from 'react';
import { MOCK_DOC_SECTIONS } from '../../../data/mockData';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { BookOpen, RefreshCw, FileCode } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

export const DocsView: React.FC = () => {
  const { showNotification } = useNotification();

  const handleRegenerate = () => {
    showNotification({
      title: 'Docs Regenerated (Demo)',
      message: 'Synthesized latest AST docstrings and endpoints from source files.',
      type: 'success',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Living Architecture Documentation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-synthesized architectural documentation kept in continuous sync with AST symbols.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleRegenerate}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Regenerate Docs (Demo)
        </Button>
      </div>

      {/* Docs Sections */}
      <div className="space-y-6">
        {MOCK_DOC_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-subtle space-y-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
                <div className="flex items-center gap-2 font-mono text-xs text-blue-600 mt-1">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{section.modulePath}</span>
                </div>
              </div>
              <Badge variant="slate" size="sm">
                Generated {section.lastGenerated}
              </Badge>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{section.summary}</p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Architecture Notes & Sequence
              </h3>
              <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {section.architectureNotes}
              </pre>
            </div>

            {section.endpointsOrInterfaces.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Interfaces & Endpoints
                </h3>
                <div className="space-y-2">
                  {section.endpointsOrInterfaces.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <div className="font-mono font-semibold text-blue-700">{item.name}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                        {item.signature}
                      </div>
                      <p className="text-slate-600 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
