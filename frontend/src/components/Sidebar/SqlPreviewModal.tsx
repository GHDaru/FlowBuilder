import React, { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip
} from '@mui/material';
import { PlayArrow as PlayIcon, DeleteSweep as ClearIcon, SettingsEthernet as TestIcon } from '@mui/icons-material';
import { sqlService, type SqlPreviewRequest } from '../../services/sqlService';

interface SqlPreviewModalProps {
  open: boolean;
  onClose: () => void;
  databaseType: string;
  connectionDetails: Record<string, any>;
  sqlQuery: string;
  variables: string[];
  nodeTitle?: string;
}

const SqlPreviewModal: React.FC<SqlPreviewModalProps> = ({ 
  open, 
  onClose, 
  databaseType, 
  connectionDetails, 
  sqlQuery, 
  variables,
  nodeTitle = 'Nó SQL'
}) => {
  const [mockValues, setMockValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState<boolean | null>(null);

  // Load saved mocks from localStorage when variables change
  useEffect(() => {
    if (open) {
      const savedMocksStr = localStorage.getItem('sql_preview_mocks');
      const savedMocks = savedMocksStr ? JSON.parse(savedMocksStr) : {};
      
      const initial: Record<string, string> = {};
      variables.forEach(v => {
        initial[v] = savedMocks[v] || '';
      });
      setMockValues(initial);
      setResult(null);
      setError(null);
      setConnectionSuccess(null);
    }
  }, [open, variables]);

  const handleMockChange = (variable: string, value: string) => {
    const newMocks = { ...mockValues, [variable]: value };
    setMockValues(newMocks);
    localStorage.setItem('sql_preview_mocks', JSON.stringify(newMocks));
  };

  const handleClearMocks = () => {
    const cleared: Record<string, string> = {};
    variables.forEach(v => cleared[v] = '');
    setMockValues(cleared);
    localStorage.removeItem('sql_preview_mocks');
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setError(null);
    setResult(null);
    setConnectionSuccess(null);

    try {
        const request: SqlPreviewRequest = {
            database_type: databaseType,
            connection_details: connectionDetails,
            sql_query: '', // Not needed for pure connection test
            variables: {}
        };
        const response = await sqlService.testConnection(request);
        if (response.success) {
            setConnectionSuccess(true);
        } else {
            setConnectionSuccess(false);
            setError(response.error || 'Connection failed.');
        }
    } catch (err: any) {
        setConnectionSuccess(false);
        setError(err.response?.data?.detail || err.message || 'Network error.');
    } finally {
        setTestingConnection(false);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setConnectionSuccess(null);
    
    try {
      const request: SqlPreviewRequest = {
        database_type: databaseType,
        connection_details: connectionDetails,
        sql_query: sqlQuery,
        variables: mockValues
      };
      
      const response = await sqlService.previewQuery(request);
      
      if (response.success) {
        setResult(response.data || '[]');
      } else {
        setError(response.error || 'Unknown error occurred during execution.');
      }
    } catch (err: any) {
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            setError('Connection timeout. Please verify your credentials and database accessibility from the backend server.');
        } else {
            setError(err.response?.data?.detail || err.message || 'Network error.');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1e1e2f', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Preview SQL Query
        <Button 
            size="small" 
            variant="outlined" 
            color="inherit" 
            onClick={handleTestConnection}
            disabled={testingConnection || loading}
            startIcon={testingConnection ? <CircularProgress size={14} color="inherit" /> : <TestIcon />}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white' } }}
        >
            Testar Conexão
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {connectionSuccess === true && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setConnectionSuccess(null)}>
                Conexão com {databaseType} estabelecida com sucesso!
            </Alert>
        )}

        <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 2 }}>
            Note: This execution is limited to 50 rows to prevent UI freezing. Ensure the backend can reach the specified database.
        </Typography>
        
        {variables.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Variáveis Dinâmicas detectadas:
                    </Typography>
                    <Tooltip title="Limpar Valores">
                        <IconButton size="small" onClick={handleClearMocks}>
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Forneça valores de teste. Estes valores são salvos localmente no seu navegador.
                </Typography>
                
                {variables.map(v => (
                    <TextField
                        key={v}
                        label={`{{${v}}}`}
                        size="small"
                        fullWidth
                        sx={{ mb: 1.5 }}
                        value={mockValues[v] || ''}
                        onChange={(e) => handleMockChange(v, e.target.value)}
                    />
                ))}
            </Box>
        )}
        
        {error && (
            <Alert severity="error" sx={{ mb: 2, wordBreak: 'break-word' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Erro de Execução:</Typography>
                {error}
            </Alert>
        )}
        
        {result && (
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Resultado JSON (Máx 50 linhas):
                </Typography>
                <Box sx={{ 
                    bgcolor: '#1e1e2f', 
                    p: 1.5, 
                    borderRadius: 1, 
                    overflowX: 'auto',
                    maxHeight: 250,
                    overflowY: 'auto'
                }}>
                    <pre style={{ margin: 0, fontSize: '0.75rem', color: '#a5b4fc' }}>
                        {(() => {
                            try {
                                const parsed = JSON.parse(result);
                                const slug = (nodeTitle || 'Nó SQL').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').replace(/^_|_$/g, '');
                                return JSON.stringify({ [slug]: parsed }, null, 2);
                            } catch (e) {
                                return result;
                            }
                        })()}
                    </pre>
                </Box>
            </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} disabled={loading || testingConnection}>
            Fechar
        </Button>
        <Button 
            variant="contained" 
            color="primary" 
            onClick={handlePreview}
            disabled={loading || testingConnection}
            startIcon={loading ? <CircularProgress size={16} /> : <PlayIcon />}
        >
            Executar Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SqlPreviewModal;
