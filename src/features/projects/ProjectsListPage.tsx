import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Star,
  GitBranch,
  ArrowRight,
  Map,
  Filter,
} from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const { projects, selectProjectById, toggleStarProject, setIsProjectModalOpen } = useProject();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'loc' | 'coverage'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

        const matchesLang =
          selectedLanguage === 'all' ||
          p.languages.some((l) => l.name.toLowerCase() === selectedLanguage.toLowerCase());

        return matchesSearch && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'loc') return b.stats.linesOfCode - a.stats.linesOfCode;
        if (sortBy === 'coverage') return b.stats.testCoverage - a.stats.testCoverage;
        return 0; // recent default
      });
  }, [projects, search, selectedLanguage, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Repositories & Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your analyzed codebases, track architectural complexity, and start simulations.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsProjectModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Project
        </Button>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-subtle">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Filter projects by name, tag, or description..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-slate-700 focus-ring"
          >
            <option value="all">All Languages</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>

          {/* Sort filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-slate-700 focus-ring"
          >
            <option value="recent">Sort by Recently Analyzed</option>
            <option value="name">Sort by Name</option>
            <option value="loc">Sort by Lines of Code</option>
            <option value="coverage">Sort by Test Coverage</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-6 h-6 text-slate-400" />}
          title="No matching repositories found"
          description={`No projects matched the search query "${search}" with language filter "${selectedLanguage}".`}
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedLanguage('all');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proj.languages[0]?.color || '#2563EB' }}
                    />
                    <Link
                      to={`/projects/${proj.id}/overview`}
                      onClick={() => selectProjectById(proj.id)}
                      className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate"
                    >
                      {proj.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => toggleStarProject(proj.id)}
                    className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                    aria-label="Star project"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        proj.isStarred ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {proj.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Symbols</div>
                    <div className="font-bold text-slate-800">{proj.stats.symbolsCount}</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Coverage</div>
                    <div className="font-bold text-emerald-600">{proj.stats.testCoverage}%</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Security</div>
                    <div className="font-bold text-slate-800">{proj.stats.securityScore}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                    {proj.defaultBranch}
                  </span>
                  <span>{proj.lastAnalyzedAt}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      selectProjectById(proj.id);
                      navigate(`/projects/${proj.id}/codemap`);
                    }}
                    leftIcon={<Map className="w-3.5 h-3.5" />}
                  >
                    Code Map
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      selectProjectById(proj.id);
                      navigate(`/projects/${proj.id}/overview`);
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-subtle divide-y divide-slate-100">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: proj.languages[0]?.color || '#2563EB' }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/${proj.id}/overview`}
                      onClick={() => selectProjectById(proj.id)}
                      className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      {proj.name}
                    </Link>
                    <Badge variant="slate" size="sm">
                      {proj.defaultBranch}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{proj.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 self-end sm:self-center shrink-0">
                <div className="hidden md:block">
                  <span className="font-semibold text-slate-900">{proj.stats.symbolsCount}</span> symbols
                </div>
                <div className="hidden md:block">
                  <span className="font-semibold text-emerald-600">{proj.stats.testCoverage}%</span> coverage
                </div>
                <div className="text-slate-400 text-[11px]">{proj.lastAnalyzedAt}</div>
                <Button
                  variant="secondary"
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
          ))}
        </div>
      )}
    </div>
  );
};
