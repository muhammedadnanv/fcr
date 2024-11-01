import { toast } from "@/components/ui/use-toast";
import { checkRateLimit, getRemainingRequests, getResetTime } from './rateLimit';
import { API_ENDPOINTS, API_CONFIG } from './constants';
import { delay, sanitizeInput, validateDimensions } from './utils';
import { enhancePrompt, enhanceNegativePrompt } from './promptEnhancer';
import type { GenerateImageParams, ApiResponse } from './types';

async function retryWithBackoff(fn: () => Promise<Response>): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < API_CONFIG.MAX_RETRIES; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json() as ApiResponse;
        if (data.error?.includes("is currently loading")) {
          const waitTime = Math.min((data.estimated_time || 20) * 1000, 30000);
          toast({
            title: "Model is warming up",
            description: `Please wait ${Math.ceil(waitTime/1000)} seconds...`,
          });
          await delay(waitTime);
          continue;
        }
      }

      if (response.status === 429) {
        toast({
          title: "Rate limit reached",
          description: "Please wait before making more requests.",
          variant: "destructive",
        });
        throw new Error("rate_limit");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (lastError.message === "rate_limit") throw lastError;
      if (i === API_CONFIG.MAX_RETRIES - 1) throw lastError;
      
      await delay(API_CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, i));
    }
  }
  throw lastError || new Error("Failed after maximum retries");
}

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const userId = localStorage.getItem('userId') || 'anonymous';
  if (!checkRateLimit(userId)) {
    const resetTime = getResetTime(userId);
    const waitMinutes = resetTime ? Math.ceil((resetTime - Date.now()) / 60000) : 1;
    
    toast({
      title: "Rate limit exceeded",
      description: `You've reached the limit of 5 images per minute. Please wait ${waitMinutes} minute(s).`,
      variant: "destructive",
    });
    throw new Error("Rate limit exceeded");
  }

  const remainingRequests = getRemainingRequests(userId);
  toast({
    title: "Remaining requests",
    description: `You have ${remainingRequests} image generation(s) left for this minute.`,
  });

  const sanitizedPrompt = sanitizeInput(prompt);
  const sanitizedNegativePrompt = sanitizeInput(negativePrompt);
  const { width: validatedWidth, height: validatedHeight } = validateDimensions(width, height);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_DURATION);

  try {
    const enhancedPrompt = enhancePrompt(sanitizedPrompt);
    const enhancedNegativePrompt = enhanceNegativePrompt(sanitizedNegativePrompt);

    const makeRequest = (modelId: string) => fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Request-ID": crypto.randomUUID(),
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: enhancedNegativePrompt,
            width: validatedWidth,
            height: validatedHeight,
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            ...API_CONFIG.DEFAULT_PARAMS
          }
        }),
        signal: controller.signal
      }
    );

    try {
      // Try with SDXL base model first
      const response = await retryWithBackoff(() => makeRequest(API_ENDPOINTS.PRIMARY));
      const blob = await response.blob();
      const baseImage = URL.createObjectURL(blob);

      // Try to enhance with SDXL refiner
      try {
        const refinedResponse = await retryWithBackoff(() => makeRequest(API_ENDPOINTS.ENHANCED));
        const refinedBlob = await refinedResponse.blob();
        URL.revokeObjectURL(baseImage); // Clean up base image URL
        return URL.createObjectURL(refinedBlob);
      } catch (refinerError) {
        console.warn("Refiner failed, using base image:", refinerError);
        return baseImage;
      }
    } catch (primaryError) {
      console.error("Primary model error:", primaryError);
      toast({
        title: "Switching to backup model",
        description: "Please wait while we try an alternative model...",
      });
      
      const response = await retryWithBackoff(() => makeRequest(API_ENDPOINTS.FALLBACK));
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        toast({
          title: "Request timeout",
          description: "The request took too long. Please try again with a simpler prompt.",
          variant: "destructive",
        });
        throw new Error('Request timed out - please try again with a simpler prompt');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  } finally {
    clearTimeout(timeoutId);
  }
}