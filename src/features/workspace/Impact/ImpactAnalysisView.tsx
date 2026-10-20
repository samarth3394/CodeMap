import React, { useState } from 'react';
import { MOCK_IMPACT_PROPOSALS } from '../../../data/mockData';
import { ImpactChangeProposal } from '../../../types/analysis';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import {
  Zap,
  AlertTriangle,
  FileCode,
  Play,
} from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

export const ImpactAnalysisView: React.FC = () => {
  const [proposals] = useState<ImpactChangeProposal[]>(MOCK_IMPACT_PROPOSALS);
  const [selectedPropId, setSelectedPropId] = useState<string>(MOCK_IMPACT_PROPOSALS[0].id);
  const { showNotification } = useNotification();

  const selectedProposal =
    proposals.find((p) => p.id === selectedPropId) || proposals[0];

  const handleRunSimulation = () => {
    showNotification({
      title: 'Impact Simulation Complete',
      message: `Identified ${selectedProposal.impactedFiles.length} impacted files and ${selectedProposal.impactedTests.length} test suites requiring attention.`,
      type: 'info',
    });
  };

  const riskBadge = {
    low: 'emerald',
    medium: 'amber',
    high: 'rose',
    critical: 'rose',
  }[selectedProposal.riskScore] as 'emerald' | 'amber' | 'rose';

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pre-Commit Impact Simulation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate blast radius and downstream callers before changing signatures, enums, or contracts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleRunSimulation}
          leftIcon={<Play className="w-3.5 h-3.5" />}
        >
          Run Blast Radius Check
        </Button>
      </div>

      {/* Main Grid: Proposal selector + Proposal detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Proposals List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Simulated Changes ({proposals.length})
          </h2>

          <div className="space-y-2">
            {proposals.map((prop) => {
              const isSelected = prop.id === selectedPropId;
              return (
                <button
                  key={prop.id}
                  onClick={() => setSelectedPropId(prop.id)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-semibold uppercase text-slate-500">
                      {prop.changeType.replace('_', ' ')}
                    </span>
                    <Badge variant={prop.riskScore === 'high' ? 'rose' : 'amber'} size="sm">
                      {prop.riskScore.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-xs text-slate-900 leading-snug">{prop.title}</h3>
                  <div className="mt-2 text-[11px] font-mono text-slate-500 truncate">
                    {prop.targetFile}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Impact Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <Badge variant={riskBadge} size="md">
                  {selectedProposal.riskScore.toUpperCase()} BLAST RADIUS
                </Badge>
                <h2 className="text-base font-bold text-slate-900 mt-2">
                  {selectedProposal.title}
                </h2>
                <div className="mt-1 font-mono text-xs text-slate-500">
                  Target Symbol:{' '}
                  <span className="text-blue-600 font-semibold">{selectedProposal.targetSymbol}</span>
                </div>
              </div>
            </div>

            {/* Impacted Files Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-between">
                <span>Direct & Transitive Callers ({selectedProposal.impactedFiles.length} Files)</span>
              </h3>
              <div className="space-y-2">
                {selectedProposal.impactedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-slate-900 font-semibold">
                        <FileCode className="w-3.5 h-3.5 text-blue-600" />
                        <span>{file.path}</span>
                      </div>
                      <Badge
                        variant={file.riskLevel === 'direct' ? 'rose' : 'amber'}
                        size="sm"
                      >
                        {file.riskLevel} caller
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {file.affectedSymbols.map((sym, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px]"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impacted Test Suites */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Affected Test Suites ({selectedProposal.impactedTests.length})
              </h3>
              <div className="space-y-1.5">
                {selectedProposal.impactedTests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-lg text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 font-mono text-amber-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.testFile}</span>
                      <span className="text-slate-400 font-sans">::</span>
                      <span className="font-semibold">{t.testName}</span>
                    </div>
                    <Badge variant="amber" size="sm">
                      Must Update Test
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
