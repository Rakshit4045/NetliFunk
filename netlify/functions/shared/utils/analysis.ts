import { SkillMatch, ExperienceAnalysis, WorkPreferenceMatch } from '../types';
import { formatExperience } from './date';

export const generateExperienceAnalysis = (current: number, required: number): string => {
  if (current >= required) {
    return `Meets the required experience criteria with ${formatExperience(current)}.`;
  }
  
  const gap = required - current;
  if (gap <= 2) {
    return `Currently at ${formatExperience(current)}, slightly under the required ${formatExperience(required)}, but demonstrates rapid skill acquisition and diverse project experience that could compensate for the gap.`;
  }
  return `Currently at ${formatExperience(current)}, which shows an experience gap of ${formatExperience(gap)} from the required ${formatExperience(required)}.`;
};

export const generateSkillsSummary = (matches: SkillMatch[]): string => {
  const exactMatches = matches.filter(m => m.match === 'exact').length;
  const similarMatches = matches.filter(m => m.match === 'similar').length;
  const missing = matches.filter(m => m.match === 'missing').length;

  return `Matches ${exactMatches} required skills exactly, has similar experience in ${similarMatches} skills, and lacks ${missing} required skills.`;
};

export const generateKeyStrengths = (skillMatches: SkillMatch[], experienceAnalysis: ExperienceAnalysis): string[] => {
  const strengths: string[] = [];

  if (experienceAnalysis.isMatch) {
    strengths.push("Meets required years of experience");
  }

  const exactMatches = skillMatches.filter(m => m.match === 'exact');
  if (exactMatches.length > 0) {
    strengths.push(`Strong match in ${exactMatches.length} key required skills`);
    
    // Highlight advanced level skills
    const advancedSkills = exactMatches.filter(m => m.level === 'Advanced');
    if (advancedSkills.length > 0) {
      strengths.push(`Advanced expertise in: ${advancedSkills.map(s => s.skill).join(', ')}`);
    }
  }

  return strengths;
};

export const generateConcerns = (
  skillMatches: SkillMatch[],
  experienceAnalysis: ExperienceAnalysis,
  workPreferences: WorkPreferenceMatch[]
): string[] => {
  const concerns: string[] = [];

  if (!experienceAnalysis.isMatch) {
    concerns.push(experienceAnalysis.analysis);
  }

  const missingSkills = skillMatches.filter(m => m.match === 'missing');
  if (missingSkills.length > 0) {
    concerns.push(`Missing experience in: ${missingSkills.map(s => s.skill).join(', ')}`);
  }

  const unmatchedPreferences = workPreferences.filter(p => !p.matches);
  if (unmatchedPreferences.length > 0) {
    concerns.push(unmatchedPreferences[0].comment);
  }

  return concerns;
};

export const calculateOverallScore = (
  skillMatches: SkillMatch[],
  experience: ExperienceAnalysis,
  domainMatches?: { matches: boolean, relevantProjects: string[] }[]
): number => {
  const skillScore = (skillMatches.filter(s => s.match !== 'missing').length / skillMatches.length) * 100;
  const experienceScore = experience.isMatch ? 100 : 50;
  
  // Calculate domain expertise score if available
  const domainScore = domainMatches?.some(m => m.matches) ? 100 : 0;
  
  if (domainMatches?.some(m => m.matches)) {
    // If there's relevant domain expertise, weight it more heavily
    return (skillScore * 0.5) + (experienceScore * 0.2) + (domainScore * 0.3);
  }
  
  return (skillScore * 0.7) + (experienceScore * 0.3);
};

export const generateOverallSummary = (score: number): string => {
  if (score >= 80) {
    return "Strong match for the position with relevant skills and experience.";
  } else if (score >= 60) {
    return "Good potential match with some areas for growth.";
  } else {
    return "May need additional experience or skills for this role.";
  }
};
