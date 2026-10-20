import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  GitBranch,
  ChevronDown,
  Search,
  Plus,
  Compass,
  Menu,
  Check,
  Code2,
} from 'lucide-react';

export const Header: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const {
    projects,
    selectedProject,
    currentBranch,
    setCurrentBranch,
    selectProjectById,
    setIsProjectModalOpen,
  } = useProject();
  const { openPalette } = useCommandPalette();
  const navigate = useNavigate();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const branches = ['main', 'develop', 'feat/async-reservation', 'v1.4-hotfix'];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4">
      {/* Left: Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-lg py-1 px-1.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 tracking-tight text-base">CodeMap</span>
            <Badge variant="blue" size="sm">
              Stage 1 Demo
            </Badge>
          </div>
        </Link>

        {/* Separator */}
        <span className="hidden sm:inline-block h-4 w-px bg-slate-200 mx-1" />

        {/* Project Selector Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setIsProjectDropdownOpen(!isProjectDropdownOpen);
              setIsBranchDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors focus-ring"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium max-w-[140px] truncate">{selectedProject.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProjectDropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-64 rounded-xl bg-white p-1.5 shadow-dropdown border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsProjectDropdownOpen(false)}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Codebase
              </div>
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProject.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      selectProjectById(proj.id);
                      setIsProjectDropdownOpen(false);
                      navigate(`/projects/${proj.id}/overview`);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{proj.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {proj.languages[0]?.name} • {proj.stats.filesCount} files
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    setIsProjectModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create / Import Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Branch Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setIsBranchDropdownOpen(!isBranchDropdownOpen);
              setIsProjectDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors focus-ring"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">{currentBranch}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isBranchDropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-44 rounded-xl bg-white p-1.5 shadow-dropdown border border-slate-200 z-50"
              onMouseLeave={() => setIsBranchDropdownOpen(false)}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Branch
              </div>
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setCurrentBranch(b);
                    setIsBranchDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left font-mono ${
                    b === currentBranch
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{b}</span>
                  {b === currentBranch && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center/Right: Quick Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={openPalette}
          className="flex items-center gap-3 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors focus-ring w-44 sm:w-64 justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search codebase, symbols...</span>
          </div>
          <kbd className="hidden sm:inline-flex text-[10px] font-mono bg-white text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded shadow-subtle">
            ⌘K
          </kbd>
        </button>

        {/* Global links */}
        <Link
          to="/projects"
          className="hidden lg:inline-flex text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Projects
        </Link>
        <Link
          to="/dashboard"
          className="hidden lg:inline-flex text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Dashboard
        </Link>

        {/* New Project Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsProjectModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </Button>

        {/* User profile / demo avatar */}
        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-700">
          AR
        </div>
      </div>
    </header>
  );
};
