import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Paper, Box, Typography } from '@mui/material';
import { AltRoute as RouterIcon } from '@mui/icons-material';
import NodeToolbar from './NodeToolbar';

const ConditionNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const rules = data.rules || [];

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={!!selected} />
      <Paper
        elevation={selected ? 10 : 2}
        sx={{
          width: 160,
          backgroundColor: 'background.paper',
          border: selected ? '2px solid' : '1px solid',
          borderColor: selected ? 'secondary.main' : 'divider',
          borderRadius: 2,
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'secondary.main',
          }
        }}
      >
        {/* Input Handle (Left) */}
        <Handle
          type="target"
          position={Position.Left}
          style={{ width: 8, height: 8, backgroundColor: '#ec4899', border: '1px solid #0f172a' }}
        />

        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <RouterIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'secondary.main', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>
                Condição
              </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'text.primary' }}>
            {data.label || 'Router'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {rules.map((rule: any) => (
              <Box key={rule.id} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
                <Typography variant="caption" sx={{ fontSize: '0.55rem', mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                  {rule.variable} == {rule.value}
                </Typography>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={rule.id}
                  style={{ top: 'auto', right: -5, position: 'relative', transform: 'none', width: 8, height: 8, backgroundColor: '#10b981', border: '1px solid #0f172a' }}
                />
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', mt: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.55rem', mr: 1, color: 'text.disabled', fontStyle: 'italic' }}>
                  Default
                </Typography>
                <Handle
                  type="source"
                  position={Position.Right}
                  id="default"
                  style={{ top: 'auto', right: -5, position: 'relative', transform: 'none', width: 8, height: 8, backgroundColor: '#64748b', border: '1px solid #0f172a' }}
                />
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ConditionNode;
