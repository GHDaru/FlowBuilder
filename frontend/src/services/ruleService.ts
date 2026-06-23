import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8003' : 'https://api-visual-lab.ghdaru.com.br');

export interface RuleOrigin {
  type: 'manual' | 'feedback';
  atendimento_ref?: string;
  feedback_original?: string;
}

export interface Rule {
  id: string;
  name: string;
  text: string;
  dimension: string;
  scope: 'global' | 'especifico';
  context: string | null;
  is_active: boolean;
  origin?: RuleOrigin;
  created_at: string;
}

export const ruleService = {
  listRules: async (): Promise<Rule[]> => {
    const response = await axios.get<Rule[]>(`${API_URL}/rules`);
    return response.data;
  },
  createRule: async (rule: Partial<Rule>): Promise<Rule> => {
    const response = await axios.post<Rule>(`${API_URL}/rules`, rule);
    return response.data;
  },
  updateRule: async (id: string, rule: Partial<Rule>): Promise<Rule> => {
    const response = await axios.put<Rule>(`${API_URL}/rules/${id}`, rule);
    return response.data;
  },
  deleteRule: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/rules/${id}`);
  },
  generateManualRule: async (description: string): Promise<{name: string, text: string}> => {
    const response = await axios.post(`${API_URL}/rules/generate/manual`, { description });
    return response.data;
  },
  generateFeedbackRule: async (data: {
    transcript: string;
    avaliacao_dimensao: any;
    feedback_supervisor: string;
    atendimento_ref: string;
  }): Promise<Rule> => {
    const response = await axios.post<Rule>(`${API_URL}/rules/generate/feedback`, data);
    return response.data;
  }
};
