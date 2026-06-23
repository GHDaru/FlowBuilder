import React from 'react';
import { NodeToolbar as RTNodeToolbar, Position, useReactFlow } from 'reactflow';
import { Paper, IconButton, Tooltip, Stack } from '@mui/material';
import { 
  ContentCopy as DuplicateIcon, 
  Delete as DeleteIcon, 
  InfoOutlined as InfoIcon 
} from '@mui/icons-material';

interface NodeToolbarProps {
  nodeId: string;
  isVisible: boolean;
}

const NodeToolbar: React.FC<NodeToolbarProps> = ({ nodeId, isVisible }) => {
  const { deleteElements, getNode, addNodes } = useReactFlow();

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id: nodeId }] });
  };

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node = getNode(nodeId);
    if (!node) return;

    const newNode = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
    };
    addNodes(newNode);
  };

  return (
    <RTNodeToolbar isVisible={isVisible} position={Position.Top}>
      <Paper 
        elevation={8} 
        sx={{ 
          p: 0.5, 
          borderRadius: 2, 
          bgcolor: 'background.paper', 
          border: '1px solid',
          borderColor: 'divider',
          mb: 1,
          display: 'flex',
          boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Stack direction="row" spacing={0.5} component="div">
          <Tooltip title="Duplicar">
            <IconButton size="small" onClick={onDuplicate} color="inherit">
              <DuplicateIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Excluir">
            <IconButton size="small" onClick={onDelete} color="inherit" sx={{ '&:hover': { color: 'error.main' } }}>
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Informações">
            <IconButton size="small" color="inherit">
              <InfoIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </RTNodeToolbar>
  );
};

export default NodeToolbar;
