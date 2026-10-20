import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { MOCK_ACTIVITY, ONBOARDING_STEPS } from '../../data/mockData';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Plus,
  GitBranch,
  Star,
  ArrowRight,
  Map,
  FileCode,
  Bot,
  Zap,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { projects, selectProjectById, toggleStarProject, setIsProjectModalOpen } = useProject();
  const navigate = useNavigate();

  const totalLines = projects.reduce((acc, p) => acc + p.stats.linesOfCode, 0);
  const totalSymbols = projects.reduce((acc, p) => acc + p.stats.symbolsCount, 0);
  const avgCoverage = (
    projects.reduce((acc, p) => acc + p.stats.testCoverage, 0) / projects.length
  ).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workspace Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of indexed repositories, architectural health, and real-time AST intelligence.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/projects">
            <Button variant="secondary" size="sm">
              All Projects ({projects.length})
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsProjectModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Repositories</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Code2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{projects.length}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> All AST indexes ready
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Indexed Symbols</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileCode className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalSymbols.toLocaleString()}</div>
          <div className="mt-1 text-xs text-slate-500">Across {totalLines.toLocaleString()} LOC</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg Test Coverage</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{avgCoverage}%</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">Passing CI thresholds</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Security Score</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">94 / 100</div>
          <div className="mt-1 text-xs text-slate-500">0 Critical vulnerabilities</div>
        </div>
      </div>

      {/* Onboarding Checklist Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Stage 1 Onboarding & Exploration Checklist</h2>
            <p className="text-xs text-slate-500">
              Explore key codebase intelligence workflows in this local prototype.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            2 of 4 Completed
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ONBOARDING_STEPS.map((step) => (
            <div
              key={step.id}
              className={`p-3.5 rounded-lg border transition-all ${
                step.completed
                  ? 'bg-slate-50/60 border-slate-200'
                  : 'bg-white border-blue-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    step.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {step.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                    <span>{step.title}</span>
                    {step.linkPath && (
                      <Link
                        to={step.linkPath}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        {step.linkText} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Projects Listing + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pinned / Demo Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Featured Demo Repositories</h2>
            <Link to="/projects" className="text-xs text-blue-600 hover:underline">
              View all ({projects.length})
            </Link>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-mono text-xs font-bold">
                      {proj.languages[0]?.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/projects/${proj.id}/overview`}
                          onClick={() => selectProjectById(proj.id)}
                          className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate"
                        >
                          {proj.name}
                        </Link>
                        <Badge variant="slate" size="sm">
                          {proj.defaultBranch}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStarProject(proj.id)}
                    className="text-slate-400 hover:text-amber-500 p-1 rounded transition-colors shrink-0"
                    aria-label="Star project"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        proj.isStarred ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Tags and Stats */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>{proj.stats.filesCount} files</span>
                    <span>•</span>
                    <span>{proj.stats.symbolsCount} symbols</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{proj.stats.testCoverage}% test coverage</span>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        selectProjectById(proj.id);
                        navigate(`/projects/${proj.id}/codemap`);
                      }}
                      leftIcon={<Map className="w-3.5 h-3.5" />}
                    >
                      Map
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        selectProjectById(proj.id);
                        navigate(`/projects/${proj.id}/explorer`);
                      }}
                      leftIcon={<FileCode className="w-3.5 h-3.5" />}
                    >
                      Explorer
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        selectProjectById(proj.id);
                        navigate(`/projects/${proj.id}/overview`);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Workspace
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Analysis & User Activity</h2>
            <span className="text-[11px] text-slate-400">Live feed</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle space-y-4">
            {MOCK_ACTIVITY.map((act) => {
              const icons = {
                impact_analysis: <Zap className="w-3.5 h-3.5 text-amber-600" />,
                security_scan: <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />,
                git_sync: <GitBranch className="w-3.5 h-3.5 text-blue-600" />,
                ai_query: <Bot className="w-3.5 h-3.5 text-purple-600" />,
                index: <Layers className="w-3.5 h-3.5 text-indigo-600" />,
              };

              return (
                <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {icons[act.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 leading-normal">
                      <span className="font-semibold text-slate-900">{act.projectName}</span>:{' '}
                      {act.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{act.user.name}</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
