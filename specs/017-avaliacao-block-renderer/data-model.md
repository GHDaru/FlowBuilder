# Data Model: AvaliacaoBlock Component

## Frontend Interfaces (`avalia.consolidacao.v1`)

```typescript
export interface RuleApplied {
    id: string;
    tipo: 'contexto' | 'piso_teto' | 'suspensao';
    descricao: string;
    efeito: string;
}

export interface SubAxis {
    eixo: string;
    nota: number;
    peso: number;
    contribuicao_percentual: number;
    justificativa: string;
    regras_aplicadas: RuleApplied[];
}

export interface Dimension {
    dimensao_id: string;
    dimensao_nome: string;
    nota: number;
    faixa: string;
    resumo_frase: string;
    sub_notas: SubAxis[];
}

export interface ClientTrail {
    nota: number;
    classificacao_nps: 'promotor' | 'passivo' | 'detrator' | 'indeterminado';
    experiencia_predominante: string;
    sinais_emocionais: any[];
    esforco_percebido: { nivel: string; justificativa: string };
    resolucao_percebida: { status: string; justificativa: string };
    alerta_imediato: { necessario: boolean };
}

export interface ConsolidatedEvaluation {
    schema_version: string;
    nota_atendimento: number;
    faixa_atendimento: string;
    resumo_atendimento: string;
    atendente: {
        nota: number;
        faixa: string;
        dimensoes: Dimension[];
    };
    cliente: ClientTrail;
}
```
