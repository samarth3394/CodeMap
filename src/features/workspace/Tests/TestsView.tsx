import React, { useState } from 'react';
import { MOCK_TEST_SUITES } from '../../../data/mockData';
import { TestSuite } from '../../../types/analysis';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import {
  CheckCircle2,
  XCircle,
  Play,
} from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

export const TestsView: React.FC = () => {
  const [suites] = useState<TestSuite[]>(MOCK_TEST_SUITES);
  const [activeSuiteId, setActiveSuiteId] = useState<string>(MOCK_TEST_SUITES[0].id);
  const { showNotification } = useNotification();

  const activeSuite = suites.find((s) => s.id === activeSuiteId) || suites[0];

  const totalTests = suites.reduce((acc, s) => acc + s.total, 0);
  const totalPassed = suites.reduce((acc, s) => acc + s.passed, 0);
  const totalFailed = suites.reduce((acc, s) => acc + s.failed, 0);

  const handleRunTests = () => {
    showNotification({
      title: 'Test Suite Executed (Demo)',
      message: `Executed ${totalTests} test cases across 2 suites in 3.2s.`,
      type: 'info',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Test Suites & Coverage
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            PyTest execution matrix, failed assertions, and coverage mapping by AST symbol.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleRunTests}
          leftIcon={<Play className="w-3.5 h-3.5" />}
        >
          Run Test Suites (Demo)
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Total Test Cases</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{totalTests}</div>
          <div className="text-[11px] text-slate-500 mt-1">2 test files</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Passed</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{totalPassed}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">96.8% success rate</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Failed Assertions</div>
          <div className="text-xl font-bold text-rose-600 mt-1">{totalFailed}</div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Needs investigation</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Total Runtime</div>
          <div className="text-xl font-bold text-slate-900 mt-1">3.2s</div>
          <div className="text-[11px] text-slate-500 mt-1">Async parallel worker</div>
        </div>
      </div>

      {/* Suites & Cases View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Suites List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Test Suites</h2>
          <div className="space-y-2">
            {suites.map((suite) => {
              const isSelected = suite.id === activeSuiteId;
              return (
                <button
                  key={suite.id}
                  onClick={() => setActiveSuiteId(suite.id)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900">{suite.name}</span>
                    {suite.failed > 0 ? (
                      <Badge variant="rose" size="sm">
                        {suite.failed} Failed
                      </Badge>
                    ) : (
                      <Badge variant="emerald" size="sm">
                        Passed
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">{suite.file}</div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
                    <span>{suite.passed}/{suite.total} passed</span>
                    <span>•</span>
                    <span>{suite.durationSeconds}s</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Test Cases Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">{activeSuite.name}</h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">{activeSuite.file}</div>
              </div>
              <Badge variant="slate" size="sm">
                Duration: {activeSuite.durationSeconds}s
              </Badge>
            </div>

            <div className="space-y-2">
              {activeSuite.cases.map((tc) => (
                <div
                  key={tc.id}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    tc.status === 'failed'
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-medium text-slate-900">
                      {tc.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{tc.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{tc.durationMs}ms</span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Target: <span className="text-blue-600">{tc.coverageTarget}</span>
                  </div>

                  {tc.errorMessage && (
                    <div className="mt-2 p-2 rounded bg-rose-100/70 border border-rose-200 text-rose-900 font-mono text-[11px]">
                      {tc.errorMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
