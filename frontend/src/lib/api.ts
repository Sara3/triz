/**
 * API services for interacting with the backend
 */

import axios from 'axios';

// Base API URL - can be changed in the environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// TypeScript interfaces
interface TrizPrinciple {
  id: number;
  number: number;
  name: string;
  description: string;
  examples: string;
}

interface EngineeringParameter {
  id: number;
  number: number;
  name: string;
  description: string;
}

interface Patent {
  id: number;
  patent_number: string;
  title: string;
  abstract: string;
  filing_date: string;
  publication_date: string;
  inventors: string;
  assignee: string;
  pdf_file?: string;
}

interface PatentAnalysis {
  id: number;
  patent: Patent;
  improving_parameter: EngineeringParameter;
  worsening_parameter: EngineeringParameter;
  applied_principles: TrizPrinciple[];
  analysis_date: string;
  notes: string;
}

interface PatentCitation {
  id: number;
  citing_patent: Patent;
  cited_patent: Patent;
  citation_type: string;
}

interface PatentAnalysisResult {
  metadata?: {
    title?: string;
    abstract?: string;
    inventors?: string;
    assignee?: string;
    patent_number?: string;
  };
  contradictions?: Array<{
    contradiction: {
      improving_parameter: string;
      worsening_parameter: string;
    };
    suggested_principles: string[];
  }>;
  fileUrl?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check endpoint
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// TRIZ principles endpoint
export const getTrizPrinciples = () => api.get<TrizPrinciple[]>('/triz/principles/');
export const getTrizPrinciple = (id: number) => api.get<TrizPrinciple>(`/triz/principles/${id}/`);

// Engineering parameters endpoint
export const getEngineeringParameters = () => api.get<EngineeringParameter[]>('/triz/parameters/');
export const getEngineeringParameter = (id: number) => api.get<EngineeringParameter>(`/triz/parameters/${id}/`);

// TRIZ matrix endpoint
export const getContradictionMatrix = () => api.get('/triz/matrix/');
export const getContradictionPrinciples = (improving: number, worsening: number) => 
  api.get(`/triz/matrix/get_principles/?improving=${improving}&worsening=${worsening}`);

// Get all patents
export const getPatents = () => api.get<Patent[]>('/patents/');
export const getPatent = (id: number) => api.get<Patent>(`/patents/${id}/`);
export const createPatent = (data: Omit<Patent, 'id'> | FormData) => {
  // If it's a FormData object, we need to handle it differently
  if (data instanceof FormData) {
    return api.post<Patent>('/patents/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  // Regular JSON POST
  return api.post<Patent>('/patents/', data);
};
export const updatePatent = (id: number, data: Partial<Patent>) => api.put<Patent>(`/patents/${id}/`, data);
export const deletePatent = (id: number) => api.delete(`/patents/${id}/`);
export const getPatentAnalyses = (id: number) => api.get<PatentAnalysis[]>(`/patents/${id}/analyses/`);
export const getPatentCitations = (id: number) => api.get<PatentCitation[]>(`/patents/${id}/citations/`);

// Get patent by ID
export const getPatentById = async (patentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patents/${patentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch patent: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch patent ${patentId}:`, error);
    throw error;
  }
};

// Upload a patent
export const uploadPatent = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patents`, {
      method: 'POST',
      body: formData, // FormData object containing file and metadata
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload patent: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to upload patent:', error);
    throw error;
  }
};

// Analyze a patent
export const analyzePatent = async (patentFile: File | string): Promise<PatentAnalysisResult> => {
  try {
    const formData = new FormData();
    let fileUrl = '';
    
    if (typeof patentFile === 'string') {
      // If we already have a URL, use it
      fileUrl = patentFile;
      formData.append('file_url', fileUrl);
    } else {
      // If we have a file, append it to form data
      formData.append('file', patentFile);
    }
    
    // Send to the Django analyze endpoint
    const response = await api.post<PatentAnalysisResult>('/patents/analyze/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to analyze patent:', error);
    throw error;
  }
};

// Upload a file to storage service (mocked)
export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    // In a real implementation, this would upload to a CDN, S3, Azure Blob Storage, etc.
    // Here we're just mocking the process
    
    // Simulate network delay and upload process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock CDN URL
    const fileName = encodeURIComponent(file.name);
    const timestamp = Date.now();
    const mockCdnUrl = `https://mock-cdn.example.com/patents/${timestamp}-${fileName}`;
    
    console.log(`File uploaded to: ${mockCdnUrl}`);
    return mockCdnUrl;
  } catch (error) {
    console.error('Failed to upload file to storage:', error);
    throw new Error('Failed to upload file to storage service');
  }
};

// Get all analyses
export const getAnalyses = () => api.get<PatentAnalysis[]>('/analyses/');
export const getAnalysis = (id: number) => api.get<PatentAnalysis>(`/analyses/${id}/`);
export const createAnalysis = (data: Omit<PatentAnalysis, 'id' | 'analysis_date'>) => 
  api.post<PatentAnalysis>('/analyses/', data);
export const updateAnalysis = (id: number, data: Partial<PatentAnalysis>) => 
  api.put<PatentAnalysis>(`/analyses/${id}/`, data);
export const deleteAnalysis = (id: number) => api.delete(`/analyses/${id}/`);

// Patent Citations
export const getCitations = () => api.get<PatentCitation[]>('/citations/');
export const getCitation = (id: number) => api.get<PatentCitation>(`/citations/${id}/`);
export const createCitation = (data: Omit<PatentCitation, 'id'>) => 
  api.post<PatentCitation>('/citations/', data);
export const updateCitation = (id: number, data: Partial<PatentCitation>) => 
  api.put<PatentCitation>(`/citations/${id}/`, data);
export const deleteCitation = (id: number) => api.delete(`/citations/${id}/`);

export type {
  TrizPrinciple,
  EngineeringParameter,
  Patent,
  PatentAnalysis,
  PatentCitation,
  PatentAnalysisResult,
};

export default api; 