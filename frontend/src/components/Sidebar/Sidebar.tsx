import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  Button, 
  Stack, 
  Chip, 
  Divider, 
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Slider
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Save as SaveIcon, 
  AutoAwesome as SparklesIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  OpenInFull as ExpandIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { extractVariables } from '../../utils/variableExtractor';
import { modelService, type Model } from '../../services/modelService';
import { officialDataApi, type OfficialVariable } from '../../services/officialDataApi';
import ExpandedEditorModal from '../Common/ExpandedEditorModal';
import SqlPreviewModal from './SqlPreviewModal';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

interface SidebarProps {
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedNode, onUpdateNode, onClose }) => {
  if (!selectedNode) return null;

  const isConditionNode = selectedNode.type === 'condition';
  const isStartNode = selectedNode.type === 'start';
  const isSqlNode = selectedNode.type === 'sql';

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [title, setTitle] = useState(selectedNode.data.label || '');
  const [prompt, setPrompt] = useState(selectedNode.data.prompt || '');
  const [schema, setSchema] = useState(selectedNode.data.schema || '{}');
  const [selectedModel, setSelectedModel] = useState(selectedNode.data.model_id || '');
  const [temperature, setTemperature] = useState<number>(selectedNode.data.temperature ?? 0.0);
  const [rules, setRules] = useState<any[]>(selectedNode.data.rules || []);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [availableVariables, setAvailableVariables] = useState<OfficialVariable[]>([]);
  const [selectedGlobals, setSelectedGlobals] = useState<string[]>(selectedNode.data.selected_globals || []);
  
  // SQL specific state
  const [databaseType, setDatabaseType] = useState(selectedNode.data.database_type || 'sqlite');
  const [connectionDetails, setConnectionDetails] = useState(selectedNode.data.connection_details || { file_path: '' });
  const [sqlQuery, setSqlQuery] = useState(selectedNode.data.sql_query || '');

  const [isAssisting, setIsAssisting] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [expandedEditor, setExpandedEditor] = useState<{
    isOpen: boolean;
    field: 'prompt' | 'schema' | 'sql' | null;
    title: string;
    value: string;
  }>({
    isOpen: false,
    field: null,
    title: '',
    value: ''
  });

  // Sync state with selectedNode data
  useEffect(() => {
    setTitle(selectedNode.data.label || '');
    setPrompt(selectedNode.data.prompt || '');
    setSchema(selectedNode.data.schema || '{}');
    setSelectedModel(selectedNode.data.model_id || '');
    setTemperature(selectedNode.data.temperature ?? 0.0);
    setRules(selectedNode.data.rules || []);
    setSelectedGlobals(selectedNode.data.selected_globals || []);
    setDatabaseType(selectedNode.data.database_type || 'sqlite');
    setConnectionDetails(selectedNode.data.connection_details || { file_path: '' });
    setSqlQuery(selectedNode.data.sql_query || '');
  }, [selectedNode.id, selectedNode.data]);

  useEffect(() => {
    if (isConditionNode || isStartNode || isSqlNode) return; // Don't fetch models for condition/start/sql nodes

    const fetchModels = async () => {
        setIsLoadingModels(true);
        try {
            const models = await modelService.listModels();
            setAvailableModels(models);
            if (!selectedModel) {
                const defaultModel = models.find(m => m.id === 'gpt-4o-mini');
                if (defaultModel) setSelectedModel(defaultModel.id);
            }
        } catch (error) {
            console.error("Error fetching models:", error);
        } finally {
            setIsLoadingModels(false);
        }
    };
    fetchModels();
  }, [selectedModel, isConditionNode, isStartNode, isSqlNode]);

  useEffect(() => {
    if (!isStartNode) return;

    const fetchVariables = async () => {
        setIsLoadingVariables(true);
        try {
            const vars = await officialDataApi.listVariables();
            setAvailableVariables(vars);
        } catch (error) {
            console.error("Error fetching variables:", error);
        } finally {
            setIsLoadingVariables(false);
        }
    };
    fetchVariables();
  }, [isStartNode]);

  const variables = isSqlNode ? extractVariables(sqlQuery) : extractVariables(prompt);

  const handleSave = () => {
    if (isConditionNode) {
        onUpdateNode(selectedNode.id, {
            label: title,
            rules
        });
        return;
    }

    if (isStartNode) {
        console.log("[DEBUG] Saving Start Node with Globals:", selectedGlobals);
        onUpdateNode(selectedNode.id, {
            label: title,
            selected_globals: [...selectedGlobals]
        });
        return;
    }

    if (isSqlNode) {
        onUpdateNode(selectedNode.id, {
            label: title,
            database_type: databaseType,
            connection_details: connectionDetails,
            sql_query: sqlQuery,
            variables
        });
        return;
    }

    const provider = availableModels.find(m => m.id === selectedModel)?.provider || 'openai';
    onUpdateNode(selectedNode.id, {
      label: title,
      prompt,
      schema,
      variables,
      model_id: selectedModel,
      provider: provider,
      temperature: temperature
    });
  };

  const handleAssist = async () => {
    const intent = window.prompt("O que este nó deve fazer? (Ex: resumir o atendimento)");
    if (!intent) return;

    setIsAssisting(true);
    try {
      const response = await axios.post(`http://127.0.0.1:8003/assist/node?user_intent=${encodeURIComponent(intent)}`);
      const { title: newTitle, prompt_template, output_schema } = response.data;
      
      setTitle(newTitle);
      setPrompt(prompt_template);
      setSchema(JSON.stringify(output_schema, null, 2));
    } catch (error) {
      console.error(error);
      alert("Falha na assistência de IA.");
    } finally {
      setIsAssisting(false);
    }
  };

  const addRule = () => {
      setRules([...rules, { id: `rule-${Date.now()}`, variable: '', operator: 'equals', value: '' }]);
  };

  const updateRule = (index: number, field: string, value: string) => {
      const newRules = [...rules];
      newRules[index][field] = value;
      setRules(newRules);
  };

  const deleteRule = (index: number) => {
      const newRules = [...rules];
      newRules.splice(index, 1);
      setRules(newRules);
  };

  const handleCopy = async (text: string, type: 'prompt' | 'schema') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'prompt') {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } else {
        setCopiedSchema(true);
        setTimeout(() => setCopiedSchema(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleExpand = (field: 'prompt' | 'schema' | 'sql', currentTitle: string, currentValue: string) => {
    setExpandedEditor({
      isOpen: true,
      field,
      title: currentTitle,
      value: currentValue
    });
  };

  const handleExpandedSave = (newValue: string) => {
    if (expandedEditor.field === 'prompt') {
      setPrompt(newValue);
    } else if (expandedEditor.field === 'schema') {
      setSchema(newValue);
    }
  };

  return (
    <>
    <Paper 
      elevation={20}
      sx={{ 
        position: 'absolute', 
        right: 0, 
        top: 0, 
        bottom: 0, 
        width: 320, 
        backgroundColor: 'background.paper', 
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', 
        flexDirection: 'column', 
        zIndex: 5,
        p: 0
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
            {isStartNode ? 'Configurar Início' : isConditionNode ? 'Configurar Condição' : 'Configurar Nó LLM'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Stack spacing={4}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Título
              </Typography>
              {!isConditionNode && (
                  <Button 
                    size="small" 
                    startIcon={isAssisting ? <CircularProgress size={12} /> : <SparklesIcon />}
                    onClick={handleAssist}
                    disabled={isAssisting}
                    sx={{ fontSize: '0.65rem', py: 0 }}
                  >
                    Assistir
                  </Button>
              )}
            </Box>
            <TextField 
              fullWidth 
              size="small" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do passo..."
            />
          </Box>

          {isConditionNode ? (
              <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                    Regras de Roteamento
                  </Typography>
                  <Stack spacing={2} sx={{ mb: 2 }}>
                      {rules.map((rule, idx) => (
                          <Paper key={rule.id} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Regra {idx + 1}</Typography>
                                  <IconButton size="small" color="error" onClick={() => deleteRule(idx)}>
                                      <DeleteIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                              </Box>
                              <Stack spacing={1}>
                                  <TextField 
                                      size="small" 
                                      placeholder="Variável (ex: sentiment)" 
                                      value={rule.variable}
                                      onChange={(e) => updateRule(idx, 'variable', e.target.value)}
                                      fullWidth
                                      sx={{ input: { fontSize: '0.8rem', fontFamily: 'monospace' } }}
                                  />
                                  <FormControl size="small" fullWidth>
                                      <Select
                                          value={rule.operator}
                                          onChange={(e) => updateRule(idx, 'operator', e.target.value)}
                                          sx={{ fontSize: '0.8rem' }}
                                      >
                                          <MenuItem value="equals">Igual a (==)</MenuItem>
                                          <MenuItem value="not_equals">Diferente de (!=)</MenuItem>
                                          <MenuItem value="contains">Contém</MenuItem>
                                      </Select>
                                  </FormControl>
                                  <TextField 
                                      size="small" 
                                      placeholder="Valor" 
                                      value={rule.value}
                                      onChange={(e) => updateRule(idx, 'value', e.target.value)}
                                      fullWidth
                                      sx={{ input: { fontSize: '0.8rem' } }}
                                  />
                              </Stack>
                          </Paper>
                      ))}
                  </Stack>
                  <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addRule} fullWidth>
                      Adicionar Regra
                  </Button>
              </Box>
          ) : isStartNode ? (
              <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                    Variáveis Globais Disponíveis
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {isLoadingVariables ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                              <CircularProgress size={24} />
                          </Box>
                      ) : (
                          <FormGroup>
                              {availableVariables.map((v) => (
                                  <FormControlLabel 
                                      key={v.id}
                                      control={
                                          <Checkbox 
                                              size="small" 
                                              checked={selectedGlobals.includes(v.id)} 
                                              onChange={(e) => {
                                                  if (e.target.checked) setSelectedGlobals([...selectedGlobals, v.id]);
                                                  else setSelectedGlobals(selectedGlobals.filter(id => id !== v.id));
                                              }}
                                          />
                                      } 
                                      label={
                                          <Box sx={{ pr: 1, width: '100%', overflow: 'hidden' }}>
                                              <Box sx={{ 
                                                  display: 'flex', 
                                                  alignItems: 'center', 
                                                  gap: 1, 
                                                  flexWrap: 'wrap',
                                                  mb: 0.5 
                                              }}>
                                                  <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                                                      {v.label}
                                                  </Typography>
                                                  <Chip 
                                                      label={`{{${v.id}}}`} 
                                                      size="small" 
                                                      sx={{ 
                                                          height: 18, 
                                                          fontSize: '0.65rem', 
                                                          fontFamily: 'monospace',
                                                          bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                          color: '#3b82f6',
                                                          border: '1px solid rgba(59, 130, 246, 0.3)',
                                                          flexShrink: 0
                                                      }} 
                                                  />
                                              </Box>
                                              <Typography 
                                                  variant="caption" 
                                                  color="text.secondary" 
                                                  sx={{ 
                                                      display: 'block', 
                                                      lineHeight: 1.3,
                                                      wordBreak: 'break-word'
                                                  }}
                                              >
                                                  {v.description}
                                              </Typography>
                                          </Box>
                                      } 

                                      sx={{ mb: 1, alignItems: 'flex-start' }}
                                  />
                              ))}
                          </FormGroup>
                      )}
                  </Paper>
              </Box>
          ) : isSqlNode ? (
              <>
                  <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                          Tipo de Banco de Dados
                      </Typography>
                      <FormControl fullWidth size="small">
                          <Select
                              value={databaseType}
                              onChange={(e) => setDatabaseType(e.target.value)}
                          >
                              <MenuItem value="sqlite">SQLite</MenuItem>
                              <MenuItem value="postgres">PostgreSQL</MenuItem>
                          </Select>
                      </FormControl>
                  </Box>

                  {databaseType === 'sqlite' ? (
                      <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                              Caminho do Arquivo (SQLite)
                          </Typography>
                          <TextField 
                              fullWidth 
                              size="small" 
                              value={connectionDetails.file_path || ''} 
                              onChange={(e) => setConnectionDetails({ ...connectionDetails, file_path: e.target.value })}
                              placeholder="ex: ./data/my_db.sqlite"
                          />
                      </Box>
                  ) : (
                      <Stack spacing={2}>
                          <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                  Host e Porta
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                  <TextField 
                                      fullWidth 
                                      size="small" 
                                      value={connectionDetails.host || ''} 
                                      onChange={(e) => setConnectionDetails({ ...connectionDetails, host: e.target.value })}
                                      placeholder="localhost"
                                  />
                                  <TextField 
                                      sx={{ width: 100 }}
                                      size="small" 
                                      value={connectionDetails.port || ''} 
                                      onChange={(e) => setConnectionDetails({ ...connectionDetails, port: e.target.value })}
                                      placeholder="5432"
                                  />
                              </Box>
                          </Box>
                          <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                  Banco de Dados
                              </Typography>
                              <TextField 
                                  fullWidth 
                                  size="small" 
                                  value={connectionDetails.database || ''} 
                                  onChange={(e) => setConnectionDetails({ ...connectionDetails, database: e.target.value })}
                                  placeholder="nome_do_banco"
                              />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                              <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                      Usuário
                                  </Typography>
                                  <TextField 
                                      fullWidth 
                                      size="small" 
                                      value={connectionDetails.user || ''} 
                                      onChange={(e) => setConnectionDetails({ ...connectionDetails, user: e.target.value })}
                                      placeholder="postgres"
                                  />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                      Senha
                                  </Typography>
                                  <TextField 
                                      fullWidth 
                                      type="password"
                                      size="small" 
                                      value={connectionDetails.password || ''} 
                                      onChange={(e) => setConnectionDetails({ ...connectionDetails, password: e.target.value })}
                                      placeholder="*****"
                                  />
                              </Box>
                          </Box>
                      </Stack>
                  )}

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Consulta SQL
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => setIsPreviewOpen(true)} title="Preview">
                          <PlayIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleCopy(sqlQuery, 'prompt')} title="Copiar">
                          {copiedPrompt ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                        </IconButton>
                        <IconButton size="small" onClick={() => handleExpand('sql', 'Editar SQL Query', sqlQuery)} title="Expandir">
                          <ExpandIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={8} 
                      value={sqlQuery} 
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="SELECT * FROM table WHERE id = {{var}}"
                      slotProps={{
                        input: {
                          sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
                        }
                      }}
                    />
                    {variables.length > 0 && (
                      <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {variables.map(v => (
                          <Chip 
                            key={v} 
                            label={v} 
                            size="small" 
                            variant="outlined" 
                            sx={{ height: 20, fontSize: '0.65rem', fontFamily: 'monospace', borderColor: 'primary.main', color: 'primary.light' }} 
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
              </>
          ) : (
              <>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                      Motor de IA (Modelo)
                    </Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            displayEmpty
                            disabled={isLoadingModels}
                        >
                            {isLoadingModels ? (
                                <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...</MenuItem>
                            ) : (
                                availableModels.map((model) => (
                                    <MenuItem key={model.id} value={model.id}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Typography variant="body2">{model.name}</Typography>
                                            <Chip label={model.provider} size="small" sx={{ height: 16, fontSize: '0.6rem', textTransform: 'uppercase' }} />
                                        </Box>
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                      Temperatura ({temperature.toFixed(1)})
                    </Typography>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={temperature}
                            onChange={(_, value) => setTemperature(value as number)}
                            min={0}
                            max={1}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                        />
                    </Box>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Prompt Template
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleCopy(prompt, 'prompt')} title="Copiar">
                          {copiedPrompt ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                        </IconButton>
                        <IconButton size="small" onClick={() => handleExpand('prompt', 'Editar Prompt Template', prompt)} title="Expandir">
                          <ExpandIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={8} 
                      value={prompt} 
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Use {{variavel}} para injetar valores..."
                      slotProps={{
                        input: {
                          sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
                        }
                      }}
                    />
                    {variables.length > 0 && (
                      <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {variables.map(v => (
                          <Chip 
                            key={v} 
                            label={v} 
                            size="small" 
                            variant="outlined" 
                            sx={{ height: 20, fontSize: '0.65rem', fontFamily: 'monospace', borderColor: 'primary.main', color: 'primary.light' }} 
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        JSON Schema (Output)
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleCopy(schema, 'schema')} title="Copiar">
                          {copiedSchema ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                        </IconButton>
                        <IconButton size="small" onClick={() => handleExpand('schema', 'Editar JSON Schema', schema)} title="Expandir">
                          <ExpandIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={6} 
                      value={schema} 
                      onChange={(e) => setSchema(e.target.value)}
                      slotProps={{
                        input: {
                          sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
                        }
                      }}
                    />
                  </Box>
              </>
          )}
        </Stack>
      </Box>

      <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<SaveIcon />} 
          onClick={handleSave}
          sx={{ py: 1.5, fontWeight: 'bold' }}
        >
          Salvar Configuração
        </Button>
      </Box>
    </Paper>

    <SqlPreviewModal
      open={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      databaseType={databaseType}
      connectionDetails={connectionDetails}
      sqlQuery={sqlQuery}
      variables={variables}
      nodeTitle={title || selectedNode.data.label || 'Nó SQL'}
    />

    <ExpandedEditorModal 
      open={expandedEditor.isOpen}
      title={expandedEditor.title}
      initialValue={expandedEditor.value}
      onSave={handleExpandedSave}
      onClose={() => setExpandedEditor({ ...expandedEditor, isOpen: false })}
    />
    </>
  );
};

export default Sidebar;
