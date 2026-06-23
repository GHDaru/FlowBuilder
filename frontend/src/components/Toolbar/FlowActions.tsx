import React from 'react';
import { Box, Button, ButtonGroup, Tooltip, Divider, Paper } from '@mui/material';
import { 
  Add as NewIcon, 
  Save as SaveIcon, 
  SaveAs as SaveAsIcon, 
  FolderOpen as LoadIcon,
  AddCircle as AddNodeIcon 
} from '@mui/icons-material';

interface FlowActionsProps {
  onNew: () => void;
  onAddNode: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onLoad: () => void;
  isSaving?: boolean;
}

const FlowActions: React.FC<FlowActionsProps> = ({ onNew, onAddNode, onSave, onSaveAs, onLoad, isSaving }) => {
  return (
    <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', gap: 2 }}>
      
      {/* Flow Management Group */}
      <Paper elevation={10} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <ButtonGroup variant="contained" color="inherit" size="small">
          <Tooltip title="Novo Fluxo">
            <Button onClick={onNew}>
              <NewIcon />
            </Button>
          </Tooltip>
          
          <Tooltip title="Carregar Fluxo">
            <Button onClick={onLoad}>
              <LoadIcon />
            </Button>
          </Tooltip>

          <Tooltip title="Salvar Alterações">
            <Button onClick={onSave} color="success" disabled={isSaving}>
              <SaveIcon />
            </Button>
          </Tooltip>

          <Tooltip title="Salvar Como...">
            <Button onClick={onSaveAs} color="success" disabled={isSaving}>
              <SaveAsIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Paper>

      <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Node Management Group */}
      <Paper elevation={10} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <ButtonGroup variant="contained" color="primary" size="small">
          <Tooltip title="Adicionar Nó LLM">
            <Button onClick={onAddNode} startIcon={<AddNodeIcon />}>
              Adicionar Nó
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Paper>

    </Box>
  );
};

export default FlowActions;
