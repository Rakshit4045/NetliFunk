import { 
  generateSkillsSummary,
  generateKeyStrengths,
  generateConcerns,
  calculateOverallScore,
  generateOverallSummary
} from '../../../functions/shared/utils/analysis';
import { aiSkillMatchChunk } from '../../../functions/shared/utils/skills';
import { JDAnalysisResult, SkillMatch, DomainMatch } from '../../../functions/shared/types';
import { Handler } from '@netlify/functions';
import { analyzeJobDescription } from './jobDescription';
import { professionalProfile } from '../../../data/professional-profile';
import { logInfo, logWarn, logError, logDebug, withLogging } from '../../../functions/shared/utils/logger';

export const handler: Handler = withLogging(async (event) => {
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
      logWarn('Request body missing');
      throw new Error('Request body is required');
    }
    
    const { jdText, customPrompt } = JSON.parse(event.body);
    if (!jdText || typeof jdText !== 'string') {
      logWarn('Invalid job description text', { jdText });
      throw new Error('Job description text is required and must be a string');
    }
    
    logInfo('Starting job description analysis', { 
      jdLength: jdText.length,
      hasCustomPrompt: !!customPrompt 
    });
    
    const { skills, experience, preferences } = await analyzeJobDescription(jdText, professionalProfile, customPrompt);
    logDebug('Initial analysis complete', { 
      skillsCount: skills.length,
      experienceLevel: experience.level
    });
    
    const skillMatches: SkillMatch[] = await aiSkillMatchChunk(skills, professionalProfile.skillsets);

    logDebug('Skill matching complete', { 
      totalSkills: skillMatches.length,
      matchedSkills: skillMatches.filter(s => s.match !== 'missing').length
    });
    
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

    logInfo('Analysis complete', {
      overallScore,
      keyStrengthsCount: keyStrengths.length,
      concernsCount: potentialConcerns.length
    });

    // If we have domain matches, add them to the key strengths
    if (domainMatches.some(m => m.matches)) {
      const matchedDomains = domainMatches.filter(m => m.matches);
      matchedDomains.forEach(match => {
        keyStrengths.push(`Strong ${match.domain} domain expertise with ${match.experience} and relevant projects: ${match.relevantProjects.join(', ')}`);
      });
      logDebug('Domain matches added to strengths', {
        matchedDomains: matchedDomains.map(m => m.domain)
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
    };
  } catch (err: any) {
    logError('JD Analysis Error:', {
      message: err.message,
      stack: err.stack,
      body: event.body
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: err.message,
        details: err.stack,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
});
