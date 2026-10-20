import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { useProject } from '../../context/ProjectContext';
import {
  Search,
  Map,
  FileCode,
  Bot,
  Zap,
  CheckCircle2,
  Shield,
  BookOpen,
  FolderGit2,
  Settings,
  Plus,
  LayoutDashboard,
  ArrowRight,
  GitBranch,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { isOpen, closePalette } = useCommandPalette();
  const { projects, selectedProject, selectProjectById, setIsProjectModalOpen } = useProject();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const items = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      {
        id: 'nav-dashboard',
        category: 'Navigation',
        title: 'Dashboard Overview',
        icon: <LayoutDashboard className="w-4 h-4 text-blue-600" />,
        action: () => navigate('/dashboard'),
      },
      {
        id: 'nav-projects',
        category: 'Navigation',
        title: 'All Projects',
        icon: <FolderGit2 className="w-4 h-4 text-blue-600" />,
        action: () => navigate('/projects'),
      },
      {
        id: 'nav-codemap',
        category: 'Workspace',
        title: `Code Map: ${selectedProject.name}`,
        icon: <Map className="w-4 h-4 text-indigo-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/codemap`),
      },
      {
        id: 'nav-explorer',
        category: 'Workspace',
        title: `Code Explorer: ${selectedProject.name}`,
        icon: <FileCode className="w-4 h-4 text-indigo-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/explorer`),
      },
      {
        id: 'nav-ai',
        category: 'Workspace',
        title: `AI Assistant: Query ${selectedProject.name}`,
        icon: <Bot className="w-4 h-4 text-purple-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/ai`),
      },
      {
        id: 'nav-impact',
        category: 'Workspace',
        title: 'Impact Analysis Simulation',
        icon: <Zap className="w-4 h-4 text-amber-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/impact`),
      },
      {
        id: 'nav-tests',
        category: 'Workspace',
        title: 'Test Coverage & Suites',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/tests`),
      },
      {
        id: 'nav-security',
        category: 'Workspace',
        title: 'Security & Vulnerability Audit',
        icon: <Shield className="w-4 h-4 text-rose-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/security`),
      },
      {
        id: 'nav-docs',
        category: 'Workspace',
        title: 'Living Documentation',
        icon: <BookOpen className="w-4 h-4 text-sky-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/docs`),
      },
      {
        id: 'nav-settings',
        category: 'Workspace',
        title: 'Project Settings & Indexing',
        icon: <Settings className="w-4 h-4 text-slate-600" />,
        action: () => navigate(`/projects/${selectedProject.id}/settings`),
      },
      {
        id: 'act-new-project',
        category: 'Actions',
        title: 'Create New Project or Import Repo',
        icon: <Plus className="w-4 h-4 text-blue-600" />,
        action: () => setIsProjectModalOpen(true),
      },
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        category: 'Switch Project',
        title: p.name,
        subtitle: `${p.languages[0]?.name || 'Code'} • ${p.defaultBranch}`,
        icon: <GitBranch className="w-4 h-4 text-slate-600" />,
        action: () => {
          selectProjectById(p.id);
          navigate(`/projects/${p.id}/overview`);
        },
      })),
    ];

    if (!query.trim()) return list;

    const q = query.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [query, selectedProject, projects, navigate, selectProjectById, setIsProjectModalOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={closePalette}
      />
      <div className="flex min-h-full items-start justify-center pt-16 sm:pt-24 px-4 text-center">
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-modal border border-slate-200 transition-all w-full max-w-xl">
          {/* Search Bar */}
          <div className="relative flex items-center border-b border-slate-200 px-4 py-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, search pages, or switch projects..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          </div>

          {/* Results list */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    closePalette();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.subtitle || item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Use <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↑</kbd>{' '}
              <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↓</kbd> to
              navigate
            </span>
            <span>
              Press <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↵</kbd>{' '}
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
