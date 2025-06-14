import { GoogleGenerativeAI } from '@google/generative-ai';
import { defaultConfig } from '../config/ai-config';
import { AIAssistantRequest, AIAssistantResponse } from '../../shared/types';
import { cleanJsonResponse } from '../../shared/utils/text';
import { logInfo, logError } from '../../shared/utils/logger';
import { portfolioData } from '../../../data/portfolio-sections';

const generatePrompt = (request: AIAssistantRequest): string => {
  const sectionData = portfolioData[request.section];

  return `You are an AI assistant for my personal portfolio website. Respond to the user's question regarding the "${request.section}" section using a first-person, conversational tone. Your answer should reflect the context of that specific section only.

Section Context:
${JSON.stringify(sectionData, null, 2)}

User Question: ${request.question}

Respond using the following JSON format:
{
  "answer": "Your first-person response here",
  "followUpQuestions": ["Follow-up question 1?", "Follow-up question 2?", "Follow-up question 3?"]
}

Guidelines:
- Use a warm, friendly, and personal tone.
- Speak in the first person using "I", "my", "me", etc.
- Keep the answer concise and informative (2–3 sentences).
- Stay focused strictly on the "${request.section}" context.
- If the question doesn't relate to this section, politely inform the user and recommend the appropriate section (e.g., about, experience, projects, skills, contact).
  - End your answer with this sentence: "Please check out the {relevant section name} section for more details."
- Suggest 3–4 short, second-person follow-up questions that relate closely to the current section’s content.
`;
};



export const handleAIAssistant = async (request: AIAssistantRequest): Promise<AIAssistantResponse> => {
  const startTime = Date.now();
  logInfo('Starting AI Assistant response generation', {
    section: request.section,
    question: request.question
  });

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Validate section exists
    if (!portfolioData[request.section]) {
      throw new Error(`Invalid section: ${request.section}`);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_NAME || defaultConfig.modelName,
      generationConfig: {
        temperature: 0.7, // Higher temperature for more creative responses
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const prompt = generatePrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = cleanJsonResponse<AIAssistantResponse>(response.text());

    if (!aiResponse || !aiResponse.answer || !Array.isArray(aiResponse.followUpQuestions)) {
      throw new Error('Invalid AI response format');
    }

    const totalTime = Date.now() - startTime;
    logInfo('AI Assistant response generated', {
      section: request.section,
      duration: `${totalTime}ms`,
      followUpCount: aiResponse.followUpQuestions.length
    });

    return aiResponse;
  } catch (err: any) {
    const totalTime = Date.now() - startTime;
    logError('AI Assistant failed', {
      error: err.message,
      stack: err.stack,
      duration: `${totalTime}ms`
    });
    throw err;
  }
};
