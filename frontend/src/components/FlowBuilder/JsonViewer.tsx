import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { Close as CloseIcon, Code as JsonIcon } from '@mui/icons-material';

interface JsonViewerProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <JsonIcon color="primary" />
            <Typography variant="h6">Definição JSON do Fluxo</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
        <Box sx={{ p: 2 }}>
            <pre style={{ 
                margin: 0, 
                fontSize: '0.8rem', 
                color: '#818cf8', 
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
            }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default JsonViewer;
