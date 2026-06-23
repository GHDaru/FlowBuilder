import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  IconButton, 
  Button, 
  Chip, 
  Stack,
  TextField,
  InputAdornment,
  Switch,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { ruleService, type Rule } from '../../services/ruleService';
import RuleForm from './RuleForm';

const RulesTable: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await ruleService.listRules();
      setRules(data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleStatus = async (rule: Rule) => {
    try {
      await ruleService.updateRule(rule.id, { is_active: !rule.is_active });
      fetchRules();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta regra permanentemente?')) return;
    try {
      await ruleService.deleteRule(id);
      fetchRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, height: '100%', overflow: 'auto' }}>
      <Stack direction="row" sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1 }}>Gestão de Regras</Typography>
            <Typography variant="body2" color="text.secondary">Configure as diretrizes de scorificação para o avaliador de IA.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchRules}>Sincronizar</Button>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingRule(undefined); setFormOpen(true); }}>Nova Regra</Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
        <TextField 
          fullWidth 
          size="small"
          variant="outlined" 
          placeholder="Buscar por nome ou conteúdo da regra..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
                startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
            }
          }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 2 }}>Status</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Escopo</TableCell>
              <TableCell>Dimensão</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><CircularProgress size={32} /></TableCell></TableRow>
            ) : filteredRules.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}><Typography color="text.secondary">Nenhuma regra encontrada.</Typography></TableCell></TableRow>
            ) : filteredRules.map((rule) => (
              <TableRow key={rule.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Switch 
                    size="small" 
                    color="primary"
                    checked={rule.is_active} 
                    onChange={() => handleToggleStatus(rule)}
                  />
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{rule.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                        display: 'block', 
                        maxWidth: 400, 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                    }}>
                        {rule.text}
                    </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={rule.scope === 'global' ? 'Global' : `Específico: ${rule.context || 'N/A'}`} 
                    size="small" 
                    color={rule.scope === 'global' ? 'primary' : 'secondary'}
                    variant={rule.scope === 'global' ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600, fontSize: '0.65rem' }}
                  />
                </TableCell>
                <TableCell>
                   <Chip 
                    label={rule.dimension} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontSize: '0.65rem', borderStyle: 'dashed' }}
                   />
                </TableCell>
                <TableCell>
                   <Typography variant="caption" color="text.secondary">
                    {new Date(rule.created_at).toLocaleDateString()}
                   </Typography>
                </TableCell>
                <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => { setEditingRule(rule); setFormOpen(true); }}><EditIcon fontSize="inherit" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                            <IconButton size="small" color="error" onClick={() => handleDelete(rule.id)}><DeleteIcon fontSize="inherit" /></IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RuleForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSuccess={() => { setFormOpen(false); fetchRules(); }}
        rule={editingRule}
      />
    </Box>
  );
};

export default RulesTable;
