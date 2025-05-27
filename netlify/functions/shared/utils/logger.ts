import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

const formatMessage = (logMessage: LogMessage): string => {
  const { level, message, timestamp, context } = logMessage;
  const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
};

const log = (level: LogLevel, message: string, context?: Record<string, any>): void => {
  const logMessage: LogMessage = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context
  };

  const formattedMessage = formatMessage(logMessage);
  
  switch (level) {
    case 'error':
      console.error(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(formattedMessage);
      }
      break;
    default:
      console.log(formattedMessage);
  }
};

export const logInfo = (message: string, context?: Record<string, any>): void => {
  log('info', message, context);
};

export const logWarn = (message: string, context?: Record<string, any>): void => {
  log('warn', message, context);
};

export const logError = (message: string, context?: Record<string, any>): void => {
  log('error', message, context);
};

export const logDebug = (message: string, context?: Record<string, any>): void => {
  log('debug', message, context);
};

export const withLogging = (handler: Handler): Handler => {
  return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
    const startTime = Date.now();
    
    try {
      logInfo('Request received', {
        method: event.httpMethod,
        path: event.path,
        queryParams: event.queryStringParameters
      });

      const response = await handler(event, context);
      if (!response) {
        throw new Error('Handler returned no response');
      }
      
      const duration = Date.now() - startTime;
      logInfo('Request completed', {
        statusCode: response.statusCode,
        duration: `${duration}ms`
      });

      return response;
    } catch (err: any) {
      const duration = Date.now() - startTime;
      logError('Request failed', {
        error: err.message,
        stack: err.stack,
        duration: `${duration}ms`
      });

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: err.message
        })
      };
    }
  };
};

export default {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug,
  withLogging
}; 