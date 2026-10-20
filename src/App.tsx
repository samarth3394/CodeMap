import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { AuthModal } from './components/auth/AuthModal';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ProjectProvider>
            <CommandPaletteProvider>
              <AppRoutes />
              <AuthModal />
            </CommandPaletteProvider>
          </ProjectProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
