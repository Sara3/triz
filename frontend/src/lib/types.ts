
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer';
  avatarUrl?: string;
}

export interface Patent {
  id: string;
  patent_number: string;
  filename: string;
  title: string;
  filing_date: string;
  upload_date: string;
  raw_text: string;
  abstract: string;
  inventor: string;
  assignee: string;
  is_prior_art: boolean;
  is_competitor: boolean;
  keywords: string;
  status: 'processing' | 'analyzed' | 'reviewed' | 'error';
}

export interface PatentAnalysis {
  id: string;
  patent_id: string;
  extracted_data: TrizExtraction;
  confidence_score: number;
  review_status: 'pending' | 'reviewed' | 'approved';
  extraction_version: string;
  analysis_date: string;
  feedback_date?: string;
  user_feedback?: string;
  status?: 'approved' | 'pending' | 'rejected';  // Added for dashboard compatibility
  approved_date?: string;                        // Added for dashboard compatibility
  title?: string;                                // Added for dashboard display
  principles?: string[];                         // Added for dashboard display
}

export interface PatentCitation {
  id: string;
  patent_id: string;
  cited_patent_number: string;
  citation_context: string;
  citation_type: 'prior-art' | 'related' | 'other';
  citation_date: string;
}

export interface TrizContradiction {
  improving_parameter: string;
  worsening_parameter: string;
}

export interface TrizPrinciple {
  id: number;
  name: string;
  description: string;
  examples: string[];
}

export interface TrizExtraction {
  contradictions: {
    contradiction: TrizContradiction;
    suggested_principles: string[];
  }[];
}

export interface TrizMatrix {
  id: string;
  improving_parameter: string;
  worsening_parameter: string;
  suggested_principles: number[];
  matrix_version: string;
  last_updated: string;
}

export interface SearchQuery {
  term: string;
  filters: {
    date_range?: { start: string; end: string };
    is_prior_art?: boolean;
    is_competitor?: boolean;
    inventor?: string;
    assignee?: string;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface SearchResult {
  patents: Patent[];
  total: number;
  page: number;
  limit: number;
}

export interface AnalyticsSummary {
  total_patents: number;
  patents_by_status: Record<Patent['status'], number>;
  review_completion_rate: number;
  average_confidence_score: number;
  top_contradictions: { contradiction: TrizContradiction; count: number }[];
  top_principles: { principle: string; count: number }[];
}
