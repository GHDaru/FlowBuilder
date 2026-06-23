import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Button, 
  Stack,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Add as NewIcon, 
  Delete as DeleteIcon, 
  ContentCopy as CopyIcon,
  PlayArrow as ExecuteIcon,
  Upload as ImportIcon,
  Download as ExportIcon
} from '@mui/icons-material';
import { flowService, type Flow } from '../../services/flowService';
import { exportFlowToJson, parseFlowImport } from '../../utils/flowUtils';

interface FlowListViewProps {
  onSelect: (flow: Flow) => void;
  onNew: () => void;
}

const FlowListView: React.FC<FlowListViewProps> = ({ onSelect, onNew }) => {
  const [flows, setFlows] = useState<Flow[]>([]);

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      const data = await flowService.listFlows();
      setFlows(data);
    } catch (error) {
      console.error("Erro ao listar fluxos:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente excluir este fluxo?")) {
      await flowService.deleteFlow(id);
      loadFlows();
    }
  };

  const handleCopy = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    const newName = window.prompt("Nome da cópia:", `${name} (Cópia)`);
    if (newName) {
      await flowService.copyFlow(id, newName);
      loadFlows();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const flowData = await parseFlowImport(file);
        await flowService.createFlow(flowData);
        loadFlows();
        // Simple visual feedback
    } catch (err: any) {
        alert(`Erro ao importar: ${err.message}`);
    } finally {
        e.target.value = '';
    }
  };

  const handleExport = (e: React.MouseEvent, flow: Flow) => {
    e.stopPropagation();
    exportFlowToJson(flow);
  };

  const getNodeCount = (flow: Flow) => {
    try {
        const def = JSON.parse(flow.json_definition || '{"nodes":[]}');
        return def.nodes?.length || 0;
    } catch {
        return 0;
    }
  };

  return (
    <Box sx={{ p: 4, height: '100%', overflow: 'auto' }}>
      <Stack direction="row" sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Fluxos de Avaliação</Typography>
          <Typography variant="body2" color="text.secondary">Gerencie e orquestre seus processos de IA.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button 
                variant="outlined" 
                component="label"
                startIcon={<ImportIcon />}
            >
                Importar .json
                <input type="file" accept=".json" hidden onChange={handleImport} />
            </Button>
            <Button 
                variant="contained" 
                startIcon={<NewIcon />} 
                onClick={onNew}
            >
                Novo Fluxo
            </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID do Fluxo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nós</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data de Criação</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'text.secondary', fontStyle: 'italic' }}>
                  Nenhum fluxo encontrado. Crie um novo para começar.
                </TableCell>
              </TableRow>
            ) : (
              flows.map((flow) => (
                <TableRow 
                  key={flow.id} 
                  hover 
                  onClick={() => onSelect(flow)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.6 }}>
                    {flow.id.split('-')[0]}...
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{flow.name}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary' }}>
                    {flow.description || '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={getNodeCount(flow)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {new Date(flow.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title="Abrir Editor">
                        <IconButton size="small" color="primary">
                          <ExecuteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Exportar JSON">
                        <IconButton size="small" onClick={(e) => handleExport(e, flow)}>
                          <ExportIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicar">
                        <IconButton size="small" onClick={(e) => handleCopy(e, flow.id, flow.name)}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={(e) => handleDelete(e, flow.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FlowListView;
