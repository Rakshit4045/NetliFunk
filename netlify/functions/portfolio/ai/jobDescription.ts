import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExperienceAnalysis, WorkPreferenceMatch, ProfessionalProfile } from '../../shared/types';
import { cleanJsonResponse } from '../../shared/utils/text';
import { parseWorkMode } from '../../shared/utils/workMode';
import { generateExperienceAnalysis } from '../../shared/utils/analysis';
import { calculateYearsOfExperience, formatExperience } from '../../shared/utils/date';
import { defaultConfig } from '../config/ai-config';

interface AIWorkPreference {
  type: 'workMode' | 'workDays' | 'other';
  requirement: string;
  details: string;
}

interface AIJobAnalysis {
  skills: string[];
  requiredYears: number;
  experienceDetails?: {
    yearsRequired: number;
    experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Lead';
    specificExperience?: string[];
  };
  workPreferences: AIWorkPreference[];
}

export const analyzeJobDescription = async (
  jdText: string, 
  profile: ProfessionalProfile, 
  customPrompt?: string
): Promise<{
  skills: string[],
  experience: ExperienceAnalysis,
  preferences: WorkPreferenceMatch[]
}> => {
  const currentYears = calculateYearsOfExperience(profile.startedWorking);
  
  const prompt = `
    Analyze this job description and extract:
    1. Only Technical skills and technologies required. Also include technologies mentioned in custom prompt ${customPrompt} (as a list)
    2. Years of experience required (as a number)
    3. Work preference must match this ${JSON.stringify(profile.workPreferences)}
    4. Domain-specific requirements (e.g., healthcare, finance, etc.)
    ${customPrompt ? `\n5. Additional focus areas:\n${customPrompt}` : ''}

    
    For reference, the candidate started working on ${profile.startedWorking} and currently has ${formatExperience(currentYears)} of experience.
    
    Return only a JSON object with this structure, no other text:
    {
      "skills": string[],
      "requiredYears": number,
      "experienceDetails": {
        "yearsRequired": number,
        "experienceLevel": "Entry" | "Mid" | "Senior" | "Lead",
        "specificExperience": string[]
      },
      "workPreferences": [
        {
          "type": "workMode" | "workDays",
          "requirement": string,
          "details": string
        }
      ]
    }

    Job Description: ${jdText}
  `;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName 
  });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiResponse = cleanJsonResponse<AIJobAnalysis>(response.text());

  // Validate AI response
  if (!aiResponse || !Array.isArray(aiResponse.skills)) {
    throw new Error('Invalid AI response format');
  }

  // Prepare experience analysis with accurate years
  const experience: ExperienceAnalysis = {
    requiredYears: aiResponse.requiredYears ? formatExperience(aiResponse.requiredYears) : "No available",
    currentYears: formatExperience(currentYears),
    isMatch: currentYears >= aiResponse.requiredYears,
    analysis: generateExperienceAnalysis(currentYears, aiResponse.requiredYears),
    level: aiResponse.experienceDetails?.experienceLevel || 'Mid'
  };

  // Analyze work preferences
  const preferences = aiResponse.workPreferences.map((pref): WorkPreferenceMatch => {
    if (pref.type === 'workMode') {
      const modes = parseWorkMode(pref.requirement);
      const matches = modes.some(mode => 
        profile.workPreferences.location[mode.toLowerCase() as keyof typeof profile.workPreferences.location] 
        || profile.workPreferences.roleType.find(role => role.toLocaleLowerCase() === mode.toLocaleLowerCase())
      );

      // const matches = true;

      return {
        preference: 'Work Mode',
        requirement: pref.requirement,
        matches,
        comment: matches ? 
          'Preferred work mode available' : 
          'Work mode preference mismatch'
      };
    }
    
    if (pref.type === 'workDays') {
      const daysMatch = pref.requirement.match(/(\d+)/);
      const requiredDays = daysMatch ? parseInt(daysMatch[1], 10) : 5;
      const matches = profile.workPreferences.workSchedule.maxDaysPerWeek >= requiredDays;

      return {
        preference: 'Work Schedule',
        requirement: pref.requirement,
        matches,
        comment: matches ? 
          'Work schedule matches requirements' : 
          'Preferred work schedule differs from requirements'
      };
    }

    return {
      preference: pref.type,
      requirement: pref.requirement,
      matches: true,
      comment: pref.details
    };
  });

  return {
    skills: aiResponse.skills,
    experience,
    preferences
  };
};