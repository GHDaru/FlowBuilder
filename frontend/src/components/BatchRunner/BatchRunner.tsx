import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Stack, 
  Card, 
  CardContent, 
  CircularProgress, 
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  FolderOpen as FolderIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { flowService, type Flow } from '../../services/flowService';

const BatchRunner: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [folderPath, setFolderPath] = useState('data/test_samples');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [trackings, setTrackings] = useState<any[]>([]);

  useEffect(() => {
    flowService.listFlows().then(setFlows);
  }, []);

  const handleRun = async () => {
    if (!selectedFlowId) return alert("Selecione um fluxo");
    
    setIsRunning(true);
    setTrackings([]);
    try {
      const response = await axios.post(`http://127.0.0.1:8003/flows/${selectedFlowId}/run?folder_path=${folderPath}`);
      setExecutionResult(response.data);
      pollTrackings(response.data.tracking_ids);
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar execução");
      setIsRunning(false);
    }
  };

  const pollTrackings = (ids: string[]) => {
    const interval = setInterval(async () => {
      try {
        const results = await Promise.all(
          ids.map(id => axios.get(`http://127.0.0.1:8003/trackings/${id}`))
        );
        const data = results.map(r => r.data);
        setTrackings(data);
        
        const allFinished = data.every(t => t.status === 'COMPLETED' || t.status === 'ERROR');
        if (allFinished) {
          clearInterval(interval);
          setIsRunning(false);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
          <PlayIcon color="primary" /> Iniciar Processamento em Lote
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Fluxo de Avaliação</InputLabel>
              <Select
                value={selectedFlowId}
                label="Fluxo de Avaliação"
                onChange={(e) => setSelectedFlowId(e.target.value)}
              >
                {flows.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth 
              size="small"
              label="Caminho da Pasta"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <FolderIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                }
              }}
            />
          </Grid>
        </Grid>

        <Button 
          fullWidth 
          variant="contained" 
          size="large"
          startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
          disabled={isRunning || !selectedFlowId}
          onClick={handleRun}
          sx={{ mt: 4, py: 1.5 }}
        >
          {isRunning ? "Processando..." : "Iniciar Execução"}
        </Button>
      </Paper>

      {trackings.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ px: 1 }}>
            Status da Execução {executionResult?.execution_id}
          </Typography>
          
          <Grid container spacing={2}>
            {trackings.map((t) => (
              <Grid size={{ xs: 12 }} key={t.id}>
                <Card variant="outlined">
                  <CardContent sx={{ py: '16px !important', px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {t.status === 'COMPLETED' ? <SuccessIcon color="success" /> :
                       t.status === 'ERROR' ? <ErrorIcon color="error" /> :
                       <CircularProgress size={24} />}
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          Atendimento: {t.atendimento_id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                          {t.status}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip label={t.id.slice(0, 8)} size="small" variant="outlined" sx={{ fontFamily: 'monospace', opacity: 0.5 }} />
                  </CardContent>
                  {t.status === 'PROCESSING' && <LinearProgress sx={{ height: 2 }} />}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}
    </Box>
  );
};

export default BatchRunner;
