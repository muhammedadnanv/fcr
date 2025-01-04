import express from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: '*', // Be more restrictive in production
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Define route handler
app.post("/api/generate", async (req: express.Request, res: express.Response) => {
  try {
    const { prompt, negativePrompt, numImages = 1 } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const images = await generateImage(prompt, negativePrompt, numImages);
    res.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});