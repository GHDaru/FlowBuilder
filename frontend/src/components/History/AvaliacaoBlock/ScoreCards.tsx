import { 
    Box, 
    Typography, 
    Paper, 
    Stack, 
    Chip, 
    LinearProgress,
    Grid,
    Divider
} from '@mui/material';
import { 
    Rule as RuleIcon
} from '@mui/icons-material';
import { getBandColors, getNPSColors } from './utils/visualRules';

const ScoreBadge = ({ faixa, label }: { faixa: string, label?: string }) => {
    const colors = getBandColors(faixa || 'indeterminado');
    const displayLabel = label || faixa || 'indeterminado';
    return (
        <Chip 
            label={displayLabel.toUpperCase()} 
            size="small" 
            sx={{ 
                height: 20, 
                fontSize: '0.65rem', 
                fontWeight: 'bold', 
                bgcolor: colors.bg, 
                color: colors.text,
                border: `1px solid ${colors.border}`
            }} 
        />
    );
};

const MiniBar = ({ label, value, color }: { label: string, value: number, color?: string }) => (
    <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.8 }}>{label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{(value ?? 0).toFixed(1)}</Typography>
        </Box>
        <LinearProgress 
            variant="determinate" 
            value={(value ?? 0) * 10} 
            sx={{ 
                height: 4, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.05)',
                '& .MuiLinearProgress-bar': {
                    bgcolor: color || 'primary.main'
                }
            }} 
        />
    </Box>
);

export const MainScoreCard = ({ data }: { data: any }) => {
    return (
        <Paper sx={{ p: 3, borderRadius: 4, mb: 3, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Grid container spacing={3} sx={{ alignItems: 'center' }} component="div">
                <Grid size={{ xs: 12, md: 4 }} sx={{ borderRight: { md: '1px solid rgba(255,255,255,0.05)' } }} component="div">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{(data.nota_atendimento ?? 0).toFixed(1)}</Typography>
                        <ScoreBadge faixa={data.faixa_atendimento} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">Nota Geral do Atendimento</Typography>
                    
                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>ATENDENTE</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{(data.atendente?.nota ?? 0).toFixed(1)}</Typography>
                                <ScoreBadge faixa={data.atendente?.faixa} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>CLIENTE (NPS)</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{(data.cliente?.nota ?? 0).toFixed(1)}</Typography>
                                <Chip 
                                    label={(data.cliente?.classificacao_nps || 'indeterminado').toUpperCase()} 
                                    size="small" 
                                    sx={{ 
                                        height: 20, fontSize: '0.6rem', fontWeight: 'bold',
                                        bgcolor: getNPSColors(data.cliente?.classificacao_nps).light,
                                        color: getNPSColors(data.cliente?.classificacao_nps).main
                                    }} 
                                />
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.6, opacity: 0.9 }}>
                        "{data.resumo_atendimento}"
                    </Typography>
                    {data.atendente.marcadores_criticos?.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            {data.atendente.marcadores_criticos.map((m: string) => (
                                <Chip key={m} label={m} size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />
                            ))}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export const DimensionCards = ({ atendente }: { atendente: any }) => {
    return (
        <Grid container spacing={2} sx={{ mb: 3 }} component="div">
            {atendente.dimensoes.map((dim: any) => (
                <Grid size={{ xs: 12, md: 4 }} key={dim.dimensao_id} component="div">
                    <Paper sx={{ p: 2.5, height: '100%', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', maxWidth: '70%' }}>{dim.dimensao_nome}</Typography>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>{dim.nota.toFixed(1)}</Typography>
                                <ScoreBadge faixa={dim.faixa} />
                            </Box>
                        </Box>
                        
                        <Stack spacing={1.5}>
                            {dim.sub_notas.map((sub: any) => (
                                <Box key={sub.eixo}>
                                    <MiniBar 
                                        label={sub.eixo} 
                                        value={sub.nota} 
                                        color={sub.regras_aplicadas?.length > 0 ? '#0288d1' : undefined} 
                                    />
                                    {sub.regras_aplicadas?.length > 0 && (
                                        <Typography variant="caption" sx={{ color: '#0288d1', display: 'flex', alignItems: 'center', gap: 0.5, mt: -0.5 }}>
                                            <RuleIcon sx={{ fontSize: 10 }} /> regra aplicada
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export const ClientPerceptionCard = ({ cliente }: { cliente: any }) => {
    const npsColors = getNPSColors(cliente.classificacao_nps);

    return (
        <Grid container spacing={2} sx={{ mb: 4 }} component="div">
            <Grid size={{ xs: 12, md: 6 }} component="div">
                <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: `4px solid ${npsColors.main}`, bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1 }}>
                        PERCEPÇÃO DO CLIENTE
                    </Typography>
                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: npsColors.main }}>{(cliente.nota ?? 0).toFixed(1)}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{(cliente.classificacao_nps || 'indeterminado').toUpperCase()}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ opacity: 0.1 }} />
                        <Box sx={{ flexGrow: 1 }}>
                            <MiniBar label="Esforço Percebido" value={
                                cliente.esforco_percebido?.nivel === 'baixo' ? 9 : 
                                cliente.esforco_percebido?.nivel === 'medio' ? 6 : 
                                cliente.esforco_percebido?.nivel === 'alto' ? 3 : 
                                cliente.esforco_percebido?.nivel === 'muito_alto' ? 1 : 0
                            } color={npsColors.main} />
                            <MiniBar label="Resolução Percebida" value={
                                cliente.resolucao_percebida?.status === 'resolvido' ? 10 : 
                                cliente.resolucao_percebida?.status === 'parcial' ? 5 : 
                                cliente.resolucao_percebida?.status === 'nao_resolvido' ? 1 : 0
                            } color={npsColors.main} />
                        </Box>
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                        Experiência Predominante: <strong>{cliente.experiencia_predominante || 'N/A'}</strong>
                    </Typography>
                </Paper>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }} component="div">
                <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1 }}>
                        SINAIS EMOCIONAIS
                    </Typography>
                    <Stack spacing={1}>
                        {(cliente.sinais_emocionais || []).map((sinal: any, idx: number) => (
                            <Box key={idx} sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{(sinal.tipo || 'desconhecido').toUpperCase()}</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.6 }}>Intensidade: {sinal.intensidade || 'N/A'}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', opacity: 0.7 }}>
                                    {sinal.evidencias?.[0] || 'Sem evidência textual'}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};
