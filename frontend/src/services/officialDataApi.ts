import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8003' : 'https://api-visual-lab.ghdaru.com.br');

export interface OfficialFirm {
  id: string;
  name: string;
  evaluation_count: number;
}

export interface OfficialInteraction {
  id: number;
  ticket_id: string;
  has_evaluation: boolean;
  created_at: string;
  nota_media?: number;
  nota_comunicacao?: number;
  nota_profissionalismo?: number;
  nota_resolucao?: number;
}

export interface ProcessResponse {
  execution_id: number;
  tracking_ids: string[];
}

export interface OfficialVariable {
  id: string;
  label: string;
  description: string;
}

export const officialDataApi = {
  async listFirms(search?: string): Promise<OfficialFirm[]> {
    const response = await axios.get(`${API_URL}/official/firms`, {
        params: { search }
    });
    return response.data;
  },

  async listInteractions(firmIds: string[]): Promise<OfficialInteraction[]> {
    const ids = firmIds.join(',');
    const response = await axios.get(`${API_URL}/official/firms/${ids}/interactions`);
    return response.data;
  },

  async processInteractions(flowId: string, interactionIds: number[]): Promise<ProcessResponse> {
    const response = await axios.post(`${API_URL}/official/process`, {
        flow_id: flowId,
        interaction_ids: interactionIds
    });
    return response.data;
  },

  async listVariables(): Promise<OfficialVariable[]> {
    const response = await axios.get(`${API_URL}/official/variables`);
    return response.data;
  }
};
