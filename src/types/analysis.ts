export interface DependencyItem {
  id: string;
  name: string;
  version: string;
  latestVersion: string;
  type: 'runtime' | 'dev' | 'peer' | 'indirect';
  license: string;
  vulnerabilitiesCount: number;
  healthScore: number; // 0-100
  usedInModulesCount: number;
  isOutdated: boolean;
}

export interface ImpactChangeProposal {
  id: string;
  title: string;
  targetSymbol: string;
  targetFile: string;
  changeType: 'signature_change' | 'deprecation' | 'deletion' | 'logic_update';
  riskScore: 'low' | 'medium' | 'high' | 'critical';
  impactedFiles: {
    path: string;
    affectedSymbols: string[];
    riskLevel: 'direct' | 'transitive';
    lines: number[];
  }[];
  impactedTests: {
    testFile: string;
    testName: string;
    mustUpdate: boolean;
  }[];
}

export interface TestCase {
  id: string;
  name: string;
  file: string;
  durationMs: number;
  status: 'passed' | 'failed' | 'skipped';
  errorMessage?: string;
  coverageTarget: string;
}

export interface TestSuite {
  id: string;
  name: string;
  file: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationSeconds: number;
  cases: TestCase[];
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cwe: string;
  file: string;
  line: number;
  description: string;
  remediation: string;
  status: 'open' | 'triaged' | 'resolved' | 'ignored';
}

export interface GeneratedDocSection {
  id: string;
  title: string;
  modulePath: string;
  summary: string;
  architectureNotes: string;
  endpointsOrInterfaces: {
    name: string;
    description: string;
    signature: string;
  }[];
  lastGenerated: string;
}

export interface AnalysisRun {
  id: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  timestamp: string;
  durationSeconds: number;
  status: 'success' | 'failed' | 'warning';
  changesCount: number;
  metricsDiff: {
    complexityDiff: number;
    testCoverageDiff: number;
    securityScoreDiff: number;
  };
}
