import React from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Divider,
    Alert,
    AlertTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { 
    CheckCircle as PositiveIcon,
    Cancel as NegativeIcon,
    Help as NeutralIcon,
    TipsAndUpdates as OpportunityIcon
} from '@mui/icons-material';
import { MainScoreCard, DimensionCards, ClientPerceptionCard } from './ScoreCards';
import { AuditTree } from './AuditTree';
import { getPolarityColor } from './utils/visualRules';

interface AvaliacaoBlockProps {
    data: any;
}

const EvidenceList = ({ dim }: { dim: any }) => {
    if (!dim.evidencias || dim.evidencias.length === 0) return null;

    return (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1, opacity: 0.6 }}>
                EVIDÊNCIAS (POLARIDADE)
            </Typography>
            <List disablePadding>
                {dim.evidencias.map((ev: any, idx: number) => {
                    const polarity = typeof ev === 'string' ? 'neutra' : (ev.polaridade || 'neutra');
                    const text = typeof ev === 'string' ? ev : ev.texto;
                    const color = getPolarityColor(polarity);

                    return (
                        <ListItem key={idx} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                                {polarity === 'positiva' ? <PositiveIcon sx={{ fontSize: 16, color }} /> :
                                 polarity === 'negativa' ? <NegativeIcon sx={{ fontSize: 16, color }} /> :
                                 <NeutralIcon sx={{ fontSize: 16, color }} />}
                            </ListItemIcon>
                            <ListItemText 
                                primary={text} 
                                slotProps={{ primary: { variant: 'caption', sx: { fontStyle: 'italic', opacity: 0.8 } } }}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

const AvaliacaoBlock: React.FC<AvaliacaoBlockProps> = ({ data }) => {
    if (!data || data.schema_version !== 'avalia.consolidacao.v1') {
        return null;
    }

    // Check for critical/irregular dimensions to show Opportunity block
    const hasIssues = data.atendente.dimensoes.some((d: any) => 
        ['irregular', 'critico'].includes(d.faixa?.toLowerCase())
    );

    return (
        <Box sx={{ mt: 4, mb: 8, animate: 'fadeIn 0.5s ease-in-out' }}>
            <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 'bold', color: 'primary.main', mb: 2, display: 'block' }}>
                Relatório de Consolidação de IA
            </Typography>

            {/* Bloco 1 — Cards de notas */}
            <MainScoreCard data={data} />
            
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 2 }}>
                DETALHAMENTO POR DIMENSÃO (ATENDENTE)
            </Typography>
            <DimensionCards atendente={data.atendente} />

            {/* Conditional Evidence Lists for poor performance */}
            {data.atendente.dimensoes.map((dim: any) => (
                (dim.faixa === 'irregular' || dim.faixa === 'critico') && (
                    <Box key={dim.dimensao_id} sx={{ mb: 2 }}>
                        <Alert severity="warning" icon={<OpportunityIcon />} sx={{ borderRadius: 3, bgcolor: 'rgba(255, 152, 0, 0.05)', color: '#ffb74d' }}>
                            <AlertTitle sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>ALERTA: {dim.dimensao_nome.toUpperCase()}</AlertTitle>
                            <Typography variant="caption">{dim.resumo_frase}</Typography>
                            <EvidenceList dim={dim} />
                        </Alert>
                    </Box>
                )
            ))}

            {hasIssues && data.oportunidade_de_melhoria && (
                <Paper sx={{ p: 2, mt: 2, mb: 4, bgcolor: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f9a825', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#f9a825', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <OpportunityIcon sx={{ fontSize: 16 }} /> OPORTUNIDADE DE MELHORIA
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>{data.oportunidade_de_melhoria}</Typography>
                </Paper>
            )}

            <ClientPerceptionCard cliente={data.cliente} />

            <Divider sx={{ my: 4, opacity: 0.1 }} />

            {/* Bloco 2 — Árvore de auditoria */}
            <AuditTree data={data} />
        </Box>
    );
};

export default AvaliacaoBlock;
