import { 
  generateSkillsSummary,
  generateKeyStrengths,
  generateConcerns,
  calculateOverallScore,
  generateOverallSummary
} from '../../../functions/shared/utils/analysis';
import { aiSkillMatch } from '../../../functions/shared/utils/skills';
import { JDAnalysisResult, ProfessionalProfile, SkillMatch, DomainMatch } from '../../../functions/shared/types';
import { Handler } from '@netlify/functions';
import { analyzeJobDescription } from './jobDescription';
import { professionalProfile } from '../../../data/professional-profile';

export const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {    
    if (!event.body) {
      throw new Error('Request body is required');
    }
    
    const { jdText, customPrompt } = JSON.parse(event.body);
    if (!jdText || typeof jdText !== 'string') {
      throw new Error('Job description text is required and must be a string');
    }
    
    const { skills, experience, preferences } = await analyzeJobDescription(jdText, professionalProfile, customPrompt);
    
    // const skillMatches = skills.map((skill: string) => findSkillMatch(skill, professionalProfile));
    const skillMatches: SkillMatch[] = await aiSkillMatch(skills, professionalProfile.skillsets);
    
    // Check for domain expertise matches
    const domainMatches: DomainMatch[] = Object.entries(professionalProfile.domainExpertise).map(([domain, expertise]) => ({
      domain,
      matches: expertise.areas.some(area => 
        jdText.toLowerCase().includes(area.toLowerCase()) ||
        jdText.toLowerCase().includes(domain.toLowerCase())
      ),
      experience: expertise.experience,
      relevantProjects: expertise.projects
    }));
    
    const overallScore = calculateOverallScore(skillMatches, experience, domainMatches);
    const keyStrengths = generateKeyStrengths(skillMatches, experience);
    const potentialConcerns = generateConcerns(skillMatches, experience, preferences);

    // If we have domain matches, add them to the key strengths
    if (domainMatches.some(m => m.matches)) {
      const matchedDomains = domainMatches.filter(m => m.matches);
      matchedDomains.forEach(match => {
        keyStrengths.push(`Strong ${match.domain} domain expertise with ${match.experience} and relevant projects: ${match.relevantProjects.join(', ')}`);
      });
    }

    const analysis: JDAnalysisResult = {
      skillsAnalysis: {
        matches: skillMatches,
        overallScore: Math.round((skillMatches.filter((s: SkillMatch) => s.match !== 'missing').length / skillMatches.length) * 100),
        summary: generateSkillsSummary(skillMatches)
      },
      experienceAnalysis: experience,
      workPreferences: preferences,
      ...(domainMatches.some(m => m.matches) && {
        domainExpertise: {
          matches: domainMatches.filter(m => m.matches),
          summary: `Relevant domain expertise in: ${domainMatches.filter(m => m.matches).map(m => m.domain).join(', ')}`
        }
      }),
      overallFit: {
        score: Math.round(overallScore),
        summary: generateOverallSummary(overallScore),
        keyStrengths,
        ...(potentialConcerns.length && { potentialConcerns })
      }
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(analysis, null, 2)
    };  } catch (error: any) {
    console.error('JD Analysis Error:', {
      message: error.message,
      stack: error.stack,
      body: event.body
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};
