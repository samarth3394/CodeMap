import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import {
  LayoutDashboard,
  FolderGit2,
  Compass,
  Map,
  FileCode,
  Bot,
  Zap,
  CheckCircle2,
  Shield,
  Layers,
  BookOpen,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { selectedProject } = useProject();
  const { projectId } = useParams<{ projectId: string }>();
  const activeProjId = projectId || selectedProject.id;

  const workspaceNavItems = [
    {
      to: `/projects/${activeProjId}/overview`,
      label: 'Overview',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/codemap`,
      label: 'Code Map',
      icon: <Map className="w-4 h-4" />,
      badge: 'Visual',
    },
    {
      to: `/projects/${activeProjId}/explorer`,
      label: 'Code Explorer',
      icon: <FileCode className="w-4 h-4" />,
      badge: 'AST',
    },
    {
      to: `/projects/${activeProjId}/ai`,
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI',
    },
    {
      to: `/projects/${activeProjId}/dependencies`,
      label: 'Dependencies',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/impact`,
      label: 'Impact Analysis',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/tests`,
      label: 'Tests & Coverage',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/security`,
      label: 'Security Audit',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/docs`,
      label: 'Living Docs',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/history`,
      label: 'Analysis History',
      icon: <History className="w-4 h-4" />,
    },
    {
      to: `/projects/${activeProjId}/settings`,
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const globalNavItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      to: '/projects',
      label: 'All Projects',
      icon: <FolderGit2 className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] flex-col justify-between border-r border-slate-200 bg-white transition-all duration-200 ease-in-out ${
          isMobileOpen ? 'flex w-64' : 'hidden md:flex'
        } ${isCollapsed ? 'md:w-16' : 'md:w-60'}`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Global Navigation */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Application
              </div>
            )}
            <div className="space-y-0.5">
              {globalNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 my-3" />

          {/* Project Workspace Navigation */}
          <div>
            {!isCollapsed && (
              <div className="px-2.5 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Workspace
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                  {selectedProject.name}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {workspaceNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 group-hover:bg-slate-200 px-1.5 py-0.2 rounded font-medium">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 p-3 bg-slate-50/60">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium text-[11px] text-slate-700">AST Indexed</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">v1.4</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  {selectedProject.stats.symbolsCount} symbols
                </span>
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" title="AST Indexed" />
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
