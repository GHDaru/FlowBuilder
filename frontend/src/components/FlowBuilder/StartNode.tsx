import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Paper, Typography, Avatar, Box } from '@mui/material';
import { PlayArrow as StartIcon, SettingsEthernet as VarIcon } from '@mui/icons-material';
import NodeToolbar from './NodeToolbar';

const StartNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const globalCount = data?.selected_globals?.length || 0;

  return (
    <>
      <NodeToolbar nodeId={id} isVisible={!!selected} />
      <Paper
        elevation={selected ? 10 : 2}
        sx={{
          minWidth: 85,
          backgroundColor: 'background.paper',
          border: selected ? '2px solid' : '1px solid',
          borderColor: selected ? 'primary.main' : 'divider',
          borderRadius: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: 0.5,
          pr: 1.5,
          py: 0.3,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Avatar sx={{ width: 18, height: 18, bgcolor: 'primary.main' }}>
          <StartIcon sx={{ fontSize: 12, color: 'white' }} />
        </Avatar>
        
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.6rem', lineHeight: 1 }}>
              Início
            </Typography>
            {globalCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <VarIcon sx={{ fontSize: 10, color: 'primary.light' }} />
                    <Typography sx={{ fontSize: '0.55rem', color: 'primary.light' }}>{globalCount}</Typography>
                </Box>
            )}
        </Box>

        {/* Only Output Handle (Right) */}
        <Handle
          type="source"
          position={Position.Right}
          style={{ width: 8, height: 8, backgroundColor: '#3b82f6', border: '1px solid #0f172a' }}
        />
      </Paper>
    </>
  );
};

export default StartNode;
