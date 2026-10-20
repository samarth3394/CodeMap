import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Settings, Save, Trash2 } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

export const ProjectSettingsView: React.FC = () => {
  const { selectedProject, deleteProject } = useProject();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState(selectedProject.name);
  const [description, setDescription] = useState(selectedProject.description);
  const [repoUrl, setRepoUrl] = useState(selectedProject.repositoryUrl);
  const [defaultBranch, setDefaultBranch] = useState(selectedProject.defaultBranch);
  const [ignorePatterns, setIgnorePatterns] = useState('tests/fixtures/*, **/node_modules/**, **/__pycache__/**, **/*.pyc');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification({
      title: 'Settings Saved (Demo)',
      message: 'Workspace indexing configuration updated.',
      type: 'success',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Settings</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage repository hooks, AST parser options, and branch indexing parameters.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">General Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Identifier"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Default Branch"
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Project Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus-ring"
            />
          </div>

          <Input
            label="Git Remote Repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        {/* Indexing Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">AST Indexing & Exclusions</h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Ignore Glob Patterns (comma-separated)
            </label>
            <textarea
              rows={2}
              value={ignorePatterns}
              onChange={(e) => setIgnorePatterns(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono text-slate-900 focus-ring"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Excluded paths will not be evaluated for cyclomatic complexity or dependency edges.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-rose-900">Danger Zone</h2>
          <p className="text-xs text-rose-700 leading-normal">
            Removing this project purges all cached AST symbol graphs and indexed test runs.
          </p>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm(`Are you sure you want to remove ${selectedProject.name} from the workspace?`)) {
                const deleted = deleteProject(selectedProject.id);
                if (deleted) {
                  navigate('/dashboard');
                }
              }
            }}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Remove Project from Workspace
          </Button>
        </div>
      </form>
    </div>
  );
};
