import { TRIZ_PRINCIPLES } from './mock-data';
import { 
  ENGINEERING_PARAMETERS, 
  CONTRADICTION_MATRIX, 
  DEFAULT_PRINCIPLES,
  COMMON_CONTRADICTIONS 
} from './triz-constants';
import { TrizPrinciple, PatentAnalysis, TrizExtraction } from './types';

// Custom storage for user-added parameters and principles
let customParameters: string[] = [];
let customPrinciples: TrizPrinciple[] = [];
let analysisResults: PatentAnalysis[] = []; // Initialize as empty array

// Re-export the constants for convenience
export { 
  ENGINEERING_PARAMETERS, 
  CONTRADICTION_MATRIX, 
  DEFAULT_PRINCIPLES,
  COMMON_CONTRADICTIONS 
};

// Get all engineering parameters, including custom ones
export const getAllParameters = (): string[] => {
  return [...ENGINEERING_PARAMETERS, ...customParameters];
};

// Add a new custom parameter
export const addCustomParameter = (parameter: string): string[] => {
  if (!parameter || parameter.trim() === '') return getAllParameters();
  
  const trimmedParam = parameter.trim();
  
  // Check if it already exists (case-insensitive)
  const allParams = getAllParameters();
  const exists = allParams.some(p => p.toLowerCase() === trimmedParam.toLowerCase());
  
  if (!exists) {
    customParameters.push(trimmedParam);
  }
  
  return getAllParameters();
};

// Get the suggested principles for a given improving and worsening parameter
export const getSuggestedPrinciples = (improving: string, worsening: string): string[] => {
  // Safety check for inputs
  if (!improving || !worsening) {
    return Array.isArray(DEFAULT_PRINCIPLES) ? [...DEFAULT_PRINCIPLES] : [];
  }
  
  // Check if the contradiction exists in the matrix
  const isContradictionInMatrix = CONTRADICTION_MATRIX[improving] && 
                                  CONTRADICTION_MATRIX[improving][worsening];
  
  // If the contradiction is not in the matrix, return the default principles
  if (!isContradictionInMatrix) {
    return Array.isArray(DEFAULT_PRINCIPLES) ? [...DEFAULT_PRINCIPLES] : [];
  }
  
  // Get the principle numbers from the matrix
  const principleIds = CONTRADICTION_MATRIX[improving][worsening];
  
  // Safety check for principle IDs
  if (!Array.isArray(principleIds) || principleIds.length === 0) {
    return Array.isArray(DEFAULT_PRINCIPLES) ? [...DEFAULT_PRINCIPLES] : [];
  }
  
  // Get all principles (built-in + custom)
  const allPrinciples = [...TRIZ_PRINCIPLES, ...customPrinciples];
  
  // Safety check for principles array
  if (!Array.isArray(allPrinciples)) {
    return [];
  }
  
  // Convert principle numbers to names
  const principles = principleIds
    .map(id => {
      const principle = allPrinciples.find(p => p.id === id);
      return principle ? principle.name : null;
    })
    .filter((name): name is string => name !== null && name !== "Unknown Principle");
  
  return principles;
};

// Check if a contradiction exists in the matrix
export const isContradictionInMatrix = (improving: string, worsening: string): boolean => {
  if (!improving || !worsening) return false;
  
  return !!(CONTRADICTION_MATRIX[improving] && 
           CONTRADICTION_MATRIX[improving][worsening] &&
           Array.isArray(CONTRADICTION_MATRIX[improving][worsening]) &&
           CONTRADICTION_MATRIX[improving][worsening].length > 0);
};

// Get principle ID by name
export const getPrincipleIdByName = (name: string): number | undefined => {
  if (!name) return undefined;
  
  // Check built-in principles
  if (Array.isArray(TRIZ_PRINCIPLES)) {
    const builtInPrinciple = TRIZ_PRINCIPLES.find(p => 
      p.name.toLowerCase() === name.toLowerCase()
    );
    if (builtInPrinciple) return builtInPrinciple.id;
  }
  
  // Check custom principles
  const customPrinciple = customPrinciples.find(p => 
    p.name.toLowerCase() === name.toLowerCase()
  );
  return customPrinciple?.id;
};

