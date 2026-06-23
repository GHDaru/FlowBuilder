import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  TextField 
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Edit as PencilIcon,
  Save as SaveIcon,
  SaveAs as SaveAsIcon,
  Code as CodeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface EditorHeaderProps {
  flowName: string;
  onRename: (newName: string) => void;
  onSave: () => void;
  onSaveAs: () => void;
  onViewCode: () => void;
  onBack: () => void;
  isDraft?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  flowName, 
  onRename, 
  onSave, 
  onSaveAs, 
  onViewCode, 
  onBack,
  isDraft 
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(flowName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(flowName);
  }, [flowName]);

  const handleStartEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveName = () => {
    setEditing(false);
    if (name.trim() && name !== flowName) {
      onRename(name.trim());
    } else {
      setName(flowName);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      height: 60, 
      px: 3, 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'background.paper',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Left side: Back + Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Voltar para Lista">
          <IconButton onClick={onBack} size="small">
            <BackIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editing ? (
            <TextField
              inputRef={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') {
                  setEditing(false);
                  setName(flowName);
                }
              }}
              size="small"
              variant="standard"
              sx={{ 
                '& .MuiInput-root': { 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  color: 'primary.light'
                } 
              }}
            />
          ) : (
            <>
              <Typography 
                variant="h6" 
                onClick={handleStartEdit}
                sx={{ 
                  cursor: 'pointer', 
                  fontWeight: 600,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {name || 'Novo Fluxo'}
              </Typography>
              <IconButton size="small" onClick={handleStartEdit} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                <PencilIcon fontSize="small" />
              </IconButton>
            </>
          )}
          {isDraft && (
            <Box sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.05)', px: 1, py: 0.2, borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>DRAFT</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right side: Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Ver Código (JSON)">
          <IconButton onClick={onViewCode}>
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Salvar (Ctrl+S)">
          <IconButton onClick={onSave} color="primary">
            <SaveIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Salvar Como (Ctrl+Shift+S)">
          <IconButton onClick={onSaveAs}>
            <SaveAsIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Configurações">
          <IconButton>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default EditorHeader;
