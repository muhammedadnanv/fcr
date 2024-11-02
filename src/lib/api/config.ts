export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: 10,
  RATE_WINDOW: 60000,
  GENERATION_PARAMS: {
    num_inference_steps: 35, // Reduced for faster generation while maintaining quality
    guidance_scale: 7.5, // Optimized for better balance
    scheduler: "DPMSolverMultistepScheduler",
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      max_memory: {
        'free': 0.95 // Increased memory utilization
      }
    }
  }
};

export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5"
};

export const ERROR_MESSAGES = {
  MISSING_API_KEY: "API key is missing. Please check your environment variables.",
  TIMEOUT: "Request timed out. Please try again with a simpler prompt.",
  EMPTY_PROMPT: "Please enter a prompt before generating.",
  SHORT_PROMPT: "Prompt must be at least 3 characters long.",
  GENERATION_FAILED: "Failed to generate image. Please try again.",
  MODEL_LOADING: "Model is still loading. Please wait...",
  INVALID_RESPONSE: "Received invalid response from the server.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
};