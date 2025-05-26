import { AIConfig } from '../../../types/ai';

export const defaultConfig: AIConfig = {
  apiKey: process.env.VITE_GEMINI_API_KEY || '',
  modelName: process.env.VITE_GEMINI_MODEL_NAME || 'gemini-2.0-flash',
  maxTokens: 1048576,
  temperature: 0.7,
};
