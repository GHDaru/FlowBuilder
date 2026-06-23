import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button,
    Collapse,
    Paper
} from '@mui/material';
import { 
    ChevronRight as ChevronIcon,
    UnfoldMore as ExpandAllIcon,
    UnfoldLess as CollapseAllIcon,
    Circle as RulePointIcon
} from '@mui/icons-material';
import { getBandColors, getNPSColors, getRuleBorderColor } from './utils/visualRules';

interface TreeItemProps {
    label: string;
    value?: string | number;
    faixa?: string;
    npsClass?: string;
    badge?: string;
    description?: string;
    level: number;
    children?: React.ReactNode;
    forceExpand?: boolean;
    regras_aplicadas?: any[];
    justificativa?: string;
}

const AuditTreeItem: React.FC<TreeItemProps> = ({ 
    label, value, faixa, npsClass, badge, description, level, children, forceExpand, regras_aplicadas, justificativa
}) => {
    const [open, setOpen] = useState(false);
    const hasChildren = !!children || !!description || !!justificativa;

    useEffect(() => {
        if (forceExpand !== undefined) setOpen(forceExpand);
    }, [forceExpand]);

    const bandColors = faixa ? getBandColors(faixa) : null;
    const npsColors = npsClass ? getNPSColors(npsClass) : null;

    return (
        <Box sx={{ ml: level > 0 ? '20px' : 0 }}>
            <Box 
                onClick={() => hasChildren && setOpen(!open)}
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 1, 
                    cursor: hasChildren ? 'pointer' : 'default',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    '&:hover': { bgcolor: hasChildren ? 'rgba(255,255,255,0.02)' : 'transparent' }
                }}
            >
                {hasChildren ? (
                    <ChevronIcon sx={{ 
                        fontSize: 18, 
                        mr: 1, 
                        transform: open ? 'rotate(90deg)' : 'none',
                        transition: '0.2s',
                        opacity: 0.5
                    }} />
                ) : (
                    <Box sx={{ width: 26 }} />
                )}

                <Typography variant="body2" sx={{ fontWeight: level === 0 ? 'bold' : 'normal', flexGrow: 1, opacity: 0.9 }}>
                    {label}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {badge && (
                        <Typography variant="caption" sx={{ px: 1, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
                            {badge}
                        </Typography>
                    )}
                    {regras_aplicadas && regras_aplicadas.length > 0 && (
                        <RulePointIcon sx={{ fontSize: 10, color: '#0288d1' }} />
                    )}
                    {value !== undefined && (
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: npsColors?.main || bandColors?.text || 'inherit' }}>
                            {typeof value === 'number' ? value.toFixed(1) : value}
                        </Typography>
                    )}
                    {faixa && (
                        <Typography variant="caption" sx={{ 
                            px: 0.8, py: 0.2, borderRadius: 1, 
                            bgcolor: bandColors?.bg, color: bandColors?.text,
                            fontSize: '0.65rem', fontWeight: 'bold'
                        }}>
                            {(faixa || 'indeterminado').toUpperCase()}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Collapse in={open}>
                <Box sx={{ py: 1, pl: 4, pr: 2 }}>
                    {description && (
                        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2, fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.1)', pl: 2 }}>
                            {description}
                        </Typography>
                    )}

                    {justificativa && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>JUSTIFICATIVA TÉCNICA</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>{justificativa}</Typography>
                        </Box>
                    )}

                    {regras_aplicadas && regras_aplicadas.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.5 }}>REGRAS APLICADAS</Typography>
                            {regras_aplicadas.map((regra: any, idx: number) => (
                                <Box key={idx} sx={{ 
                                    p: 1.5, 
                                    borderRadius: 1, 
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    borderLeft: `4px solid ${getRuleBorderColor(regra.tipo)}`
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ px: 0.5, borderRadius: 0.5, bgcolor: getRuleBorderColor(regra.tipo), color: '#fff', fontWeight: 'bold', fontSize: '0.6rem' }}>
                                            {(regra.tipo || 'regra').toUpperCase()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{regra.descricao}</Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                                        Efeito: {regra.efeito}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};

export const AuditTree = ({ data }: { data: any }) => {
    const [globalExpand, setGlobalExpand] = useState<boolean | undefined>(undefined);

    const handleExpandAll = () => {
        setGlobalExpand(true);
        setTimeout(() => setGlobalExpand(undefined), 100);
    };

    const handleCollapseAll = () => {
        setGlobalExpand(false);
        setTimeout(() => setGlobalExpand(undefined), 100);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Árvore de Auditoria</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<ExpandAllIcon />} onClick={handleExpandAll} sx={{ fontSize: '0.7rem' }}>Expandir tudo</Button>
                    <Button size="small" startIcon={<CollapseAllIcon />} onClick={handleCollapseAll} sx={{ fontSize: '0.7rem' }}>Recolher tudo</Button>
                </Box>
            </Box>

            <Paper variant="outlined" sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.05)' }}>
                {/* Level 0 — Raiz */}
                <AuditTreeItem 
                    label="IDENTIFICADOR DO ATENDIMENTO" 
                    value={data.nota_atendimento} 
                    faixa={data.faixa_atendimento} 
                    level={0}
                    description={data.resumo_atendimento}
                    forceExpand={globalExpand !== undefined ? globalExpand : true}
                >
                    {/* Level 1 — Atendente */}
                    <AuditTreeItem 
                        label="TRILHA DO ATENDENTE" 
                        value={data.atendente.nota} 
                        faixa={data.atendente.faixa} 
                        badge="TRILHA A" 
                        level={1}
                        forceExpand={globalExpand}
                    >
                        {data.atendente.dimensoes.map((dim: any) => (
                            /* Level 2 — Dimensão */
                            <AuditTreeItem 
                                key={dim.dimensao_id}
                                label={dim.dimensao_nome} 
                                value={dim.nota} 
                                faixa={dim.faixa} 
                                level={2}
                                description={dim.resumo_frase}
                                forceExpand={globalExpand}
                            >
                                {dim.sub_notas.map((sub: any) => (
                                    /* Level 3 — Sub-eixo */
                                    <AuditTreeItem 
                                        key={sub.eixo}
                                        label={sub.eixo} 
                                        value={sub.nota} 
                                        badge={`${sub.contribuicao_percentual}%`}
                                        level={3}
                                        justificativa={sub.justificativa}
                                        regras_aplicadas={sub.regras_aplicadas}
                                        forceExpand={globalExpand}
                                    />
                                ))}
                            </AuditTreeItem>
                        ))}
                    </AuditTreeItem>

                    {/* Level 1 — Cliente */}
                    <AuditTreeItem 
                        label="PERCEPÇÃO DO CLIENTE" 
                        value={data.cliente.nota} 
                        npsClass={data.cliente.classificacao_nps} 
                        badge="TRILHA B" 
                        level={1}
                        forceExpand={globalExpand}
                    >
                        <AuditTreeItem label="Experiência Predominante" value={data.cliente.experiencia_predominante || 'N/A'} level={2} />
                        <AuditTreeItem label="Esforço Percebido" value={data.cliente.esforco_percebido?.nivel || 'N/A'} level={2} justificativa={data.cliente.esforco_percebido?.justificativa} />
                        <AuditTreeItem label="Resolução Percebida" value={data.cliente.resolucao_percebida?.status || 'N/A'} level={2} justificativa={data.cliente.resolucao_percebida?.justificativa} />
                        
                        {(data.cliente.sinais_emocionais || []).map((s: any, i: number) => (
                            <AuditTreeItem 
                                key={i}
                                label={`Sinal: ${s.tipo}`} 
                                value={s.intensidade} 
                                level={2} 
                                description={s.evidencias?.join(' | ')}
                            />
                        ))}

                        <AuditTreeItem 
                            label="Alerta Imediato" 
                            value={data.cliente.alerta_imediato?.necessario ? "SIM" : "NÃO"} 
                            level={2}
                            faixa={data.cliente.alerta_imediato?.necessario ? "critico" : undefined}
                        />
                    </AuditTreeItem>
                </AuditTreeItem>
            </Paper>
        </Box>
    );
};
