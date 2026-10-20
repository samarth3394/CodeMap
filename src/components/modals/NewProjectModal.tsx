import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api, GitHubStatusResponse } from '../../services/api';
import {
  FolderPlus,
  Upload,
  GitBranch,
  AlertCircle,
  X,
  RefreshCw,
  FileArchive,
  Layers,
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const NewProjectModal: React.FC = () => {
  const { isProjectModalOpen, setIsProjectModalOpen, createProject, refreshProjects } = useProject();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState<'zip' | 'github' | 'template'>('zip');

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [visibility] = useState<'private' | 'public'>('private');

  // ZIP Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // GitHub State
  const [githubUrl, setGithubUrl] = useState('');
  const [githubStatus, setGithubStatus] = useState<GitHubStatusResponse | null>(null);
  const [isLoadingGithubStatus, setIsLoadingGithubStatus] = useState(false);

  // Fetch GitHub config status on open
  useEffect(() => {
    if (isProjectModalOpen && activeTab === 'github') {
      setIsLoadingGithubStatus(true);
      api.github
        .getStatus()
        .then((res) => setGithubStatus(res))
        .catch(() =>
          setGithubStatus({
            is_configured: false,
            setup_message: 'Could not reach backend to check GitHub configuration.',
          })
        )
        .finally(() => setIsLoadingGithubStatus(false));
    }
  }, [isProjectModalOpen, activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.zip')) {
        setErrorMessage('Please select a valid .zip archive.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('Archive exceeds the 50 MB file size limit.');
        return;
      }
      setSelectedFile(file);
      if (!name) {
        // Auto-populate project name from filename
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setName(baseName.charAt(0).toUpperCase() + baseName.slice(1));
      }
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus('Upload cancelled by user.');
  };

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Project name is required.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please attach a repository .zip file.');
      return;
    }

    if (!isAuthenticated) {
      showNotification({
        title: 'Authentication Required',
        message: 'Please sign in or create an account to upload private repositories.',
        type: 'info',
      });
      openAuthModal('signup');
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);
    setUploadStatus('Initializing workspace on backend...');

    abortControllerRef.current = new AbortController();

    try {
      // 1. Create project on backend
      const project = await api.projects.create({
        name: name.trim(),
        description: description.trim(),
        default_branch: defaultBranch.trim() || 'main',
        visibility,
        repository_source: 'zip',
      });

      setUploadStatus('Streaming ZIP archive to server...');

      // 2. Upload ZIP with progress tracking
      await api.projects.uploadZip(
        project.id,
        selectedFile,
        (percent) => {
          setUploadProgress(Math.min(percent, 90));
          if (percent === 100) {
            setUploadStatus('Extracting archive and parsing AST symbols...');
          }
        },
        abortControllerRef.current.signal
      );

      setUploadProgress(100);
      setUploadStatus('Repository ready! Indexing complete.');

      showNotification({
        title: 'Repository Uploaded',
        message: `${name} has been parsed and indexed successfully.`,
        type: 'success',
      });

      await refreshProjects();

      // Reset and close
      setTimeout(() => {
        setIsProjectModalOpen(false);
        setIsUploading(false);
        setSelectedFile(null);
        setName('');
        setDescription('');
        setUploadProgress(0);
      }, 1000);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setUploadStatus('Upload aborted.');
      } else {
        setErrorMessage(
          err.detail || err.message || 'Failed to upload repository archive.'
        );
      }
      setIsUploading(false);
    }
  };

  const handleTemplateSubmit = (tmpl: {
    name: string;
    description: string;
    branch: string;
    language: string;
  }) => {
    createProject({
      name: tmpl.name,
      description: tmpl.description,
      repositoryUrl: 'https://github.com/fastapi/fastapi-commerce',
      defaultBranch: tmpl.branch,
      languages: [
        {
          name: tmpl.language as any,
          percentage: 85.0,
          color: '#3572A5',
        },
      ],
      status: 'ready',
      tags: ['Template', 'Demo'],
    });

    setIsProjectModalOpen(false);
  };

  return (
    <Modal
      isOpen={isProjectModalOpen}
      onClose={() => {
        if (!isUploading) setIsProjectModalOpen(false);
      }}
      title="Create or Import Project Workspace"
      description="Connect real source code via secure ZIP upload, configure GitHub App integration, or load pre-indexed demo architectures."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('zip')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'zip'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>ZIP Archive Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'github'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Import</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('template')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'template'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Demo Architectures</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-normal">{errorMessage}</div>
          </div>
        )}

        {/* TAB 1: ZIP ARCHIVE UPLOAD */}
        {activeTab === 'zip' && (
          <form onSubmit={handleZipSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Project / Repository Name"
                placeholder="e.g. Order Processing Service"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isUploading}
              />
              <Input
                label="Default Branch"
                placeholder="main"
                value={defaultBranch}
                onChange={(e) => setDefaultBranch(e.target.value)}
                leftIcon={<GitBranch className="w-3.5 h-3.5 text-slate-400" />}
                disabled={isUploading}
              />
            </div>

            <Input
              label="Description (Optional)"
              placeholder="High-performance asynchronous microservice"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />

            {/* ZIP Drag & Drop Box */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Repository ZIP Archive</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center bg-slate-50/60 transition-colors">
                <input
                  type="file"
                  id="zip-upload"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="zip-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-600 hover:underline">
                      Click to choose repository ZIP
                    </span>{' '}
                    <span className="text-xs text-slate-500">or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Max 50 MB • Protected against decompression bombs and Zip Slip traversal
                  </p>
                </label>

                {selectedFile && (
                  <div className="mt-3 p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs font-mono">
                    <span className="truncate max-w-[280px] text-slate-800 font-semibold">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Progress / Status display */}
            {isUploading && (
              <div className="space-y-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-900">{uploadStatus}</span>
                  <span className="font-mono text-blue-700 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="text-xs text-rose-600 hover:underline font-medium"
                  >
                    Cancel Upload
                  </button>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                {!isAuthenticated ? (
                  <span className="text-amber-600 font-medium">
                    ⚠️ Sign-in required for server storage
                  </span>
                ) : (
                  <span>Verified JWT session active</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsProjectModalOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUploading}
                  leftIcon={<FolderPlus className="w-4 h-4" />}
                >
                  Upload & Analyze
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: GITHUB IMPORT */}
        {activeTab === 'github' && (
          <div className="space-y-4">
            {isLoadingGithubStatus ? (
              <div className="text-center py-8 text-xs text-slate-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Checking server GitHub App configuration...</span>
              </div>
            ) : !githubStatus?.is_configured ? (
              /* Informative unconfigured setup card */
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>GitHub Integration Not Configured</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {githubStatus?.setup_message}
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs font-mono text-slate-700 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                    Setup Steps for Administrators:
                  </div>
                  <div>1. Register an OAuth App on GitHub Settings.</div>
                  <div>2. Add to backend/.env:</div>
                  <div className="text-blue-700 font-bold pl-3">
                    GITHUB_CLIENT_ID=your_client_id<br />
                    GITHUB_CLIENT_SECRET=your_client_secret
                  </div>
                  <div>3. Restart the backend service.</div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    Use ZIP Archive Upload in the meantime:
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab('zip')}>
                    Switch to ZIP Upload
                  </Button>
                </div>
              </div>
            ) : (
              /* Configured GitHub form */
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!githubUrl.trim()) return;
                  try {
                    await api.github.importRepo({
                      name: name.trim() || 'GitHub Repository',
                      description,
                      repo_url: githubUrl.trim(),
                      branch: defaultBranch,
                    });
                    showNotification({
                      title: 'GitHub Import Queued',
                      message: `Importing ${githubUrl}`,
                      type: 'success',
                    });
                    setIsProjectModalOpen(false);
                    await refreshProjects();
                  } catch (err: any) {
                    setErrorMessage(err.detail || 'GitHub import failed.');
                  }
                }}
                className="space-y-3.5"
              >
                <Input
                  label="GitHub Repository URL"
                  placeholder="https://github.com/owner/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  leftIcon={<GithubIcon className="w-4 h-4 text-slate-400" />}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Project Name"
                    placeholder="Auto-detected from repo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Branch"
                    placeholder="main"
                    value={defaultBranch}
                    onChange={(e) => setDefaultBranch(e.target.value)}
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsProjectModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Import from GitHub
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: DEMO ARCHITECTURES */}
        {activeTab === 'template' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Select a pre-analyzed production codebase to explore the complete Stage 1 & 2 intelligence features immediately:
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleTemplateSubmit({
                    name: 'FastAPI Microcommerce Engine',
                    description: 'Asynchronous checkout and inventory reservation microservice.',
                    branch: 'main',
                    language: 'Python',
                  })
                }
                className="p-3 text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 font-mono">
                    FastAPI Microcommerce Engine
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
                    Python Async
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  142 files • 612 AST symbols • Two-phase Redis inventory reservation and PostgreSQL AsyncSession.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTemplateSubmit({
                    name: 'TypeScript NestJS Gateway',
                    description: 'Enterprise API gateway with JWT rotation and rate-limiting.',
                    branch: 'develop',
                    language: 'TypeScript',
                  })
                }
                className="p-3 text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 font-mono">
                    TypeScript NestJS Gateway
                  </span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                    TypeScript
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  88 files • 340 AST symbols • Guards, interceptors, and Redis token bucket rate limiting.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTemplateSubmit({
                    name: 'Go Distributed Raft Core',
                    description: 'High-throughput consensus protocol with gRPC streaming.',
                    branch: 'main',
                    language: 'Go',
                  })
                }
                className="p-3 text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 font-mono">
                    Go Distributed Raft Core
                  </span>
                  <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200 font-bold">
                    Golang
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  64 files • 218 AST symbols • Leader election, log compaction, and RPC transport.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
