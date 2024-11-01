import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage, GenerateImageParams } from "@/lib/api";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { useQueryClient } from "@tanstack/react-query";

const resolutions = [
  { value: "1:1", width: 1024, height: 1024, label: "Square" },
  { value: "16:9", width: 1024, height: 576, label: "Landscape" },
  { value: "9:16", width: 576, height: 1024, label: "Portrait" },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1:1");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const queryClient = useQueryClient();

  // Cleanup URLs when component unmounts or new image is generated
  useEffect(() => {
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  const handleGenerate = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (trimmedPrompt.length < 3) {
      toast({
        title: "Error",
        description: "Prompt must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }

      const selectedResolution = resolutions.find((r) => r.value === resolution)!;
      const params: GenerateImageParams = {
        prompt: trimmedPrompt,
        width: selectedResolution.width,
        height: selectedResolution.height,
        negativePrompt: negativePrompt.trim(),
        seed: seed ? parseInt(seed) : undefined,
      };

      const imageUrl = await generateImage(params);
      setGeneratedImage(imageUrl);
      
      // Prefetch the next likely prompt
      queryClient.prefetchQuery({
        queryKey: ['image', { ...params, prompt: trimmedPrompt + " detailed" }],
        queryFn: () => generateImage({ ...params, prompt: trimmedPrompt + " detailed" }),
      });

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt, resolution, negativePrompt, seed, generatedImage, queryClient]);

  return (
    <div className="container max-w-6xl py-4 space-y-4 px-4 sm:px-6 md:px-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-[1fr,1fr]">
        <ImageSettings
          prompt={prompt}
          setPrompt={setPrompt}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          resolution={resolution}
          setResolution={setResolution}
          seed={seed}
          setSeed={setSeed}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          resolutions={resolutions}
        />
        <ImagePreview
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}