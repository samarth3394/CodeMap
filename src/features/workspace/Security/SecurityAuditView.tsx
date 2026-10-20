import React, { useState } from 'react';
import { MOCK_SECURITY_FINDINGS } from '../../../data/mockData';
import { SecurityVulnerability } from '../../../types/analysis';
import { Badge } from '../../../components/common/Badge';
import {
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

export const SecurityAuditView: React.FC = () => {
  const [findings, setFindings] = useState<SecurityVulnerability[]>(MOCK_SECURITY_FINDINGS);
  const { showNotification } = useNotification();

  const handleUpdateStatus = (id: string, newStatus: SecurityVulnerability['status']) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    showNotification({
      title: 'Vulnerability Status Updated',
      message: `Marked as ${newStatus}.`,
      type: 'info',
    });
  };

  const severityBadge = {
    low: 'blue',
    medium: 'amber',
    high: 'rose',
    critical: 'rose',
  } as const;

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Security & SAST Audit
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Static security analysis for CWE vulnerabilities, permissive policies, and secret exposure.
          </p>
        </div>
        <Badge variant="emerald" size="md">
          Zero Critical Advisories
        </Badge>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {findings.map((finding) => (
          <div
            key={finding.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge variant={severityBadge[finding.severity]} size="sm">
                  {finding.severity.toUpperCase()}
                </Badge>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  {finding.cwe}
                </span>
                <h3 className="font-semibold text-sm text-slate-900">{finding.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={finding.status}
                  onChange={(e) =>
                    handleUpdateStatus(finding.id, e.target.value as any)
                  }
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-slate-700 font-medium focus-ring"
                >
                  <option value="open">Open</option>
                  <option value="triaged">Triaged</option>
                  <option value="resolved">Resolved</option>
                  <option value="ignored">Ignored</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed">
              {finding.description}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-slate-800">Remediation Guidance:</div>
              <div className="text-slate-600 font-mono text-[11px]">{finding.remediation}</div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 text-blue-600">
                <FileCode className="w-3.5 h-3.5" />
                <span>
                  {finding.file}:{finding.line}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
