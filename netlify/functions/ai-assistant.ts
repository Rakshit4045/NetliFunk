import { Handler } from '@netlify/functions';
import { AIAssistantRequest } from './shared/types';
import { handleAIAssistant } from './portfolio/ai/assistant';

export const handler: Handler = async (event, context) => {
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
    const request = JSON.parse(event.body || '{}') as AIAssistantRequest;
      // Validate request
    if (!request.question || !request.section) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields: question or section'
        })
      };
    }

    const response = await handleAIAssistant(request);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    };
  } catch (error: any) {
    console.error('AI Assistant error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
};
