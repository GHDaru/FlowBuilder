import React from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography
} from '@mui/material';
import type { PaletteMode } from '@mui/material';

import FlowBuilder from './components/FlowBuilder/FlowBuilder';
import BatchRunner from './components/BatchRunner/BatchRunner';
import History from './components/History/History';
import FirmList from './components/OfficialData/FirmList';
import AtendimentoPicker from './components/OfficialData/AtendimentoPicker';
import RulesManagement from './components/Rules/RulesTable';
import { type OfficialFirm } from './services/officialDataApi';
import materialTheme from './theme/materialTheme';
import Sidebar from './components/Navigation/Sidebar';

function App() {
  const [activeTab, setActiveTab] = React.useState('builder');
  const [selectedFirms, setSelectedFirms] = React.useState<OfficialFirm[]>([]);
  
  // Theme mode state
  const [themeMode, setThemeMode] = React.useState<PaletteMode>(() => {
    const saved = localStorage.getItem('ui_theme_mode');
    return (saved as PaletteMode) || 'dark';
  });

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('ui_theme_mode', newMode);
      return newMode;
    });
  };

  const theme = React.useMemo(() => materialTheme(themeMode), [themeMode]);

  // Sidebar state with persistence
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('sidebar_collapsed', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default' }}>
        
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <AppBar 
            position="static" 
            elevation={0} 
            sx={{ 
              backgroundColor: 'background.paper', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)' 
            }}
          >
            <Toolbar variant="dense" sx={{ height: 64 }}>
              <Typography variant="h6" component="div" sx={{ 
                flexGrow: 1,
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: -0.5
              }}>
                {activeTab === 'builder' && 'Flow Builder'}
                {activeTab === 'runner' && 'Batch Runner'}
                {activeTab === 'history' && 'Execution History'}
                {activeTab === 'official' && 'Base Oficial (Postgres)'}
                {activeTab === 'rules' && 'Gestão de Regras'}
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
            {activeTab === 'builder' && <FlowBuilder />}
            {activeTab === 'runner' && <BatchRunner />}
            {activeTab === 'history' && <History />}
            {activeTab === 'rules' && <RulesManagement />}
            {activeTab === 'official' && (
                selectedFirms.length === 0 ? (
                    <FirmList onSelectFirms={setSelectedFirms} />
                ) : (
                    <AtendimentoPicker 
                        firms={selectedFirms} 
                        onBack={() => setSelectedFirms([])} 
                        onSuccess={() => setActiveTab('history')} 
                    />
                )
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
