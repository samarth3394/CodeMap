
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { ProjectProvider } from './context/ProjectContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <ProjectProvider>
          <CommandPaletteProvider>
            <AppRoutes />
          </CommandPaletteProvider>
        </ProjectProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
