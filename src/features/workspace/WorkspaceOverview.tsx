import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Map,
  FileCode,
  Bot,
  Zap,
  CheckCircle2,
  Shield,
  Layers,
  BookOpen,
  GitBranch,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export const WorkspaceOverview: React.FC = () => {
  const { selectedProject, currentBranch } = useProject();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const proj = selectedProject;

  const handleReindex = () => {
    showNotification({
      title: 'AST Re-indexing triggered (Demo)',
      message: 'Parsed 142 files, 612 symbols, and reconstructed 13 dependency edges.',
      type: 'success',
    });
  };

  const featureCards = [
    {
      title: 'Interactive Code Map',
      description: 'Spatial 2D graph of modules, services, and domain entities with real-time dependency edges.',
      path: `/projects/${proj.id}/codemap`,
      icon: <Map className="w-5 h-5 text-blue-600" />,
      badge: 'Interactive',
    },
    {
      title: 'Code Explorer & AST',
      description: 'Full repository file tree with syntax-highlighted Python viewer and symbol inspector.',
      path: `/projects/${proj.id}/explorer`,
      icon: <FileCode className="w-5 h-5 text-indigo-600" />,
      badge: 'AST Parsed',
    },
    {
      title: 'AI Codebase Intelligence',
      description: 'Ask deep architectural questions with exact source code citations and follow-up prompts.',
      path: `/projects/${proj.id}/ai`,
      icon: <Bot className="w-5 h-5 text-purple-600" />,
      badge: 'Citations',
    },
    {
      title: 'Pre-Commit Impact Simulation',
      description: 'Simulate function signature and enum refactorings to visualize affected callers and tests.',
      path: `/projects/${proj.id}/impact`,
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      badge: 'Blast Radius',
    },
    {
      title: 'Tests & Code Coverage',
      description: 'Test suite progression, execution durations, coverage bottlenecks, and failing assertions.',
      path: `/projects/${proj.id}/tests`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      badge: `${proj.stats.testCoverage}% Pass`,
    },
    {
      title: 'Security & SAST Audit',
      description: 'Vulnerability triage, CORS misconfiguration detection, and dependency advisory alerts.',
      path: `/projects/${proj.id}/security`,
      icon: <Shield className="w-5 h-5 text-rose-600" />,
      badge: `${proj.stats.securityScore}/100`,
    },
    {
      title: 'Package Dependencies',
      description: 'Direct and transitive dependencies, package licenses, outdated versions, and health scores.',
      path: `/projects/${proj.id}/dependencies`,
      icon: <Layers className="w-5 h-5 text-sky-600" />,
      badge: `${proj.stats.dependencyCount} Packages`,
    },
    {
      title: 'Living Documentation',
      description: 'Automatically synthesized architectural sequence notes and interface definitions.',
      path: `/projects/${proj.id}/docs`,
      icon: <BookOpen className="w-5 h-5 text-teal-600" />,
      badge: 'Auto-Sync',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Workspace Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{proj.name}</h1>
              <Badge variant="blue" size="md">
                Ready for Analysis
              </Badge>
              <Badge variant="slate" size="md">
                Commit: {proj.commitHash}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{proj.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReindex}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-index AST (Demo)
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/projects/${proj.id}/codemap`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Code Map
            </Button>
          </div>
        </div>

        {/* Quick Meta Row */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-700 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              branch: <span className="font-semibold">{currentBranch}</span>
            </span>
            <span>•</span>
            <span>Last analyzed: {proj.lastAnalyzedAt}</span>
            <span>•</span>
            <span className="text-slate-700">
              Primary: <span className="font-medium">{proj.languages[0]?.name}</span> ({proj.languages[0]?.percentage}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {proj.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Architectural Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Total Code Volume</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {proj.stats.linesOfCode.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">LOC</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{proj.stats.filesCount} source files</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">AST Symbols</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{proj.stats.symbolsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">{proj.stats.modulesCount} modules indexed</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Maintainability Index</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {proj.stats.maintainabilityIndex}{' '}
            <span className="text-xs font-normal text-emerald-600 font-semibold">Grade A</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Low cyclomatic debt</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle">
          <div className="text-xs text-slate-500 font-medium">Security & Quality</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{proj.stats.securityScore} / 100</div>
          <div className="text-[11px] text-slate-500 mt-1">{proj.stats.testCoverage}% test coverage</div>
        </div>
      </div>

      {/* Workspace Feature Cards Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Workspace Modules & Intelligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <Badge variant="slate" size="sm">
                    {card.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{card.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
