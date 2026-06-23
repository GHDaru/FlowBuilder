import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemText, 
  Paper, 
  Stack, 
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
  Grid,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  History as HistoryIcon, 
  AccessTime as ClockIcon, 
  Description as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Gavel as RuleIcon
} from '@mui/icons-material';
import AvaliacaoBlock from './AvaliacaoBlock/AvaliacaoBlock';
import RuleFeedbackDialog from '../Rules/RuleFeedbackDialog';

const History: React.FC = () => {
  const theme = useTheme();
  const [trackings, setTrackings] = useState<any[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<any>(null);
  const [trackingSummary, setTrackingSummary] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | false>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Feedback State
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeLogForFeedback, setActiveLogForFeedback] = useState<any>(null);
  const [activeTranscript, setActiveTranscript] = useState('');

  const metadata = selectedTracking?.metadata_json ? JSON.parse(selectedTracking.metadata_json) : {};

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8003' : 'https://api-visual-lab.ghdaru.com.br');

  useEffect(() => {
    axios.get(`${API_URL}/trackings`).then(res => setTrackings(res.data));
  }, []);

  const handleOpenFeedback = async (log: any) => {
    try {
        // Fetch raw transcript for this tracking
        const res = await axios.get(`${API_URL}/trackings/${selectedTracking.id}/content`);
        setActiveTranscript(res.data.content);
        setActiveLogForFeedback(log);
        setFeedbackOpen(true);
    } catch (error) {
        console.error("Error loading transcript for feedback:", error);
    }
  };

  const handleSelectTracking = async (t: any) => {
    setSelectedTracking(t);
    try {
        const [logsRes, summaryRes] = await Promise.all([
            axios.get(`${API_URL}/trackings/${t.id}/logs`),
            axios.get(`${API_URL}/trackings/${t.id}/summary`)
        ]);
        setLogs(logsRes.data);
        setTrackingSummary(summaryRes.data);
        
        // Expand the first step by default
        if (logsRes.data && logsRes.data.length > 0) {
            setExpandedStep(logsRes.data[0].id);
        } else {
            setExpandedStep(false);
        }
    } catch (error) {
        console.error("Error fetching detail data:", error);
    }
  };

  const handleAccordionChange = (stepId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedStep(isExpanded ? stepId : false);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyAll = async () => {
    const consolidated: Record<string, any> = {};
    logs.forEach(log => {
        try {
            const parsed = JSON.parse(log.response_json || '{}');
            consolidated[log.node_label || log.node_id] = parsed;
        } catch {
            consolidated[log.node_label || log.node_id] = log.response_raw;
        }
    });
    
    await handleCopy(JSON.stringify(consolidated, null, 2), 'copy-all');
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      
      {/* Sidebar List */}
      <Box sx={{ width: 350, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, px: 2, display: 'flex', alignItems: 'center', gap: 2, fontWeight: 800 }}>
          <HistoryIcon color="primary" /> Histórico
        </Typography>
        
        <List disablePadding>
          {trackings.map(t => (
            <ListItemButton 
              key={t.id}
              selected={selectedTracking?.id === t.id}
              onClick={() => handleSelectTracking(t)}
              sx={{ 
                borderRadius: 3, 
                mb: 1,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemText-secondary, & .MuiTypography-root': {
                    color: 'inherit',
                    opacity: 0.9
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit'
                  }
                }
              }}
            >
              <ListItemText 
                primary={`Atendimento: ${t.atendimento_id}`}
                secondary={
                  <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ClockIcon sx={{ fontSize: 12, opacity: 0.7 }} /> 
                        {new Date(t.started_at).toLocaleString()}
                    </Box>
                    {t.flow_name && (
                        <Typography variant="caption" sx={{ fontWeight: 700, mt: 0.5 }}>
                            {t.flow_name}
                        </Typography>
                    )}
                  </Box>
                }
                slotProps={{
                    primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } },
                    secondary: { sx: { fontSize: '0.75rem' } }
                }}
              />
              <Chip 
                label={t.status} 
                size="small" 
                color={t.status === 'COMPLETED' ? 'success' : 'warning'} 
                sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, borderRadius: 1 }} 
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Detail View */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 3, md: 6 }, backgroundColor: 'background.default' }}>
        {selectedTracking ? (
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>Trace Audit</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', p: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        ID: {selectedTracking.id}
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={copiedId === 'copy-all' ? <CheckIcon /> : <CopyIcon />} 
                    onClick={handleCopyAll}
                    color={copiedId === 'copy-all' ? "success" : "primary"}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {copiedId === 'copy-all' ? "Copiado!" : "Copiar JSON Consolidado"}
                </Button>
              </Box>

              {/* Rich Metadata Header */}
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', mb: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Grid container spacing={3} component="div">
                    <Grid size={{ xs: 12, md: 3 }} component="div">
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Contabilidade</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{metadata.contabilidade || 'N/A'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} component="div">
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Cliente</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{metadata.cliente || 'N/A'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} component="div">
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Atendente</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{metadata.atendente || 'N/A'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} component="div">
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Tempo Total</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                            {selectedTracking.total_duration_ms ? `${(selectedTracking.total_duration_ms / 1000).toFixed(1)}s` : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>
                {selectedTracking.flow_name && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mr: 1 }}>FLUXO ATIVO:</Typography>
                        <Chip label={selectedTracking.flow_name} size="small" color="primary" variant="filled" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 900, borderRadius: 1 }} />
                    </Box>
                )}
              </Paper>

              {trackingSummary && (
                <Stack direction="row" spacing={2} sx={{ mt: 3 }} component="div">
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', flexGrow: 1, textAlign: 'center' }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Tokens In</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{trackingSummary.total_input_tokens.toLocaleString()}</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', flexGrow: 1, textAlign: 'center' }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Tokens Out</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{trackingSummary.total_output_tokens.toLocaleString()}</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', flexGrow: 1, textAlign: 'center' }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Thinking</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>{trackingSummary.total_thinking_tokens.toLocaleString()}</Typography>
                    </Paper>
                </Stack>
              )}
            </Box>

            {/* Rendering the Consolidated Evaluation Block if available */}
            {(() => {
                let consolidationData = null;
                
                for (const log of logs) {
                    try {
                        const parsed = JSON.parse(log.response_json || '{}');
                        // Case 1: Schema at root
                        if (parsed.schema_version === 'avalia.consolidacao.v1') {
                            consolidationData = parsed;
                            break;
                        }
                        // Case 2: Schema wrapped in a key (e.g., {"avalia.consolidacao.v1": {...}})
                        if (parsed['avalia.consolidacao.v1'] && parsed['avalia.consolidacao.v1'].schema_version === 'avalia.consolidacao.v1') {
                            consolidationData = parsed['avalia.consolidacao.v1'];
                            break;
                        }
                    } catch { continue; }
                }
                
                if (consolidationData) {
                    return <AvaliacaoBlock data={consolidationData} />;
                }
                return null;
            })()}

            <Stack spacing={2} component="div">
              {logs.map((log, i) => {
                const responseText = (() => {
                  try {
                    return JSON.stringify(JSON.parse(log.response_json || '{}'), null, 2);
                  } catch (e) {
                    return log.response_json || log.response_raw || '';
                  }
                })();

                return (
                  <Accordion 
                    key={log.id} 
                    expanded={expandedStep === log.id}
                    onChange={handleAccordionChange(log.id)}
                    sx={{ 
                      borderRadius: '16px !important', 
                      '&:before': { display: 'none' },
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      boxShadow: 'none'
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                          borderBottom: expandedStep === log.id ? '1px solid' : 'none',
                          borderColor: 'divider',
                          px: 3,
                          '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="overline" sx={{ fontWeight: 'bold', letterSpacing: 2, color: 'text.secondary' }}>
                                  PASSO {i + 1}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {log.node_label || log.node_id}
                              </Typography>
                              {log.model_id && (
                                  <Chip 
                                      label={log.model_id} 
                                      size="small" 
                                      sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} 
                                      color="secondary"
                                      variant="outlined"
                                  />
                              )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                              {log.duration_ms > 0 && (
                                <Chip 
                                    label={`${(log.duration_ms / 1000).toFixed(1)}s`} 
                                    size="small" 
                                    variant="outlined" 
                                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} 
                                    color="info"
                                />
                              )}
                              <Chip label={`In: ${log.input_tokens || 0}`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                              <Chip label={`Out: ${log.output_tokens || 0}`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} color="primary" />
                              {log.thinking_tokens > 0 && <Chip label={`Think: ${log.thinking_tokens}`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} color="secondary" />}
                              <Chip label={log.status} size="small" color={log.status === 'SUCCESS' ? 'success' : 'error'} variant="filled" sx={{ ml: 2, fontWeight: 900, fontSize: '0.6rem' }} />
                          </Box>
                      </Box>
                    </AccordionSummary>
                    
                    <AccordionDetails sx={{ p: 4, bgcolor: 'background.default' }}>
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                Prompt Enviado / Regra Avaliada
                            </Typography>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopy(log.prompt_sent, `${log.id}-prompt`); }}>
                                {copiedId === `${log.id}-prompt` ? <CheckIcon fontSize="inherit" color="success" /> : <CopyIcon fontSize="inherit" />}
                            </IconButton>
                        </Box>
                        <Paper sx={{ p: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace', 
                              fontSize: '0.8rem', 
                              whiteSpace: 'pre-wrap', 
                              wordBreak: 'break-word',
                              overflowX: 'auto',
                              color: 'text.primary'
                            }}
                          >
                            {log.prompt_sent}
                          </Typography>
                        </Paper>
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                Resposta IA / Resultado (JSON)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Contestar e Gerar Regra">
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenFeedback(log); }}>
                                        <RuleIcon fontSize="inherit" color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopy(responseText, `${log.id}-response`); }}>
                                    {copiedId === `${log.id}-response` ? <CheckIcon fontSize="inherit" color="success" /> : <CopyIcon fontSize="inherit" />}
                                </IconButton>
                            </Box>
                        </Box>
                        <Paper sx={{ p: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <pre style={{ 
                              margin: 0, 
                              fontSize: '0.8rem', 
                              color: theme.palette.primary.main,
                              whiteSpace: 'pre-wrap', 
                              wordBreak: 'break-word',
                              overflowX: 'auto',
                              fontFamily: 'monospace'
                          }}>
                            {responseText}
                          </pre>
                        </Paper>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Box>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <FileIcon sx={{ fontSize: 100, mb: 2 }} />
            <Typography variant="h6" sx={{ fontStyle: 'italic' }}>Selecione uma execução para ver os detalhes</Typography>
          </Box>
        )}
      </Box>

      {activeLogForFeedback && (
          <RuleFeedbackDialog
            open={feedbackOpen}
            onClose={() => setFeedbackOpen(false)}
            transcript={activeTranscript}
            evaluation={JSON.parse(activeLogForFeedback.response_json || '{}')}
            atendimentoRef={selectedTracking?.atendimento_id || ''}
          />
      )}
    </Box>
  );
};

export default History;
