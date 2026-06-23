import React, { useEffect, useState } from 'react';
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
  Checkbox,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  PlayArrow as ProcessIcon,
  CheckCircle as CheckedIcon
} from '@mui/icons-material';
import { officialDataApi, type OfficialInteraction, type OfficialFirm } from '../../services/officialDataApi';
import axios from 'axios';
import { TableSortLabel } from '@mui/material';

interface AtendimentoPickerProps {
  firms: OfficialFirm[];
  onBack: () => void;
  onSuccess: (trackingIds: string[]) => void;
}

interface SortConfig {
    key: keyof OfficialInteraction | '';
    direction: 'asc' | 'desc';
}

const AtendimentoPicker: React.FC<AtendimentoPickerProps> = ({ firms, onBack, onSuccess }) => {
  const [interactions, setInteractions] = useState<OfficialInteraction[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'evaluated'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const firmIds = firms.map(f => f.id);
        const [intData, flowsData] = await Promise.all([
            officialDataApi.listInteractions(firmIds),
            axios.get('http://127.0.0.1:8003/flows').then(res => res.data)
        ]);
        setInteractions(intData);
        setFlows(flowsData);
        if (flowsData.length > 0) setSelectedFlowId(flowsData[0].id);
        
        // Default: select all loaded interactions
        setSelectedIds(intData.map(i => i.id));
      } catch (error) {
        console.error("Error fetching interactions/flows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [firms]);

  const filteredInteractions = React.useMemo(() => {
    return interactions.filter(i => {
        if (statusFilter === 'pending') return !i.has_evaluation;
        if (statusFilter === 'evaluated') return i.has_evaluation;
        return true;
    });
  }, [interactions, statusFilter]);

  const sortedInteractions = React.useMemo(() => {
    if (!sortConfig.key) return filteredInteractions;
    
    return [...filteredInteractions].sort((a: any, b: any) => {
        const aVal = a[sortConfig.key] ?? -1;
        const bVal = b[sortConfig.key] ?? -1;
        const factor = sortConfig.direction === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'string') {
            return aVal.localeCompare(bVal) * factor;
        }
        return (aVal - bVal) * factor;
    });
  }, [filteredInteractions, sortConfig]);

  const toggleSort = (key: keyof OfficialInteraction) => {
      setSortConfig(prev => ({
          key,
          direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
      }));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Only select IDs from the CURRENTLY FILTERED list
      const visibleIds = filteredInteractions.map(i => i.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      // Deselect only IDs from the CURRENTLY FILTERED list
      const visibleIds = filteredInteractions.map(i => i.id);
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    }
  };

  const handleProcess = async () => {
    if (!selectedFlowId || selectedIds.length === 0) return;
    
    setProcessing(true);
    try {
        const res = await officialDataApi.processInteractions(selectedFlowId, selectedIds);
        onSuccess(res.tracking_ids);
    } catch (error) {
        console.error("Error processing interactions:", error);
        alert("Erro ao disparar processamento.");
    } finally {
        setProcessing(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
            <BackIcon />
        </IconButton>
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                {firms.length === 1 ? firms[0].name : `${firms.length} Contabilidades`}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 600 }}>
                {firms.length === 1 ? 'Selecione os atendimentos para processar no laboratório.' : firms.map(f => f.name).join(', ')}
            </Typography>
        </Box>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel sx={{ fontSize: '0.85rem' }}>Status</InputLabel>
                <Select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="all">Todos os Atendimentos</MenuItem>
                    <MenuItem value="pending">Somente Pendentes</MenuItem>
                    <MenuItem value="evaluated">Somente Avaliados</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 280 }}>
                <InputLabel sx={{ fontSize: '0.85rem' }}>Fluxo de Execução</InputLabel>
                <Select
                    value={selectedFlowId}
                    onChange={(e) => setSelectedFlowId(e.target.value)}
                    label="Fluxo de Execução"
                    sx={{ borderRadius: 2 }}
                >
                    {flows.map(f => (
                        <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.5 }} />

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>SELECIONADOS</Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.light' }}>
                    {selectedIds.length} atendimento(s)
                </Typography>
            </Box>

            <Button 
                variant="contained" 
                color="primary"
                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <ProcessIcon />}
                disabled={selectedIds.length === 0 || processing || !selectedFlowId}
                onClick={handleProcess}
                sx={{ px: 4, borderRadius: 3, fontWeight: 700 }}
            >
                {processing ? 'Processando...' : 'Executar no Lab'}
            </Button>
        </Box>
      </Paper>

      {/* Grid */}
      <TableContainer component={Paper} elevation={0} sx={{ flexGrow: 1, overflow: 'auto', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <Checkbox 
                    size="small"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < interactions.length}
                    checked={interactions.length > 0 && selectedIds.length === interactions.length}
                    onChange={handleSelectAll}
                  />
              </TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)', py: 2 }}>Ticket ID</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>Data</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>Status</TableCell>
              
              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableSortLabel active={sortConfig.key === 'nota_media'} direction={sortConfig.direction} onClick={() => toggleSort('nota_media')}>
                    Média
                  </TableSortLabel>
              </TableCell>
              
              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableSortLabel active={sortConfig.key === 'nota_comunicacao'} direction={sortConfig.direction} onClick={() => toggleSort('nota_comunicacao')}>
                    Comum.
                  </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableSortLabel active={sortConfig.key === 'nota_profissionalismo'} direction={sortConfig.direction} onClick={() => toggleSort('nota_profissionalismo')}>
                    Profiss.
                  </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableSortLabel active={sortConfig.key === 'nota_resolucao'} direction={sortConfig.direction} onClick={() => toggleSort('nota_resolucao')}>
                    Resol.
                  </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 12 }}>
                        <CircularProgress size={32} thickness={5} />
                    </TableCell>
                </TableRow>
            ) : sortedInteractions.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 12 }}>
                        <Typography color="text.secondary">Nenhum atendimento recente encontrado.</Typography>
                    </TableCell>
                </TableRow>
            ) : (
                sortedInteractions.map((row) => (
                    <TableRow 
                        key={row.id} 
                        hover 
                        onClick={() => toggleSelect(row.id)} 
                        sx={{ cursor: 'pointer', transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox size="small" checked={selectedIds.includes(row.id)} />
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem' }}>{row.ticket_id}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem', opacity: 0.8 }}>
                            {new Date(row.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                            {row.has_evaluation ? (
                                <Chip label="AVALIADO" size="small" color="success" variant="filled" icon={<CheckedIcon sx={{ fontSize: '12px !important' }} />} sx={{ height: 18, fontSize: '0.6rem', fontWeight: 900, borderRadius: 1 }} />
                            ) : (
                                <Chip label="PENDENTE" size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 900, borderRadius: 1, opacity: 0.5 }} />
                            )}
                        </TableCell>
                        <TableCell align="center">
                            {row.nota_media != null ? <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.light' }}>{row.nota_media}</Typography> : '-'}
                        </TableCell>
                        <TableCell align="center">
                            {row.nota_comunicacao != null ? <Typography variant="caption">{row.nota_comunicacao}</Typography> : '-'}
                        </TableCell>
                        <TableCell align="center">
                            {row.nota_profissionalismo != null ? <Typography variant="caption">{row.nota_profissionalismo}</Typography> : '-'}
                        </TableCell>
                        <TableCell align="center">
                            {row.nota_resolucao != null ? <Typography variant="caption">{row.nota_resolucao}</Typography> : '-'}
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

export default AtendimentoPicker;
