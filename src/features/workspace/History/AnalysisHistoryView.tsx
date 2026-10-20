import React from 'react';
import { MOCK_ANALYSIS_RUNS } from '../../../data/mockData';
import { Badge } from '../../../components/common/Badge';
import { History, GitCommit, GitBranch, Clock } from 'lucide-react';

export const AnalysisHistoryView: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analysis History</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of AST graph builds, commit indexing, and metric variations over time.
          </p>
        </div>
      </div>

      {/* History Timeline Cards */}
      <div className="space-y-4">
        {MOCK_ANALYSIS_RUNS.map((run) => (
          <div
            key={run.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <GitCommit className="w-4 h-4" />
                </span>
                <span className="font-mono text-xs font-semibold text-slate-900">
                  {run.commitHash}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
                  <GitBranch className="w-3 h-3" />
                  {run.branch}
                </span>
                <Badge
                  variant={run.status === 'success' ? 'emerald' : 'amber'}
                  size="sm"
                >
                  {run.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {run.durationSeconds}s
                </span>
                <span>•</span>
                <span>{run.timestamp}</span>
              </div>
            </div>

            <p className="text-xs text-slate-800 font-mono">{run.commitMessage}</p>

            {/* Metric differentials */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-600">
              <div>
                Coverage:{' '}
                <span
                  className={
                    run.metricsDiff.testCoverageDiff >= 0
                      ? 'text-emerald-600 font-semibold'
                      : 'text-rose-600 font-semibold'
                  }
                >
                  {run.metricsDiff.testCoverageDiff >= 0 ? '+' : ''}
                  {run.metricsDiff.testCoverageDiff}%
                </span>
              </div>
              <div>
                Complexity:{' '}
                <span className="text-slate-800 font-semibold">
                  {run.metricsDiff.complexityDiff >= 0 ? '+' : ''}
                  {run.metricsDiff.complexityDiff}
                </span>
              </div>
              <div>
                Security Score Diff:{' '}
                <span
                  className={
                    run.metricsDiff.securityScoreDiff >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-600 font-semibold'
                  }
                >
                  {run.metricsDiff.securityScoreDiff >= 0 ? '+' : ''}
                  {run.metricsDiff.securityScoreDiff}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
