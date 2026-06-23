import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { flowService, type Flow } from '../../services/flowService';

interface LoadFlowDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (flow: Flow) => void;
}

const LoadFlowDialog: React.FC<LoadFlowDialogProps> = ({ open, onClose, onSelect }) => {
  const [flows, setFlows] = useState<Flow[]>([]);

  useEffect(() => {
    if (open) {
      flowService.listFlows().then(setFlows);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Carregar Fluxo
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {flows.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
            Nenhum fluxo encontrado.
          </Typography>
        ) : (
          <List>
            {flows.map((flow) => (
              <ListItem key={flow.id} disablePadding>
                <ListItemButton onClick={() => { onSelect(flow); onClose(); }}>
                  <ListItemText 
                    primary={flow.name} 
                    secondary={`Atualizado em: ${new Date(flow.updated_at).toLocaleString()}`} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoadFlowDialog;
