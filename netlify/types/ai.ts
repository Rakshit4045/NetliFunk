export interface AIConfig {
  apiKey: string;
  modelName: string;
  maxTokens: number;
  temperature: number;
}

export interface SkillMatch {
  skill: string;
  match: 'exact' | 'similar' | 'missing';
  confidence: number;
  relevantExperience?: string;
  alternativeSkills?: string[];
}

export interface ExperienceAnalysis {
  requiredYears: number;
  currentYears: number;
  isMatch: boolean;
  analysis: string;
}

export interface WorkPreferenceMatch {
  preference: string;
  requirement: string;
  matches: boolean;
  comment: string;
}

export interface JDAnalysisResult {
  skillsAnalysis: {
    matches: SkillMatch[];
    overallScore: number;
    summary: string;
  };
  experienceAnalysis: ExperienceAnalysis;
  workPreferences: WorkPreferenceMatch[];
  overallFit: {
    score: number;
    summary: string;
    keyStrengths: string[];
    potentialConcerns?: string[];
  };
}

export interface Skill {
  name: string;
  yearsOfExperience: number;
  projectsUsed: string[];
  relatedSkills: string[];
}

export interface DomainExpertise {
  healthcare?: boolean;
  [key: string]: boolean | undefined;
}

export interface WorkPreferences {
  location: {
    remote?: boolean;
    onsite?: boolean;
    hybrid?: boolean;
    [key: string]: boolean | undefined;
  };
  workSchedule: {
    daysPerWeek: number;
    [key: string]: any;
  };
}

export interface ProfessionalProfile {
  totalExperience: number;
  skillsets: {
    [category: string]: Skill[];
  };
  workPreferences: WorkPreferences;
  domainExpertise: DomainExpertise;
}
