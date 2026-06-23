import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Tooltip, 
  IconButton,
  Divider,
  Typography
} from '@mui/material';
import { 
  AccountTree as FlowIcon, 
  PlayArrow as RunIcon, 
  History as HistoryIcon, 
  Storage as DbIcon,
  Gavel as RulesIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as LogoIcon,
  LightMode as SunIcon,
  DarkMode as MoonIcon
} from '@mui/icons-material';
import type { PaletteMode } from '@mui/material';

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  themeMode: PaletteMode;
  onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed, onToggle, themeMode, onToggleTheme }) => {
  const menuItems = [
    { id: 'builder', label: 'Flow Builder', icon: <FlowIcon /> },
    { id: 'runner', label: 'Batch Runner', icon: <RunIcon /> },
    { id: 'history', label: 'History', icon: <HistoryIcon /> },
    { id: 'official', label: 'Base Oficial', icon: <DbIcon /> },
    { id: 'rules', label: 'Gestão de Regras', icon: <RulesIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Brand Logo Area */}
      <Box sx={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        px: collapsed ? 0 : 3,
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 2,
        color: 'primary.main'
      }}>
        <LogoIcon fontSize="large" />
        {!collapsed && (
          <Typography variant="h6" sx={{ 
            fontWeight: 900, 
            letterSpacing: -0.5,
            background: 'linear-gradient(45deg, #6442D6 30%, #C8B3FD 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AVALIA
          </Typography>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Navigation List */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.id} 
            title={collapsed ? item.label : ""} 
            placement="right"
          >
            <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={() => onTabChange(item.id)}
                selected={activeTab === item.id}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 2.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(100, 66, 214, 0.12)',
                    color: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 66, 214, 0.18)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    }
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 3,
                    justifyContent: 'center',
                    color: activeTab === item.id ? 'primary.main' : 'text.secondary',
                    transition: 'margin 0.2s'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.label} 
                    slotProps={{
                        primary: {
                            sx: { 
                                fontWeight: activeTab === item.id ? 600 : 400,
                                fontSize: '0.875rem'
                            }
                        }
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Bottom Actions & Toggle */}
      <Box sx={{ mt: 'auto', p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Divider sx={{ mb: 1, opacity: 0.5 }} />
        
        <Tooltip title={collapsed ? `Mudar para tema ${themeMode === 'light' ? 'Escuro' : 'Claro'}` : ""} placement="right">
            <ListItemButton onClick={onToggleTheme} sx={{ borderRadius: 2, px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}>
                    {themeMode === 'light' ? <MoonIcon fontSize="small" /> : <SunIcon fontSize="small" />}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={`Tema ${themeMode === 'light' ? 'Escuro' : 'Claro'}`} />}
            </ListItemButton>
        </Tooltip>

        <Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', px: 1 }}>
            <IconButton onClick={onToggle} size="small" sx={{ 
                bgcolor: 'rgba(255,255,255,0.03)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
            }}>
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
