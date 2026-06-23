import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8003' : 'https://api-visual-lab.ghdaru.com.br');

export interface NodeData {
  sequence_num: number;
  title: string;
  prompt_template: string;
  variables: string[];
  output_schema: any;
}

export interface FlowCreate {
  name: string;
  description?: string;
  json_definition?: string;
}

export interface Flow extends FlowCreate {
  id: string;
  json_definition?: string;
  created_at: string;
  updated_at: string;
}

export const flowService = {
  listFlows: async () => {
    const response = await axios.get<Flow[]>(`${API_URL}/flows`);
    return response.data;
  },
  getFlow: async (id: string) => {
    const response = await axios.get<Flow>(`${API_URL}/flows/${id}`);
    return response.data;
  },
  createFlow: async (flow: FlowCreate) => {
    const response = await axios.post<Flow>(`${API_URL}/flows`, flow);
    return response.data;
  },
  updateFlow: async (id: string, flowUpdate: any) => {
    const response = await axios.put<Flow>(`${API_URL}/flows/${id}`, flowUpdate);
    return response.data;
  },
  copyFlow: async (id: string, newName: string) => {
    const response = await axios.post<Flow>(`${API_URL}/flows/${id}/copy`, { name: newName });
    return response.data;
  },
  deleteFlow: async (id: string) => {
    await axios.delete(`${API_URL}/flows/${id}`);
  }
};
