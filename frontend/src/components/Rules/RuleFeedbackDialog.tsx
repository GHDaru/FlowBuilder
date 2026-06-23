import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { Gavel as RuleIcon, AutoAwesome as SparklesIcon } from '@mui/icons-material';
import { ruleService, type Rule } from '../../services/ruleService';

interface RuleFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  transcript: string;
  evaluation: any;
  atendimentoRef: string;
}

const RuleFeedbackDialog: React.FC<RuleFeedbackDialogProps> = ({ 
  open, 
  onClose, 
  transcript, 
  evaluation, 
  atendimentoRef 
}) => {
  const [feedback, setFeedback] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedRule, setGeneratedRule] = useState<Rule | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!feedback) return;
    setGenerating(true);
    setError(null);
    try {
      const rule = await ruleService.generateFeedbackRule({
        transcript,
        avaliacao_dimensao: evaluation,
        feedback_supervisor: feedback,
        atendimento_ref: atendimentoRef
      });
      setGeneratedRule(rule);
    } catch (err) {
      setError("Falha ao gerar regra a partir do feedback.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedRule) return;
    setSaving(true);
    try {
      await ruleService.createRule(generatedRule);
      onClose();
    } catch (err) {
      setError("Falha ao salvar regra no repositório.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RuleIcon color="primary" /> Contestar Avaliação e Gerar Regra
      </DialogTitle>
      <DialogContent>
        {!generatedRule ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Descreva por que você discorda desta avaliação. A IA irá extrair um princípio geral para evitar que este erro ocorra novamente.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Ex: O atendente não deve ser penalizado se o cliente parar de responder..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'success.light' }}>Regra Gerada pela IA:</Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <Typography variant="h6" gutterBottom>{generatedRule.name}</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>"{generatedRule.text}"</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="caption">Dimensão: <strong>{generatedRule.dimension}</strong></Typography>
                <Typography variant="caption">Escopo: <strong>{generatedRule.scope}</strong></Typography>
              </Box>
            </Paper>
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                A regra acima será adicionada ao repositório global e passará a valer para as próximas análises.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={generating || saving}>Cancelar</Button>
        {!generatedRule ? (
          <Button 
            variant="contained" 
            startIcon={generating ? <CircularProgress size={16} /> : <SparklesIcon />}
            onClick={handleGenerate}
            disabled={generating || !feedback}
          >
            {generating ? 'Analisando...' : 'Gerar Regra'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Confirmar e Salvar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RuleFeedbackDialog;
