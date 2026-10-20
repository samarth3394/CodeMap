import React, { createContext, useContext, useState } from 'react';
import { Project } from '../types/project';
import { MOCK_PROJECTS } from '../data/mockData';
import { useNotification } from './NotificationContext';

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project;
  currentBranch: string;
  selectProjectById: (id: string) => void;
  setCurrentBranch: (branch: string) => void;
  toggleStarProject: (id: string) => void;
  createProject: (newProj: Omit<Project, 'id' | 'lastAnalyzedAt' | 'commitHash' | 'stats'>) => void;
  deleteProject: (id: string) => boolean;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [currentBranch, setCurrentBranch] = useState<string>(MOCK_PROJECTS[0].defaultBranch);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { showNotification } = useNotification();

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

  const deleteProject = (id: string): boolean => {
    if (projects.length <= 1) {
      showNotification({
        title: 'Cannot Delete Only Project',
        message: 'At least one repository must remain in the workspace.',
        type: 'warning',
      });
      return false;
    }

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
