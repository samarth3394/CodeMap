export type ProjectStatus = 'ready' | 'indexing' | 'error' | 'syncing';

export type Language = 'Python' | 'TypeScript' | 'Go' | 'Rust' | 'Java';

export interface ProjectStats {
  filesCount: number;
  linesOfCode: number;
  modulesCount: number;
  symbolsCount: number;
  testCoverage: number;
  securityScore: number; // 0-100
  maintainabilityIndex: number; // 0-100
  dependencyCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repositoryUrl: string;
  defaultBranch: string;
  languages: { name: Language; percentage: number; color: string }[];
  status: ProjectStatus;
  lastAnalyzedAt: string;
  commitHash: string;
  stats: ProjectStats;
  tags: string[];
  isStarred?: boolean;
}

export interface ActivityItem {
  id: string;
  projectId: string;
  projectName: string;
  type: 'index' | 'security_scan' | 'impact_analysis' | 'ai_query' | 'git_sync';
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  status: 'completed' | 'in_progress' | 'failed';
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  linkText?: string;
  linkPath?: string;
}
