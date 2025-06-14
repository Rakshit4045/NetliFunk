export interface SkillDetail {
  name: string;
  rating: number;
  experience: string;
  description: string;
  category: string;
}

export interface WorkPreferences {
  location: {
    remote: boolean;
    hybrid: boolean;
    onsite: boolean;
    relocation?: {
      domestic: boolean;
      international: boolean;
      visaRequired: boolean;
    };
  };
  workSchedule: {
    maxDaysPerWeek: number;
    flexibleHours: boolean;
  };
  roleType: string[];
}

export interface DomainExpertise {
  [domain: string]: {
    areas: string[];
    experience: string;
    projects: string[];
  };
}

export interface Achievement {
  area: string;
  impact: string;
  skills: string[];
}

export interface ProfessionalProfile {
  currentRole: string;
  totalExperience: number; // Dynamically calculated from startedWorking
  startedWorking: string; // Format: YYYY-MM-DD
  workPreferences: WorkPreferences;
  skillsets: SkillDetail[];
  domainExpertise: DomainExpertise;
  achievements: Achievement[];
}

export interface SkillMatch {
  skill: string;
  match: 'exact' | 'similar' | 'missing';
  confidence: number;
  relevantExperience?: string;
  alternativeSkills?: string[];
  level?: string;
}

export interface ExperienceAnalysis {
  requiredYears: string;
  currentYears: string;
  isMatch: boolean;
  analysis: string;
  level?: 'Entry' | 'Mid' | 'Senior' | 'Lead';
}

export interface WorkPreferenceMatch {
  preference: string;
  requirement: string;
  matches: boolean;
  comment: string;
}

export interface DomainMatch {
  domain: string;
  matches: boolean;
  experience: string;
  relevantProjects: string[];
}

export interface DomainAnalysis {
  matches: DomainMatch[];
  summary: string;
}

export interface JDAnalysisResult {
  skillsAnalysis: {
    matches: SkillMatch[];
    overallScore: number;
    summary: string;
  };
  experienceAnalysis: ExperienceAnalysis;
  workPreferences: WorkPreferenceMatch[];
  domainExpertise?: DomainAnalysis;
  overallFit: {
    score: number;
    summary: string;
    keyStrengths: string[];
    potentialConcerns?: string[];
  };
}

export type PortfolioSection = 'about' | 'experience' | 'projects' | 'skills' | 'contact';

export interface AIAssistantRequest {
  question: string;
  section: PortfolioSection;
}

export interface AIAssistantResponse {
  answer: string;
  followUpQuestions: string[];
}
