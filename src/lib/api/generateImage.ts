import { API_CONFIG } from './config';
import { GenerateImageParams } from './types';

const MODELS = {
  create: "stabilityai/stable-diffusion-xl-base-1.0",
  enhance: "stabilityai/stable-diffusion-xl-refiner-1.0"
};

export async function generateImage({
  prompt,
  negativePrompt = "",
  userId,
  model = MODELS.create
}: GenerateImageParams): Promise<string> {
  const response = await fetch(model, {
    method: "POST",
    headers: {
      ...API_CONFIG.HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        ...API_CONFIG.DEFAULT_PARAMS,
        negative_prompt: negativePrompt,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate image');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}