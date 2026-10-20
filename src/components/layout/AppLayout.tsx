import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { NewProjectModal } from '../modals/NewProjectModal';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
      <NewProjectModal />
    </div>
  );
};
