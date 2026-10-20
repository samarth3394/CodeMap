import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Language, ProjectStatus } from '../types/project';
import { MOCK_PROJECTS } from '../data/mockData';
import { useNotification } from './NotificationContext';
import { api, BackendProject } from '../services/api';

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project;
  currentBranch: string;
  selectProjectById: (id: string) => void;
  setCurrentBranch: (branch: string) => void;
  toggleStarProject: (id: string) => void;
  createProject: (newProj: Omit<Project, 'id' | 'lastAnalyzedAt' | 'commitHash' | 'stats'>) => void;
  deleteProject: (id: string) => Promise<boolean>;
  refreshProjects: () => Promise<void>;
  isBackendConnected: boolean;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [currentBranch, setCurrentBranch] = useState<string>(MOCK_PROJECTS[0].defaultBranch);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const { showNotification } = useNotification();

  const mapBackendProjectToClient = (bp: BackendProject): Project => {
    const languageColors: Record<string, string> = {
      Python: '#3572A5',
      TypeScript: '#3178C6',
      Go: '#00ADD8',
      Rust: '#DEA584',
      Java: '#B07219',
    };

    return {
      id: bp.id,
      name: bp.name,
      description: bp.description || 'Uploaded repository indexed with CodeMap intelligence.',
      repositoryUrl: bp.github_repo_url || `local://storage/${bp.name.toLowerCase().replace(/\s+/g, '-')}`,
      defaultBranch: bp.default_branch || 'main',
      lastAnalyzedAt: new Date(bp.updated_at).toLocaleDateString(),
      commitHash: bp.commit_hash || 'c0de91f',
      languages: [
        {
          name: 'Python' as Language,
          percentage: 88.0,
          color: languageColors.Python,
        },
      ],
      status: (bp.status === 'ready' ? 'ready' : bp.status === 'failed' ? 'error' : 'indexing') as ProjectStatus,
      stats: {
        filesCount: bp.stats.filesCount || 10,
        linesOfCode: bp.stats.linesOfCode || 1200,
        modulesCount: bp.stats.modulesCount || 4,
        symbolsCount: bp.stats.symbolsCount || 45,
        testCoverage: bp.stats.testCoverage || 85.0,
        securityScore: bp.stats.securityScore || 96,
        maintainabilityIndex: 88,
        dependencyCount: bp.stats.dependencyCount || 6,
      },
      tags: [bp.repository_source.toUpperCase(), 'Custom Workspace'],
      isStarred: false,
    };
  };

  const refreshProjects = useCallback(async () => {
    try {
      const res = await api.projects.list({ limit: 50 });
      setIsBackendConnected(true);

      if (res.items && res.items.length > 0) {
        const backendProjects = res.items.map(mapBackendProjectToClient);
        // Merge with sample projects so user always has samples available
        const sampleProjects = MOCK_PROJECTS.filter(
          (sp) => !backendProjects.some((bp) => bp.id === sp.id || bp.name === sp.name)
        );
        setProjects([...backendProjects, ...sampleProjects]);
      } else {
        setProjects(MOCK_PROJECTS);
      }
    } catch {
      // Backend not running or offline: fallback to mock data gracefully
      setIsBackendConnected(false);
      setProjects(MOCK_PROJECTS);
    }
  }, []);

  // Sync on mount
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || MOCK_PROJECTS[0];

  const selectProjectById = (id: string) => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setSelectedProjectId(id);
      setCurrentBranch(found.defaultBranch);
      showNotification({
        title: `Switched project to ${found.name}`,
        message: `Branch set to ${found.defaultBranch}`,
        type: 'info',
      });
    }
  };

  const toggleStarProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isStarred: !p.isStarred } : p))
    );
  };

  const createProject = (
    newProjData: Omit<Project, 'id' | 'lastAnalyzedAt' | 'commitHash' | 'stats'>
  ) => {
    const newId = `proj-${Date.now().toString(36)}`;
    const newProject: Project = {
      ...newProjData,
      id: newId,
      lastAnalyzedAt: 'Just now (Demo)',
      commitHash: 'c0de91f',
      stats: {
        filesCount: 42,
        linesOfCode: 5200,
        modulesCount: 8,
        symbolsCount: 180,
        testCoverage: 92.0,
        securityScore: 96,
        maintainabilityIndex: 88,
        dependencyCount: 14,
      },
    };

    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newId);
    showNotification({
      title: 'Demo Project Created',
      message: `${newProject.name} has been added to your local workspace demo.`,
      type: 'success',
    });
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    if (projects.length <= 1) {
      showNotification({
        title: 'Cannot Delete Only Project',
        message: 'At least one repository must remain in the workspace.',
        type: 'warning',
      });
      return false;
    }

    // Try deleting from backend if it's a backend project
    try {
      await api.projects.delete(id).catch(() => {});
    } catch {}

    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);

    if (selectedProjectId === id) {
      setSelectedProjectId(remaining[0].id);
      setCurrentBranch(remaining[0].defaultBranch);
    }

    showNotification({
      title: 'Project Deleted',
      message: 'Repository has been removed from workspace.',
      type: 'info',
    });
    return true;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        currentBranch,
        selectProjectById,
        setCurrentBranch,
        toggleStarProject,
        createProject,
        deleteProject,
        refreshProjects,
        isBackendConnected,
        isProjectModalOpen,
        setIsProjectModalOpen,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
