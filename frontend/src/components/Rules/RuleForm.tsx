import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Box, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { AutoAwesome as SparklesIcon } from '@mui/icons-material';
import { ruleService, type Rule } from '../../services/ruleService';

interface RuleFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rule?: Rule;
}

const dimensions = [
  { id: 'comunicacao_clareza', label: 'Comunicação e Clareza' },
  { id: 'profissionalismo_conformidade', label: 'Profissionalismo e Conformidade' },
  { id: 'resolucao_eficiencia', label: 'Resolução e Eficiência' },
  { id: 'empatia_tecnica', label: 'Empatia e Técnica' },
  { id: 'todas', label: 'Todas as Dimensões' }
];

const RuleForm: React.FC<RuleFormProps> = ({ open, onClose, onSuccess, rule }) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Rule>>({
    name: '',
    text: '',
    dimension: 'todas',
    scope: 'global',
    context: '',
    is_active: true
  });

  const [description, setDescription] = useState('');

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        name: '',
        text: '',
        dimension: 'todas',
        scope: 'global',
        context: '',
        is_active: true
      });
      setDescription('');
    }
    setError(null);
  }, [rule, open]);

  const handleSave = async () => {
    if (!formData.name || !formData.text) {
        setError("Nome e Instrução são obrigatórios.");
        return;
    }

    setLoading(true);
    try {
      if (rule) {
        await ruleService.updateRule(rule.id, formData);
      } else {
        await ruleService.createRule(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao salvar regra.");
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!description) {
        setError("Descreva o comportamento desejado para usar a IA.");
        return;
    }
    setGenerating(true);
    setError(null);
    try {
      const result = await ruleService.generateManualRule(description);
      setFormData(prev => ({ ...prev, name: result.name, text: result.text }));
    } catch (err) {
      setError("Falha ao gerar regra com IA.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        slotProps={{
            paper: { sx: { borderRadius: 4, bgcolor: 'background.paper' } }
        }}
    >
      <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>
        {rule ? 'Editar Regra' : 'Nova Regra de Scorificação'}
      </DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        <Stack spacing={3} sx={{ mt: 2 }} component="div">
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
          
          {!rule && (
            <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(100, 66, 214, 0.05)', 
                borderRadius: 3, 
                border: '1px dashed rgba(100, 66, 214, 0.3)',
                position: 'relative'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <SparklesIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.light' }}>
                        Gerar com Assistente IA
                    </Typography>
                </Box>
                
                <TextField 
                    fullWidth 
                    multiline 
                    rows={2} 
                    placeholder="Ex: Se o atendente demorar mais de 5 minutos para responder, diminua a nota de agilidade em 2 pontos."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                    slotProps={{
                        input: { sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.1)' } }
                    }}
                />
                <Button 
                    variant="contained" 
                    size="small"
                    startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <SparklesIcon />} 
                    disabled={generating || !description}
                    onClick={handleAiGenerate}
                    sx={{ borderRadius: 2 }}
                >
                    {generating ? 'Gerando...' : 'Sugerir Texto da Regra'}
                </Button>
            </Box>
          )}

          <TextField 
            label="Nome da Regra" 
            fullWidth 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />

          <TextField 
            label="Instrução para a IA (Texto da Regra)" 
            fullWidth 
            multiline 
            rows={4} 
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            helperText="Escreva em segunda pessoa: 'Se X acontecer, então faça Y'."
            slotProps={{ 
                input: { sx: { borderRadius: 2, fontFamily: 'monospace', fontSize: '0.875rem' } }
            }}
          />

          <Stack direction="row" spacing={2} component="div">
            <FormControl fullWidth size="small">
              <InputLabel>Dimensão Afetada</InputLabel>
              <Select
                value={formData.dimension}
                label="Dimensão Afetada"
                onChange={(e) => setFormData({ ...formData, dimension: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                {dimensions.map(d => <MenuItem key={d.id} value={d.id}>{d.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Escopo</InputLabel>
              <Select
                value={formData.scope}
                label="Escopo"
                onChange={(e) => setFormData({ ...formData, scope: e.target.value as any, context: e.target.value === 'global' ? null : formData.context })}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="global">Global</MenuItem>
                <MenuItem value="especifico">Específico</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {formData.scope === 'especifico' && (
            <TextField 
                label="Contexto (ID da Contabilidade/Atendente)" 
                fullWidth 
                size="small"
                placeholder="Ex: contplan-001"
                value={formData.context || ''}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Cancelar</Button>
        <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
            sx={{ borderRadius: 2, px: 4 }}
        >
            {rule ? 'Atualizar Alterações' : 'Salvar Regra'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RuleForm;
