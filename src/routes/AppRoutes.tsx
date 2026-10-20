import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../features/landing/LandingPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProjectsListPage } from '../features/projects/ProjectsListPage';
import { AppLayout } from '../components/layout/AppLayout';
import { WorkspaceOverview } from '../features/workspace/WorkspaceOverview';
import { CodeMapView } from '../features/workspace/CodeMap/CodeMapView';
import { CodeExplorerView } from '../features/workspace/CodeExplorer/CodeExplorerView';
import { AIAssistantView } from '../features/workspace/AIAssistant/AIAssistantView';
import { ImpactAnalysisView } from '../features/workspace/Impact/ImpactAnalysisView';
import { DependenciesView } from '../features/workspace/Dependencies/DependenciesView';
import { TestsView } from '../features/workspace/Tests/TestsView';
import { SecurityAuditView } from '../features/workspace/Security/SecurityAuditView';
import { DocsView } from '../features/workspace/Docs/DocsView';
import { AnalysisHistoryView } from '../features/workspace/History/AnalysisHistoryView';
import { ProjectSettingsView } from '../features/workspace/Settings/ProjectSettingsView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Workspace Layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsListPage />} />

        {/* Project Specific Routes */}
        <Route path="/projects/:projectId/overview" element={<WorkspaceOverview />} />
        <Route path="/projects/:projectId/codemap" element={<CodeMapView />} />
        <Route path="/projects/:projectId/explorer" element={<CodeExplorerView />} />
        <Route path="/projects/:projectId/ai" element={<AIAssistantView />} />
        <Route path="/projects/:projectId/dependencies" element={<DependenciesView />} />
        <Route path="/projects/:projectId/impact" element={<ImpactAnalysisView />} />
        <Route path="/projects/:projectId/tests" element={<TestsView />} />
        <Route path="/projects/:projectId/security" element={<SecurityAuditView />} />
        <Route path="/projects/:projectId/docs" element={<DocsView />} />
        <Route path="/projects/:projectId/history" element={<AnalysisHistoryView />} />
        <Route path="/projects/:projectId/settings" element={<ProjectSettingsView />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
