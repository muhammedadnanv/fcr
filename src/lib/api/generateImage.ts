import { API_CONFIG, ERROR_MESSAGES } from './constants';
import { delay, sanitizeInput, validateDimensions } from './utils';
import { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  if (!prompt || prompt.trim().length < 3) {
    throw new Error(ERROR_MESSAGES.SHORT_PROMPT);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_DURATION);

  try {
    const { width: validatedWidth, height: validatedHeight } = validateDimensions(width, height);
    const sanitizedPrompt = sanitizeInput(prompt);
    const sanitizedNegativePrompt = negativePrompt ? sanitizeInput(negativePrompt) : undefined;

    let response;
    let retries = 0;

    while (retries < API_CONFIG.MAX_RETRIES) {
      try {
        const res = await fetch(API_CONFIG.API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: sanitizedPrompt,
            parameters: {
              ...API_CONFIG.GENERATION_PARAMS,
              width: validatedWidth,
              height: validatedHeight,
              negative_prompt: sanitizedNegativePrompt,
            }
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: ERROR_MESSAGES.INVALID_RESPONSE }));
          
          if (res.status === 503) {
            throw new Error(ERROR_MESSAGES.MODEL_LOADING);
          }
          
          if (res.status === 429) {
            throw new Error(ERROR_MESSAGES.RATE_LIMIT);
          }
          
          if (res.status === 401) {
            throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
          }
          
          throw new Error(errorData.error || ERROR_MESSAGES.GENERATION_FAILED);
        }

        response = await res.blob();
        break;
      } catch (error) {
        retries++;
        if (retries === API_CONFIG.MAX_RETRIES) throw error;
        await delay(API_CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, retries - 1));
      }
    }

    if (!response) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return URL.createObjectURL(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
      throw error;
    }
    throw new Error(ERROR_MESSAGES.GENERATION_FAILED);
  } finally {
    clearTimeout(timeoutId);
  }
}