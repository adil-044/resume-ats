import { create } from 'zustand';

export interface AnalysisResult {
  id: string;
  initial_score: number;
  overall_score: number;
  breakdown: {
    keyword_match: number;
    semantic_alignment: number;
    section_integrity: number;
  };
  missing_keywords: string[];
  matched_keywords: string[];
  formatting_issues: string[];
  optimized_content: {
    format: string;
    raw_text: string;
  };
  original_text?: string;
  job_title?: string;
  job_description?: string;
  created_at?: string;
}

interface ResumeState {
  resumeFile: File | null;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  history: AnalysisResult[];
  setResumeFile: (file: File | null) => void;
  setJobDescription: (jd: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setHistory: (history: AnalysisResult[]) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumeFile: null,
  jobDescription: '',
  analysisResult: null,
  isAnalyzing: false,
  history: [],
  setResumeFile: (file) => set({ resumeFile: file }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setHistory: (history) => set({ history }),
}));
