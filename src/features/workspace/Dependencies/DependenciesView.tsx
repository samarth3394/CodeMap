import React, { useState } from 'react';
import { MOCK_DEPENDENCIES } from '../../../data/mockData';
import { DependencyItem } from '../../../types/analysis';
import { Badge } from '../../../components/common/Badge';
import { Input } from '../../../components/common/Input';
import {
  Layers,
  Search,
  Package,
} from 'lucide-react';

export const DependenciesView: React.FC = () => {
  const [dependencies] = useState<DependencyItem[]>(MOCK_DEPENDENCIES);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = dependencies.filter((dep) => {
    const matchesSearch =
      dep.name.toLowerCase().includes(search.toLowerCase()) ||
      dep.license.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || dep.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Package Dependencies</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit runtime frameworks, package health scores, license compliance, and outdated advisories.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-subtle">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search dependencies by package name or license..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-slate-700 focus-ring"
          >
            <option value="all">All Dependency Types</option>
            <option value="runtime">Runtime Dependencies</option>
            <option value="dev">Dev / Test Dependencies</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Current Version</th>
              <th className="py-3 px-4">Latest Version</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">License</th>
              <th className="py-3 px-4">Health Score</th>
              <th className="py-3 px-4">Callers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {filtered.map((dep) => (
              <tr key={dep.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 font-sans">
                    <Package className="w-3.5 h-3.5 text-slate-400 font-mono" />
                    <span>{dep.name}</span>
                    {dep.isOutdated && (
                      <Badge variant="amber" size="sm">
                        Update Available
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-700">{dep.version}</td>
                <td className="py-3 px-4 text-slate-500">{dep.latestVersion}</td>
                <td className="py-3 px-4 font-sans capitalize">
                  <Badge variant="slate" size="sm">
                    {dep.type}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-600 font-sans">{dep.license}</td>
                <td className="py-3 px-4 font-sans">
                  <span className="font-semibold text-emerald-600">{dep.healthScore} / 100</span>
                </td>
                <td className="py-3 px-4 text-slate-500 font-sans">
                  {dep.usedInModulesCount} modules
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
