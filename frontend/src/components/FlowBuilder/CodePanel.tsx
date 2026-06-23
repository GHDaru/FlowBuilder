import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Stack, 
  Paper, 
  Divider 
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ContentCopy as CopyIcon, 
  Download as DownloadIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface CodePanelProps {
  open: boolean;
  onClose: () => void;
  flow: {
      name: string;
      nodes: any[];
      edges: any[];
  };
}

const CodePanel: React.FC<CodePanelProps> = ({ open, onClose, flow }) => {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(flow, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flow.name.replace(/\s+/g, '_') || 'fluxo'}_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 500, backgroundColor: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)' }
        }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Definição do Fluxo (JSON)</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Paper 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            backgroundColor: '#000', 
            overflow: 'auto', 
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace', color: '#818cf8' }}>
            {jsonStr}
          </pre>
        </Paper>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={copied ? <CheckIcon /> : <CopyIcon />} 
            onClick={handleCopy}
            color={copied ? "success" : "primary"}
          >
            {copied ? 'Copiado!' : 'Copiar JSON'}
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            startIcon={<DownloadIcon />} 
            onClick={handleDownload}
          >
            Baixar .json
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default CodePanel;
