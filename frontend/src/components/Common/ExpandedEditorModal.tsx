import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';

interface ExpandedEditorModalProps {
  open: boolean;
  title: string;
  initialValue: string;
  onSave: (newValue: string) => void;
  onClose: () => void;
}

const ExpandedEditorModal: React.FC<ExpandedEditorModalProps> = ({ 
  open, 
  title, 
  initialValue, 
  onSave, 
  onClose 
}) => {
  const [value, setValue] = useState(initialValue);

  // Sync state when modal opens
  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: { 
            height: '80vh', 
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundImage: 'none'
          }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <TextField
          autoFocus
          multiline
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          placeholder="Digite aqui..."
          sx={{
            flexGrow: 1,
            '& .MuiInputBase-root': {
              height: '100%',
              alignItems: 'flex-start',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              p: 3
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Pressione <strong>Ctrl + Enter</strong> para salvar rapidamente. Pressione <strong>Esc</strong> para cancelar.
        </Typography>
        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            Salvar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ExpandedEditorModal;
