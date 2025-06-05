import { SkillMatch, SkillDetail } from '../../shared/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { defaultConfig } from '@/functions/portfolio/config/ai-config';
import { cleanJsonResponse } from './text';
import { logInfo, logWarn, logError, logDebug } from './logger';

// export const findSkillMatch = (requiredSkill: string, profile: ProfessionalProfile): SkillMatch => {
//   // Flatten all skills from different categories
//   const allSkills = Object.values(profile.skillsets).flat() as SkillDetail[];
//   const requiredSkillLower = requiredSkill.toLowerCase();
  
//   // Check for match in related skills
//   const similarSkill = allSkills.find((skill: SkillDetail) =>
//     skill.relatedSkills?.some((related: string) => {
//       const relatedLower = related.toLowerCase();
//       return relatedLower === requiredSkillLower ||
//              relatedLower.includes(requiredSkillLower) ||
//              requiredSkillLower.includes(relatedLower);
//     })
//   );

//   if (similarSkill) {
//     return {
//       skill: requiredSkill,
//       match: 'similar',
//       confidence: 0.7,
//       level: similarSkill.level,
//       alternativeSkills: [similarSkill.name, ...(similarSkill.relatedSkills || [])],
//       relevantExperience: `Experience with similar technology: ${similarSkill.name} (${similarSkill.level})`
//     };
//   }
  
//   // Check for exact or close match in primary skills and their related skills
//   const exactOrFuzzyMatch = allSkills.find((skill: SkillDetail) => {
//     const skillLower = skill.name.toLowerCase();
//     const skillMatches = skillLower === requiredSkillLower ||
//            skillLower.includes(requiredSkillLower) ||
//            requiredSkillLower.includes(skillLower);
    
//     // Also check if any of the skill's projects or related skills contain the required skill
//     const relatedMatches = skill.projectsUsed.some(project => 
//       project.toLowerCase().includes(requiredSkillLower)
//     ) || skill.relatedSkills.some(related => 
//       related.toLowerCase().includes(requiredSkillLower)
//     );
    
//     return skillMatches || relatedMatches;
//   });

//   if (exactOrFuzzyMatch) {
//     return {
//       skill: requiredSkill,
//       match: 'exact',
//       confidence: exactOrFuzzyMatch.name.toLowerCase() === requiredSkillLower ? 1 : 0.9,
//       level: exactOrFuzzyMatch.level,
//       relevantExperience: `${exactOrFuzzyMatch.yearsOfExperience} years (${exactOrFuzzyMatch.level}) with projects: ${exactOrFuzzyMatch.projectsUsed.join(', ')}`
//     };
//   }


//   // Check domain expertise as a last resort
//   const domainSkills = Object.values(profile.domainExpertise)
//     .flatMap(domain => domain.areas)
//     .map(area => area.toLowerCase());

//   if (domainSkills.some(skill => skill === requiredSkillLower || skill.includes(requiredSkillLower))) {
//     return {
//       skill: requiredSkill,
//       match: 'similar',
//       confidence: 0.6,
//       relevantExperience: 'Related domain expertise'
//     };
//   }

//   return {
//     skill: requiredSkill,
//     match: 'missing',
//     confidence: 0
//   };
// };


export const aiSkillMatch = async (requiredSkill: string[], skillsets: SkillDetail[]): Promise<SkillMatch[]> => {
  const startTime = Date.now();
  logInfo('Starting skill matching process', {
    requiredSkillsCount: requiredSkill.length,
    skillsetsCount: skillsets.length
  });

  // Optimize the prompt by reducing verbosity while maintaining clarity
  const prompt = `
  Analyze skills match between job requirements and profile skills.
  Return a JSON array with this structure for each skill:
  {
    "skill": string,
    "match": "exact" | "similar" | "missing",
    "confidence": number,
    "relevantExperience"?: string,
    "alternativeSkills"?: string[],
    "level"?: string
  }

  Rules:
  - "exact": matches name or relatedSkills (confidence: 1.0)
  - "similar": related technologies (confidence: 0.7-0.9)
  - "missing": no match (confidence: 0.0-0.4)
  - Include relevantExperience for exact/similar matches
  - Include alternativeSkills for similar matches
  - Include level for exact matches

  Input:
  skillsets: ${JSON.stringify(skillsets.map(s => `- ${s.name}, ${s.description}, ${s.experience}, `).join('\n'))}
  jdSkills: ${JSON.stringify(requiredSkill)}
`;

  try {
    if(!process.env.GEMINI_API_KEY) {
      logError('Missing API key configuration');
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    
    const modelInitStart = Date.now();
    logDebug('Initializing AI model', {
      modelName: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName
    });
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName,
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent outputs
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });
    
    const modelInitTime = Date.now() - modelInitStart;
    logDebug('Model initialization complete', { duration: `${modelInitTime}ms` });
    
    const aiRequestStart = Date.now();
    logInfo('Sending request to AI model for skill matching');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiRequestTime = Date.now() - aiRequestStart;
    logDebug('AI request complete', { duration: `${aiRequestTime}ms` });
    
    const parsingStart = Date.now();
    logDebug('Received AI response, cleaning and parsing');
    const aiResponse = cleanJsonResponse<SkillMatch[]>(response.text());
    const parsingTime = Date.now() - parsingStart;
    logDebug('Response parsing complete', { duration: `${parsingTime}ms` });
    
    if (!aiResponse || !Array.isArray(aiResponse)) {
      logError('Invalid AI response format', { response: aiResponse });
      throw new Error('Invalid AI response format');
    }

    const totalTime = Date.now() - startTime;
    logInfo('Skill matching complete', {
      totalSkills: aiResponse.length,
      exactMatches: aiResponse.filter(m => m.match === 'exact').length,
      similarMatches: aiResponse.filter(m => m.match === 'similar').length,
      missingMatches: aiResponse.filter(m => m.match === 'missing').length,
      totalDuration: `${totalTime}ms`,
      modelInitTime: `${modelInitTime}ms`,
      aiRequestTime: `${aiRequestTime}ms`,
      parsingTime: `${parsingTime}ms`
    });

    return aiResponse;
  } catch (err: any) {
    const totalTime = Date.now() - startTime;
    logError('Skill matching failed', {
      error: err.message,
      stack: err.stack,
      totalDuration: `${totalTime}ms`
    });
    throw err;
  }
};

