export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

export async function generateImage({
  prompt,
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("Hugging Face API key is not configured. Please add your API key to the .env file.");
  }

  if (!apiKey.startsWith('hf_')) {
    throw new Error("Invalid API key format. Hugging Face API keys should start with 'hf_'");
  }

  // Create an AbortController with a longer timeout (3 minutes)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            width,
            height,
            num_inference_steps: 30,
            seed: seed || Math.floor(Math.random() * 1000000),
          }
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to generate image";
      
      try {
        const errorData = JSON.parse(errorText);
        
        // Handle "Model too busy" error specifically
        if (errorData.error?.includes("Model too busy")) {
          throw new Error("The AI model is currently experiencing high traffic. Please try again in a minute.");
        }
        
        if (response.status === 503 && errorData.error?.includes("is currently loading")) {
          const estimatedTime = Math.ceil(errorData.estimated_time || 60);
          throw new Error(`Model is currently loading. Please try again in ${estimatedTime} seconds.`);
        }
        
        if (errorData.error?.includes("token seems invalid")) {
          throw new Error("Your API key appears to be invalid. Please check your Hugging Face API token and ensure you have accepted the model's terms of use at huggingface.co");
        }
        
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        if (e instanceof Error && (
          e.message.includes("Model is currently loading") ||
          e.message.includes("The AI model is currently experiencing high traffic")
        )) {
          throw e;
        }
        throw new Error(errorText || errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 3 minutes. The server might be experiencing high load. Please try again later.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while generating the image.');
  } finally {
    clearTimeout(timeoutId);
  }
}