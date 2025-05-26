import { SkillMatch, SkillDetail } from '../../shared/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { defaultConfig } from '@/functions/portfolio/config/ai-config';
import { cleanJsonResponse } from './text';

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
  const prompt = `
  You are a smart resume and skillset analyzer.

  You will receive:
  - A detailed JSON structure called skillsets, containing categorized technical skills, each with name, level, years of experience, relatedSkills, and projectsUsed.
  - A list of jdSkills, which are extracted skills from a job description.

  Your task:
  Compare each skill in jdSkills with the skillsets object and return a response that tells us how well the JD skills match your profile.

  ### Matching logic:
  1. If the jdSkill matches any name in skillsets, it is an **exact** match.
  2. If the jdSkill does not match any name, but matches **any item in the relatedSkills array** for a skill in skillsets, it is considered an **exact** match.
  3. If the jdSkill does not match either the name or any item in relatedSkills for any skill in skillsets, and it is somewhat **related** (for example, synonyms or similar technologies), it can be considered a **similar** match.
  4. If the jdSkill does not match at all in the name or relatedSkills and is not similar in any way, it is considered **missing**.

  For each jdSkill, return the following in a **compact JSON array**:

  {
    skill: string;
    match: 'exact' | 'similar' | 'missing';
    confidence: number;
    relevantExperience?: string;
    alternativeSkills?: string[];
    level?: string;
  }

  Matching rules:
  - Mark as 'exact' if the jdSkill matches any 'name' in the skillsets.
  - Mark as 'similar' if the jdSkill matches are closely related to the skills present in skillsets(For e.g., jdSkill = Database, skillsets = SQL, Database is related to sQL).
  - Mark as 'missing' if it matches neither.
  - Set confidence to:
    - 1.0 for exact matches
    - 0.7 to 0.9 for similar matches
    - 0.0 to 0.4 for missing skills

  Additional rules:
  - Always return a result object for **every** jdSkill — no filtering allowed.
  - For 'exact', include:
    - 'relevantExperience' (must contain years of experience and short description about how it was utilized based on matching skillsets entry, e.g., "1+ YoE, Used in 3 projects")
    - 'level' if available
    - 'alternativeSkills' if match is 'similar'
  - For 'similar', include:
    - 'alternativeSkills' (must contain the similar skills for the skills present in skillsets)
    - 'relevantExperience' (how is this skill relevant to the similar skill)
  - For 'missing' entries:
    - Set confidence below 0.5
    - Do not include irrelevantExperience, level, or alternatives

  ‼Important:
    - Only return a single **compact JSON array**, nothing else.
    - Do not add any extra text, headers, markdown, or line breaks.
    - The response must be directly parsable using JSON.parse() in code.

  Input:

  skillsets: ${JSON.stringify(skillsets)}  
  jdSkills: ${JSON.stringify(requiredSkill)}
`;

  try{

    if(!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName
    })
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // console.log('AI Response:', response.text());
    const aiResponse = cleanJsonResponse<SkillMatch[]>(response.text());
    // const aiResponse = JSON.parse(response.text()) as SkillMatch[];
    if (!aiResponse || !Array.isArray(aiResponse)) {
      throw new Error('Invalid AI response format');
    }
    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }

};