/**
 * Chunked version of aiSkillMatch: processes requiredSkill in batches of 15, runs in parallel, and initializes the AI model once.
 * Aggregates all SkillMatch results into a single array and logs chunk progress.
 */
export const aiSkillMatchChunk = async (
  requiredSkill: string[],
  skillsets: SkillDetail[],
  chunkSize: number = 5
): Promise<SkillMatch[]> => {
  const startTime = Date.now();
  logInfo('Starting chunked skill matching', {
    totalRequiredSkills: requiredSkill.length,
    chunkSize
  });

  if(!process.env.GEMINI_API_KEY) {
    logError('Missing API key configuration');
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  // Initialize AI model once
  const modelInitStart = Date.now();
  logDebug('Initializing AI model (once for all chunks)', {
    modelName: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName
  });
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName,
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });
  const modelInitTime = Date.now() - modelInitStart;
  logDebug('Model initialization complete', { duration: `${modelInitTime}ms` });

  // Prepare chunks
  const chunks: string[][] = [];
  for (let i = 0; i < requiredSkill.length; i += chunkSize) {
    chunks.push(requiredSkill.slice(i, i + chunkSize));
  }

  // Run all chunked AI calls in parallel
  const chunkPromises = chunks.map((chunk, idx) => (async () => {
    const chunkStart = Date.now();
    logInfo('Processing skill chunk', { chunkIndex: idx + 1, chunkSkills: chunk.length });
    // Use the same model instance, but replicate the aiSkillMatch logic inline
    // (to avoid re-initializing model and to keep logging consistent)
    // Build prompt for this chunk
    const prompt = `\n  Analyze skills match between job requirements and profile skills.\n  Return a JSON array with this structure for each skill:\n  {\n    \"skill\": string,\n    \"match\": \"exact\" | \"similar\" | \"missing\",\n    \"confidence\": number,\n    \"relevantExperience\"?: string,\n    \"alternativeSkills\"?: string[],\n    \"level\"?: string\n  }\n\n  Rules:\n  - \"exact\": matches name or relatedSkills (confidence: 1.0)\n  - \"similar\": related technologies (confidence: 0.7-0.9)\n  - \"missing\": no match (confidence: 0.0-0.4)\n  - Include relevantExperience for exact/similar matches\n  - Include alternativeSkills for similar matches
\n  - Include level for exact matches\n\n  Input:\n  skillsets: ${JSON.stringify(skillsets.map(s => `- ${s.name}, ${s.description}, ${s.experience}, `).join('\n'))}\n  jdSkills: ${JSON.stringify(chunk)}\n`;
    try {
      const aiRequestStart = Date.now();
      logInfo('Sending request to AI model for skill matching', { chunkIndex: idx + 1 });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiRequestTime = Date.now() - aiRequestStart;
      logDebug('AI request complete', { chunkIndex: idx + 1, duration: `${aiRequestTime}ms` });
      const parsingStart = Date.now();
      logDebug('Received AI response, cleaning and parsing', { chunkIndex: idx + 1 });
      const aiResponse = cleanJsonResponse<SkillMatch[]>(response.text());
      const parsingTime = Date.now() - parsingStart;
      logDebug('Response parsing complete', { chunkIndex: idx + 1, duration: `${parsingTime}ms` });
      if (!aiResponse || !Array.isArray(aiResponse)) {
        logError('Invalid AI response format', { chunkIndex: idx + 1, response: aiResponse });
        throw new Error('Invalid AI response format');
      }
      const chunkTime = Date.now() - chunkStart;
      logInfo('Chunk processed', { chunkIndex: idx + 1, chunkTime: `${chunkTime}ms`, matches: aiResponse.length });
      return aiResponse;
    } catch (err: any) {
      logWarn('Chunk skill matching failed', { chunkIndex: idx + 1, chunk, error: err.message });
      return [];
    }
  })());

  // Await all chunks in parallel
  const allResults = await Promise.all(chunkPromises);
  const allMatches = allResults.flat();
  const totalTime = Date.now() - startTime;
  logInfo('Chunked skill matching complete', {
    totalSkillsMatched: allMatches.length,
    totalDuration: `${totalTime}ms`,
    totalChunks: chunks.length,
    modelInitTime: `${modelInitTime}ms`
  });
  return allMatches;
};