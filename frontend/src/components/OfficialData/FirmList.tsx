import React, { useEffect, useState, useMemo } from 'react';
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
  TextField, 
  InputAdornment,
  CircularProgress,
  Stack,
  Checkbox,
  Button,
  TableSortLabel,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Business as CompanyIcon,
  PlayArrow as ProcessIcon
} from '@mui/icons-material';
import { officialDataApi, type OfficialFirm } from '../../services/officialDataApi';

interface FirmListProps {
  onSelectFirms: (firms: OfficialFirm[]) => void;
}

const FirmList: React.FC<FirmListProps> = ({ onSelectFirms }) => {
  const [firms, setFirms] = useState<OfficialFirm[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFirms = async () => {
      setLoading(true);
      try {
        const data = await officialDataApi.listFirms(debouncedSearch);
        setFirms(data);
        // Default: select all loaded firms ONLY if it's the initial load or a new search
        setSelectedIds(data.map(f => f.id));
      } catch (error) {
        console.error("Error fetching firms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, [debouncedSearch]);

  const filteredFirms = useMemo(() => {
    return [...firms].sort((a, b) => {
        const factor = sortDirection === 'asc' ? 1 : -1;
        return (a.evaluation_count - b.evaluation_count) * factor;
    });
  }, [firms, sortDirection]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(filteredFirms.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleProceed = () => {
    const selectedFirms = firms.filter(f => selectedIds.includes(f.id));
    onSelectFirms(selectedFirms);
  };

  const totalFirms = firms.length;
  const totalEvaluations = firms.reduce((acc, firm) => acc + firm.evaluation_count, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CompanyIcon color="primary" /> Contabilidades
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Selecione as empresas para auditar e processe em lote os atendimentos da Base Oficial.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', minWidth: 160, textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Contabilidades</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{totalFirms.toLocaleString()}</Typography>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', minWidth: 160, textAlign: 'center', boxShadow: '0 8px 24px rgba(100, 66, 214, 0.15)' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Total Avaliações</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.light' }}>{totalEvaluations.toLocaleString()}</Typography>
            </Paper>
        </Stack>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField 
            fullWidth 
            size="small"
            placeholder="Pesquisar contabilidade por nome ou ID..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }
            }}
          />
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<ProcessIcon />}
            disabled={selectedIds.length === 0}
            onClick={handleProceed}
            sx={{ px: 4, whiteSpace: 'nowrap', borderRadius: 3, fontWeight: 700 }}
          >
              Ver {selectedIds.length} Itens
          </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ flexGrow: 1, overflow: 'auto', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'background.paper' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Checkbox 
                  size="small"
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredFirms.length}
                  checked={filteredFirms.length > 0 && selectedIds.length === filteredFirms.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)', py: 2 }}>Nome da Contabilidade</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>ID Oficial</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableSortLabel
                    active={true}
                    direction={sortDirection}
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    sx={{ fontWeight: 800 }}
                  >
                    Avaliados
                  </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 12 }}>
                        <CircularProgress size={32} thickness={5} />
                    </TableCell>
                </TableRow>
            ) : filteredFirms.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 12 }}>
                        <Typography color="text.secondary">Nenhuma contabilidade encontrada.</Typography>
                    </TableCell>
                </TableRow>
            ) : (
                filteredFirms.map((firm) => (
                    <TableRow 
                        key={firm.id} 
                        hover 
                        onClick={() => toggleSelect(firm.id)}
                        sx={{ cursor: 'pointer', transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox size="small" checked={selectedIds.includes(firm.id)} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{firm.name}</TableCell>
                        <TableCell align="center">
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 1, opacity: 0.8 }}>
                                {firm.id}
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Chip 
                                label={firm.evaluation_count} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                                sx={{ fontWeight: 900, minWidth: 40, borderRadius: 1 }} 
                            />
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

export default FirmList;
