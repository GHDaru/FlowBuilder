import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8003' : 'https://api-visual-lab.ghdaru.com.br');

export interface SqlPreviewRequest {
  database_type: string;
  connection_details: Record<string, any>;
  sql_query: string;
  variables: Record<string, any>;
}

export interface SqlPreviewResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export const sqlService = {
  previewQuery: async (request: SqlPreviewRequest): Promise<SqlPreviewResponse> => {
    const response = await axios.post<SqlPreviewResponse>(`${API_URL}/tools/sql/preview`, request);
    return response.data;
  },
  testConnection: async (request: SqlPreviewRequest): Promise<SqlPreviewResponse> => {
    const response = await axios.post<SqlPreviewResponse>(`${API_URL}/tools/sql/test-connection`, request);
    return response.data;
  }
};
