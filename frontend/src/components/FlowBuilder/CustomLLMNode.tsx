import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Paper, Box, Typography, Chip } from '@mui/material';
import { SmartToy as LLMIcon } from '@mui/icons-material';
import NodeToolbar from './NodeToolbar';

const CustomLLMNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  return (
    <>
      <NodeToolbar nodeId={id} isVisible={!!selected} />
      <Paper
        elevation={selected ? 10 : 2}
        sx={{
          width: 140,
          backgroundColor: 'background.paper',
          border: selected ? '2px solid' : '1px solid',
          borderColor: selected ? 'primary.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
          }
        }}
      >
        {/* Input Handle (Left) */}
        <Handle
          type="target"
          position={Position.Left}
          style={{ width: 8, height: 8, backgroundColor: '#3b82f6', border: '1px solid #0f172a' }}
        />

        <Box sx={{ p: 1 }}> {/* Reduced from 1.5 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LLMIcon sx={{ fontSize: 14, color: 'primary.light' }} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.5 }}>
                LLM
                </Typography>
            </Box>
            {data.model_id && (
                <Chip 
                    label={data.model_id.replace('gpt-', '').replace('gemini-', '')} 
                    size="small" 
                    color="secondary" 
                    variant="filled"
                    sx={{ height: 14, fontSize: '0.5rem', fontWeight: 'bold', px: 0 }} 
                />
            )}
          </Box>
          
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
            {data.label}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
              {data.variables?.slice(0, 2).map((v: string) => (
                  <Chip key={v} label={v} size="small" sx={{ height: 12, fontSize: '0.5rem', fontFamily: 'monospace' }} />
              ))}
              {data.variables?.length > 2 && <Typography variant="caption" sx={{ fontSize: '0.55rem' }}>...</Typography>}
          </Box>
        </Box>

        {/* Output Handle (Right) */}
        <Handle
          type="source"
          position={Position.Right}
          style={{ width: 8, height: 8, backgroundColor: '#10b981', border: '1px solid #0f172a' }}
        />
      </Paper>
    </>
  );
};

export default CustomLLMNode;
