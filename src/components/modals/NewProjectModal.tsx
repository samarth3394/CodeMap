import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useProject } from '../../context/ProjectContext';
import { Language } from '../../types/project';
import { Sparkles, FolderPlus, GitBranch } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { isProjectModalOpen, setIsProjectModalOpen, createProject } = useProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>('Python');
  const [tags, setTags] = useState('Microservice, Internal');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTemplate = (tmpl: {
    name: string;
    desc: string;
    url: string;
    lang: Language;
    tags: string;
  }) => {
    setName(tmpl.name);
    setDescription(tmpl.desc);
    setRepositoryUrl(tmpl.url);
    setPrimaryLanguage(tmpl.lang);
    setTags(tmpl.tags);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Project name is required';
    if (!repositoryUrl.trim()) newErrors.repositoryUrl = 'Repository URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const languageColors: Record<Language, string> = {
      Python: '#3572A5',
      TypeScript: '#3178C6',
      Go: '#00ADD8',
      Rust: '#DEA584',
      Java: '#B07219',
    };

    createProject({
      name: name.trim(),
      description: description.trim() || 'Custom imported codebase analyzed with CodeMap intelligence.',
      repositoryUrl: repositoryUrl.trim(),
      defaultBranch: defaultBranch.trim() || 'main',
      languages: [
        {
          name: primaryLanguage,
          percentage: 85.0,
          color: languageColors[primaryLanguage],
        },
      ],
      status: 'ready',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setIsProjectModalOpen(false);
    // Reset form
    setName('');
    setDescription('');
    setRepositoryUrl('');
    setTags('Microservice, Internal');
    setErrors({});
  };

  return (
    <Modal
      isOpen={isProjectModalOpen}
      onClose={() => setIsProjectModalOpen(false)}
      title="Create or Import Project"
      description="Connect a Git repository or initialize from a demo template to parse symbols and map architecture."
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={() => setIsProjectModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            leftIcon={<FolderPlus className="w-4 h-4" />}
          >
            Create Project (Demo)
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Demo Templates */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick-fill with sample templates</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleTemplate({
                  name: 'analytics-aggregator',
                  desc: 'Asynchronous event stream consumer with ClickHouse and Redis pipelines.',
                  url: 'https://github.com/enterprise-org/analytics-aggregator',
                  lang: 'Python',
                  tags: 'Analytics, AsyncIO, ClickHouse',
                })
              }
              className="text-xs bg-white text-blue-700 hover:bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded transition-colors"
            >
              Python Analytics Engine
            </button>
            <button
              type="button"
              onClick={() =>
                handleTemplate({
                  name: 'identity-gateway',
                  desc: 'Zero-trust edge router with mTLS and OpenID Connect authorization tokens.',
                  url: 'https://github.com/enterprise-org/identity-gateway',
                  lang: 'TypeScript',
                  tags: 'OAuth2, Edge, Security',
                })
              }
              className="text-xs bg-white text-blue-700 hover:bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded transition-colors"
            >
              TS Identity Gateway
            </button>
            <button
              type="button"
              onClick={() =>
                handleTemplate({
                  name: 'telemetry-collector',
                  desc: 'High-volume OTLP metrics ingestion service with Prometheus exporter.',
                  url: 'https://github.com/enterprise-org/telemetry-collector',
                  lang: 'Go',
                  tags: 'OTel, Metrics, High-Scale',
                })
              }
              className="text-xs bg-white text-blue-700 hover:bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded transition-colors"
            >
              Go Telemetry Service
            </button>
          </div>
        </div>

        <Input
          label="Project Name"
          placeholder="e.g. orders-orchestrator"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <div className="w-full">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Repository Description
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-ring hover:border-slate-400 focus:border-blue-600"
            placeholder="Brief description of service domain and responsibility..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Git Repository URL"
            placeholder="https://github.com/org/repo"
            leftIcon={<GitBranch className="w-4 h-4" />}
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            error={errors.repositoryUrl}
            required
          />
          <Input
            label="Default Branch"
            placeholder="main"
            value={defaultBranch}
            onChange={(e) => setDefaultBranch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Primary Language
            </label>
            <select
              value={primaryLanguage}
              onChange={(e) => setPrimaryLanguage(e.target.value as Language)}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 focus-ring hover:border-slate-400 focus:border-blue-600"
            >
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <Input
            label="Tags (comma-separated)"
            placeholder="e.g. Production, AsyncIO"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          * Note: In Stage 1 demo mode, mock AST parser trees and metrics are generated instantly for local exploration without running backend pipelines.
        </p>
      </form>
    </Modal>
  );
};
