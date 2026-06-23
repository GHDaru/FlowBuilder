import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Paper, Typography, Avatar, Box } from '@mui/material';
import { Storage as StorageIcon } from '@mui/icons-material';
import NodeToolbar from './NodeToolbar';

const SqlNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const dbType = data?.database_type || 'sqlite';

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={!!selected} />
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 8, height: 8, backgroundColor: '#8b5cf6', border: '1px solid #1e1e2f' }}
      />
      
      <Paper
        elevation={selected ? 10 : 3}
        sx={{
          minWidth: 140,
          backgroundColor: 'background.paper',
          border: selected ? '2px solid' : '1px solid',
          borderColor: selected ? 'primary.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Box sx={{ 
          bgcolor: 'rgba(100, 66, 214, 0.08)', 
          p: 1, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: '#8b5cf6' }}>
            <StorageIcon sx={{ fontSize: 14, color: 'white' }} />
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="caption" noWrap sx={{ fontWeight: 'bold', display: 'block', textOverflow: 'ellipsis' }}>
                {data?.label || 'Nó SQL'}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary', textTransform: 'uppercase' }}>
                {dbType}
              </Typography>
          </Box>
        </Box>
      </Paper>

      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 8, height: 8, backgroundColor: '#8b5cf6', border: '1px solid #1e1e2f' }}
      />
    </>
  );
};

export default SqlNode;
