import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8003' : 'https://api-visual-lab.ghdaru.com.br');

export interface Model {
  id: string;
  name: string;
  provider: string;
}

export const modelService = {
  async listModels(): Promise<Model[]> {
    const response = await axios.get(`${API_URL}/models`);
    return response.data;
  }
};