// Get all principle names for dropdown selection
export const getAllPrincipleNames = (): string[] => {
  const builtInNames = Array.isArray(TRIZ_PRINCIPLES) ? 
    TRIZ_PRINCIPLES.map(principle => principle.name) : [];
    
  const customNames = customPrinciples.map(principle => principle.name);
  
  return [...builtInNames, ...customNames];
};

// Get principle details by name
export const getPrincipleDetailsByName = (name: string) => {
  if (!name) return undefined;
  
  // Check built-in principles
  if (Array.isArray(TRIZ_PRINCIPLES)) {
    const builtInPrinciple = TRIZ_PRINCIPLES.find(p => 
      p.name.toLowerCase() === name.toLowerCase()
    );
    if (builtInPrinciple) return builtInPrinciple;
  }
  
  // Check custom principles
  return customPrinciples.find(p => 
    p.name.toLowerCase() === name.toLowerCase()
  );
};

// Get default principles if no contradiction is found in the matrix
export const getDefaultPrinciples = (): string[] => {
  return Array.isArray(DEFAULT_PRINCIPLES) ? [...DEFAULT_PRINCIPLES] : [];
};

// Get common predefined contradictions
export const getCommonContradictions = () => {
  return Array.isArray(COMMON_CONTRADICTIONS) ? [...COMMON_CONTRADICTIONS] : [];
};

// Get a contradiction by improving and worsening parameters
export const getContradiction = (improving: string, worsening: string) => {
  if (!improving || !worsening || !Array.isArray(COMMON_CONTRADICTIONS)) return undefined;
  
  return COMMON_CONTRADICTIONS.find(
    c => c.improving_parameter === improving && c.worsening_parameter === worsening
  );
};

// Add a new custom principle
export const addCustomPrinciple = (principle: Omit<TrizPrinciple, 'id'>): TrizPrinciple => {
  // Generate a new ID - use a high number to avoid conflicts with built-in principles
  const existingIds = [...TRIZ_PRINCIPLES, ...customPrinciples].map(p => p.id);
  const maxId = Math.max(...existingIds, 0);
  const newId = maxId + 1;
  
  const newPrinciple: TrizPrinciple = {
    id: newId,
    name: principle.name.trim(),
    description: principle.description.trim(),
    examples: Array.isArray(principle.examples) ? 
      principle.examples.map(e => e.trim()).filter(e => e !== '') : 
      []
  };
  
  // Check if it already exists by name (case-insensitive)
  const existingPrinciple = getPrincipleDetailsByName(newPrinciple.name);
  if (!existingPrinciple) {
    customPrinciples.push(newPrinciple);
  }
  
  return newPrinciple;
};

// Get all custom principles
export const getCustomPrinciples = (): TrizPrinciple[] => {
  return [...customPrinciples];
};

// Reset all custom data (mainly for testing purposes)
export const resetCustomData = (): void => {
  customParameters = [];
  customPrinciples = [];
};

// Store a patent analysis result
export const storeAnalysisResult = (analysis: PatentAnalysis): void => {
  // Check if analysis already exists with the same ID
  const existingIndex = analysisResults.findIndex(a => a.id === analysis.id);
  
  if (existingIndex >= 0) {
    // Update existing analysis
    analysisResults[existingIndex] = analysis;
  } else {
    // Add new analysis
    analysisResults.push(analysis);
  }
};

// Get all stored analysis results
export const getAllAnalysisResults = (): PatentAnalysis[] => {
  return [...analysisResults];
};

// Get analysis results for a specific patent
export const getAnalysisResultsByPatentId = (patentId: string): PatentAnalysis[] => {
  return analysisResults.filter(analysis => analysis.patent_id === patentId);
};

// Get a specific analysis by ID
export const getAnalysisById = (analysisId: string): PatentAnalysis | undefined => {
  return analysisResults.find(analysis => analysis.id === analysisId);
};
